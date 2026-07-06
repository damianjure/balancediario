## 2024-06-10 - Stop Leaking Internal Supabase Errors to Client
**Vulnerability:** Internal Supabase database errors (`error.message`) were being sent directly to the client in HTTP 500 responses across multiple API routes (e.g., `src/server/routes/me.ts` and `src/server/routes/dashboard.ts`).
**Learning:** Returning raw database error messages exposes internal infrastructure details, schemas, and potential query structures, violating the "fail securely" principle.
**Prevention:** Always catch and log internal errors on the server, but return generic, sanitized error messages (e.g., `"internal_error"`) to the client when a 500 error occurs.

## 2025-02-21 - Prevent Timing Attacks in Admin Token Validation
**Vulnerability:** The admin API token was validated using a standard string equality check (`===`), exposing the application to timing attacks where an attacker could iteratively guess the token length and content.
**Learning:** Node's `crypto.timingSafeEqual` must be used for sensitive string comparisons. However, it requires inputs to be `Buffer` objects of the exact same length. Comparing lengths directly before calling `timingSafeEqual` is crucial to prevent `TypeError`s.
**Prevention:** Always use `crypto.timingSafeEqual` with `Buffer.from()` and explicit length checks when verifying API tokens, secrets, or passwords.
