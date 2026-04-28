import "server-only";

import xmlrpc from "xmlrpc";
import { cacheTag, cacheLife } from "next/cache";

import { env } from "./env";
import type { OdooEmployeeRaw, OdooAppraisalRaw } from "@/types/odoo";
import type { Employee, Appraisal } from "@/types/employee";

/* ─────────────────────────────────────────────────────────────────────────
 * Public types
 * ────────────────────────────────────────────────────────────────────── */

export type OdooDomain = ReadonlyArray<unknown>;

export interface OdooSearchReadOptions {
  domain?: OdooDomain;
  fields?: readonly string[];
  offset?: number;
  limit?: number;
  order?: string;
}

/* ─────────────────────────────────────────────────────────────────────────
 * XML-RPC clients (lazy, one per process)
 * ────────────────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────────────────
 * Authentication — UID is memoized for the lifetime of the server runtime.
 * ────────────────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────────────────
 * Generic execute_kw wrapper
 * ────────────────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────────────────
 * Reusable typed helpers
 * ────────────────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────────────────
 * Domain mappers
 * ────────────────────────────────────────────────────────────────────── */

const stringOrNull = (v: string | false): string | null =>
  typeof v === "string" && v.length > 0 ? v : null;

export function mapEmployee(raw: OdooEmployeeRaw): Employee {
  return {
    id: raw.id,
    name: raw.name,
    email: stringOrNull(raw.work_email),
    jobTitle: stringOrNull(raw.job_title),
    department: raw.department_id ? raw.department_id[1] : null,
    managerName: raw.parent_id ? raw.parent_id[1] : null,
    avatarBase64: stringOrNull(raw.image_128),
  };
}

export function mapAppraisal(raw: OdooAppraisalRaw): Appraisal {
  return {
    id: raw.id,
    displayName: raw.display_name,
    employeeId: raw.employee_id ? raw.employee_id[0] : 0,
    employeeName: raw.employee_id ? raw.employee_id[1] : null,
    stage: raw.stage_id ? raw.stage_id[1] : null,
    deadline: stringOrNull(raw.appraisal_deadline),
    periodFrom: stringOrNull(raw.app_period_from),
    isDraft: raw.check_draft,
    isSent: raw.check_sent,
    isDone: raw.check_done,
    isCancelled: raw.check_cancel,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
 * Field lists
 * ────────────────────────────────────────────────────────────────────── */

const EMPLOYEE_FIELDS = [
  "id",
  "name",
  "work_email",
  "job_title",
  "department_id",
  "parent_id",
  "active",
  "image_128",
] as const;

const ACTIVE_DOMAIN: OdooDomain = [["active", "=", true]];

const APPRAISAL_FIELDS = [
  "id",
  "display_name",
  "employee_id",
  "stage_id",
  "appraisal_deadline",
  "app_period_from",
  "check_draft",
  "check_sent",
  "check_done",
  "check_cancel",
] as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Cached resource helpers — use 'use cache' directive (Next.js 16).
 *
 * Requires `experimental.useCache: true` in next.config.ts.
 * cacheTag() enables on-demand revalidation via revalidateTag(tag, 'max').
 * cacheLife('minutes') ≈ 5-min stale-while-revalidate window.
 * ────────────────────────────────────────────────────────────────────── */

export async function getCachedEmployees(
  limit: number,
  offset: number,
): Promise<OdooEmployeeRaw[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("employees");

  return searchRead<OdooEmployeeRaw>("hr.employee", {
    domain: ACTIVE_DOMAIN,
    fields: EMPLOYEE_FIELDS,
    limit,
    offset,
    order: "name asc",
  });
}

export async function getCachedActiveEmployeeCount(): Promise<number> {
  "use cache";
  cacheLife("minutes");
  cacheTag("employees");

  return count("hr.employee", ACTIVE_DOMAIN);
}

export async function getCachedDepartmentCount(): Promise<number> {
  "use cache";
  cacheLife("minutes");
  cacheTag("departments");

  return count("hr.department", []);
}

export async function getCachedPendingAppraisalCount(): Promise<number> {
  "use cache";
  cacheLife("minutes");
  cacheTag("appraisals");

  return count("hr.appraisal", [["check_done", "=", false], ["check_cancel", "=", false]]);
}

export async function getCachedAppraisals(
  limit: number,
  offset: number,
  domain: OdooDomain = [],
): Promise<OdooAppraisalRaw[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("appraisals");

  return searchRead<OdooAppraisalRaw>("hr.appraisal", {
    domain,
    fields: APPRAISAL_FIELDS,
    limit,
    offset,
    order: "appraisal_deadline asc",
  });
}

export async function getCachedAppraisalCount(
  domain: OdooDomain = [],
): Promise<number> {
  "use cache";
  cacheLife("minutes");
  cacheTag("appraisals");

  return count("hr.appraisal", domain);
}
