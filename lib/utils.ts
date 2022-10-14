import { useMemo } from "react";
import { CoinInfo, CryptoPair, Dashboard } from "./graphql/generated";
import { CryptoPairOption } from "components/Autocomplete";

const isOptionDisabled = (
  pairs: CryptoPair[] = [],
  coinId: string,
  vsCurrency: string
) => {
  return pairs
    ? !!pairs.find(
        (pair) => pair.coinId === coinId && pair.vsCurrency === vsCurrency
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
            .map(({ symbol = "", id }) => {
              const label = vsCurrency + "/" + symbol;
              const disabled = isOptionDisabled(
                dashboard.pairs,
                id,
                vsCurrency
              );
              return {
                coinId: id,
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

export const dedupe = (strings: string[] = []) =>
  strings.filter((string, index) => {
    return strings.indexOf(string) === index;
  });
