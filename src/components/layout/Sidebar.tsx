"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const NAV: NavItem[] = [
  { label: "Dashboard",  href: "/",          icon: LayoutDashboard },
  { label: "Appraisals", href: "/appraisals", icon: ClipboardList   },
  { label: "Employees",  href: "/employees",  icon: Users           },
  { label: "Settings",   href: "/settings",   icon: Settings        },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col bg-[#060813] border-r border-white/[0.06]">

      {/* Brand */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-white/[0.06]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icon.png"
          alt="TechRover"
          width={28}
          height={28}
          style={{ width: 28, height: 28 }}
          className="rounded-lg shrink-0"
        />
        <div className="flex flex-col leading-none gap-[3px]">
          <span className="text-[#DDE8F5] font-bold text-[13px] tracking-tight">
            TechRover
          </span>
          <span className="text-[#3D4E67] text-[9px] uppercase tracking-[0.14em] font-semibold">
            Appraisals
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-4 flex flex-col gap-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
                active
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-[#5B6D8A] hover:text-[#C5D1E4] hover:bg-white/[0.04]",
              )}
            >
              <Icon
                className={cn(
                  "w-[15px] h-[15px] shrink-0 transition-colors",
                  active ? "text-cyan-400" : "text-[#3D4E67] group-hover:text-[#8899B0]",
                )}
              />
              <span className="flex-1">{label}</span>
              {active && (
                <span className="w-1 h-3.5 rounded-full bg-cyan-500/70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer — live indicator */}
      <div className="px-4 py-3.5 border-t border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="relative w-1.5 h-1.5 shrink-0">
            <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="animate-live-pulse absolute inset-0 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[11px] text-[#3D4E67] font-medium">
            Odoo · live · 5 min cache
          </span>
        </div>
      </div>
    </aside>
  );
}
