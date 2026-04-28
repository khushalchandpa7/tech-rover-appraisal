/**
 * Domain shapes used by the UI. These are the result of mapping the raw
 * Odoo payloads (see `types/odoo.ts`) into normalized values where:
 *  - missing strings become `null` (never the literal `false`)
 *  - many2one tuples become a single display string
 */

export interface Employee {
  id: number;
  name: string;
  email: string | null;
  jobTitle: string | null;
  department: string | null;
  managerName: string | null;
  /** Base64 image without the `data:image/png;base64,` prefix. */
  avatarBase64: string | null;
}

export interface EmployeesPayload {
  data: Employee[];
  pagination: { total: number; limit: number; offset: number };
}

export interface Appraisal {
  id: number;
  displayName: string;
  employeeId: number;
  employeeName: string | null;
  stage: string | null;
  deadline: string | null;
  periodFrom: string | null;
  isDraft: boolean;
  isSent: boolean;
  isDone: boolean;
  isCancelled: boolean;
}
