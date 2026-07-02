## 2024-06-10 - Memoizing Dashboard Aggregations
**Learning:** In React components dealing with large datasets (like `DashboardApp` and its `history` array), complex aggregations, filtering, and mapping operations run synchronously on the main thread during every render. If not memoized, this causes significant UI blocking.
**Action:** Always identify expensive array transformations inside component bodies and wrap them in `useMemo` with precise dependency arrays. Document the impact of the optimization with a code comment.

## 2026-07-02 - Single Pass Iteration Over Large Datasets
**Learning:** In operations dealing with large dataset arrays like `history: Movimiento[]`, chaining methods such as `.filter().forEach()` creates intermediate array allocations that waste memory and increase iteration overhead.
**Action:** Use a single `for...of` loop instead of chaining array methods to iterate over large datasets efficiently, preventing unnecessary memory allocation and improving execution speed.
