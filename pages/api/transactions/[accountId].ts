import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient, getSession } from '../../../lib/fauna';
import { TransactionData, getTransactions } from '../../../lib/nordigen';


export default requireSession(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<TransactionData>
) => {
  const client = createClient();
  const session = getSession(client);

  const account = await getTransactions(req.query.accountId as string, session);

  res.status(200).json(account);
});
