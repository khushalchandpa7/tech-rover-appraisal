"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div
        className="animate-fade-up w-full max-w-md rounded-xl border p-6"
        style={{
          borderColor: "rgba(239,68,68,0.2)",
          background:
            "linear-gradient(145deg, rgba(20,10,10,0.95) 0%, rgba(13,18,37,0.95) 100%)",
          boxShadow: "0 0 0 1px rgba(239,68,68,0.08), 0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/10">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
          </div>
          <h2 className="text-[14px] font-bold text-[#DDE8F5]">
            Something went wrong
          </h2>
        </div>

        <p className="text-[13px] text-[#4A5A7A] mb-4 leading-relaxed">
          An unexpected error occurred. The issue has been reported automatically.
        </p>

        {error.digest && (
          <p className="text-[11px] text-[#2D3C52] font-mono mb-4">
            ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/[0.08] text-[13px] font-semibold text-[#8899B0] hover:text-[#DDE8F5] hover:border-blue-500/30 hover:bg-blue-500/[0.06] transition-all duration-150"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Try again
        </button>
      </div>
    </div>
  );
}
