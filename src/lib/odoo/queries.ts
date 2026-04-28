import "server-only";

import { cacheTag, cacheLife } from "next/cache";

import { searchRead, count, type OdooDomain } from "./client";
import type { OdooEmployeeRaw, OdooAppraisalRaw } from "@/types/odoo";

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
