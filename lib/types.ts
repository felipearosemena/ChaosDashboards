import { CryptoPair } from "./graphql/generated";

export type CryptoPairOption = CryptoPair & { label: string; disabled: boolean };

export type PriceResponse = {
  [coin: string]: {
    [currency: string]: number;
  };
};
