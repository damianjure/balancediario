# Tasks: Mejorar rendimiento de la app

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~60 lines |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | auto-chain |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | All refactoring | PR 1 | main branch; all changes in `src/server/app.ts` |

## Phase 1: listDashboardMembers Refactoring

- [x] 1.1 In `src/server/app.ts`, refactor `listDashboardMembers` to use a single Supabase query with JOIN: `.select('*, app_users(email)')`.
- [x] 1.2 In `src/server/app.ts`, remove the secondary batched query for `app_users` and update the mapping logic to extract the email from the joined `app_users` object, ensuring the return type remains `DashboardMemberSummary`.

## Phase 2: Stateless Middleware & Side Effect Relocation

- [x] 2.1 In `src/server/app.ts`, remove the `syncedUserKeys` and `seededUserKeys` Sets from the `createApp` closure.
- [x] 2.2 In `src/server/app.ts`, locate the `requireSession` middleware and remove the code responsible for `syncPendingDashboardInvitations` and demo data seeding (`onboarding_state === "pending"`).
- [x] 2.3 In `src/server/app.ts`, relocate the `syncPendingDashboardInvitations` and demo data seeding logic to the `GET /api/me` endpoint handler, ensuring they execute before returning the user profile.

## Phase 3: Testing & Verification

- [x] 3.1 Run unit and integration tests (`npm run test`) to confirm `/api/me` functions successfully.
- [x] 3.2 Verify that protected routes utilizing `requireSession` and endpoints calling `listDashboardMembers` (`GET /api/dashboard/members`) do not experience regressions.
