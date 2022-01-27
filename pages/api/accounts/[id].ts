import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import type { NextApiRequest, NextApiResponse } from 'next'
import { AccountDetails, getAccount } from '../../../lib/nordigen';
import { loadSession, saveSession } from '../../../lib/session';


export default requireSession(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<AccountDetails>
) => {
  const session = await loadSession(req);

  const accountId = req.query.id as string;
  const account = await getAccount(accountId, session);

  await saveSession(res, session);

  res.status(200).json({ ...account, id: accountId });
});
