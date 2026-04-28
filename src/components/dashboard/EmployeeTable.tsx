import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Employee } from "@/types/employee";

interface EmployeeTableProps {
  employees: Employee[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  basePath?: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function avatarGradient(name: string): string {
  const palettes = [
    "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)",
    "linear-gradient(135deg, #5B21B6 0%, #818CF8 100%)",
    "linear-gradient(135deg, #0F766E 0%, #2DD4BF 100%)",
    "linear-gradient(135deg, #9D174D 0%, #F472B6 100%)",
    "linear-gradient(135deg, #92400E 0%, #FBBF24 100%)",
    "linear-gradient(135deg, #1E3A5F 0%, #60A5FA 100%)",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palettes[Math.abs(hash) % palettes.length];
}

function PaginationLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.06] text-[12px] font-medium text-[#3D4E67] opacity-40 cursor-not-allowed select-none">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-[12px] font-medium text-[#8899B0] hover:text-[#DDE8F5] hover:border-cyan-500/30 hover:bg-cyan-500/[0.06] transition-all duration-150"
    >
      {children}
    </Link>
  );
}

export function EmployeeTable({
  employees,
  totalCount,
  currentPage = 1,
  pageSize = 25,
  basePath = "/",
}: EmployeeTableProps) {
  const hasPagination = totalCount !== undefined && totalCount > pageSize;
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : undefined;
  const hasPrev = currentPage > 1;
  const hasNext = totalPages !== undefined && currentPage < totalPages;
  const pageUrl = (page: number) => `${basePath}?page=${page}`;

  return (
    <div
      className="animate-fade-up-2 rounded-xl border overflow-hidden"
      style={{
        borderColor: "rgba(255,255,255,0.07)",
        background: "linear-gradient(145deg, rgba(13,18,37,0.8) 0%, rgba(9,12,28,0.9) 100%)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(6,182,212,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-[14px] font-bold text-[#DDE8F5] tracking-tight">
            Employees
          </h2>
          <p className="text-[12px] text-[#3D4E67] mt-0.5">
            {totalCount !== undefined ? totalCount.toLocaleString() : employees.length}{" "}
            active · click a row to view appraisal
          </p>
        </div>
        {totalCount !== undefined && totalPages && totalPages > 1 && (
          <span className="text-[11px] font-medium text-[#3D4E67]">
            Page {currentPage} / {totalPages}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {["Employee", "Job Title", "Department", "Manager", ""].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[11px] font-semibold text-[#3D4E67] uppercase tracking-[0.1em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#3D4E67] text-sm">
                  No employees returned from Odoo. Check ODOO_DB &amp; permissions.
                </td>
              </tr>
            ) : (
              employees.map((e, idx) => (
                <tr
                  key={e.id}
                  className={cn(
                    "group border-b border-white/[0.04] hover:bg-cyan-500/[0.04] transition-colors duration-100",
                    idx % 2 === 0 ? "" : "bg-white/[0.012]",
                  )}
                >
                  {/* Employee */}
                  <td className="px-5 py-3">
                    <Link href={`/appraisals/${e.id}`} className="flex items-center gap-3">
                      <Avatar className="h-7 w-7 shrink-0 ring-1 ring-white/[0.06]">
                        {e.avatarBase64 ? (
                          <AvatarImage
                            src={`data:image/png;base64,${e.avatarBase64}`}
                            alt={e.name}
                          />
                        ) : null}
                        <AvatarFallback
                          className="text-[10px] font-bold text-white"
                          style={{ background: avatarGradient(e.name) }}
                        >
                          {initials(e.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col leading-none gap-[3px]">
                        <span className="font-semibold text-[#C5D1E4] group-hover:text-cyan-300 transition-colors">
                          {e.name}
                        </span>
                        <span className="text-[11px] text-[#3D4E67] font-mono">
                          {e.email ?? "—"}
                        </span>
                      </div>
                    </Link>
                  </td>

                  {/* Job Title */}
                  <td className="px-5 py-3 text-[#6B7FA3]">
                    {e.jobTitle ?? <span className="text-[#2D3C52]">—</span>}
                  </td>

                  {/* Department */}
                  <td className="px-5 py-3">
                    {e.department ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/[0.05] text-[#8899B0] border border-white/[0.06]">
                        {e.department}
                      </span>
                    ) : (
                      <span className="text-[#2D3C52]">—</span>
                    )}
                  </td>

                  {/* Manager */}
                  <td className="px-5 py-3 text-[#6B7FA3]">
                    {e.managerName ?? <span className="text-[#2D3C52]">—</span>}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/appraisals/${e.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#3D4E67] group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      View
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {hasPagination && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
          <span className="text-[12px] text-[#3D4E67]">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalCount!)} of{" "}
            {totalCount!.toLocaleString()}
          </span>
          <div className="flex items-center gap-2">
            <PaginationLink href={pageUrl(currentPage - 1)} disabled={!hasPrev}>
              <ChevronLeft className="w-3 h-3" />
              Prev
            </PaginationLink>
            <PaginationLink href={pageUrl(currentPage + 1)} disabled={!hasNext}>
              Next
              <ChevronRight className="w-3 h-3" />
            </PaginationLink>
          </div>
        </div>
      )}
    </div>
  );
}
