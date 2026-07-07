## 2024-06-10 - Stop Leaking Internal Supabase Errors to Client
**Vulnerability:** Internal Supabase database errors (`error.message`) were being sent directly to the client in HTTP 500 responses across multiple API routes (e.g., `src/server/routes/me.ts` and `src/server/routes/dashboard.ts`).
**Learning:** Returning raw database error messages exposes internal infrastructure details, schemas, and potential query structures, violating the "fail securely" principle.
**Prevention:** Always catch and log internal errors on the server, but return generic, sanitized error messages (e.g., `"internal_error"`) to the client when a 500 error occurs.

## 2024-07-07 - Prevent Timing Attacks in Token Validation
**Vulnerability:** Comparing sensitive strings like API tokens (`X-Admin-Token` and `adminApiToken`) using standard string equality (`===`) exposes the application to timing attacks. An attacker could measure the time taken to reject a request to infer the token character by character.
**Learning:** Node.js's standard string equality comparison returns as soon as a mismatch is found. When comparing sensitive values, we must use a constant-time comparison approach to prevent leaking information through response times. Additionally, when using `Buffer.from` to compare strings, lengths must be compared first to prevent `TypeErrors` caused by multi-byte characters resulting in buffers of different lengths.
**Prevention:** Always use Node's `crypto.timingSafeEqual` with `Buffer.from()` instead of standard string equality (`===`) when comparing sensitive strings (tokens, secrets, passwords). Crucially, verify that the resulting buffer lengths match (`buffer1.length === buffer2.length`) before calling `timingSafeEqual`.
