import { API } from "ynab";
import { createClient, getUser, User } from './fauna';
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage } from "http";
import { RequireAuthProp } from '@clerk/clerk-sdk-node';

export function absoluteUrl(
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

export const requestYnabTokens = (origin: string, code: string) => {
  console.log("Fetching YNAB token");

  const clientId = process.env.NEXT_PUBLIC_YNAB_CLIENT_ID;
  const clientSecret = process.env.YNAB_CLIENT_SECRET;
  const redirectUri = origin + "/api/ynab/authorize";

  if (!clientId || !clientSecret) {
    throw new Error("Missing YNAB client configuration!");
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);
  params.append("grant_type", "authorization_code")
  params.append("code", code);

  return fetch(`https://app.youneedabudget.com/oauth/token`, {
    method: "POST",
    body: params
  });
}

export const refreshYnabToken = (origin: string, refreshToken: string) => {
  console.log("Refreshing YNAB token");

  const clientId = process.env.NEXT_PUBLIC_YNAB_CLIENT_ID;
  const clientSecret = process.env.YNAB_CLIENT_SECRET;
  const redirectUri = origin + "/api/ynab/authorize";

  if (!clientId || !clientSecret) {
    throw new Error("Missing YNAB client configuration!");
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("redirect_uri", redirectUri);
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", refreshToken);

  return fetch(`https://app.youneedabudget.com/oauth/token`, {
    method: "POST",
    body: params
  });
}

export type YnabTokenData = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
};

export const getFreshYnabTokens = async (user: User, origin: string) => {
  let ynabTokens = await user.getYnabTokens();

  if (!ynabTokens) {
    throw new Error("Missing YNAB token in storage")
  }

  if (ynabTokens.access_expires < new Date()) {
    const response = await refreshYnabToken(origin, ynabTokens.refresh_token);

    if (!response.ok) {
      throw new Error(`Error refreshing YNAB tokens: ${response.statusText}`);
    }

    const newYnabTokens: YnabTokenData = await response.json();

    console.log("New ynab tokens", newYnabTokens);

    await user.load();
    ynabTokens = await user.setYnabTokens({
      access_token: newYnabTokens.access_token,
      access_expires: new Date(Date.now() + newYnabTokens.expires_in),
      refresh_token: newYnabTokens.refresh_token
    });
  }

  if (!ynabTokens?.access_token) {
    throw new Error("Unable to get YNAB token");
  }

  return ynabTokens;
};

export const withYnabApi = <
  Req extends RequireAuthProp<NextApiRequest>,
  Res extends NextApiResponse
>(handler: (req: Req, res: Res, ynab: API) => Promise<void> | void) => {
  return async (req: Req, res: Res) => {
    const client = createClient();
    const user = await getUser(client, req.auth.userId);
    const origin = absoluteUrl(req).origin;

    let ynabTokens;
    try {
      ynabTokens = await getFreshYnabTokens(user, origin);
    } catch (e: any) {
      res.status(400).json({ error: e ? e.toString() : "unknown" });
      return;
    }
    const ynab = new API(ynabTokens.access_token);
    console.log("Got ynab api", ynabTokens)
    await handler(req, res, ynab);
  }
}
