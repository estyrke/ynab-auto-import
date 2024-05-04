import { request } from "https";
import { Session } from "./fauna";

type TokenResponse = {
  access: string;
  access_expires: number;
  refresh: string;
  refresh_expires: number;
};

type RefreshTokenResponse = {
  access: string;
  access_expires: number;
};

export type Tokens = {
  access: string;
  access_expires: Date;
  refresh: string;
  refresh_expires: Date;
};

const makeRequest = async <Res>(
  method: string,
  path: string,
  body: any,
  session?: Session
) =>
  new Promise<Res>(async (resolve, reject) => {
    let tokens = undefined;
    if (session) {
      tokens = await session.getTokens();
      if (!tokens?.refresh_expires || tokens.refresh_expires < new Date()) {
        tokens = await session.updateTokens(await getTokens());
      } else if (!tokens.access_expires || tokens.access_expires < new Date()) {
        tokens = await session.updateTokens(await refreshTokens(tokens));
      }
    }
    const postData = body !== undefined ? JSON.stringify(body) : "";
    const auth = tokens?.access
      ? { Authorization: `Bearer ${tokens.access}` }
      : {};

    const nreq = request(
      {
        method,
        host: "bankaccountdata.gocardless.com",
        path,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Content-Length": Buffer.byteLength(postData),
          ...auth,
        },
      },
      (nres) => {
        nres.setEncoding("utf8");
        let ndata = "";
        nres.on("data", (chunk) => {
          ndata += chunk;
        });
        nres.on("end", () => {
          if (
            nres.statusCode &&
            nres.statusCode >= 200 &&
            nres.statusCode < 300
          ) {
            resolve(JSON.parse(ndata));
          } else {
            reject(JSON.parse(ndata));
          }
        });
      }
    );

    nreq.on("error", (e) => {
      console.log(`problem with request: ${e.message}`);
      reject(e);
    });

    // write data to request body
    nreq.write(postData);
    nreq.end();
  });

const post = async <Res>(
  path: string,
  body: any,
  session?: Session
): Promise<Res> => makeRequest("POST", path, body, session);
const get = async <Res>(path: string, session?: Session): Promise<Res> =>
  makeRequest("GET", path, "", session);

export const getTokens = async (): Promise<Tokens> => {
  console.log("Fetching new tokens...");
  return post<TokenResponse>("/api/v2/token/new/", {
    secret_id: process.env.NORDIGEN_SECRET_ID,
    secret_key: process.env.NORDIGEN_SECRET_KEY,
  }).then((tokens) => ({
    ...tokens,
    access_expires: new Date(Date.now() + tokens.access_expires),
    refresh_expires: new Date(Date.now() + tokens.refresh_expires),
  }));
};

export const refreshTokens = async (tokens: Tokens): Promise<Tokens> => {
  console.log("Refreshing access token...");

  return post<RefreshTokenResponse>("/api/v2/token/refresh/", {
    refresh: tokens.refresh,
  }).then((access_token) => ({
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

export type RequisitionStatusData = {
  short: string;
  long: string;
  description: string;
};
export const requisitionStatus = (
  shortStatus?: string
): RequisitionStatusData | undefined =>
  ({
    CR: {
      short: "CR",
      long: "CREATED",
      description: "Requisition has been successfully created",
    },
    LN: {
      short: "LN",
      long: "LINKED",
      description: "Account has been successfully linked to requisition",
    },
    EX: {
      short: "EX",
      long: "EXPIRED",
      description: "Access to account has expired as set in End User Agreement",
    },
    RJ: {
      short: "RJ",
      long: "REJECTED",
      description: "SSN verification has failed",
    },
    UA: {
      short: "UA",
      long: "UNDERGOING_AUTHENTICATION",
      description:
        "End-user is redirected to the financial institution for authentication",
    },
    GA: {
      short: "GA",
      long: "GRANTING_ACCESS",
      description: "End-user is granting access to their account information",
    },
    SA: {
      short: "SA",
      long: "SELECTING_ACCOUNTS",
      description: "End-user is selecting accounts",
    },
    GC: {
      short: "GC",
      long: "GIVING_CONSENT",
      description: "End-user is giving consent at Nordigen's consent screen",
    },
  }[shortStatus ?? ""]);

type RequisitionsData = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RequisitionData[];
};

export type CreateRequisitionOptions = {
  redirectUrl: string;
  institutionId: string;
};

export const createRequisition = async (
  { redirectUrl, institutionId }: CreateRequisitionOptions,
  session: Session
) =>
  post<RequisitionData>(
    "/api/v2/requisitions/",
    {
      redirect: redirectUrl,
      institution_id: institutionId,
    },
    session
  );

export const deleteRequisition = async (id: string, session: Session) =>
  makeRequest<void>(
    "DELETE",
    `/api/v2/requisitions/${id}/`,
    undefined,
    session
  );

export const getRequisition = async (id: string, session: Session) =>
  get<RequisitionData>(`/api/v2/requisitions/${id}/`, session);
export const getRequisitions = async (session: Session) =>
  (await get<RequisitionsData>(`/api/v2/requisitions/`, session)).results;

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

export const getAccount = async (id: string, session: Session) =>
  (
    await get<{ account: AccountDetails }>(
      `/api/v2/accounts/${id}/details/`,
      session
    )
  ).account;

export type Currency = string; // TODO: enum?

export type Amount = {
  currency: Currency;
  amount: string;
};

export type PendingTransaction = {
  transactionAmount: Amount;
  valueDate: string;
  remittanceInformationUnstructured: string;
};

export type CurrencyExchange = {
  exchangeRate: string;
  instructedAmount: Amount;
  sourceCurrency: Currency;
  targetCurrency: Currency;
  unitCurrency: Currency;
};

export type Transaction = PendingTransaction & {
  transactionId: string;
  creditorName?: string;
  debtorName?: string;
  creditorAccount?: Account;
  debtorAccount?: Account;
  bankTransactionCode?: string;
  bookingDate: string;
  entryReference?: string;
  additionalInformation?: string;
  currencyExchange?: CurrencyExchange;
};

export type TransactionData = {
  booked: Transaction[];
  pending: PendingTransaction[];
};

export const getTransactions = async (accountId: string, session: Session) =>
  (
    await get<{ transactions: TransactionData }>(
      `/api/v2/accounts/${accountId}/transactions/`,
      session
    )
  ).transactions;

export type InstitutionData = {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  countries: string[];
  logo: string;
};

export const getInstitiutions = async (countryCode: string, session: Session) =>
  get<InstitutionData[]>(
    `/api/v2/institutions/?country=${countryCode}`,
    session
  );
export const getInstitiution = async (id: string, session: Session) =>
  get<InstitutionData>(`/api/v2/institutions/${id}/`, session);
