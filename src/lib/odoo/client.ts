import "server-only";

import xmlrpc from "xmlrpc";

import { env } from "../env";

export type OdooDomain = ReadonlyArray<unknown>;

export interface OdooSearchReadOptions {
  domain?: OdooDomain;
  fields?: readonly string[];
  offset?: number;
  limit?: number;
  order?: string;
}

type XmlRpcClient = ReturnType<typeof xmlrpc.createClient>;

const isSecure = env.ODOO_URL.startsWith("https://");
const createClient = isSecure ? xmlrpc.createSecureClient : xmlrpc.createClient;

const commonClient: XmlRpcClient = createClient({
  url: `${env.ODOO_URL}/xmlrpc/2/common`,
});
const objectClient: XmlRpcClient = createClient({
  url: `${env.ODOO_URL}/xmlrpc/2/object`,
});

function methodCall<T>(
  client: XmlRpcClient,
  method: string,
  params: unknown[],
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    client.methodCall(method, params, (err: unknown, value: unknown) => {
      if (err) reject(err);
      else resolve(value as T);
    });
  });
}

let cachedUid: number | null = null;

export async function authenticate(): Promise<number> {
  if (cachedUid !== null) return cachedUid;

  const uid = await methodCall<number | false>(commonClient, "authenticate", [
    env.ODOO_DB,
    env.ODOO_USERNAME,
    env.ODOO_API_KEY,
    {},
  ]);

  if (!uid) {
    throw new Error(
      "Odoo authentication failed — verify ODOO_DB, ODOO_USERNAME, and ODOO_API_KEY.",
    );
  }

  cachedUid = uid;
  return uid;
}

export async function executeKw<T>(
  model: string,
  method: string,
  args: readonly unknown[] = [],
  kwargs: Readonly<Record<string, unknown>> = {},
): Promise<T> {
  const uid = await authenticate();
  return methodCall<T>(objectClient, "execute_kw", [
    env.ODOO_DB,
    uid,
    env.ODOO_API_KEY,
    model,
    method,
    args,
    kwargs,
  ]);
}

export function searchRead<T = Record<string, unknown>>(
  model: string,
  {
    domain = [],
    fields = [],
    offset = 0,
    limit = 80,
    order = "",
  }: OdooSearchReadOptions = {},
): Promise<T[]> {
  return executeKw<T[]>(model, "search_read", [domain], {
    fields,
    offset,
    limit,
    order,
  });
}

export function count(model: string, domain: OdooDomain = []): Promise<number> {
  return executeKw<number>(model, "search_count", [domain]);
}

export async function readById<T = Record<string, unknown>>(
  model: string,
  id: number,
  fields: readonly string[] = [],
): Promise<T | null> {
  const rows = await executeKw<T[]>(model, "read", [[id]], { fields });
  return rows[0] ?? null;
}
