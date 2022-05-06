import { requireAuth, RequireAuthProp } from '@clerk/nextjs/api';
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient, getSession, getUser } from '../../lib/fauna';
import { ApiError } from '../../lib/api.error';
import { getInstitiutions, InstitutionData } from '../../lib/nordigen';

export default requireAuth(async (
  req: RequireAuthProp<NextApiRequest>,
  res: NextApiResponse<InstitutionData[] | ApiError>
) => {
  const client = createClient();
  const session = getSession(client);

  const institutions = await getInstitiutions("SE", session);

  res.status(200).json(institutions);
});