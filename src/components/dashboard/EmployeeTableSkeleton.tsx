interface EmployeeTableSkeletonProps {
  rows?: number;
}

function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse bg-white/[0.06] ${className ?? ""}`}
    />
  );
}

export function EmployeeTableSkeleton({ rows = 8 }: EmployeeTableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Stats row skeleton */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-5 space-y-3"
            style={{
              borderColor: "rgba(255,255,255,0.07)",
              background: "rgba(13,18,37,0.8)",
            }}
          >
            <Pulse className="h-3 w-24" />
            <Pulse className="h-9 w-16" />
            <Pulse className="h-2.5 w-36" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          borderColor: "rgba(255,255,255,0.07)",
          background: "rgba(13,18,37,0.8)",
        }}
      >
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <Pulse className="h-4 w-28" />
          <Pulse className="h-3 w-44" />
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {["Employee", "Job Title", "Department", "Manager", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left">
                  <Pulse className="h-2.5 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-white/[0.04]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Pulse className="h-7 w-7 rounded-full shrink-0" />
                    <div className="space-y-1.5">
                      <Pulse className="h-3 w-32" />
                      <Pulse className="h-2.5 w-44" />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3"><Pulse className="h-3 w-24" /></td>
                <td className="px-5 py-3"><Pulse className="h-5 w-20 rounded-md" /></td>
                <td className="px-5 py-3"><Pulse className="h-3 w-28" /></td>
                <td className="px-5 py-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
