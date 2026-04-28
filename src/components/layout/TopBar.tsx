"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function initials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function TopBar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header
      className="h-14 shrink-0 border-b border-white/[0.06] flex items-center px-5 lg:px-8 justify-between"
      style={{ background: "rgba(6, 8, 19, 0.75)", backdropFilter: "blur(12px)" }}
    >
      {/* Left: status pill */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/[0.07]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-[11px] font-semibold text-cyan-400 tracking-wide uppercase">
            Odoo · live
          </span>
        </div>
      </div>

      {/* Right: user */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="hidden sm:flex flex-col text-right leading-none gap-[3px]">
              <span className="text-[13px] font-semibold text-[#C5D1E4]">
                {user.name ?? user.email}
              </span>
              <span className="text-[11px] text-[#3D4E67]">{user.email}</span>
            </div>

            <Avatar className="h-7 w-7 ring-1 ring-white/10">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name ?? "User"} />
              )}
              <AvatarFallback
                className="text-[10px] font-bold text-cyan-300"
                style={{ background: "linear-gradient(135deg, #0c3044 0%, #0891B2 100%)" }}
              >
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>

            <button
              onClick={() => signOut({ redirectTo: "/login" })}
              title="Sign out"
              className="p-1.5 rounded-md text-[#3D4E67] hover:text-[#8899B0] hover:bg-white/[0.05] transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
