# NASA Exoplanet Archive API Integration Guide

## Overview

The application now supports fetching real exoplanet data from NASA's Exoplanet Archive using their TAP (Table Access Protocol) service.

## Configuration

### Enable NASA API

Edit `.env` file:

```env
# Set to false to use real NASA data
VITE_MOCK_API=false

# Set to true to use mockup JSON data
VITE_MOCK_API=true
```

### Switch Between Data Sources

The app automatically switches based on the `VITE_MOCK_API` environment variable:

- **`false`**: Fetches live data from NASA Exoplanet Archive
- **`true`**: Uses local mockup JSON files

## API Service

### File Structure

```
src/services/
├── api.js                    # Main API service with routing
├── nasaExoplanetApi.js       # NASA Exoplanet Archive integration
└── ...
```

### Available Methods

#### 1. Get All Exoplanets

```javascript
import { apiService } from '@services/api';

// Get latest 100 exoplanets
const response = await apiService.getExoplanets({ limit: 100 });
const exoplanets = response.data;
```

**Options:**
- `limit`: Maximum number of results (default: 100)
- `habitable`: Filter for potentially habitable planets
- `minRadius`: Minimum planet radius in Earth radii
- `maxRadius`: Maximum planet radius in Earth radii
- `discoveryYear`: Filter by discovery year
- `orderBy`: SQL ORDER BY clause (default: 'disc_year DESC')

#### 2. Get Habitable Exoplanets

```javascript
// Get potentially habitable exoplanets
const response = await apiService.getHabitableExoplanets(50);
const habitable = response.data;
```

**Criteria:**
- Radius: 0.5 - 2.0 Earth radii
- Temperature: 180K - 320K

#### 3. Get Recent Discoveries

```javascript
// Get recently discovered exoplanets
const response = await apiService.getRecentExoplanets(50);
const recent = response.data;
```

#### 4. Search by Name

```javascript
// Search for specific planets or systems
const response = await apiService.searchExoplanets('Kepler');
const results = response.data;
```

#### 5. Get Statistics

```javascript
// Get overall statistics
const response = await apiService.getExoplanetStatistics();
const stats = response.data;
// { totalPlanets, totalSystems, firstDiscovery, latestDiscovery }
```

## Data Structure

### NASA Response Format

The NASA API returns data in this format after transformation:

```javascript
{
  id: "exoplanet-0-kepler-442-b",
  name: "Kepler-442 b",
  hostname: "Kepler-442",
  type: "Super Earth",              // Calculated based on radius
  mass: 2.34,                        // Earth masses
  radius: 1.34,                      // Earth radii
  distance: 1206,                    // Light years
  temperature: 233,                  // Kelvin
  orbitalPeriod: 112.3,              // Days
  discoveryYear: 2015,
  discoveryMethod: "Transit",
  discoveryFacility: "Kepler",
  habitable: true,                   // Calculated
  habitableZoneIndex: 0.85,
  stellarType: "K-type main-sequence",
  surfaceGravity: 1.6,               // Earth g's
  escapeVelocity: 18.4,              // km/s
  description: "Auto-generated description",
  imageUrl: "/assets/exoplanets/default.jpg",
  details: {
    atmosphere: "Data not available",
    composition: "Likely rocky",
    hostStarMass: 0,
    hostStarRadius: 0,
    hostStarTemperature: 0,
    semiMajorAxis: 0
  }
}
```

### Planet Type Classification

Based on planet radius:

| Type | Radius (Earth radii) |
|------|---------------------|
| Terrestrial | < 1.5 |
| Super Earth | 1.5 - 4 |
| Mini-Neptune | 4 - 8 |
| Gas Giant | 8 - 14 |
| Super Jupiter | > 14 |

### Habitability Criteria

A planet is considered potentially habitable if:
- **Radius**: 0.5 - 2.0 Earth radii (rocky planet size)
- **Temperature**: 180K - 320K (allows liquid water)

## React Query Integration

### In Components

```javascript
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@services/api';

function ExoplanetList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['exoplanets', 'habitable'],
    queryFn: () => apiService.getHabitableExoplanets(100),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const exoplanets = data?.data || [];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {exoplanets.map(planet => (
        <ExoplanetCard key={planet.id} planet={planet} />
      ))}
    </div>
  );
}
```

### Cache Configuration

```javascript
staleTime: 10 * 60 * 1000  // 10 minutes - NASA data doesn't change frequently
refetchOnWindowFocus: false // Avoid unnecessary refetches
```

## UI Features on Exoplanets Page

### 1. Data Source Indicator

When NASA API is enabled, a badge displays:
```
🌌 Live NASA Exoplanet Archive Data (100 planets)
```

### 2. Quick Filter Buttons

Three quick filter options:

