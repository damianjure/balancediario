## 2024-06-10 - Stop Leaking Internal Supabase Errors to Client
**Vulnerability:** Internal Supabase database errors (`error.message`) were being sent directly to the client in HTTP 500 responses across multiple API routes (e.g., `src/server/routes/me.ts` and `src/server/routes/dashboard.ts`).
**Learning:** Returning raw database error messages exposes internal infrastructure details, schemas, and potential query structures, violating the "fail securely" principle.
**Prevention:** Always catch and log internal errors on the server, but return generic, sanitized error messages (e.g., `"internal_error"`) to the client when a 500 error occurs.

## 2024-06-25 - Prevent Timing Attacks on Token/Secret Comparison
**Vulnerability:** The admin API token was being validated using standard string equality (`===`) in `hasValidAdminToken`. This comparison fails early on the first mismatched character, allowing an attacker to incrementally guess the secret token by measuring the response time (a timing attack).
**Learning:** Comparing sensitive secrets like API tokens, hashes, or passwords with `===` exposes the application to timing attacks, especially if the operation is otherwise very fast and observable over the network.
**Prevention:** Always use Node's `crypto.timingSafeEqual` with `Buffer.from()` instead of standard string equality when comparing sensitive strings. Crucially, verify that the resulting buffer lengths match (`buffer1.length === buffer2.length`) before calling `timingSafeEqual`, to prevent `TypeError`s caused by multi-byte characters having different byte lengths.
