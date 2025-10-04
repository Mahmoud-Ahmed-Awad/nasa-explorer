# API Response Format Guide

## Important: Response Structure

All API calls using the `mockApi` instance return data in the following format:

```javascript
{
  data: [...] // Your actual data array or object
}
```

## Common Mistake ❌

```javascript
// This will FAIL because data is nested
const { data: missions } = useQuery({
  queryKey: ['missions'],
  queryFn: () => apiService.getMissions(),
})

missions?.filter(...) // ❌ ERROR: missions is { data: [...] }, not an array!
```

## Correct Pattern ✅

```javascript
// Option 1: Extract data after fetching
const { data: missionsResponse } = useQuery({
  queryKey: ['missions'],
  queryFn: () => apiService.getMissions(),
})

const missions = missionsResponse?.data || []
missions?.filter(...) // ✅ Works!
```

```javascript
// Option 2: Use select to transform data
const { data: missions } = useQuery({
  queryKey: ['missions'],
  queryFn: () => apiService.getMissions(),
  select: (response) => response.data, // Extract data here
})

missions?.filter(...) // ✅ Works!
```

## Fixed Files

The following files have been updated with the correct pattern:

- ✅ `src/pages/Missions.jsx`
- ✅ `src/pages/Exoplanets.jsx`
- ✅ `src/pages/Satellites.jsx`

## Pattern for All Pages

When using any of these API methods, always extract the data:

```javascript
// For arrays
const { data: itemsResponse, isLoading, error } = useQuery({
  queryKey: ['items'],
  queryFn: () => apiService.getItems(),
})
const items = itemsResponse?.data || []

// For objects
const { data: itemResponse, isLoading, error } = useQuery({
  queryKey: ['item', id],
  queryFn: () => apiService.getItemById(id),
})
const item = itemResponse?.data || {}
```

## API Service Methods

All these methods return `{ data: [...] }`:

- `apiService.getMissions()` → `{ data: Mission[] }`
- `apiService.getExoplanets()` → `{ data: Exoplanet[] }`
- `apiService.getSatellites()` → `{ data: Satellite[] }`
- `apiService.getTeamMembers()` → `{ data: TeamMember[] }`
- `apiService.getDashboardStats()` → `{ data: DashboardStats }`

## Why This Happens

Axios automatically wraps responses in a `data` property:

```javascript
// What axios returns
{
  data: [...],      // Your actual data
  status: 200,
  statusText: 'OK',
  headers: {...},
  config: {...}
}
```

React Query captures this entire response object, so you need to access `.data` to get your actual content.

## Quick Fix Script

If you encounter this error in a new component:

1. Look for: `const { data: items } = useQuery(...)`
2. Change to: `const { data: itemsResponse } = useQuery(...)`
3. Add below: `const items = itemsResponse?.data || []`

---

Last Updated: 2025-10-02
