import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCachedAppraisals,
  getCachedAppraisalCount,
  mapAppraisal,
} from "@/lib/odoo";
import type { OdooDomain } from "@/lib/odoo";
import type { Appraisal } from "@/types/employee";

export const metadata: Metadata = {
  title: "Appraisals — TechRover Appraisals",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type AppraisalFilter = "all" | "open" | "done" | "cancelled";

const FILTER_LABELS: Record<AppraisalFilter, string> = {
  all: "All",
  open: "Open",
  done: "Completed",
  cancelled: "Cancelled",
};

function filterDomain(filter: AppraisalFilter): OdooDomain {
  if (filter === "open")
    return [["check_done", "=", false], ["check_cancel", "=", false]];
  if (filter === "done") return [["check_done", "=", true]];
  if (filter === "cancelled") return [["check_cancel", "=", true]];
  return [];
}

function StatusBadge({ appraisal }: { appraisal: Appraisal }) {
  if (appraisal.isCancelled)
    return (
      <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-300">
        Cancelled
      </Badge>
    );
  if (appraisal.isDone)
    return (
      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
        Completed
      </Badge>
    );
  if (appraisal.isSent)
    return (
      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-300">
        In Progress
      </Badge>
    );
  return (
    <Badge variant="outline" className="border-slate-500/30 bg-slate-500/10 text-slate-300">
      Draft
    </Badge>
  );
}

function AppraisalTableSkeleton() {
  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader>
        <Skeleton className="h-5 w-32 bg-slate-800" />
        <Skeleton className="h-4 w-56 mt-1 bg-slate-800/60" />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                {["Employee", "Stage", "Deadline", "Status"].map((h) => (
                  <TableHead key={h} className="text-slate-400">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-slate-800">
                  {Array.from({ length: 4 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-3 w-28 bg-slate-800" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

interface AppraisalsDataProps {
  filter: AppraisalFilter;
  page: number;
}

async function AppraisalsData({ filter, page }: AppraisalsDataProps) {
  const domain = filterDomain(filter);
  const offset = (page - 1) * PAGE_SIZE;

  const [rawAppraisals, totalCount] = await Promise.all([
    getCachedAppraisals(PAGE_SIZE, offset, domain),
    getCachedAppraisalCount(domain),
  ]);

  const appraisals = rawAppraisals.map(mapAppraisal);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;
  const pageUrl = (p: number) => `/appraisals?filter=${filter}&page=${p}`;

  return (
    <Card className="bg-slate-900/60 border-slate-800">
      <CardHeader>
        <CardTitle className="text-slate-100">
          {FILTER_LABELS[filter]} Appraisals
        </CardTitle>
        <CardDescription className="text-slate-500">
          {totalCount.toLocaleString()} records from{" "}
          <code className="text-slate-400">hr.appraisal</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Employee</TableHead>
                <TableHead className="text-slate-400">Stage</TableHead>
                <TableHead className="text-slate-400">Deadline</TableHead>
                <TableHead className="text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appraisals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                    No appraisals found.
                  </TableCell>
                </TableRow>
              ) : (
                appraisals.map((a) => (
                  <TableRow key={a.id} className="border-slate-800 hover:bg-slate-900/60">
                    <TableCell>
                      <Link
                        href={`/appraisals/${a.employeeId}`}
                        className="text-sm font-medium text-slate-100 hover:text-blue-300"
                      >
                        {a.employeeName ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {a.stage ?? "—"}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {a.deadline
                        ? new Date(a.deadline).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge appraisal={a} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              {hasPrev ? (
                <Link
                  href={pageUrl(page - 1)}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-slate-700 text-slate-300 hover:text-slate-100")}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Link>
              ) : (
                <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-slate-700 opacity-30 cursor-not-allowed pointer-events-none")}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </span>
              )}
              {hasNext ? (
                <Link
                  href={pageUrl(page + 1)}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-slate-700 text-slate-300 hover:text-slate-100")}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              ) : (
                <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-slate-700 opacity-30 cursor-not-allowed pointer-events-none")}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface PageProps {
  searchParams: Promise<{ filter?: string; page?: string }>;
}

export default async function AppraisalsPage({ searchParams }: PageProps) {
  const { filter: filterParam, page: pageParam } = await searchParams;

  const validFilters: AppraisalFilter[] = ["all", "open", "done", "cancelled"];
  const filter: AppraisalFilter = validFilters.includes(filterParam as AppraisalFilter)
    ? (filterParam as AppraisalFilter)
    : "all";
  const page = Math.max(1, Number(pageParam ?? "1") || 1);

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <p className="text-[11px] font-semibold text-[#3D4E67] uppercase tracking-[0.14em] mb-1">
          hr.appraisal
        </p>
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#DDE8F5] leading-none">
          Appraisals
        </h1>
        <p className="text-[13px] text-[#4A5A7A] mt-1.5 font-medium">
          In-flight and completed appraisals from Odoo
        </p>
      </header>

      <div className="flex gap-2 flex-wrap">
        {validFilters.map((f) => (
          <Link
            key={f}
            href={`/appraisals?filter=${f}&page=1`}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              filter === f
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/30"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent"
            }`}
          >
            {FILTER_LABELS[f]}
          </Link>
        ))}
      </div>

      <Suspense fallback={<AppraisalTableSkeleton />}>
        <AppraisalsData filter={filter} page={page} />
      </Suspense>
    </div>
  );
}
