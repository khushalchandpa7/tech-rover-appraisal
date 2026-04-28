/**
 * Raw Odoo payload shapes as returned by XML-RPC `search_read` / `read` calls.
 *
 * Odoo quirks worth knowing:
 *  - many2one fields come back as `[id, display_name]` tuples, or `false` when empty.
 *  - Optional string/text fields return `false` instead of `null` or `""`.
 *  - Dates and datetimes are ISO-ish strings ("2025-04-27" or "2025-04-27 10:15:00").
 *  - Image fields like `image_128` are base64 strings or `false`.
 */

/** A many2one relational field. */
export type OdooMany2One = [number, string] | false;

/** Optional string fields use `false` for empty values in Odoo. */
export type OdooOptionalString = string | false;

/** `hr.employee` model — fields used in this scaffold. */
export interface OdooEmployeeRaw {
  id: number;
  name: string;
  work_email: OdooOptionalString;
  job_title: OdooOptionalString;
  department_id: OdooMany2One;
  parent_id: OdooMany2One; // direct manager
  active: boolean;
  image_128: OdooOptionalString; // base64-encoded avatar
}

/** `hr.department` count payload (search_count returns a number, not records). */
export interface OdooDepartmentRaw {
  id: number;
  name: string;
}

/** `hr.appraisal` model — fields confirmed via fields_get. */
export interface OdooAppraisalRaw {
  id: number;
  display_name: string;
  employee_id: OdooMany2One;
  stage_id: OdooMany2One;
  appraisal_deadline: OdooOptionalString;
  app_period_from: OdooOptionalString;
  check_draft: boolean;
  check_sent: boolean;
  check_done: boolean;
  check_cancel: boolean;
}
