import type { NextApiRequest, NextApiResponse } from "next";
import { BootstrapResponse, CoinDict } from "lib/types";
import { client } from "services/coingecko";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BootstrapResponse | Error>
) {
  try {
    const [allSupportedCurrencies, coinMarket] = await Promise.all([
      client.simpleSupportedCurrencies(),
      client.coinMarket({ vs_currency: "usd", ids: "", per_page: 250 }),
    ]);

    const coins: CoinDict = {};

    coinMarket.forEach((coin) => {
      if (coin.symbol) {
        coins[coin.symbol] = {
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          price: coin.current_price
        };
      }
    });

    const supportedCurrencies = allSupportedCurrencies.filter(symbol => coins[symbol])

    const response: BootstrapResponse = {
      supportedCurrencies,
      coins,
    };

    res.status(200).json(response);
  } catch {
    res.status(404).json(new Error("Failed to load data"));
  }
}
