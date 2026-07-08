## 2024-06-10 - Stop Leaking Internal Supabase Errors to Client
**Vulnerability:** Internal Supabase database errors (`error.message`) were being sent directly to the client in HTTP 500 responses across multiple API routes (e.g., `src/server/routes/me.ts` and `src/server/routes/dashboard.ts`).
**Learning:** Returning raw database error messages exposes internal infrastructure details, schemas, and potential query structures, violating the "fail securely" principle.
**Prevention:** Always catch and log internal errors on the server, but return generic, sanitized error messages (e.g., `"internal_error"`) to the client when a 500 error occurs.

## 2025-02-28 - Prevent Timing Attacks in Admin Token Validation
**Vulnerability:** The `X-Admin-Token` was being compared to `adminApiToken` using standard string equality (`===`) in `src/server/app.ts`. This allowed potential timing attacks where an attacker could deduce the token byte by byte based on response times.
**Learning:** Node's built-in string comparison short-circuits upon encountering the first differing character, leaking the length of the matched prefix.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from()` when comparing sensitive tokens. Critically, ensure the buffer lengths match (`buffer1.length === buffer2.length`) before calling `timingSafeEqual` to avoid TypeErrors.
