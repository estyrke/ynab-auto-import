import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteRequisition, RequisitionData } from '../../lib/nordigen';
import { loadSession, saveSession } from '../../lib/session';

export default requireSession(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<RequisitionData>
) => {
  const session = await loadSession(req);

  if (!session.req_id || session.req_status != "LN") {
    console.warn("No requisition exists, or requisition is not linked");
    res.status(200).end();
    return;
  }

  await deleteRequisition(session.req_id, session);

  session.req_id = undefined;
  session.req_status = undefined;
  await saveSession(res, session);
  res.status(200).end();
});
