import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — TechRover Appraisals",
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor: "rgba(255,255,255,0.07)",
        background:
          "linear-gradient(145deg, rgba(13,18,37,0.85) 0%, rgba(9,12,28,0.95) 100%)",
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.04)",
      }}
    >
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h2 className="text-[14px] font-bold text-[#DDE8F5] tracking-tight">
          {title}
        </h2>
        <p className="text-[12px] text-[#3D4E67] mt-0.5">{description}</p>
      </div>
      <div className="divide-y divide-white/[0.05]">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <span className="text-[12px] font-medium text-[#5B6D8A]">{label}</span>
      <span className="text-[12px] font-semibold text-[#8899B0] font-mono">
        {value}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-7">
      <header className="animate-fade-up">
        <p className="text-[11px] font-semibold text-[#3D4E67] uppercase tracking-[0.14em] mb-1">
          Configuration
        </p>
        <h1 className="text-[26px] font-extrabold tracking-tight text-[#DDE8F5] leading-none">
          Settings
        </h1>
        <p className="text-[13px] text-[#4A5A7A] mt-1.5 font-medium">
          Application configuration and integration status
        </p>
      </header>

      <div className="space-y-4 animate-fade-up-1">
        <Section
          title="Odoo Connection"
          description="ERP integration credentials and cache policy"
        >
          <Row label="URL" value={process.env.ODOO_URL ?? "—"} />
          <Row label="Database" value={process.env.ODOO_DB ?? "—"} />
          <Row
            label="Service account"
            value={process.env.ODOO_USERNAME ?? "—"}
          />
          <Row
            label="Cache TTL"
            value={<span className="text-[#5B6D8A] font-sans">5 minutes</span>}
          />
        </Section>

        <Section
          title="Authentication"
          description="OAuth provider and domain restriction"
        >
          <Row label="Provider" value="Google OAuth 2.0" />
          <Row
            label="Allowed domain"
            value={`@${process.env.AUTH_DOMAIN ?? "techrover.com"}`}
          />
        </Section>
      </div>
    </div>
  );
}
