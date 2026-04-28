import { authenticate } from "@/lib/odoo";

export const dynamic = "force-dynamic";

export async function GET() {
  const ts = new Date().toISOString();

  try {
    await authenticate();
    return Response.json({ status: "ok", odoo: true, ts });
  } catch {
    return Response.json(
      { status: "degraded", odoo: false, ts },
      { status: 503 },
    );
  }
}
