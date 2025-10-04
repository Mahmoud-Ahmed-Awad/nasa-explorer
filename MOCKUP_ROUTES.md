# Mockup JSON Routes Documentation

This document describes all the mockup JSON routes available in the application for development and testing.

## Overview

The application uses two separate axios instances:
- **`api`**: For real API calls (with `/api` base URL)
- **`mockApi`**: For mockup JSON files served from the `public` folder (with `/` base URL)

## Available Mockup Files

All mockup JSON files are located in the `public` folder and can be accessed directly.

### 1. Missions (`/missions.json`)
**Location**: `public/missions.json`  
**Route**: `mockApi.get("missions.json")`  
**Service Method**: `apiService.getMissions()`

**Data Structure**:
```json
[
  {
    "id": "kepler",
    "name": "Kepler Space Telescope",
    "type": "Space Observatory",
    "status": "Retired",
    "launchYear": 2009,
    "endYear": 2018,
    "agency": "NASA",
    "cost": 600000000,
    "description": "...",
    "objectives": [...],
    "achievements": [...],
    "instruments": [...],
    "imageUrl": "/assets/missions/kepler.jpg",
    "details": {...}
  }
]
```

**Total Records**: 10 missions (Kepler, TESS, JWST, Hubble, Gaia, CHEOPS, Spitzer, PLATO, ARIEL, ISS)

---

### 2. Exoplanets (`/exoplanets.json`)
**Location**: `public/exoplanets.json`  
**Route**: `mockApi.get("exoplanets.json")`  
**Service Methods**: 
- `apiService.getExoplanets()` - Get all exoplanets
- `apiService.getExoplanetById(id)` - Get specific exoplanet by ID

**Data Structure**:
```json
[
  {
    "id": "kepler-442b",
    "name": "Kepler-442 b",
    "hostname": "Kepler-442",
    "type": "Super Earth",
    "mass": 2.34,
    "radius": 1.34,
    "distance": 1206,
    "temperature": 233,
    "orbitalPeriod": 112.3,
    "discoveryYear": 2015,
    "discoveryMethod": "Transit",
    "discoveryFacility": "Kepler",
    "habitable": true,
    "habitableZoneIndex": 0.85,
    "stellarType": "K-type main-sequence",
    "surfaceGravity": 1.6,
    "escapeVelocity": 18.4,
    "description": "...",
    "imageUrl": "/assets/exoplanets/kepler-442b.jpg",
    "details": {...}
  }
]
```

**Total Records**: 16 exoplanets (including Kepler-442 b, Proxima Centauri b, TRAPPIST-1 e, K2-18 b, etc.)

---

### 3. Satellites (`/satellites.json`)
**Location**: `public/satellites.json`  
**Route**: `mockApi.get("satellites.json")`  
**Service Methods**: 
- `apiService.getSatellites()` - Get all satellites
- `apiService.getSatelliteById(id)` - Get specific satellite by ID

**Data Structure**:
```json
[
  {
    "id": "landsat-9",
    "name": "Landsat 9",
    "type": "Earth Observation",
    "status": "Active",
    "launchYear": 2021,
    "agency": "NASA/USGS",
    "altitude": 705,
    "orbitalPeriod": 99,
    "purpose": "Earth observation and land surface monitoring",
    "description": "...",
    "applications": [...],
    "specifications": {...},
    "sensors": [...],
    "imageUrl": "/assets/satellites/landsat-9.jpg",
    "position": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "altitude": 705
    }
  }
]
```

**Total Records**: 15 satellites (Landsat-9, Sentinel-2A, Aqua, Terra, GOES-18, etc.)

---

### 4. Team Members (`/team.json`)
**Location**: `public/team.json`  
**Route**: `mockApi.get("team.json")`  
**Service Methods**: 
- `apiService.getTeamMembers()` - Get all team members
- `apiService.getTeamMemberById(id)` - Get specific team member by ID

**Data Structure**:
```json
[
  {
    "id": "member-1",
    "name": "Dr. Sarah Chen",
    "role": "Lead Astrophysicist",
    "department": "Exoplanet Research",
    "email": "s.chen@nasa.gov",
    "bio": "...",
    "expertise": [...],
    "education": "Ph.D. in Astrophysics, MIT",
    "publications": 87,
    "imageUrl": "/assets/team/sarah-chen.jpg",
    "social": {
      "twitter": "@DrSarahChen",
      "linkedin": "sarah-chen-phd",
      "orcid": "0000-0002-1234-5678"
    }
  }
]
```

