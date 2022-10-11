export type Coin = {
  id?: string;
  symbol?: string;
  name?: string;
  image?: string;
};

export type BootstrapResponse = {
  supportedCurrencies: string[];
  coins: Coin[];
};

export type CoinMap = Map<string, Coin>;

export type BootstrapData = {
  supportedTokens: string[];
  supportedCurrencies: string[];
  coinMap: CoinMap;
};

export type CoinPair = {
  id: string;
  vsCurrency: string;
};

export type Dashboard = {
  id: string;
  title: string;
  pairs: CoinPair[];
};
