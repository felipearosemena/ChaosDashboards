import { Coin } from "./graphql/generated";
import keyBy from "lodash/keyBy";

export const priceDictKey = (coinId: string, vsCurrency: string) => {
  return `${coinId}-${vsCurrency}`;
};

export const getCoinMap = (coins: Coin[] = []) => {
  const coinsById = keyBy(coins, "id");
  const coinsBySymbol = keyBy(coins, "symbol");

  return {
    coinsById,
    coinsBySymbol,
  };
};

export const dedupe = (strings: string[] = []) =>
  strings.filter((string, index) => {
    return strings.indexOf(string) === index;
  });
