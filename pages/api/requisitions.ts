import { requireAuth, RequireAuthProp } from "@clerk/clerk-sdk-node";
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient, getUser, getSession } from "../../lib/fauna";
import { ApiError } from "../../lib/api.error";
import { createRequisition, RequisitionData } from "../../lib/nordigen";

export default requireAuth(
  async (
    req: RequireAuthProp<NextApiRequest>,
    res: NextApiResponse<RequisitionData | string[] | ApiError>
  ) => {
    const client = createClient();
    const user = await getUser(client, req.auth?.userId ?? "").catch((e) => {
      throw JSON.stringify(e);
    });
    let requisitionIds = await user.getRequisitionIds();

    switch (req.method) {
      case "POST":
        const session = await getSession(client);
        console.log("body", req.body);
        const requisition = await createRequisition(req.body, session);
        requisitionIds = await user.setRequisitionIds([
          ...requisitionIds,
          requisition.id,
        ]);
        res.status(200).json(requisition);
        break;
      case "GET":
        console.log("User's requisitions: ", requisitionIds);
        res.status(200).json(requisitionIds ?? []);
        break;
      default:
        res.status(400).json({ error: "Invalid method" });
        break;
    }
  }
);
