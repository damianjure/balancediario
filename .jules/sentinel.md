## 2024-06-10 - Stop Leaking Internal Supabase Errors to Client
**Vulnerability:** Internal Supabase database errors (`error.message`) were being sent directly to the client in HTTP 500 responses across multiple API routes (e.g., `src/server/routes/me.ts` and `src/server/routes/dashboard.ts`).
**Learning:** Returning raw database error messages exposes internal infrastructure details, schemas, and potential query structures, violating the "fail securely" principle.
**Prevention:** Always catch and log internal errors on the server, but return generic, sanitized error messages (e.g., `"internal_error"`) to the client when a 500 error occurs.

## 2024-06-11 - Prevent Timing Attacks in Admin Token Comparison
**Vulnerability:** The `hasValidAdminToken` function in `src/server/app.ts` compared the `X-Admin-Token` directly against the expected token using simple string equality (`===`). This approach is vulnerable to timing attacks, where an attacker measures the response time to guess the token character by character.
**Learning:** Comparing secret strings such as API tokens character by character using typical string equality exposes the time taken to find a mismatch, thus leaking information about the token.
**Prevention:** Always use Node.js `crypto.timingSafeEqual` with `Buffer.from()` when comparing sensitive strings. Verify buffer lengths match (`buffer1.length === buffer2.length`) before calling the function to prevent TypeErrors.
