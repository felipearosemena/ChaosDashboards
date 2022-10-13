import useSWR from "swr";
import React, { ReactNode } from "react";
import { CoinResponse } from "lib/types";

type CoinData = {
  data: CoinResponse;
  loading: boolean;
  error: string | null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useCoinData = (): CoinData => {
  const { data, error } = useSWR<CoinResponse>("/api/bootstrap", fetcher);

  if (error) {
    return {
      data: { supportedCurrencies: [], coins: {} },
      loading: false,
      error: "Error getting coins",
    };
  }

  if (data) {
    const { coins, supportedCurrencies } = data;

    if (!coins) {
      return {
        data: { supportedCurrencies: [], coins: {} },
        loading: false,
        error: "Error getting coins",
      };
    }

    return {
      data: {
        supportedCurrencies,
        coins,
      },
      loading: false,
      error: null,
    };
  } else {
    return {
      data: { supportedCurrencies: [], coins: {} },
      loading: true,
      error: null,
    };
  }
};

export const CoinDataContext = React.createContext<CoinData>({
  data: {
    supportedCurrencies: [],
    coins: {},
  },
  loading: true,
  error: null,
});

export const CoinDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const data = useCoinData();

  return (
    <CoinDataContext.Provider value={data}>
      {children}
    </CoinDataContext.Provider>
  );
};
