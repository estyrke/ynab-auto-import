import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRequisition, RequisitionData } from '../../lib/nordigen';
import { loadSession, saveSession } from '../../lib/session';


export default requireSession(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<RequisitionData>
) => {
  const session = await loadSession(req);

  console.log("Requisition id from session: ", session.req_id);

  if (session.req_id === undefined) {
    console.warn("Missing requisition id, aborting.");
    res.status(400).json({ error: "Missing requisition id" } as unknown as RequisitionData);
    return;
  }

  const requisition = await getRequisition(session.req_id, session);
  console.log(`Requisition status is `, requisition.status);
  session.req_status = requisition.status;
  await saveSession(res, session);
  res.status(200).json(requisition);
});