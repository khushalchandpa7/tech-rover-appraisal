import "server-only";
import { z } from "zod";

// Validated, server-only environment access. Importing this module from a
// client component will throw at build time thanks to "server-only".
const schema = z.object({
  ODOO_URL: z.url(),
  ODOO_DB: z.string().min(1),
  ODOO_USERNAME: z.string().min(1),
  ODOO_API_KEY: z.string().min(1),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  // Fail-fast on boot with a readable message rather than an opaque crash later.
  throw new Error(
    `Invalid Odoo environment variables:\n${z.prettifyError(parsed.error)}`,
  );
}

export const env = parsed.data;
