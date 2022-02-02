
import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { AccountsResponse } from 'ynab';
import { ApiError } from '../../../../lib/api.error';
import { withYnabApi } from '../../../../lib/ynab';

export default requireSession(withYnabApi(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<AccountsResponse | ApiError>,
  ynab
) => {
  if (!req.session?.userId) {
    res.status(400).json({ error: "Missing userId" })
    return;
  }
  console.log("Ynab getting accounts", req.query.id)

  try {
    const accounts = await ynab.accounts.getAccounts(req.query.id as string);
    res.status(200).json(accounts);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}));
