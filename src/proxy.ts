export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: [
    // Skip: static assets, Next.js internals, health check, auth API
    "/((?!_next/static|_next/image|favicon\\.ico|api/health|api/auth).*)",
  ],
};
