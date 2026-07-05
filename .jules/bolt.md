## 2024-06-10 - Memoizing Dashboard Aggregations
**Learning:** In React components dealing with large datasets (like `DashboardApp` and its `history` array), complex aggregations, filtering, and mapping operations run synchronously on the main thread during every render. If not memoized, this causes significant UI blocking.
**Action:** Always identify expensive array transformations inside component bodies and wrap them in `useMemo` with precise dependency arrays. Document the impact of the optimization with a code comment.

## 2024-06-11 - Single loop array mapping
**Learning:** Using chained `.filter().forEach()` inside dashboard aggregations creates unnecessary intermediate array allocations, taking up more memory and overhead.
**Action:** Use a single `for...of` loop instead to improve performance by reducing iteration overhead. Document the impact of the optimization with a code comment.
