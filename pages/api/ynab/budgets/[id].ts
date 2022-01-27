
import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { API, AccountsResponse } from 'ynab';
import { ApiError } from '../../../../lib/api.error';

export default requireSession(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<AccountsResponse | ApiError>
) => {
  const ynab = new API(req.headers.token?.toString() ?? "");

  console.log("Ynab getting accounts", req.query.id)

  try {
    const accounts = await ynab.accounts.getAccounts(req.query.id as string);
    res.status(200).json(accounts);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});
