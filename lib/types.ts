export type Coin = {
  id?: string;
  symbol?: string;
  name?: string;
  image?: string;
  price?: number;
};

export type CoinPair = { symbol: string; vsCurrency: string };
export type CoinPairOption = CoinPair & { value: string; disabled: boolean };

export type CoinDict = {
  [symbol: string]: Coin;
};

export type CoinResponse = {
  supportedCurrencies: string[];
  coins: CoinDict;
};

export type Dashboard = {
  id: string;
  title: string;
  pairs: CoinPair[];
};

export type PriceResponse = {
  [coin: string]: {
    [currency: string]: number;
  };
};
