import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { readById, mapEmployee } from "@/lib/odoo";
import type { OdooEmployeeRaw } from "@/types/odoo";

export const dynamic = "force-dynamic";

const EMPLOYEE_FIELDS = [
  "id",
  "name",
  "work_email",
  "job_title",
  "department_id",
  "parent_id",
  "active",
  "image_128",
];

interface PageProps {
  params: Promise<{ employeeId: string }>;
}

export default async function AppraisalDetailPage({ params }: PageProps) {
  const { employeeId } = await params;
  const id = Number(employeeId);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const raw = await readById<OdooEmployeeRaw>(
    "hr.employee",
    id,
    EMPLOYEE_FIELDS,
  );
  if (!raw) notFound();
  const employee = mapEmployee(raw);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          {employee.name}
        </h1>
        <p className="text-sm text-slate-400">
          {employee.jobTitle ?? "—"} ·{" "}
          <span className="text-slate-300">
            {employee.department ?? "No department"}
          </span>
        </p>
      </header>

      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">
            Appraisal aggregation · stub
          </CardTitle>
          <CardDescription className="text-slate-500">
            This page will combine timesheets (
            <code>account.analytic.line</code>), project history (
            <code>project.project</code>), and prior appraisal records (
            <code>hr.appraisal</code>) for {employee.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-slate-400 space-y-2">
          <div>
            Manager:{" "}
            <span className="text-slate-200">
              {employee.managerName ?? "—"}
            </span>
          </div>
          <div>
            Email:{" "}
            <span className="text-slate-200">{employee.email ?? "—"}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
