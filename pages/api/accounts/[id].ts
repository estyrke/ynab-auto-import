import { requireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import type { NextApiRequest, NextApiResponse } from 'next'
import { AccountDetails, getAccount } from '../../../lib/nordigen';
import { createClient, getSession } from '../../../lib/fauna';


export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse<AccountDetails>
) => {
  const client = createClient();
  const session = getSession(client);

  const accountId = req.query.id as string;
  const account = await getAccount(accountId, session);

  res.status(200).json({ ...account, id: accountId });
});
