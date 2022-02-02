import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from '../../../lib/api.error';
import { createClient, getUser } from '../../../lib/fauna';
import { absoluteUrl, requestYnabTokens, YnabTokenData } from '../../../lib/ynab';

export default requireSession(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<void | ApiError>
) => {
  console.log("Authorize called", req.query);
  const origin = absoluteUrl(req).origin;
  const code = req.query.code;

  if (typeof code != "string") {
    res.status(400).json({ error: "Missing authorization code!" });
    return;
  }

  const response = await requestYnabTokens(origin, code);

  if (!response.ok) {
    res.status(400).json({ error: "Error retrieving YNAB tokens", reason: await response.text() } as ApiError)
    return;
  }

  const ynabTokens: YnabTokenData = await response.json();

  console.log("Ynab tokens", ynabTokens);
  const client = createClient();
  if (!req.session?.userId) {
    res.status(400).json({ error: "Missing userId" })
    return;
  }
  const user = await getUser(client, req.session.userId);
  await user.load();
  await user.setYnabTokens({
    access_token: ynabTokens.access_token,
    access_expires: new Date(Date.now() + ynabTokens.expires_in),
    refresh_token: ynabTokens.refresh_token
  });

  res.redirect("/import").end();
});
