import { requireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getInstitiution, InstitutionData } from '../../../lib/nordigen';
import { createClient, getSession } from '../../../lib/fauna';
import { ApiError } from '../../../lib/api.error';

export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse<InstitutionData | ApiError>
) => {
  if (typeof req.query.id != "string" || req.query.id == "undefined") {
    console.warn("Missing institution id, aborting.");
    res.status(400).json({ error: "Missing parameter id" });
    return;
  }

  if (req.method == "GET") {
    const client = createClient();
    const session = getSession(client);

    const institution = await getInstitiution(req.query.id, session);

    res.status(200).json(institution);
  } else {
    res.status(400).json({ error: "Invalid method" });
  }
});