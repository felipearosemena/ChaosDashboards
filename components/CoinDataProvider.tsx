import React, { ReactNode } from "react";
import { ApolloError } from "@apollo/client";
import {
  useCoinInfoQuery,
  CoinInfoQuery,
} from "lib/graphql/generated";

type CoinDataContextType = {
  data: CoinInfoQuery | undefined;
  loading: boolean;
  error?: ApolloError | undefined;
};

export const CoinDataContext = React.createContext<CoinDataContextType>({
  data: undefined,
  loading: false,
  error: undefined,
});

export const CoinDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data, loading, error } = useCoinInfoQuery();

  return (
    <CoinDataContext.Provider value={{ data, loading, error }}>
      {children}
    </CoinDataContext.Provider>
  );
};
