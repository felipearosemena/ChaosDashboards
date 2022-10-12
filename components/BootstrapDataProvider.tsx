import useSWR from "swr";
import React, { ReactNode } from "react";
import { BootstrapResponse } from "lib/types";

type BootstrapData = {
  data: BootstrapResponse;
  loading: boolean;
  error: string | null;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useBootstrapData = (): BootstrapData => {
  const { data, error } = useSWR<BootstrapResponse>("/api/bootstrap", fetcher);

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

export const BootstrapDataContext = React.createContext<BootstrapData>({
  data: {
    supportedCurrencies: [],
    coins: {},
  },
  loading: true,
  error: null,
});

export const BootstrapDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const data = useBootstrapData();

  return (
    <BootstrapDataContext.Provider value={data}>
      {children}
    </BootstrapDataContext.Provider>
  );
};
