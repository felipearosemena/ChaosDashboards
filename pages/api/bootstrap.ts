import type { NextApiRequest, NextApiResponse } from "next";
import { BootstrapResponse, Coin } from "lib/types";
import { client } from "services/coingecko";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BootstrapResponse | Error>
) {
  const [supportedCurrencies, market] = await Promise.all([
    client.simpleSupportedCurrencies(),
    client.coinMarket({ vs_currency: "usd", ids: "", per_page: 250 }),
  ]);

  const coins: Coin[] = market.map((c) => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    image: c.image,
  }));

  const response: BootstrapResponse = {
    supportedCurrencies,
    coins,
  };

  if (!response.coins.length) {
    res.status(404).json(new Error("Failed to load data"));
  }

  res.status(200).json(response);
}
