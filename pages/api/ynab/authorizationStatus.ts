import { requireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from '../../../lib/api.error';
import { createClient, getUser } from '../../../lib/fauna';
import { absoluteUrl, getFreshYnabTokens } from '../../../lib/ynab';

export type AuthorizationStatus = {
  valid_token: boolean;
  expires?: string;
};

export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse<AuthorizationStatus | ApiError>
) => {
  const client = createClient();

  const user = await getUser(client, req.auth.userId);
  const origin = absoluteUrl(req).origin;
  const tokens = await getFreshYnabTokens(user, origin);

  if (tokens.access_expires > new Date()) {
    res.status(200).json({ valid_token: true, expires: tokens.access_expires.toUTCString() });
    return;
  }

  res.status(200).json({ valid_token: false })
});
