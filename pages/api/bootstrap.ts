// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { BootstrapResponse, Coin } from "../../models";
import { client } from "../../services/coingecko";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BootstrapResponse | Error>
) {
  const [supportedCurrencies, market] = await Promise.all([
    client.simpleSupportedCurrencies(),
    // client.coinList({ include_platform: false }),
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
    // allCoinsList,
    coins,
  };

  if (!response.coins.length) {
    res.status(404).json(new Error("Failed to load data"));
  }

  res.status(200).json(response);
}
