import useSWR from "swr";
import React, { ReactNode } from "react";
import {
  CoinInfo,
  useCoinInfoQuery,
} from "lib/graphql/generated";

type CoinDataContextType = {
  coinInfo?: CoinInfo;
  loading: boolean;
  error: boolean;
};

export const CoinDataContext = React.createContext<CoinDataContextType>({
  coinInfo: {
    coins: [],
    supportedCurrencies: [],
  },
  loading: false,
  error: false,
});

export const CoinDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data, loading, error } = useCoinInfoQuery();

  return (
    <CoinDataContext.Provider
      value={{ coinInfo: data?.coinInfo || undefined, loading, error: !!error }}
    >
      {children}
    </CoinDataContext.Provider>
  );
};
