
import useSWR from "swr";
import { BootstrapResponse } from "lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useBootstrapData = (): BootstrapResponse => {
  // TODO: Handle error
  const { data, error } = useSWR<BootstrapResponse>("/api/bootstrap", fetcher);

  if (data) {
    const { coins, supportedCurrencies } = data;

    return {
      supportedCurrencies,
      coins,
    };
  } else {
    return { supportedCurrencies: [],  coins: {} };
  }
};
