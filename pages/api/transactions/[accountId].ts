import type { NextApiRequest, NextApiResponse } from 'next'
import { TransactionData, getTransactions } from '../../../lib/nordigen';
import { loadSession, saveSession } from '../../../lib/session';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TransactionData>
) {
  const session = await loadSession(req);

  const account = await getTransactions(req.query.accountId as string, session);

  await saveSession(res, session);

  res.status(200).json(account);
}
