import { useMemo } from "react";
import { Coin, CoinInfo, CryptoPair, Dashboard, PriceResponse } from "./graphql/generated";
import { CryptoPairOption } from "components/Autocomplete";

type CoinDict = { [key: string]: Coin };
type PriceDict = { [key: string]: number | undefined };

export const useCoinDict = (coinInfo?: CoinInfo) => {
  return useMemo(() => {
    if (coinInfo) {
      let newDict: CoinDict = {};
      coinInfo.coins.forEach((coin) => (newDict[coin.symbol] = coin));
      return newDict;
    } else {
      return {};
    }
  }, [coinInfo]);
};

export const usePriceDict = (prices?: PriceResponse[]) => {
  return useMemo(() => {
    if (prices) {
      let newDict: PriceDict = {};
      prices.forEach(
        ({ price, coinId, vsCurrency }) =>
          (newDict[`${coinId}-${vsCurrency}`] = price)
      );
      return newDict;
    } else {
      return {};
    }
  }, [prices]);
};

const isOptionDisabled = (
  pairs: CryptoPair[] = [],
  symbol: string,
  vsCurrency: string
) => {
  return pairs
    ? !!pairs.find(
        (pair) => pair.symbol === symbol && pair.vsCurrency === vsCurrency
      )
    : false;
};

export const useCryptoPairOptions = (
  coinInfo?: CoinInfo | null,
  dashboard?: Dashboard | null
) => {
  return useMemo<CryptoPairOption[]>(() => {
    if (coinInfo && dashboard) {
      // Nested loop, not ideal for performance if we have a large number of token pairs to support
      // But should be ok if we are working with a limited number
      return coinInfo.supportedCurrencies
        .map((vsCurrency) => {
          return coinInfo.coins
            .filter((coin) => coin.symbol && coin.symbol !== vsCurrency)
            .map(({ symbol = "" }) => {
              const label = vsCurrency + "/" + symbol;
              const disabled = isOptionDisabled(
                dashboard.pairs,
                symbol,
                vsCurrency
              );
              return {
                symbol,
                vsCurrency,
                label,
                disabled,
              };
            });
        })
        .flat();
    } else {
      return [];
    }
  }, [dashboard, coinInfo]);
};