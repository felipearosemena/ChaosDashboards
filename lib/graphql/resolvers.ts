import { Resolvers, Dashboard, CoinInfo, CryptoPairOption } from "./generated";
import { DashboardDbObject } from "./generated";
import { connect } from "../store";
import { ObjectId } from "mongodb";
import { getCoinInfo, getPrices } from "lib/coingecko";
import { getCoinMap, priceDictKey } from "lib/utils";
import { keyBy } from "lodash";

const dbPromise = connect();

const getDashboardsCollection = async () => {
  const db = await dbPromise;
  return db.collection<Omit<DashboardDbObject, "_id">>("dashboards");
};

const getDashboard = async (id: string) => {
  const collection = await getDashboardsCollection();
  const dbObject = await collection.findOne({
    _id: ObjectId.createFromHexString(id),
  });

  if (!dbObject) {
    throw new Error("Dashboard not found")
  }

  return fromDbObject(dbObject)
};

const fromDbObject = (dbObject: DashboardDbObject): Dashboard => ({
  id: dbObject._id.toHexString(),
  title: dbObject.title,
  pairs: dbObject.pairs,
});

const resolvers: Resolvers = {
  Query: {
    dashboards: async () => {
      const collection = await getDashboardsCollection();
      return await collection.find().map(fromDbObject).toArray();
    },
    dashboard: async (_: any, { id }) => getDashboard(id),
    widgets: async (_: any, { dashboardId }) => {
      const coinInfo = await getCoinInfo();
      const dashboard = await getDashboard(dashboardId);

      if (dashboard) {
        const pricePairs = await getPrices(dashboard.pairs, coinInfo);
        const { coinsById, coinsBySymbol } = getCoinMap(coinInfo.coins);
        const priceDict = keyBy(pricePairs, ({ coinId, vsCurrency }) =>
          priceDictKey(coinId, vsCurrency)
        );

        return dashboard.pairs.map((pair) => {
          const coin = coinsById[pair.coinId];
          const vsCoin = coinsBySymbol[pair.vsCurrency];

          let key = priceDictKey(vsCoin?.id, coin?.symbol);
          let price = priceDict[key]?.price;

          return { coin, vsCoin, price, key };
        });
      }

      return [];
    },
    pairOptions: async () => {
      const coinInfo = await getCoinInfo();
      const { coinsBySymbol } = getCoinMap(coinInfo?.coins);

      if (coinInfo) {
        const options: { [key: string]: CryptoPairOption } = {};
        const { supportedCurrencies, coins } = coinInfo

        // Nested loop, not ideal for performance if we have a large number of token pairs to support
        // But should be ok if we are working with a limited number
        supportedCurrencies.forEach(({ symbol: vsCurrency }) => {
          coins
            .filter((coin) => coin.symbol && coin.symbol !== vsCurrency)
            .forEach((coin) => {
              const vsCurrencyCoin = coinsBySymbol[vsCurrency];

              // Option for vsCurrencyCoin / coin -> eg: BTC / XMR
              const option = {
                coinId: coin.id,
                vsCurrency: vsCurrencyCoin.symbol,
                label: vsCurrencyCoin.symbol + "/" + coin.symbol,
                disabled: false,
              };

              if (!options[option.label]) {
                options[option.label] = option;
              }

              // Option for coin / vsCurrency -> eg XMR / BTC
              const inverseOption = {
                coinId: vsCurrencyCoin.id,
                vsCurrency: coin.symbol,
                label: coin.symbol + "/" + vsCurrencyCoin.symbol,
                disabled: false,
              };

              if (!options[inverseOption.label]) {
                options[inverseOption.label] = inverseOption;
              }
            });
        });

        return Object.values(options);
      } else {
        return [];
      }
    },
  },
  Mutation: {
    createDashboard: async (_: any, { title }) => {
      const collection = await getDashboardsCollection();
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
      const collection = await getDashboardsCollection();
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
      const collection = await getDashboardsCollection();
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

      return fromDbObject({ ...result, pairs });
    },
  },
};

export default resolvers;
