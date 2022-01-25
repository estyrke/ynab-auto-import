import { tokenToCSSVar } from "@chakra-ui/react";
import { request } from "https";
import { Session } from "./session";

type TokenResponse = {
  access: string,
  access_expires: number,
  refresh: string,
  refresh_expires: number,
};

type RefreshTokenResponse = {
  access: string,
  access_expires: number,
};

export type Tokens = {
  access: string,
  access_expires: Date,
  refresh: string,
  refresh_expires: Date,
};

const makeRequest = async <Res>(method: string, path: string, body: any, session?: Session) =>
  new Promise<Res>(async (resolve, reject) => {
    // TODO: add token refresh logic
    let token = undefined;
    if (session) {
      if (!session.tokens || session.tokens.refresh_expires < new Date()) {
        session.tokens = await getTokens();
      }
      else if (session.tokens.access_expires < new Date()) {
        session.tokens = await refreshTokens(session.tokens);
      }
      token = session.tokens.access;
    }
    const postData = body !== undefined ? JSON.stringify(body) : "";
    console.log(`REQUEST URL: ${path}`)
    console.log(`REQUEST BODY: ${postData}`)
    const auth = token ? { 'Authorization': `Bearer ${token}` } : {};

    const nreq = request({
      method, host: "ob.nordigen.com", path, headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...auth
      }
    }, (nres) => {
      console.log(`STATUS: ${nres.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(nres.headers)}`);
      nres.setEncoding('utf8');
      let ndata = "";
      nres.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
        ndata += chunk;
      });
      nres.on('end', () => {
        if (nres.statusCode && nres.statusCode >= 200 && nres.statusCode < 300) {
          resolve(JSON.parse(ndata));
        }
        else {
          reject(JSON.parse(ndata));
        }
      });
    });

    nreq.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
      reject(e);
    });

    // write data to request body
    nreq.write(postData);
    nreq.end();
  });

const post = async<Res>(path: string, body: any, session?: Session): Promise<Res> => makeRequest("POST", path, body, session);
const get = async<Res>(path: string, session?: Session): Promise<Res> => makeRequest("GET", path, "", session);

export const getTokens = async (): Promise<Tokens> => {
  console.log("Fetching new tokens...");
  return post<TokenResponse>("/api/v2/token/new/", { secret_id: process.env.NORDIGEN_SECRET_ID, secret_key: process.env.NORDIGEN_SECRET_KEY })
    .then(tokens => ({
      ...tokens,
      access_expires: new Date(Date.now() + tokens.access_expires),
      refresh_expires: new Date(Date.now() + tokens.refresh_expires)
    }));
};

export const refreshTokens = async (tokens: Tokens): Promise<Tokens> => {
  console.log("Refreshing access token...");

  return post<RefreshTokenResponse>("/api/v2/token/refresh/", { refresh: tokens.refresh })
    .then(access_token => ({
      ...tokens,
      access: access_token.access,
      access_expires: new Date(Date.now() + access_token.access_expires),
    }));
};

export type RequisitionData = {
  id: string;
  created: string;
  redirect: string;
  status: string;
  institution_id: string;
  agreements: string;
  accounts: string[];
  reference: string;
  user_language: string;
  link: string;
  ssn: string;
  account_selection: boolean;
};

export const createRequisition = async (redirectUrl: string, session: Session) => post<RequisitionData>("/api/v2/requisitions/", {
  redirect: redirectUrl,
  //institution_id: "SANDBOXFINANCE_SFIN0000",
  institution_id: "DANSKEBANK_DABASESX"
}, session);

export const deleteRequisition = async (id: string, session: Session) => makeRequest<void>("DELETE", `/api/v2/requisitions/${id}/`, undefined, session);

export const getRequisition = async (id: string, session: Session) => get<RequisitionData>(`/api/v2/requisitions/${id}/`, session);

export type Account = {
  iban?: string;
  bban?: string;
};

export type AccountDetails = {
  id: string;
  resourceId: string;
  iban: string;
  bban: string;
  currency: string;
  ownerName: string;
  name: string;
  product: string;
  cashAccountType: string;
};

export const getAccount = async (id: string, session: Session) => (await get<{ account: AccountDetails }>(`/api/v2/accounts/${id}/details/`, session)).account;


export type Amount = {
  currency: string;
  amount: string;
};

export type PendingTransaction = {
  transactionAmount: Amount;
  valueDate: string;
  remittanceInformationUnstructured: string;
};


export type Transaction = PendingTransaction & {
  transactionId: string;
  creditorName?: string;
  debtorName?: string;
  creditorAccount?: Account;
  debtorAccount?: Account;
  bankTransactionCode: string;
  bookingDate: string;
};


export type TransactionData = {
  booked: Transaction[];
  pending: PendingTransaction[];
}

export const getTransactions = async (accountId: string, session: Session) => (await get<{ transactions: TransactionData }>(`/api/v2/accounts/${accountId}/transactions/`, session)).transactions;
