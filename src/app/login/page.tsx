import { signIn } from "@/auth";

export const metadata = {
  title: "Sign In — TechRover Appraisals",
};

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden"
      style={{ background: "#07091A" }}
    >
      {/* Ambient grid */}
      <div className="absolute inset-0 bg-grid-subtle opacity-60" />

      {/* Blue orb glow — top center */}
      <div
        className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Bottom-right accent */}
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at bottom right, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="animate-fade-up relative w-full max-w-[360px] rounded-2xl p-8"
        style={{
          background: "linear-gradient(145deg, rgba(13,18,42,0.95) 0%, rgba(9,12,30,0.98) 100%)",
          border: "1px solid rgba(6, 182, 212, 0.15)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.6), 0 0 60px rgba(6,182,212,0.08)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-5 mb-8">
          <div className="relative">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(6,20,28,0.8)",
                boxShadow: "0 8px 24px rgba(6, 182, 212, 0.25)",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icon.png"
                alt="TechRover"
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl"
              />
            </div>
            {/* glow ring */}
            <div
              className="absolute inset-0 rounded-2xl opacity-20 blur-md -z-10"
              style={{ background: "linear-gradient(135deg, #0E7490, #06B6D4)" }}
            />
          </div>

          <div className="text-center">
            <h1 className="text-[22px] font-extrabold tracking-tight text-[#DDE8F5] leading-tight">
              TechRover Appraisals
            </h1>
            <p className="mt-1.5 text-[13px] text-[#4A5A7A] font-medium">
              Sign in to access the workspace
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-[11px] text-[#2D3C52] font-medium uppercase tracking-wider">
            Continue with
          </span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Sign-in action */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-[#1A1A2E] bg-white hover:bg-blue-50 transition-all duration-150"
            style={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-5 text-center text-[11px] text-[#2D3C52] leading-relaxed">
          Access restricted to authorized{" "}
          <span className="text-[#3D4E67]">TechRover</span> accounts
        </p>
      </div>

      {/* Wordmark bottom */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <span className="text-[11px] text-[#1E2840] font-medium tracking-widest uppercase">
          TechRover Solutions
        </span>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
