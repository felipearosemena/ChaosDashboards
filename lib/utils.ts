import { useEffect, useMemo, useState } from "react";
import { Coin, CoinInfo, CryptoPair, PricePair } from "./graphql/generated";
import { CryptoPairOption } from "components/Autocomplete";
import keyBy from "lodash/keyBy";

const priceDictKey = (coinId: string, vsCurrency: string) => {
  return `${coinId}-${vsCurrency}`;
};

export const getCoinMap = (coins: Coin[] = []) => {
  const coinsById = keyBy(coins, "id")
  const coinsBySymbol = keyBy(coins, "symbol")

  return {
    coinsById,
    coinsBySymbol,
  };
};

export const useWidgetList = (
  pairs: CryptoPair[] = [],
  coins: Coin[] = [],
  pricePairs: PricePair[] = []
) => {
  const { coinsById, coinsBySymbol } = getCoinMap(coins);
  const priceDict = useMemo(
    () =>
      keyBy(pricePairs, ({ coinId, vsCurrency }) =>
        priceDictKey(coinId, vsCurrency)
      ),
    [pricePairs]
  );

  return pairs.map((pair) => {
    const coin = coinsById[pair.coinId];
    const vsCoin = coinsBySymbol[pair.vsCurrency];

    let key = priceDictKey(vsCoin?.id, coin?.symbol);
    let price = priceDict[key]?.price;

    if (!price) {
      key = priceDictKey(pair.coinId, pair.vsCurrency);
      price = priceDict[key]?.price;
      price = 1 / price;
    }

    return { coin, vsCoin, price, key };
  });
};

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
  pairs?: CryptoPair[] | null
) => {
  const [options, setOptions] = useState<CryptoPairOption[]>([]);
  const { coinsById, coinsBySymbol } = useMemo(() => getCoinMap(coinInfo?.coins), [coinInfo?.coins]);

  useEffect(() => {
    const getOptions = () => {
      if (coinInfo && pairs) {
        const options: { [key: string]: CryptoPairOption } = {};
        // Nested loop, not ideal for performance if we have a large number of token pairs to support
        // But should be ok if we are working with a limited number
        coinInfo.supportedCurrencies.forEach((vsCurrency) => {
          coinInfo.coins
            .filter((coin) => coin.symbol && coin.symbol !== vsCurrency)
            .map(({ id }) => {
              const vsCurrencyCoin = coinsBySymbol[vsCurrency];
              const coin = coinsById[id];

              const option = {
                coinId: coin.id,
                vsCurrency: vsCurrencyCoin.symbol,
                label: vsCurrencyCoin.symbol + "/" + coin.symbol,
                disabled: isOptionDisabled(
                  pairs,
                  coin.id,
                  vsCurrencyCoin.symbol
                ),
              };

              if (!options[option.label]) {
                options[option.label] = option;
              }

              const inverseOption = {
                coinId: vsCurrencyCoin.id,
                vsCurrency: coin.symbol,
                label: coin.symbol + "/" + vsCurrencyCoin.symbol,
                disabled: isOptionDisabled(
                  pairs,
                  vsCurrencyCoin.id,
                  coin.symbol
                ),
              };

              if (!options[inverseOption.label]) {
                options[inverseOption.label] = inverseOption;
              }

              return [option, inverseOption];
            });
        });

        return Object.values(options);
      } else {
        return [];
      }
    };

    if (pairs && coinInfo) {
      console.log("setting options");
      
      setOptions(getOptions());
    }
  }, [pairs, coinInfo, coinsById, coinsBySymbol]);

  return options;
};

export const dedupe = (strings: string[] = []) =>
  strings.filter((string, index) => {
    return strings.indexOf(string) === index;
  });
