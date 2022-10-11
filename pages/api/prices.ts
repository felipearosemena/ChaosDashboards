// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SimplePriceResponse } from "coingecko-api-v3";
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "services/coingecko";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SimplePriceResponse | { error: string }>
) {
  const query = req.query;
  const { ids, vs_currencies } = query;

  if (typeof ids === "string" && typeof vs_currencies === "string") {
    const response = await client.simplePrice({
      ids,
      vs_currencies,
    });

    res.status(200).json(response);
  } else {
    res.status(400).json({ error: "Bad request" });
  }
}
