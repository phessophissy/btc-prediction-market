# Frontend Components

Shared UI components currently include:

- `Header`
- `MarketCard`
- `MarketList`
- `StatsOverview`
- `BetModal`
- `PageHero`
- `StatCard`
- `EmptyState`
- `LoadingCard`
- `ConnectionRequired`

These components are intended to keep route files thin and easier to review.

## SearchInput

Uses `useDebounce` with a 300ms delay before triggering the search query.
The debounce value is configurable via the `debounceMs` prop (default: 300).
