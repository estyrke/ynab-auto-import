
import { NextApiRequest, NextApiResponse } from 'next';
import { API, AccountsResponse } from 'ynab';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccountsResponse>
) {
  const ynab = new API(process.env.YNAB_TOKEN ?? "");

  console.log("Ynab getting accounts", req.query.id)
  res.status(200).json((await ynab.accounts.getAccounts(req.query.id as string)));
}
