import { useEffect } from "react";
import useSWR from "swr";
import { BootstrapData, BootstrapResponse, Coin } from "lib/types";
import { getDashboards } from "lib/store";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useBootstrapData = (): BootstrapData => {
  // TODO: Handle error
  const { data, error } = useSWR<BootstrapResponse>("/api/bootstrap", fetcher);

  if (data) {
    const coinMap = new Map<string, Coin>();
    const { coins, supportedCurrencies } = data;

    coins.forEach((coin) => {
      if (coin.symbol) {
        coinMap.set(coin.symbol, coin);
      }
    });

    const supportedTokens = supportedCurrencies.filter((symbol) =>
      coinMap.get(symbol)
    );

    return {
      supportedTokens,
      supportedCurrencies,
      coinMap,
    };
  } else {
    return { supportedTokens: [], supportedCurrencies: [], coinMap: new Map() };
  }
};