- **🌍 All Exoplanets**: Latest 100 discoveries
- **🌱 Potentially Habitable**: Earth-like conditions
- **✨ Recently Discovered**: Newest findings

### 3. Automatic Refresh

Data refreshes when:
- Switching between filter modes
- After 10 minutes (stale time)
- Manual refetch via button

## NASA API Specifications

### Endpoint

```
https://exoplanetarchive.ipac.caltech.edu/TAP/sync
```

### Query Language

Uses ADQL (Astronomical Data Query Language), similar to SQL:

```sql
SELECT 
  pl_name,
  hostname,
  sy_dist,
  pl_rade,
  pl_bmasse,
  pl_orbper,
  pl_eqt,
  st_spectype,
  discoverymethod,
  disc_year,
  disc_facility
FROM ps
WHERE default_flag = 1
ORDER BY disc_year DESC
LIMIT 100
```

### Key Columns

- `pl_name`: Planet name
- `hostname`: Host star name
- `sy_dist`: Distance to system (parsecs)
- `pl_rade`: Planet radius (Earth radii)
- `pl_bmasse`: Planet mass (Earth masses)
- `pl_orbper`: Orbital period (days)
- `pl_eqt`: Equilibrium temperature (Kelvin)
- `st_spectype`: Stellar spectral type
- `discoverymethod`: Detection method
- `disc_year`: Discovery year
- `disc_facility`: Discovery facility/telescope
- `default_flag`: 1 for default parameters

## Performance Optimization

### 1. Request Timeout

```javascript
timeout: 30000  // 30 seconds for NASA API
```

### 2. Result Limiting

Default limit of 100 planets to balance performance and data richness.

### 3. Caching

- React Query caches responses for 10 minutes
- Reduces unnecessary API calls
- Improves app performance

### 4. Error Handling

```javascript
try {
  const data = await nasaExoplanetService.getAllExoplanets();
  return data;
} catch (error) {
  console.error('Failed to fetch exoplanets:', error);
  // Fallback to mockup data or show error
}
```

## Testing

### 1. Test NASA API Connection

```javascript
// In browser console
import { apiService } from '@services/api';

// Test fetching data
apiService.getExoplanets({ limit: 10 })
  .then(res => console.log('✅ Success:', res.data))
  .catch(err => console.error('❌ Error:', err));
```

### 2. Test Habitable Planets

```javascript
apiService.getHabitableExoplanets(10)
  .then(res => {
    console.log(`Found ${res.data.length} habitable planets:`);
    res.data.forEach(p => console.log(`- ${p.name}`));
  });
```

### 3. Test Search

```javascript
apiService.searchExoplanets('Kepler-442')
  .then(res => console.log('Search results:', res.data));
```

## Troubleshooting

### Issue: No Data Returned

**Check:**
1. `.env` file has `VITE_MOCK_API=false`
2. Internet connection is active
3. NASA Exoplanet Archive is accessible
4. Browser console for errors

**Solution:**
```bash
# Restart dev server after changing .env
npm run dev
```

### Issue: CORS Errors

**Problem:** Browser blocks requests to NASA API

**Solution:** 
- NASA Exoplanet Archive should support CORS
- Check browser console for specific CORS error
- Ensure no browser extensions are blocking requests

### Issue: Timeout Errors

**Problem:** NASA API is slow or unresponsive

**Solution:**
- Increase timeout in `nasaExoplanetApi.js`
- Reduce result limit
- Use mockup data as fallback

```javascript
timeout: 60000  // Increase to 60 seconds
```

### Issue: Data Format Errors

**Problem:** NASA API changed response format

**Solution:**
- Check NASA API documentation
- Update `transformExoplanetData()` function
- Add additional format detection

## Development vs Production

### Development
```env
VITE_MOCK_API=true  # Fast, offline testing
```

### Production
```env
VITE_MOCK_API=false  # Real NASA data
```

## Additional Resources

- **NASA Exoplanet Archive**: https://exoplanetarchive.ipac.caltech.edu/
- **TAP Documentation**: https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html
- **ADQL Guide**: http://www.ivoa.net/documents/ADQL/
- **Column Definitions**: https://exoplanetarchive.ipac.caltech.edu/docs/API_PS_columns.html

## Future Enhancements

Potential improvements:

- [ ] Add pagination for large datasets
- [ ] Implement advanced filtering (by detection method, facility)
- [ ] Add sorting options (by distance, size, temperature)
- [ ] Cache responses in localStorage
- [ ] Add download options (JSON, CSV, PDF)
- [ ] Implement virtual scrolling for large lists
- [ ] Add detailed star system views
- [ ] Integrate with other NASA APIs (JWST data, etc.)
- [ ] Add comparison tool for multiple planets
- [ ] Implement saved searches and favorites

---

Last Updated: 2025-10-02
Version: 1.0.0
