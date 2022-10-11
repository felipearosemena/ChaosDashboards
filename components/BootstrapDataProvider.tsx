import React, { ReactNode } from "react";
import { BootstrapResponse } from "lib/types";
import { useBootstrapData } from "lib/hooks";

export const BootstrapDataContext = React.createContext<BootstrapResponse>({
  supportedCurrencies: [],
  coins: {},
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
