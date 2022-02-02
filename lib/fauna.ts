import { Client, Ref, Collection, Get, Match, Index, Update, If, Exists, Create, Let, Var, Expr, values } from 'faunadb';
import { Tokens } from './nordigen';

export const createClient = () => new Client({
  secret: process.env.FAUNA_ADMIN_KEY ?? "",
  domain: 'db.fauna.com',
  port: 443,
  scheme: 'https',
})

type SessionData = {
  tokens?: {
    access: string;
    access_expires: values.FaunaTime;
    refresh: string;
    refresh_expires: values.FaunaTime;
  }
}

type FaunaDocument<TData> = {
  ref: Expr;
  ts: number;
  data: TData;
}

type GlobalDocument = FaunaDocument<SessionData>;

export class Session {
  private data: SessionData = {};

  constructor(private readonly client: Client) {
  }

  public readonly load = async () => {
    this.data = (await this.client.query<GlobalDocument>(Let({
      session: Ref(Collection("Globals"), 1)
    }, If(Exists(Var("session")),
      Get(Var("session")),
      Create(Var("session"), { data: {} })
    )))).data ?? {};
  }

  public readonly getTokens = async (): Promise<Tokens | undefined> => {
    await this.load();
    return this.data.tokens ? {
      ...this.data.tokens,
      access_expires: new Date((this.data.tokens?.access_expires as values.FaunaTime & { value: string }).value),
      refresh_expires: new Date((this.data.tokens?.refresh_expires as values.FaunaTime & { value: string }).value),
    } : undefined;
  }

  public readonly updateTokens = async (tokens: Tokens): Promise<Tokens | undefined> => {
    const updated = await this.client.query<GlobalDocument>(
      Update(
        Ref(Collection("Globals"), 1),
        {
          data: {
            tokens: {
              ...tokens,
              access_expires: new values.FaunaTime(tokens.access_expires),
              refresh_expires: new values.FaunaTime(tokens.refresh_expires)
            }
          }
        }));
    this.data = updated.data;
    return this.getTokens();
  }
}


export const getSession = (client: Client) => new Session(client)


export type AccountLink = {
  iban: string;
  ynabAccount: string;
};

export type YnabTokens = {
  access_token: string;
  access_expires: Date;
  refresh_token: string;
}

export type UserData = {
  requisitionIds?: string[];
  account_links?: AccountLink[];
  ynabTokens?: {
    access_token: string;
    access_expires: values.FaunaTime;
    refresh_token: string;
  };
};

export type UserDocument = FaunaDocument<UserData>;

export class User {
  private data: UserData = {};
  private ref;

  constructor(private readonly client: Client, private readonly userId: string) {
    this.ref = Match(Index("user_by_id"), userId);
  }

  public readonly load = async () => {
    const doc = await this.client.query<UserDocument>(Let({
      userRef: this.ref,
    }, If(Exists(Var("userRef")),
      Get(Var("userRef")),
      Create("Users", { data: { userId: this.userId } }))));

    this.data = doc.data;
    this.ref = doc.ref;
  }

  public readonly getRequisitionIds = async (): Promise<string[]> => {
    await this.load();
    return this.data.requisitionIds ?? [];
  }

  public readonly setRequisitionIds = async (requisitionIds: string[]): Promise<string[]> => {
    const updated = await this.client.query<UserDocument>(Update(this.ref, { data: { requisitionIds } }));
    this.data = updated.data;
    return this.data.requisitionIds ?? [];
  }

  public readonly getYnabTokens = async (): Promise<YnabTokens | undefined> => {
    await this.load();
    return this.data.ynabTokens ? {
      ...this.data.ynabTokens,
      access_expires: new Date((this.data.ynabTokens?.access_expires as values.FaunaTime & { value: string }).value),
    } : undefined;
  }

  public readonly setYnabTokens = async (ynabTokens: YnabTokens): Promise<YnabTokens | undefined> => {
    const updated = await this.client.query<UserDocument>(Update(this.ref, {
      data: {
        ynabTokens: {
          ...ynabTokens,
          access_expires: new values.FaunaTime(ynabTokens.access_expires),
        }
      }
    }));
    this.data = updated.data;
    return this.getYnabTokens();
  }
}

export const getUser = async (client: Client, userId: string) => new User(client, userId);
