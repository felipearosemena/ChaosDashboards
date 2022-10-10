// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../services/coingecko'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  const response = await client.simpleSupportedCurrencies()
  res.status(200).json(response)
}
