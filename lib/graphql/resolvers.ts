import { Resolvers, Dashboard, CryptoPair } from "./generated";
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

const dedupe = (strings: string[] = []) =>
  strings.filter((string, index) => {
    return strings.indexOf(string) === index;
  });

const fetchPrices = async (ids: string[], vsCurrencies: string[]) => {
  try {
    const response = await coingeckoClient.simplePrice({
      ids: dedupe(ids).join(","),
      vs_currencies: dedupe(vsCurrencies).join(","),
    });

    const prices: CryptoPair[] = [];
    for (const [coinId] of Object.entries(response)) {
      const responseVsCurrencies = response[coinId];
      for (const [vsCurrency, price] of Object.entries(responseVsCurrencies)) {
        prices.push({
          coinId,
          vsCurrency,
          price: 1 / price, // Need to invert the value due to how coingecko returns the values
        });
      }
    }

    return prices;
  } catch (error) {
    console.log(error);
    throw new Error("Coingecko API Error");
  }
};

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

      const result = dbObject ? fromDbObject(dbObject) : null;

      if (result?.pairs.length) {
        const { pairs } = result;
        const ids = pairs.map((p) => p.coinId);
        const vsCurrencies = pairs.map((p) => p.vsCurrency);
        const prices = await fetchPrices(ids, vsCurrencies);
        pairs.forEach((pair) => {
          pair.price = prices.find(
            (price) =>
              price.coinId === pair.coinId &&
              price.vsCurrency === pair.vsCurrency
          )?.price;
        });
      }

      return result;
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
    prices: async (_: any, { ids, vsCurrencies }) =>
      fetchPrices(ids, vsCurrencies),
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
        return { success: true };
      } else {
        throw new Error(`Failed to delete dashboard id: ${id}`);
      }
    },
    addCryptoPair: async (_: any, { dashboardId, coinId, vsCurrency }) => {
      const collection = await getCollection();
      const result = await collection.findOne({
        _id: new ObjectId(dashboardId),
      });

      if (!result) {
        throw new Error("Dashboard not found");
      }

      const { pairs } = result;

      let pairExists = pairs.find(
        (pair) => pair.coinId === coinId && pair.vsCurrency === vsCurrency
      );

      if (pairExists) {
        throw new Error("Pair already exists");
      }

      pairs.push({
        coinId,
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

      return { success: true };
    },
  },
};

export default resolvers;
