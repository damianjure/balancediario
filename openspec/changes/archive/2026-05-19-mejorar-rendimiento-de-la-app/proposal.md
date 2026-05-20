# Proposal: Mejorar rendimiento de la app

## Intent

Optimizar el rendimiento del backend eliminando cuellos de botella en la consulta de miembros del dashboard y reduciendo la sobrecarga del middleware de sesión global, devolviendo la naturaleza stateless a las instancias de Cloud Run.

## Scope

### In Scope
- Refactorizar `listDashboardMembers` (`src/server/app.ts`) para utilizar un JOIN nativo de Supabase (`app_users(email)`), eliminando la doble consulta secuencial.
- Reubicar `syncPendingDashboardInvitations` desde el middleware global `requireSession` hacia el handler de `GET /api/me`.
- Eliminar el caché en memoria (`syncedUserKeys` Set) que se usaba para mitigar el impacto en el middleware.

### Out of Scope
- Optimización de otros endpoints de la API.
- Mecanismos realtime para auto-aceptar invitaciones en background sin recargar la página.

## Capabilities

### New Capabilities
None

### Modified Capabilities
None

## Approach

1. Modificar la query de `listDashboardMembers` en `src/server/app.ts` para hacer el JOIN y mapear la respuesta al contrato existente de la API.
2. Eliminar la invocación a `syncPendingDashboardInvitations(req.user.id)` dentro del middleware `requireSession`.
3. Mover esta invocación al inicio del handler de `GET /api/me`.
4. Remover la declaración y el uso del Set global `syncedUserKeys`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/server/app.ts` | Modified | Refactor de `listDashboardMembers`, `requireSession` y `GET /api/me` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Cambios en la forma de respuesta de `listDashboardMembers` | Medium | Asegurar el mapeo correcto del join para que coincida con la UI y tests existentes. |
| Retraso en sincronización de invitaciones | Low | Trade-off aceptable (las invitaciones se sincronizan al recargar la app y llamar a `/api/me`). |
| Tamaño del PR excede 400 líneas | Low | El PR size se estima en menos de 100 líneas (modificaciones muy localizadas en `src/server/app.ts`). |

## Rollback Plan

Revertir los cambios en `src/server/app.ts`, restaurando el `Set` en memoria para el caché del middleware y restaurando la consulta en dos pasos para `listDashboardMembers`.

## Dependencies

- Ninguna dependencia externa adicional.

## Success Criteria

- [ ] `listDashboardMembers` resuelve los usuarios en una única consulta a la base de datos.
- [ ] `requireSession` ya no incluye lógica de sincronización ni dependencias de estado en memoria.
- [ ] Los tests unitarios y de integración de API (incluyendo dashboard compartido y sesión) continúan pasando exitosamente.