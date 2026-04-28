import { Suspense } from "react";
import type { Metadata } from "next";

import { EmployeeTable } from "@/components/dashboard/EmployeeTable";
import { EmployeeTableSkeleton } from "@/components/dashboard/EmployeeTableSkeleton";
import {
  getCachedActiveEmployeeCount,
  getCachedEmployees,
  mapEmployee,
} from "@/lib/odoo";

export const metadata: Metadata = {
  title: "Employees — TechRover Appraisals",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

async function EmployeesData({ page }: { page: number }) {
  const offset = (page - 1) * PAGE_SIZE;

  const [rawEmployees, totalCount] = await Promise.all([
    getCachedEmployees(PAGE_SIZE, offset),
    getCachedActiveEmployeeCount(),
  ]);

  return (
    <EmployeeTable
      employees={rawEmployees.map(mapEmployee)}
      totalCount={totalCount}
      currentPage={page}
      pageSize={PAGE_SIZE}
      basePath="/employees"
    />
  );
}

export default async function EmployeesPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? "1") || 1);

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <p className="text-[11px] font-semibold text-[#3D4E67] uppercase tracking-[0.14em] mb-1">
          hr.employee
        </p>
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#DDE8F5] leading-none">
          Employees
        </h1>
        <p className="text-[13px] text-[#4A5A7A] mt-1.5 font-medium">
          All active employees from Odoo · {PAGE_SIZE} per page
        </p>
      </header>

      <Suspense fallback={<EmployeeTableSkeleton rows={PAGE_SIZE} />}>
        <EmployeesData page={page} />
      </Suspense>
    </div>
  );
}