**Total Records**: 8 team members

---

### 5. Dashboard Stats (`/dashboard-stats.json`)
**Location**: `public/dashboard-stats.json`  
**Route**: `mockApi.get("dashboard-stats.json")`  
**Service Method**: `apiService.getDashboardStats()`

**Data Structure**:
```json
{
  "stats": [
    {
      "id": "missions-explored",
      "label": "Missions Explored",
      "value": 12,
      "icon": "🚀",
      "color": "from-neon-blue to-cyan-500",
      "trend": "+3 this month",
      "percentage": 15
    }
  ],
  "recentActivity": [...],
  "achievements": [...],
  "quickLinks": [...],
  "userProfile": {...}
}
```

**Sections**: 
- `stats`: 4 stat cards
- `recentActivity`: 6 activity items
- `achievements`: 8 achievements
- `quickLinks`: 4 quick navigation links
- `userProfile`: User profile data

---

## Usage Examples

### React Component Example

```jsx
import { useQuery } from '@tanstack/react-query'
import { apiService } from '@services/api'

function MissionsPage() {
  const { data: missions, isLoading, error } = useQuery({
    queryKey: ['missions'],
    queryFn: () => apiService.getMissions(),
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {missions?.data.map(mission => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  )
}
```

### Direct Axios Example

```javascript
import { mockApi } from '@services/api'

// Get all exoplanets
const response = await mockApi.get('exoplanets.json')
const exoplanets = response.data

// Get specific exoplanet
const exoplanet = await apiService.getExoplanetById('kepler-442b')
```

---

## Configuration

### Environment Variables

```env
# For mockup development (uses mockApi)
VITE_API_BASE=/api
VITE_MOCK_API=true

# For production (uses real API)
VITE_API_BASE=https://nasa-server-eight.vercel.app
VITE_MOCK_API=false
```

### API Service Configuration

**File**: `src/services/api.js`

```javascript
// Main API instance (for real backend)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api",
  timeout: 10000,
})

// Mockup API instance (for JSON files in public folder)
const mockApi = axios.create({
  baseURL: "/",
  timeout: 10000,
})
```

---

## Development Tips

1. **Add New Mockup File**:
   - Create JSON file in `public` folder
   - Add service method in `apiService` using `mockApi`
   - Update this documentation

2. **Switch Between Mockup and Real API**:
   - Mockup: Use `mockApi.get("filename.json")`
   - Real API: Use `api.get("/endpoint")`

3. **Testing**:
   - Open browser console to see request logs
   - Check Network tab for file loading
   - Verify JSON structure matches component expectations

4. **Data Validation**:
   - All IDs should be unique and lowercase-kebab-case
   - Dates should be in ISO 8601 format
   - Images URLs should use relative paths starting with `/assets/`

---

## Troubleshooting

### 404 Errors on JSON Files

**Problem**: Getting 404 errors when accessing JSON files.

**Solution**: Ensure you're using `mockApi` instead of `api` for mockup files:
```javascript
// ❌ Wrong - will look for /api/missions.json
api.get("/missions.json")

// ✅ Correct - will look for /missions.json in public folder
mockApi.get("missions.json")
```

### CORS Errors

**Problem**: CORS errors when accessing JSON files.

**Solution**: JSON files in the `public` folder are served by Vite dev server and should not have CORS issues. If you see CORS errors, check your axios configuration.

### Data Not Loading

**Problem**: Components show loading state indefinitely.

**Solution**: 
1. Check browser console for errors
2. Verify JSON file exists in `public` folder
3. Validate JSON syntax using a JSON validator
4. Check service method is using correct axios instance

---

## Future Enhancements

Potential additions to mockup data:

- [ ] Research papers/publications JSON
- [ ] Educational tutorials/lessons JSON
- [ ] User preferences/settings JSON
- [ ] Notifications/alerts JSON
- [ ] Saved searches/favorites JSON
- [ ] Comments/discussions JSON

---

Last Updated: 2025-10-02
