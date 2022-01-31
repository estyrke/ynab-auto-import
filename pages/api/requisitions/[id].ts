import { requireSession, WithSessionProp } from '@clerk/nextjs/api';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getRequisition, RequisitionData, deleteRequisition } from '../../../lib/nordigen';
import { createClient, getSession, getUser } from '../../../lib/fauna';
import { ApiError } from '../../../lib/api.error';

export default requireSession(async (
  req: WithSessionProp<NextApiRequest>,
  res: NextApiResponse<RequisitionData | ApiError>
) => {
  const client = createClient();
  const user = await getUser(client, req.session?.userId ?? "").catch((e) => { throw JSON.stringify(e) });
  const session = getSession(client);
  const requisitionIds = await user.getRequisitionIds();
  console.log("User's requisitions: ", requisitionIds);

  if (typeof req.query.id != "string") {
    console.warn("Missing requisition id, aborting.");
    res.status(400).json({ error: "Missing parameter id" });
    return;
  }

  if (!requisitionIds.includes(req.query.id)) {
    console.warn("Missing requisition id, aborting.");
    res.status(404).json({ error: "Requisition does not exist" });
    return;
  }

  switch (req.method) {
    case "DELETE":
      await deleteRequisition(req.query.id, session);
      await user.setRequisitionIds(requisitionIds.filter(id => id != req.query.id));
      res.status(204).end();
      break;

    case "GET":
      const requisition = await getRequisition(req.query.id, session);
      console.log(`Requisition status is `, requisition.status);

      res.status(200).json(requisition);
      break;
    default:
      res.status(400).json({ error: "Invalid method" });
      break;
  }
});