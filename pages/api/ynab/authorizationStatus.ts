import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { BudgetSummaryResponse } from 'ynab';
import { ApiError } from '../../../lib/api.error';
import { createClient, getUser } from '../../../lib/fauna';
import { absoluteUrl, requestYnabTokens, refreshYnabToken, YnabTokenData, getFreshYnabTokens } from '../../../lib/ynab';

export type AuthorizationStatus = {
  valid_token: boolean;
  expires?: string;
};

export default requireSession(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<AuthorizationStatus | ApiError>
) => {
  const client = createClient();
  if (!req.session?.userId) {
    res.status(400).json({ error: "Missing userId" })
    return;
  }

  const user = await getUser(client, req.session.userId);
  const origin = absoluteUrl(req).origin;
  const tokens = await getFreshYnabTokens(user, origin);

  if (tokens.access_expires > new Date()) {
    res.status(200).json({ valid_token: true, expires: tokens.access_expires.toUTCString() });
    return;
  }

  res.status(200).json({ valid_token: false })
});
