## 2024-06-10 - Memoizing Dashboard Aggregations
**Learning:** In React components dealing with large datasets (like `DashboardApp` and its `history` array), complex aggregations, filtering, and mapping operations run synchronously on the main thread during every render. If not memoized, this causes significant UI blocking.
**Action:** Always identify expensive array transformations inside component bodies and wrap them in `useMemo` with precise dependency arrays. Document the impact of the optimization with a code comment.

## 2024-06-11 - Optimizing Array Aggregations
**Learning:** Chaining array methods like `.filter().forEach()` or `.filter().map()` on large collections (like `history: Movimiento[]`) causes multiple array iterations and allocates unnecessary intermediate arrays, increasing GC pressure and memory usage, leading to sluggish UI updates.
**Action:** Use single `for...of` loops with inline `continue` conditions instead of chained array methods for complex array aggregations when processing large dataset arrays on the frontend.
