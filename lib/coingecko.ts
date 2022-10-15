import { CoinGeckoClient, CoinMarket } from "coingecko-api-v3";
import { CoinInfo, CryptoPair, PricePair } from "./graphql/generated";
import { dedupe, getCoinMap } from "./utils";

type CoinInfoPromise = Promise<[string[], CoinMarket[]]>
let coinInfoPromise: CoinInfoPromise
const globalAny: any = global;

const client = new CoinGeckoClient({
  timeout: 10000,
  autoRetry: false,
});

const cacheCoinInfoPromise = (promise: CoinInfoPromise) => {
  if (process.env.NODE_ENV === "development") {
    globalAny.coinInfoPromise = promise;
  } else {
    coinInfoPromise = promise
  }
}

const getCoinInfoPromise = (): CoinInfoPromise | undefined => {
  if (process.env.NODE_ENV === "development") {
    return globalAny.coinInfoPromise;
  } else {
    return coinInfoPromise
  }
}

export const getCoinInfo = async () => {
  try {
    let coinInfoPromise = getCoinInfoPromise()

    if (!coinInfoPromise) {
      coinInfoPromise = Promise.all([
        client.simpleSupportedCurrencies(),
        client.coinMarket({
          vs_currency: "usd",
          ids: "",
          per_page: 40, // Arbitrary number of tokens to load initially.
        }),
      ]);
      cacheCoinInfoPromise(coinInfoPromise)
    }
    const [allSupportedCurrencies, coinMarket] = await coinInfoPromise

    const coins = coinMarket.map((coin) => ({
      id: coin.id || "",
      name: coin.name || "",
      symbol: coin.symbol || "",
      image: coin.image || "",
    }));
    const coinSymbols = coins.map((coin) => coin.symbol);
    const supportedCurrencies = allSupportedCurrencies
      .filter((symbol) => coinSymbols.includes(symbol))
      .map((currency) => ({
        symbol: currency,
      }));

    const coinInfo = {
      supportedCurrencies,
      coins,
    };

    return coinInfo;
  } catch (error) {
    console.log(error);
    throw new Error("Coingecko API Error");
  }
};

const getSimplePricesArguments = (
  pairs: CryptoPair[] = [],
  coinInfo: CoinInfo
) => {
  const { coins, supportedCurrencies } = coinInfo;
  const { coinsById, coinsBySymbol } = getCoinMap(coins);
  return pairs.reduce<{
    ids: string[];
    vsCurrencies: string[];
  }>(
    (curr, pair) => {
      if (
        supportedCurrencies
          .map((currency) => currency.symbol)
          .includes(pair.vsCurrency)
      ) {
        curr.ids.push(pair.coinId);
        curr.vsCurrencies.push(pair.vsCurrency);
      } else {
        // If the pair's vsCurrency isn't supported
        // try flipping the currencies so we're using the vsCurrency
        // corresponding to the pair's `coinId`
        const vsCurrency = coinsById[pair.coinId]?.symbol;
        const id = coinsBySymbol[pair.vsCurrency]?.id;

        if (vsCurrency && id) {
          curr.ids.push(id);
          curr.vsCurrencies.push(vsCurrency);
        }
      }
      return curr;
    },
    {
      ids: [],
      vsCurrencies: [],
    }
  );
};

export const getPrices = async (pairs: CryptoPair[] = [], coinInfo: CoinInfo) => {
  const { ids, vsCurrencies } = getSimplePricesArguments(pairs, coinInfo);
  const { coinsById, coinsBySymbol } = getCoinMap(coinInfo.coins);

  try {
    const response = await client.simplePrice({
      ids: dedupe(ids).join(","),
      vs_currencies: dedupe(vsCurrencies).join(","),
    });

    const prices: PricePair[] = [];
    for (const [coinId] of Object.entries(response)) {
      const responseVsCurrencies = response[coinId];
      for (const [vsCurrency, price] of Object.entries(responseVsCurrencies)) {
        prices.push({
          coinId,
          vsCurrency,
          price,
        });

        // Push the inverse price as well
        const coin = coinsById[coinId]
        const vsCurrencyCoin = coinsBySymbol[vsCurrency]
        prices.push({
          coinId: vsCurrencyCoin.id,
          vsCurrency: coin.symbol,
          price: 1 / price,
        });
      }
    }

    return prices;
  } catch (error) {
    console.log(error);
    throw new Error("Coingecko API Error");
  }
};