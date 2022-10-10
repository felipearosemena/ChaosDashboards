// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CoinListResponseItem } from 'coingecko-api-v3'
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../services/coingecko'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoinListResponseItem[]>
) {
  const response = await client.coinList({ include_platform:  false })
  res.status(200).json(response)
}
