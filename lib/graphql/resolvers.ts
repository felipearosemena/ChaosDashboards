import { Resolvers, Dashboard, PriceResponse } from "./generated";
import { DashboardDbObject } from "./generated";
import { connect } from "../store";
import { ObjectId } from "mongodb";
import { client as coingeckoClient } from "lib/coingecko";

const dbPromise = connect();

const getCollection = async () => {
  const db = await dbPromise;
  return db.collection<Omit<DashboardDbObject, "_id">>("dashboards");
};

const fromDbObject = (dbObject: DashboardDbObject): Dashboard => ({
  id: dbObject._id.toHexString(),
  title: dbObject.title,
  pairs: dbObject.pairs,
});

const resolvers: Resolvers = {
  Query: {
    dashboards: async () => {
      const collection = await getCollection();
      return await collection.find().map(fromDbObject).toArray();
    },
    dashboard: async (_: any, { id }) => {
      const collection = await getCollection();
      const dbObject = await collection.findOne({
        _id: ObjectId.createFromHexString(id),
      });
      return dbObject ? fromDbObject(dbObject) : null;
    },
    coinInfo: async (_: any) => {
      try {
        const [allSupportedCurrencies, coinMarket] = await Promise.all([
          coingeckoClient.simpleSupportedCurrencies(),
          coingeckoClient.coinMarket({
            vs_currency: "usd",
            ids: "",
            per_page: 40, // Arbitrary number of tokens to load initially. Assuming our universe of tokens is known and
          }),
        ]);

        const coins = coinMarket.map((coin) => ({
          id: coin.id || "",
          name: coin.name || "",
          symbol: coin.symbol || "",
          image: coin.image || "",
          price: coin.current_price || 0,
        }));
        const coinSymbols = coins.map((coin) => coin.symbol);

        const supportedCurrencies = allSupportedCurrencies.filter((symbol) =>
          coinSymbols.includes(symbol)
        );

        return {
          supportedCurrencies,
          coins,
        };
      } catch (error) {
        console.log(error);
        throw new Error("Coingecko API Error");
      }
    },
    prices: async (_: any, { ids, vsCurrencies }) => {
      try {
        const response = await coingeckoClient.simplePrice({
          ids: ids.join(','),
          vs_currencies: vsCurrencies.join(','),
        });
        
        const prices: PriceResponse[] = []
        for (const [coinId] of Object.entries(response)) {
          const responseVsCurrencies = response[coinId]
          for (const [vsCurrency, price] of Object.entries(responseVsCurrencies)) {
            prices.push({
              coinId,
              vsCurrency,
              price: 1 / price // Need to invert the value due to how coingecko returns the values
            })
          }
        }

        return prices
      } catch(error) {
        console.log(error);
        throw new Error("Coingecko API Error");
      }
    },
  },
  Mutation: {
    createDashboard: async (_: any, { title }) => {
      const collection = await getCollection();
      const data = {
        title,
        pairs: [],
      };
      const result = await collection.insertOne(data);
      return fromDbObject({
        ...data,
        _id: result.insertedId,
      });
    },
    deleteDashboard: async (_: any, { id }) => {
      const collection = await getCollection();
      const result = await collection.deleteOne({
        _id: ObjectId.createFromHexString(id),
      });

      if (result.deletedCount) {
        return true;
      } else {
        throw new Error(`Failed to delete dashboard id: ${id}`);
      }
    },
    addCryptoPair: async (_: any, { dashboardId, symbol, vsCurrency }) => {
      const collection = await getCollection();
      const result = await collection.findOne({
        _id: new ObjectId(dashboardId),
      });

      if (!result) {
        throw new Error("Dashboard not found");
      }

      const { pairs } = result;

      let pairExists = pairs.find(
        (pair) => pair.symbol === symbol && pair.vsCurrency === vsCurrency
      );

      if (pairExists) {
        throw new Error("Pair already exists");
      }

      pairs.push({
        symbol,
        vsCurrency,
      });

      const updated = await collection.updateOne(
        {
          _id: result._id,
        },
        {
          $set: {
            pairs,
          },
        }
      );

      if (!updated.modifiedCount) {
        throw new Error("Failed to add pair");
      }

      return fromDbObject({ ...result, pairs });
    },
  },
};

export default resolvers;
