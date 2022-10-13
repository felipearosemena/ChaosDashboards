import { CryptoPair } from "./graphql/generated";

export type CryptoPairOption = CryptoPair & { value: string; disabled: boolean };

export type PriceResponse = {
  [coin: string]: {
    [currency: string]: number;
  };
};
