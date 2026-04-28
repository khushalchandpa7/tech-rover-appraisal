import { Users, Building2, FileClock } from "lucide-react";

interface StatsCardsProps {
  totalEmployees: number;
  totalDepartments: number;
  pendingAppraisals: number;
}

interface StatConfig {
  label: string;
  value: number;
  hint: string;
  icon: typeof Users;
  accentColor: string;
  glowClass: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  delay: string;
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accentColor,
  glowClass,
  iconBg,
  iconColor,
  borderColor,
  delay,
}: StatConfig) {
  return (
    <div
      className={`animate-fade-up relative rounded-xl border overflow-hidden ${glowClass}`}
      style={{
        animationDelay: delay,
        background: "linear-gradient(145deg, rgba(13,18,37,0.95) 0%, rgba(9,12,28,0.95) 100%)",
        borderColor,
      }}
    >
      {/* Accent gradient corner */}
      <div
        className="absolute top-0 left-0 w-32 h-32 opacity-10 rounded-br-[80px] pointer-events-none"
        style={{ background: `radial-gradient(circle at top left, ${accentColor}, transparent 70%)` }}
      />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-[11px] font-semibold text-[#5B6D8A] uppercase tracking-[0.12em]">
            {label}
          </p>
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: iconBg }}
          >
            <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          </div>
        </div>

        <p
          className="text-4xl font-extrabold tracking-tight leading-none"
          style={{ color: "#DDE8F5" }}
        >
          {value.toLocaleString()}
        </p>

        <p className="mt-2 text-[11px] text-[#3D4E67] font-medium">{hint}</p>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-40"
        style={{ background: `linear-gradient(90deg, ${accentColor} 0%, transparent 60%)` }}
      />
    </div>
  );
}

export function StatsCards({
  totalEmployees,
  totalDepartments,
  pendingAppraisals,
}: StatsCardsProps) {
  const stats: StatConfig[] = [
    {
      label: "Active Employees",
      value: totalEmployees,
      hint: "hr.employee · active = true",
      icon: Users,
      accentColor: "#06B6D4",
      glowClass: "card-glow-blue",
      iconBg: "rgba(6, 182, 212, 0.12)",
      iconColor: "text-cyan-400",
      borderColor: "rgba(6, 182, 212, 0.14)",
      delay: "0ms",
    },
    {
      label: "Departments",
      value: totalDepartments,
      hint: "hr.department · total records",
      icon: Building2,
      accentColor: "#818CF8",
      glowClass: "card-glow-indigo",
      iconBg: "rgba(99, 102, 241, 0.12)",
      iconColor: "text-indigo-400",
      borderColor: "rgba(99, 102, 241, 0.14)",
      delay: "70ms",
    },
    {
      label: "Open Appraisals",
      value: pendingAppraisals,
      hint: "hr.appraisal · not done / not cancelled",
      icon: FileClock,
      accentColor: "#F59E0B",
      glowClass: "card-glow-amber",
      iconBg: "rgba(245, 158, 11, 0.12)",
      iconColor: "text-amber-400",
      borderColor: "rgba(245, 158, 11, 0.14)",
      delay: "140ms",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
