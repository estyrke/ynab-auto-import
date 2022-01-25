import { NextApiRequest, NextApiResponse } from 'next';
import { serialize, CookieSerializeOptions } from 'cookie'

import { JWE, JWK } from 'node-jose';
import { Tokens } from './nordigen';

export type Session = {
  req_id?: string;
  req_status?: string;
  tokens?: Tokens;
}

/**
 * This sets `cookie` using the `res` object
 */

const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue = JSON.stringify(value);

  if (options.maxAge !== undefined) {
    options.expires = new Date(Date.now() + options.maxAge)
    options.maxAge /= 1000
  }

  res.setHeader('Set-Cookie', serialize(name, stringValue, options))
}


export const loadSession = async (req: NextApiRequest): Promise<Session> => {
  if (req.cookies["MONEY_SESSION"] === undefined) {
    console.warn("No session present");
    return {};
  }
  const key = await JWK.asKey(process.env.MONEY_JWK ?? "");
  const dec = JWE.createDecrypt(key);

  const encSession = JSON.parse(req.cookies["MONEY_SESSION"]);
  const decResult = await dec.decrypt(encSession);
  const session = JSON.parse(decResult.payload.toString());
  session.tokens.access_expires = new Date(session.tokens.access_expires);
  session.tokens.refresh_expires = new Date(session.tokens.refresh_expires);
  console.log("Session is", session);

  return session;
}

export const saveSession = async (res: NextApiResponse, session: Session): Promise<void> => {
  console.log("Session is", session);

  const key = await JWK.asKey(process.env.MONEY_JWK ?? "");
  const enc = JWE.createEncrypt(key);
  enc.update(Buffer.from(JSON.stringify(session)));
  const encSession = await enc.final();
  setCookie(res, "MONEY_SESSION", encSession, { httpOnly: true });
}