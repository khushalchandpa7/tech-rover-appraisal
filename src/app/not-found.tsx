import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden"
      style={{ background: "#07091A" }}
    >
      <div className="absolute inset-0 bg-grid-subtle opacity-40" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(37,99,235,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="animate-fade-up relative flex flex-col items-center gap-6 text-center">
        <p
          className="text-[120px] font-extrabold leading-none tracking-tighter select-none"
          style={{
            background: "linear-gradient(180deg, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.06) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </p>

        <div className="space-y-2 -mt-4">
          <h2 className="text-[18px] font-bold text-[#C5D1E4] tracking-tight">
            Page not found
          </h2>
          <p className="text-[13px] text-[#3D4E67] max-w-xs leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold border border-white/[0.08] text-[#8899B0] hover:text-[#DDE8F5] hover:border-blue-500/30 hover:bg-blue-500/[0.06] transition-all duration-150"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
