import { NextResponse } from "next/server";
import { executeKw } from "@/lib/odoo";

export const dynamic = "force-dynamic";

export async function GET() {
  const fields = await executeKw<Record<string, { string: string; type: string }>>(
    "hr.appraisal",
    "fields_get",
    [],
    { attributes: ["string", "type"] },
  );

  const sorted = Object.entries(fields)
    .map(([key, meta]) => ({ field: key, label: meta.string, type: meta.type }))
    .sort((a, b) => a.field.localeCompare(b.field));

  return NextResponse.json(sorted);
}
