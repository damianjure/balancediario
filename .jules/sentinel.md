## 2024-06-10 - Stop Leaking Internal Supabase Errors to Client
**Vulnerability:** Internal Supabase database errors (`error.message`) were being sent directly to the client in HTTP 500 responses across multiple API routes (e.g., `src/server/routes/me.ts` and `src/server/routes/dashboard.ts`).
**Learning:** Returning raw database error messages exposes internal infrastructure details, schemas, and potential query structures, violating the "fail securely" principle.
**Prevention:** Always catch and log internal errors on the server, but return generic, sanitized error messages (e.g., `"internal_error"`) to the client when a 500 error occurs.

## 2024-07-05 - Fix Timing Attack Vulnerability in Token Comparison
**Vulnerability:** The API admin token (`X-Admin-Token` header) was being compared to the stored `adminApiToken` using a simple strict equality operator (`===`). This allows an attacker to deduce the correct token via a timing attack, as standard string comparison checks characters sequentially and returns faster on a mismatch early in the string.
**Learning:** String comparison operators like `===` are not constant-time. They can inadvertently leak information about secret values based on how long the comparison takes.
**Prevention:** To prevent timing attacks when comparing sensitive strings like API tokens or secrets, always use Node's `crypto.timingSafeEqual` with `Buffer.from()` instead of standard string equality (`===`). Crucially, verify that the resulting buffer lengths match (`buffer1.length === buffer2.length`) before comparison.
