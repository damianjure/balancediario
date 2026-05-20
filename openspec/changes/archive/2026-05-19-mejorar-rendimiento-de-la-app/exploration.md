## Exploration: Mejorar rendimiento de la app

### Current State
El proyecto actualmente tiene dos cuellos de botella de rendimiento documentados en `AGENTS.md` (deuda técnica):
1. `listDashboardMembers` realiza dos consultas secuenciales a la base de datos (una a `dashboard_members` y luego un `IN` a `app_users`) en lugar de usar un JOIN nativo de Supabase.
2. `syncPendingDashboardInvitations` se evalúa en el middleware global `requireSession`, interceptando cada request autenticado. Aunque está mitigado parcialmente con un caché en memoria del proceso (`syncedUserKeys` Set), añade sobrecarga innecesaria a cada petición y ensucia la naturaleza stateless de las instancias de Cloud Run.

### Affected Areas
- `src/server/app.ts` — Lógica de `listDashboardMembers`, middleware `requireSession` y el endpoint `GET /api/me`.

### Approaches

1. **Optimización de listDashboardMembers con JOIN (Recomendado)**
   - Utilizar las capacidades de relación por foreign key de Supabase/PostgREST para traer `app_users ( email )` en la misma consulta de `dashboard_members`.
   - Pros: Elimina un roundtrip completo a la base de datos. Reduce la latencia del endpoint `/api/dashboard/members`. Simplifica el código.
   - Cons: Requiere ajustar el mapeo del resultado retornado por Supabase.
   - Effort: Low

2. **Reubicación de syncPendingDashboardInvitations a /api/me (Recomendado)**
   - Sacar la llamada a `syncPendingDashboardInvitations` del middleware `requireSession` y moverla al handler de `GET /api/me`. Eliminar el caché en memoria (`syncedUserKeys`).
   - Pros: Devuelve la naturaleza stateless al backend. Acelera todos los requests de la API al no tener que evaluar hooks de sincronización en cada llamada (ej. `/api/movimientos`).
   - Cons: Ninguno significativo.
   - Effort: Low

### Recommendation
Implementar ambas aproximaciones (Approach 1 y 2). Cambiar `listDashboardMembers` para que use el join nativo y reubicar la sincronización de invitaciones en `/api/me`, limpiando el Set en memoria.

### Risks
- Al mover la sincronización a `/api/me`, si el usuario mantiene la SPA abierta sin recargar durante días, las invitaciones recibidas en ese lapso no se auto-aceptarán hasta el próximo refresh. Esto es un trade-off aceptable, ya que el usuario típico refresca o vuelve a abrir la app, y si hace falta se podría añadir un botón manual o push a futuro.

### Ready for Proposal
Yes — The orchestrator should proceed to propose these two targeted backend performance optimizations.