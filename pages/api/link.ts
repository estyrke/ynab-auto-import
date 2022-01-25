import { IncomingMessage } from 'http';
import { request } from 'https'
import type { NextApiRequest, NextApiResponse } from 'next'
import { createRequisition, getTokens, RequisitionData } from '../../lib/nordigen';
import { loadSession, saveSession } from '../../lib/session';

function absoluteUrl(
  req?: IncomingMessage,
  localhostAddress = 'localhost:3000'
) {
  let host =
    (req?.headers ? req.headers.host : window.location.host) || localhostAddress
  let protocol = /^localhost(:\d+)?$/.test(host) ? 'http:' : 'https:'

  if (
    req &&
    req.headers['x-forwarded-host'] &&
    typeof req.headers['x-forwarded-host'] === 'string'
  ) {
    host = req.headers['x-forwarded-host']
  }

  if (
    req &&
    req.headers['x-forwarded-proto'] &&
    typeof req.headers['x-forwarded-proto'] === 'string'
  ) {
    protocol = `${req.headers['x-forwarded-proto']}:`
  }

  return {
    protocol,
    host,
    origin: protocol + '//' + host,
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequisitionData>
) {
  const session = await loadSession(req);
  const requisition = await createRequisition(`${absoluteUrl(req).origin}/`, session);

  session.req_id = requisition.id;
  await saveSession(res, session);
  res.status(200).json(requisition);
}
