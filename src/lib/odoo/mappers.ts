import type { OdooEmployeeRaw, OdooAppraisalRaw } from "@/types/odoo";
import type { Employee, Appraisal } from "@/types/employee";

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
