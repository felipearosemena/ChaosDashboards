import React, { ReactNode } from "react";
import { BootstrapData } from "lib/types";
import { useBootstrapData } from "lib/hooks";

export const BootstrapDataContext = React.createContext<BootstrapData>({
  supportedTokens: [],
  supportedCurrencies: [],
  coinMap: new Map(),
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
