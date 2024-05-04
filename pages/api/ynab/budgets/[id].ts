
import { requireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextApiRequest, NextApiResponse } from 'next';
import { AccountsResponse } from 'ynab';
import { ApiError } from '../../../../lib/api.error';
import { withYnabApi } from '../../../../lib/ynab';

export default requireAuth(withYnabApi(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse<AccountsResponse | ApiError>,
  ynab
) => {
  console.log("Ynab getting accounts", req.query.id)

  try {
    const accounts = await ynab.accounts.getAccounts(req.query.id as string);
    res.status(200).json(accounts);
  } catch (e) {
    res.status(400).json({ error: e });
  }
}));
