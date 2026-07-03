## 2024-06-10 - Memoizing Dashboard Aggregations
**Learning:** In React components dealing with large datasets (like `DashboardApp` and its `history` array), complex aggregations, filtering, and mapping operations run synchronously on the main thread during every render. If not memoized, this causes significant UI blocking.
**Action:** Always identify expensive array transformations inside component bodies and wrap them in `useMemo` with precise dependency arrays. Document the impact of the optimization with a code comment.
## 2024-03-08 - Optimizing Array Processing Pipelines
**Learning:** Chaining array methods like `.filter().forEach()` or `.filter().map()` allocates intermediate arrays in memory. When processing large datasets (like `history: Movimiento[]`), this causes unnecessary memory pressure and garbage collection pauses.
**Action:** Replace multi-step array processing chains with a single `for...of` loop with `continue` statements for filtering. This performs the operation in a single pass without allocating intermediate arrays, significantly reducing overhead in hot paths.
