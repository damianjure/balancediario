## 2024-06-10 - Memoizing Dashboard Aggregations
**Learning:** In React components dealing with large datasets (like `DashboardApp` and its `history` array), complex aggregations, filtering, and mapping operations run synchronously on the main thread during every render. If not memoized, this causes significant UI blocking.
**Action:** Always identify expensive array transformations inside component bodies and wrap them in `useMemo` with precise dependency arrays. Document the impact of the optimization with a code comment.

## 2024-07-07 - Array Iteration Overhead in Data Aggregation
**Learning:** Chaining array methods like `.filter().filter().forEach()` or `.filter().map()` creates intermediate array allocations and causes multiple passes over large datasets (like `history: Movimiento[]`).
**Action:** Use a single `for...of` loop with inline `continue` conditions instead of chaining array methods when processing large datasets, preventing unnecessary memory allocation and reducing iteration overhead.
