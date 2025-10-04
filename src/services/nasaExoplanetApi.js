import axios from "axios";

/**
 * NASA Exoplanet Archive API Service
 * Documentation: https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html
 */

// NASA Exoplanet Archive TAP endpoint
const NASA_EXOPLANET_BASE =
  "https://exoplanetarchive.ipac.caltech.edu/TAP/sync";
const USE_CORS_PROXY = true; // Set to false if you have a backend proxy
const CORS_PROXY = "https://corsproxy.io/?url=";

// Create axios instance for NASA Exoplanet Archive
const exoplanetApi = axios.create({
  timeout: 15000, // Reduced timeout to fail faster
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

// Request interceptor
exoplanetApi.interceptors.request.use(
  (config) => {
    console.log(`🪐 NASA Exoplanet API Request: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("NASA Exoplanet API Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
exoplanetApi.interceptors.response.use(
  (response) => {
    console.log(`✅ NASA Exoplanet API Response: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(
      "NASA Exoplanet API Response error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// -------- Helpers: retry/backoff + CORS fallback + simple cache --------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWithBackoff(url, options = {}, retries = 1) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Use shorter timeouts with each attempt
      const timeout = attempt === 0 ? 10000 : 15000;
      return await axios.get(url, { timeout, ...options });
    } catch (err) {
      const status = err.response?.status;
      const isRetryable =
        status === 429 ||
        (status >= 500 && status <= 599) ||
        err.code === "ECONNABORTED" ||
        err.code === "ERR_NETWORK";
      if (isRetryable && attempt < retries) {
        const delay = 2000; // Fixed 2s delay instead of exponential
        console.warn(
          `Exoplanet fetch retry ${attempt + 1} after ${delay}ms (status: ${
            status || err.code
          })`
        );
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }
}

function buildNasaUrl(query) {
  return `${NASA_EXOPLANET_BASE}?query=${encodeURIComponent(
    query
  )}&format=json`;
}

async function fetchWithCorsPreference(query) {
  const nasaUrl = buildNasaUrl(query);
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(nasaUrl)}`;
  const first = USE_CORS_PROXY ? proxyUrl : nasaUrl;
  const second = USE_CORS_PROXY ? nasaUrl : proxyUrl;

  try {
    return await getWithBackoff(first);
  } catch (e) {
    console.warn(
      `Primary exoplanet fetch failed, trying fallback...`,
      e?.message || e
    );
    return await getWithBackoff(second);
  }
}

// Static fallback data for when API is down
const STATIC_EXOPLANETS = [
  {
    pl_name: "Kepler-452b",
    hostname: "Kepler-452",
    sy_dist: 1402,
    pl_rade: 1.63,
    pl_bmasse: 5.0,
    pl_orbper: 384.84,
    pl_eqt: 265,
    st_spectype: "G2V",
    discoverymethod: "Transit",
    disc_year: 2015,
    disc_facility: "Kepler Space Telescope",
  },
  {
    pl_name: "TRAPPIST-1e",
    hostname: "TRAPPIST-1",
    sy_dist: 40.7,
    pl_rade: 0.92,
    pl_bmasse: 0.69,
    pl_orbper: 6.1,
    pl_eqt: 251,
    st_spectype: "M8V",
    discoverymethod: "Transit",
    disc_year: 2017,
    disc_facility: "TRAPPIST",
  },
  {
    pl_name: "Proxima Centauri b",
    hostname: "Proxima Centauri",
    sy_dist: 4.24,
    pl_rade: 1.07,
    pl_bmasse: 1.17,
    pl_orbper: 11.19,
    pl_eqt: 234,
    st_spectype: "M5.5Ve",
    discoverymethod: "Radial Velocity",
    disc_year: 2016,
    disc_facility: "ESO 3.6 m",
  },
  {
    pl_name: "TOI-715 b",
    hostname: "TOI-715",
    sy_dist: 137,
    pl_rade: 1.55,
    pl_bmasse: 3.02,
    pl_orbper: 19.3,
    pl_eqt: 280,
    st_spectype: "M4V",
    discoverymethod: "Transit",
    disc_year: 2024,
    disc_facility: "TESS",
  },
  {
    pl_name: "K2-18 b",
    hostname: "K2-18",
    sy_dist: 124,
    pl_rade: 2.61,
    pl_bmasse: 8.63,
    pl_orbper: 32.94,
    pl_eqt: 265,
    st_spectype: "M2.5V",
    discoverymethod: "Transit",
    disc_year: 2015,
    disc_facility: "Kepler Space Telescope",
  },
];

// Simple in-memory cache keyed by query
const QUERY_CACHE = new Map();
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes
function cacheGet(key) {
  const entry = QUERY_CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > entry.ttl) {
    QUERY_CACHE.delete(key);
    return null;
  }
  return entry.data;
}
function cacheSet(key, data, ttl = DEFAULT_TTL) {
  QUERY_CACHE.set(key, { data, ttl, time: Date.now() });
}

/**
 * Build a TAP query for exoplanet data
 * @param {Object} options - Query options
 * @returns {string} - ADQL query string
 */
const buildExoplanetQuery = (options = {}) => {
  const {
    limit = 1000,
    habitable = false,
    minRadius = null,
    maxRadius = null,
    discoveryYear = null,
    orderBy = "disc_year DESC",
  } = options;

  // Use SELECT TOP for ADQL syntax
  let query = `SELECT TOP ${limit} pl_name, hostname, sy_dist, pl_rade, pl_bmasse, pl_orbper, pl_eqt, st_spectype, discoverymethod, disc_year, disc_facility FROM ps WHERE default_flag = 1`;

  if (habitable) {
    // Rough habitable zone criteria:
    // - Planet radius between 0.5 and 2.0 Earth radii
    // - Equilibrium temperature between 180K and 320K
    query += ` AND pl_rade BETWEEN 0.5 AND 2.0`;
    query += ` AND pl_eqt BETWEEN 180 AND 320`;
  }

  if (minRadius !== null) {
    query += ` AND pl_rade >= ${minRadius}`;
  }

  if (maxRadius !== null) {
    query += ` AND pl_rade <= ${maxRadius}`;
  }

  if (discoveryYear !== null) {
    query += ` AND disc_year = ${discoveryYear}`;
  }

  query += ` ORDER BY ${orderBy}`;

  return query.trim();
};

/**
 * Transform NASA API response to match our app's format
 * @param {Array} data - Raw data from NASA API
 * @returns {Array} - Transformed exoplanet objects
 */
const transformExoplanetData = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((planet, index) => {
    // Calculate habitability based on multiple factors
    const radius = planet.pl_rade || 0;
    const temp = planet.pl_eqt || 0;
    const habitable =
      radius >= 0.5 && radius <= 2.0 && temp >= 180 && temp <= 320;

    // Determine planet type based on radius
    let type = "Unknown";
    if (radius < 1.5) type = "Terrestrial";
    else if (radius < 4) type = "Super Earth";
    else if (radius < 8) type = "Mini-Neptune";
    else if (radius < 14) type = "Gas Giant";
    else type = "Super Jupiter";

    return {
      id: `exoplanet-${index}-${
        planet.pl_name?.toLowerCase().replace(/\s+/g, "-") || index
      }`,
      name: planet.pl_name || "Unknown",
      hostname: planet.hostname || "Unknown",
      type: type,
      mass: planet.pl_bmasse || 0,
      radius: planet.pl_rade || 0,
      distance: planet.sy_dist || 0,
      temperature: planet.pl_eqt || 0,
      orbitalPeriod: planet.pl_orbper || 0,
      discoveryYear: planet.disc_year || 0,
      discoveryMethod: planet.discoverymethod || "Unknown",
      discoveryFacility: planet.disc_facility || "Unknown",
      habitable: habitable,
      habitableZoneIndex: habitable ? 0.8 : 0.2,
      stellarType: planet.st_spectype || "Unknown",
      hostStar: planet.hostname || "Unknown",
      eccentricity: 0,
      inclination: 0,
      semiMajorAxis: 0,
      surfaceGravity:
        radius > 0
          ? Math.round(((planet.pl_bmasse || 1) / (radius * radius)) * 10) / 10
          : 0,
      escapeVelocity:
        radius > 0
          ? Math.round(
              Math.sqrt((2 * (planet.pl_bmasse || 1)) / radius) * 11.2 * 10
            ) / 10
          : 0,
      description: `${
        planet.pl_name
      } is a ${type.toLowerCase()} discovered in ${
        planet.disc_year || "unknown year"
      } using ${planet.discoverymethod || "unknown method"}.`,
      imageUrl: `/assets/exoplanets/default.jpg`,
      details: {
        atmosphere: "Data not available",
        composition:
          type === "Terrestrial"
            ? "Likely rocky"
            : type.includes("Gas")
            ? "Gas giant"
            : "Unknown",
        hostStarMass: 0,
        hostStarRadius: 0,
        hostStarTemperature: 0,
        semiMajorAxis: 0,
        eccentricity: 0,
        inclination: 0,
        hostStar: planet.hostname || "Unknown",
        discoveryMethod: planet.discoverymethod || "Unknown",
        discoveryFacility: planet.disc_facility || "Unknown",
        stellarType: planet.st_spectype || "Unknown",
      },
    };
  });
};

/**
 * NASA Exoplanet Archive Service
 */
const nasaExoplanetService = {
  /**
   * Get all confirmed exoplanets
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Array of exoplanet objects
   */
  async getAllExoplanets(options = {}) {
    try {
      const query = buildExoplanetQuery(options);
      const cached = cacheGet(query);
      if (cached) {
        console.log(
          `🗃️ Using cached exoplanet query results (${cached.length})`
        );
        return transformExoplanetData(cached);
      }

      // Test network connectivity first with a simple endpoint
      // try {
      //   const testResponse = await axios.get("https://httpbin.org/status/200", {
      //     timeout: 3000,
      //     validateStatus: () => true,
      //   });
      //   console.log("🌐 Network connectivity test:", testResponse.status);
      // } catch (networkError) {
      //   console.warn(
      //     "⚠️ Network connectivity issue detected:",
      //     networkError?.message || networkError
      //   );
      //   console.log(
      //     `🗃️ Using ${STATIC_EXOPLANETS.length} static exoplanets due to network issues`
      //   );
      //   return transformExoplanetData(STATIC_EXOPLANETS);
      // }

      console.log(`🌌 Fetching real NASA exoplanet data`);
      const response = await fetchWithCorsPreference(query);

      // Handle both response formats (direct array or nested data)
      const rawData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      cacheSet(query, rawData);

      console.log(`📊 Fetched ${rawData.length} exoplanets from NASA`);

      return transformExoplanetData(rawData);
    } catch (error) {
      console.warn(
        "⚠️ NASA Exoplanet API failed, using static fallback data:",
        error.message
      );

      // Return static fallback data instead of throwing error
      console.log(
        `🗃️ Using ${STATIC_EXOPLANETS.length} static exoplanets as fallback`
      );
      return transformExoplanetData(STATIC_EXOPLANETS);
    }
  },

  /**
   * Get habitable zone exoplanets
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} - Array of potentially habitable exoplanets
   */
  async getHabitableExoplanets(limit = 200) {
    try {
      return await this.getAllExoplanets({
        limit,
        habitable: true,
        orderBy: "pl_eqt ASC",
      });
    } catch (error) {
      console.warn("⚠️ Falling back to static habitable exoplanets");
      return transformExoplanetData(
        STATIC_EXOPLANETS.filter(
          (p) =>
            p.pl_rade >= 0.5 &&
            p.pl_rade <= 2.0 &&
            p.pl_eqt >= 180 &&
            p.pl_eqt <= 320
        )
      );
    }
  },

  /**
   * Get recently discovered exoplanets
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} - Array of recently discovered exoplanets
   */
  async getRecentExoplanets(limit = 300) {
    try {
      return await this.getAllExoplanets({
        limit,
        orderBy: "disc_year DESC, rowid DESC",
      });
    } catch (error) {
      console.warn("⚠️ Falling back to static recent exoplanets");
      const sortedStatic = [...STATIC_EXOPLANETS].sort(
        (a, b) => b.disc_year - a.disc_year
      );
      return transformExoplanetData(sortedStatic.slice(0, limit));
    }
  },

  /**
   * Search exoplanets by name
   * @param {string} name - Planet or star name
   * @returns {Promise<Array>} - Array of matching exoplanets
   */
  async searchExoplanets(name) {
    try {
      const query = `SELECT TOP 100 pl_name, hostname, sy_dist, pl_rade, pl_bmasse, pl_orbper, pl_eqt, st_spectype, discoverymethod, disc_year, disc_facility FROM ps WHERE default_flag = 1 AND (pl_name LIKE '%${name}%' OR hostname LIKE '%${name}%') ORDER BY disc_year DESC`;
      const cacheKey = `search:${query}`;
      const cached = cacheGet(cacheKey);
      if (cached) return transformExoplanetData(cached);

      const response = await fetchWithCorsPreference(query);

      const rawData = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      cacheSet(cacheKey, rawData);
      return transformExoplanetData(rawData);
    } catch (error) {
      console.warn(
        "⚠️ Exoplanet search failed, using static fallback:",
        error.message
      );

      // Search in static data as fallback
      const searchTerm = name.toLowerCase();
      const matches = STATIC_EXOPLANETS.filter(
        (p) =>
          p.pl_name.toLowerCase().includes(searchTerm) ||
          p.hostname.toLowerCase().includes(searchTerm)
      );
      return transformExoplanetData(matches);
    }
  },

  /**
   * Get exoplanet statistics
   * @returns {Promise<Object>} - Statistics object
   */
  async getStatistics() {
    try {
      const query = `SELECT COUNT(*) as total_planets, COUNT(DISTINCT hostname) as total_systems, MIN(disc_year) as first_discovery, MAX(disc_year) as latest_discovery FROM ps WHERE default_flag = 1`;
      const cacheKey = `stats:${query}`;
      const cached = cacheGet(cacheKey);
      if (!cached) {
        const response = await fetchWithCorsPreference(query);
        const dataRow = Array.isArray(response.data)
          ? response.data[0]
          : response.data?.data?.[0];
        cacheSet(cacheKey, dataRow);
      }
      const data = cacheGet(cacheKey);
      return {
        totalPlanets: data?.total_planets || 0,
        totalSystems: data?.total_systems || 0,
        firstDiscovery: data?.first_discovery || 1992,
        latestDiscovery: data?.latest_discovery || new Date().getFullYear(),
      };
    } catch (error) {
      console.error("❌ Error fetching statistics:", error);
      return {
        totalPlanets: 0,
        totalSystems: 0,
        firstDiscovery: 1992,
        latestDiscovery: new Date().getFullYear(),
      };
    }
  },
};

export default nasaExoplanetService;
export { exoplanetApi, buildExoplanetQuery, transformExoplanetData };
