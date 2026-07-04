## 2024-06-10 - Memoizing Dashboard Aggregations
**Learning:** In React components dealing with large datasets (like `DashboardApp` and its `history` array), complex aggregations, filtering, and mapping operations run synchronously on the main thread during every render. If not memoized, this causes significant UI blocking.
**Action:** Always identify expensive array transformations inside component bodies and wrap them in `useMemo` with precise dependency arrays. Document the impact of the optimization with a code comment.
## 2024-06-11 - Optimize Array Iteration for Performance
**Learning:** In frontend data processing (like computing summaries in dashboards), chaining array methods (e.g. `.filter().forEach()`) can lead to intermediate array allocations that degrade performance. Iterating through arrays using `for...of` loops and performing checks/updates in a single pass is much faster.
**Action:** Use single `for...of` loops instead of chaining methods like `.filter().forEach()` to prevent unnecessary intermediate array allocations and reduce iteration overhead when processing large dataset arrays.
