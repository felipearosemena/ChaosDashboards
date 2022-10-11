import { PriceResponse } from "lib/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "services/coingecko";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PriceResponse | { error: string }>
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
