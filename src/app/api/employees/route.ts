import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  getCachedEmployees,
  getCachedActiveEmployeeCount,
  mapEmployee,
} from "@/lib/odoo";
import type { EmployeesPayload } from "@/types/employee";

// Hard upper bound to protect Odoo from runaway queries through this endpoint.
const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

export async function GET(
  req: NextRequest,
): Promise<NextResponse<EmployeesPayload | { error: string }>> {
  try {
    const url = new URL(req.url);

    const rawLimit = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT);
    const rawOffset = Number(url.searchParams.get("offset") ?? 0);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
      : DEFAULT_LIMIT;
    const offset = Number.isFinite(rawOffset) && rawOffset >= 0 ? rawOffset : 0;

    const [rows, total] = await Promise.all([
      getCachedEmployees(limit, offset),
      getCachedActiveEmployeeCount(),
    ]);

    return NextResponse.json({
      data: rows.map(mapEmployee),
      pagination: { total, limit, offset },
    });
  } catch (err) {
    // Log server-side; never leak Odoo internals (URLs, stack traces) to clients.
    console.error("[api/employees] Odoo error:", err);
    return NextResponse.json(
      { error: "Failed to fetch employees from Odoo" },
      { status: 502 },
    );
  }
}
