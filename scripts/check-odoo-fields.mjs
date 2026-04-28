import xmlrpc from "xmlrpc";

const ODOO_URL = "https://portal.techrover.us/odoo";
const DB = "Techrover";
const USERNAME = "khushal.c@techroversolutions.com";
const API_KEY = "8d790d3abe9214bdaebce77fa0d0520c09cc63fb";

const common = xmlrpc.createSecureClient({ url: `${ODOO_URL}/xmlrpc/2/common` });
const object = xmlrpc.createSecureClient({ url: `${ODOO_URL}/xmlrpc/2/object` });

const call = (client, method, params) =>
  new Promise((resolve, reject) =>
    client.methodCall(method, params, (err, val) => (err ? reject(err) : resolve(val)))
  );

const uid = await call(common, "authenticate", [DB, USERNAME, API_KEY, {}]);
console.log("UID:", uid);

// Get all fields on hr.appraisal
const fields = await call(object, "execute_kw", [
  DB, uid, API_KEY,
  "hr.appraisal", "fields_get", [],
  { attributes: ["string", "type", "selection"] },
]);

console.log("\n=== hr.appraisal fields ===");
for (const [name, info] of Object.entries(fields)) {
  const sel = info.selection ? ` [${info.selection.map(s => s[0]).join(", ")}]` : "";
  console.log(`  ${name} (${info.type})${sel} — ${info.string}`);
}

// Fetch 2 sample records to see actual data shape
const samples = await call(object, "execute_kw", [
  DB, uid, API_KEY,
  "hr.appraisal", "search_read", [[]],
  { limit: 2, fields: [] },
]);
console.log("\n=== 2 sample records ===");
console.log(JSON.stringify(samples, null, 2));
