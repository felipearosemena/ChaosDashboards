import type { NextApiRequest, NextApiResponse } from "next";
import { BootstrapResponse, Coin } from "lib/types";
import { client } from "services/coingecko";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BootstrapResponse | Error>
) {
  try {
    const [supportedCurrencies, coinMarket] = await Promise.all([
      client.simpleSupportedCurrencies(),
      client.coinMarket({ vs_currency: "usd", ids: "", per_page: 250 }),
    ]);

    const coins: Coin[] = coinMarket.map((c) => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      image: c.image,
    }));

    const response: BootstrapResponse = {
      supportedCurrencies,
      coins,
    };

    res.status(200).json(response);
  } catch {
    res.status(404).json(new Error("Failed to load data"));
  }
}
