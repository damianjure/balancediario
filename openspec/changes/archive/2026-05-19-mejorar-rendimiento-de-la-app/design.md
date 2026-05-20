# Design: Mejorar rendimiento de la app

## Technical Approach

The design focuses on converting `requireSession` back to a purely stateless authentication middleware by extracting side effects (invitation synchronization and demo data seeding). These side effects will be relocated to the `GET /api/me` endpoint, which is called during client initialization and page reloads. The stateful Sets (`syncedUserKeys`, `seededUserKeys`) will be removed entirely.
Additionally, the `listDashboardMembers` function will be refactored to perform a single query using Supabase's native foreign key JOINs, eliminating the need to manually fetch and stitch `app_users` records.

## Architecture Decisions

### Decision: Relocating synchronization side effects to `/api/me`

**Choice**: Move `syncPendingDashboardInvitations` and demo data seeding (for `onboarding_state === "pending"`) from `requireSession` to `GET /api/me`.
**Alternatives considered**: Keeping the logic in the middleware but checking the DB on every request to avoid in-memory state.
**Rationale**: Checking the DB on every request in the middleware would introduce unacceptable latency to all protected API calls. Moving the logic to `/api/me` ensures it runs only when the client establishes its session (initial load/refresh) while allowing subsequent API requests to remain fast and stateless.

### Decision: Removing in-memory caching Sets

**Choice**: Delete `syncedUserKeys` and `seededUserKeys` from the `createApp` closure.
**Alternatives considered**: Replacing them with Redis or an external cache.
**Rationale**: An external cache adds infrastructure complexity. By moving the logic to `/api/me`, we can rely on the existing `app_users` query in `/api/me` to determine if onboarding is pending, and invitation syncing can be safely run idempotently on app load, eliminating the need for process-level caching.

### Decision: Refactoring `listDashboardMembers` with Supabase JOINs

**Choice**: Modify the `.select()` statement in `listDashboardMembers` to include `app_users(email)` and remove the subsequent batched query.
**Alternatives considered**: Creating a database view combining `dashboard_members` and `app_users`.
**Rationale**: A native Supabase foreign-key query is sufficient and keeps the schema simple without requiring new SQL migrations for views.

## Data Flow

```text
Client App                   API (`GET /api/me`)           Supabase DB
    │                               │                           │
    ├─ 1. Fetch Session Profile ───→│                           │
    │                               ├─ 2. Sync Invitations ────→│
    │                               │                           │
    │                               ├─ 3. Check Onboarding ────→│
    │                               │   (Seed if 'pending')     │
    │                               │                           │
    │                               ├─ 4. Get User Profile ────→│
    │                               │                           │
    │← 5. Return JSON Profile ──────┤                           │
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/server/app.ts` | Modify | Remove `syncedUserKeys` and `seededUserKeys`. Extract side-effects from `requireSession`. Refactor `listDashboardMembers` to use a single joined query. Add sync and seeding logic to `GET /api/me`. |

## Interfaces / Contracts

No changes to external HTTP contracts. The `listDashboardMembers` mapping will adapt the Supabase joined output structure back to the existing `DashboardMemberSummary` return type:

```typescript
return members.map((member: any) => ({
  id: member.id,
  user_id: member.user_id,
  email: member.app_users?.email ?? null,
  role: member.role,
  status: member.status,
  created_at: member.created_at,
  permissions: member.permissions ?? {},
}));
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `listDashboardMembers` mapping | Verify that the Supabase JOIN response is correctly mapped to `DashboardMemberSummary`. |
| Integration | Stateless Middleware | Ensure `requireSession` no longer maintains state across requests and successfully authorizes requests. |
| Integration | `/api/me` | Verify that calling `/api/me` executes the invitation sync and onboarding seed logic appropriately. |

## Migration / Rollout

No database migration is required. The deployment is zero-downtime, and existing sessions will naturally begin executing the sync logic upon the next page reload when `/api/me` is called.

## Open Questions

- [ ] None. The change is straightforward and aligned with existing Supabase patterns.
