
import { NextApiRequest, NextApiResponse } from 'next';
import { API, AccountsResponse } from 'ynab';
import { ApiError } from '../../../../lib/api.error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccountsResponse | ApiError>
) {
  const ynab = new API(req.headers.authorization?.split(" ")[1] ?? "");

  console.log("Ynab getting accounts", req.query.id)

  try {
    const accounts = await ynab.accounts.getAccounts(req.query.id as string);
    res.status(200).json(accounts);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}
