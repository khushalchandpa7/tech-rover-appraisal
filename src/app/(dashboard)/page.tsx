import { Suspense } from "react";

import { StatsCards } from "@/components/dashboard/StatsCards";
import { EmployeeTable } from "@/components/dashboard/EmployeeTable";
import { EmployeeTableSkeleton } from "@/components/dashboard/EmployeeTableSkeleton";
import {
  getCachedActiveEmployeeCount,
  getCachedDepartmentCount,
  getCachedEmployees,
  getCachedPendingAppraisalCount,
  mapEmployee,
} from "@/lib/odoo";

// Render per request so the build does not attempt to reach Odoo with the
// placeholder credentials that ship in .env.local. Data is still served
// from 'use cache' (5 min TTL) so this is not an Odoo load concern.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

async function DashboardData({ page }: { page: number }) {
  const offset = (page - 1) * PAGE_SIZE;

  const [rawEmployees, activeCount, departmentCount, pendingAppraisals] =
    await Promise.all([
      getCachedEmployees(PAGE_SIZE, offset),
      getCachedActiveEmployeeCount(),
      getCachedDepartmentCount(),
      getCachedPendingAppraisalCount(),
    ]);

  return (
    <div className="space-y-6">
      <StatsCards
        totalEmployees={activeCount}
        totalDepartments={departmentCount}
        pendingAppraisals={pendingAppraisals}
      />
      <EmployeeTable
        employees={rawEmployees.map(mapEmployee)}
        totalCount={activeCount}
        currentPage={page}
        pageSize={PAGE_SIZE}
        basePath="/"
      />
    </div>
  );
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? "1") || 1);

  return (
    <div className="space-y-7">
      <header className="animate-fade-up">
        <p className="text-[11px] font-semibold text-[#3D4E67] uppercase tracking-[0.14em] mb-1">
          Overview
        </p>
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#DDE8F5] leading-none">
          Appraisal Dashboard
        </h1>
        <p className="text-[13px] text-[#4A5A7A] mt-1.5 font-medium">
          Live data from Odoo · cache refreshed every 5 minutes
        </p>
      </header>

      <Suspense fallback={<EmployeeTableSkeleton />}>
        <DashboardData page={page} />
      </Suspense>
    </div>
  );
}
