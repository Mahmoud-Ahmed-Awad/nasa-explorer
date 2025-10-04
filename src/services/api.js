import axios from "axios";
import nasaExoplanetService from "./nasaExoplanetApi";
import nasaMissionsService from "./nasaMissionsApi";
import nasaSatellitesService from "./nasaSatellitesApi";

// Create axios instance for API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create separate axios instance for mockup JSON files in public folder
const mockApi = axios.create({
  baseURL: "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Check if we should use mockup data or real NASA API
const USE_MOCKUP =
  import.meta.env.VITE_MOCK_API === "true" ||
  import.meta.env.VITE_MOCK_API === true;

// Request interceptor for main API
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('auth-token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for main API
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Request interceptor for mockup API
mockApi.interceptors.request.use(
  (config) => {
    console.log(
      `Mockup Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Mockup request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for mockup API
mockApi.interceptors.response.use(
  (response) => {
    console.log(`Mockup Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "Mockup response error:",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

// API service object
const apiService = {
  // Missions - Always use NASA API with smart fallback handling
  getMissions: async () => {
    console.log("🚀 Fetching fresh NASA missions data");
    try {
      const data = await nasaMissionsService.getAllMissions();
      console.log(`✅ Successfully fetched ${data.length} missions from NASA`);
      return { data };
    } catch (error) {
      console.error("❌ NASA Missions API failed:", error);

      // Handle specific error types
      if (error?.response?.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else if (error?.response?.status === 503) {
        console.warn(
          "⚠️ Some NASA APIs are temporarily unavailable, using fallback data"
        );
        return mockApi.get("missions.json");
      } else if (
        error?.message?.includes("Network Error") ||
        error?.code === "ERR_NETWORK" ||
        error?.message?.includes("connect") ||
        error?.message?.includes("ECONNABORTED") ||
        error?.message?.includes("upstream connect error")
      ) {
        console.warn("⚠️ Network connectivity issue, using fallback data");
        return mockApi.get("missions.json");
      }

      // For other errors, still try fallback
      console.warn("⚠️ Using fallback data due to API error");
      return mockApi.get("missions.json");
    }
  },

  // Exoplanets - Always use NASA API with enhanced data fetching
  getExoplanets: async (options = {}) => {
    console.log("🌌 Fetching fresh NASA exoplanet data");
    try {
      // Fetch large dataset of exoplanets by default
      const defaultOptions = { limit: 2000, ...options };
      const data = await nasaExoplanetService.getAllExoplanets(defaultOptions);
      console.log(
        `✅ Successfully fetched ${data.length} exoplanets from NASA`
      );
      // Wrap in axios-like response format for consistency
      return { data };
    } catch (error) {
      console.error("❌ NASA Exoplanet API failed:", error);

      // Handle specific error types
      if (error?.response?.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else if (error?.response?.status === 503) {
        console.warn(
          "⚠️ NASA Exoplanet Archive is temporarily unavailable, using fallback data"
        );
        return mockApi.get("exoplanets.json");
      } else if (
        error?.message?.includes("Network Error") ||
        error?.code === "ERR_NETWORK" ||
        error?.message?.includes("connect") ||
        error?.message?.includes("ECONNABORTED") ||
        error?.message?.includes("upstream connect error")
      ) {
        console.warn("⚠️ Network connectivity issue, using fallback data");
        return mockApi.get("exoplanets.json");
      }

      // For other errors, still try fallback
      console.warn("⚠️ Using fallback data due to API error");
      return mockApi.get("exoplanets.json");
    }
  },

  getExoplanetById: (id) => {
    if (USE_MOCKUP) {
      return mockApi
        .get("exoplanets.json")
        .then((res) => res.data.find((p) => p.id === id));
    } else {
      // Extract planet name from id and search NASA API
      const planetName = id.replace("exoplanet-", "").replace(/-/g, " ");
      return nasaExoplanetService
        .searchExoplanets(planetName)
        .then((results) => results[0]);
    }
  },

  // NASA Exoplanet specific methods
  getHabitableExoplanets: async (limit = 200) => {
    const data = await nasaExoplanetService.getHabitableExoplanets(limit);
    return { data };
  },

  getRecentExoplanets: async (limit = 300) => {
    const data = await nasaExoplanetService.getRecentExoplanets(limit);
    return { data };
  },

  searchExoplanets: async (name) => {
    const data = await nasaExoplanetService.searchExoplanets(name);
    return { data };
  },

  getExoplanetStatistics: async () => {
    const data = await nasaExoplanetService.getStatistics();
    return { data };
  },

  // Satellites - Always use NASA API with enhanced tracking
  getSatellites: async () => {
    console.log("🛰️ Fetching fresh NASA satellites data");
    try {
      const data = await nasaSatellitesService.getAllSatellites();
      console.log(
        `✅ Successfully fetched ${data.length} satellites from NASA`
      );
      return { data };
    } catch (error) {
      console.error("❌ NASA Satellites API failed:", error);

      // Handle specific error types
      if (error?.response?.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else if (error?.response?.status === 503) {
        console.warn(
          "⚠️ NASA satellite tracking APIs are temporarily unavailable, using fallback data"
        );
        return mockApi.get("satellites.json");
      } else if (
        error?.message?.includes("Network Error") ||
        error?.code === "ERR_NETWORK" ||
        error?.message?.includes("connect") ||
        error?.message?.includes("ECONNABORTED") ||
        error?.message?.includes("upstream connect error")
      ) {
        console.warn("⚠️ Network connectivity issue, using fallback data");
        return mockApi.get("satellites.json");
      }

      // For other errors, still try fallback
      console.warn("⚠️ Using fallback data due to API error");
      return mockApi.get("satellites.json");
    }
  },

  getSatelliteById: async (id) => {
    if (USE_MOCKUP) {
      return mockApi
        .get("satellites.json")
        .then((res) => res.data.find((s) => s.id === id));
    } else {
      const satellites = await nasaSatellitesService.getAllSatellites();
      return satellites.find((s) => s.id === id);
    }
  },

  // Team - using mockApi for local JSON files
  getTeamMembers: () => mockApi.get("team.json"),
  getTeamMemberById: (id) =>
    mockApi.get("team.json").then((res) => res.data.find((m) => m.id === id)),

  // Dashboard Stats - Combine real NASA statistics
  getDashboardStats: async () => {
    if (USE_MOCKUP) {
      return mockApi.get("dashboard-stats.json");
    } else {
      try {
        // Fetch statistics from all NASA sources
        const [exoStats, missionStats, satStats] = await Promise.allSettled([
          nasaExoplanetService.getStatistics(),
          nasaMissionsService.getMissionStatistics(),
          nasaSatellitesService.getSatelliteStatistics(),
        ]);

        const stats = [
          {
            id: "missions-explored",
            label: "NASA Missions",
            value: missionStats.value?.totalMissions || 0,
            icon: "rocket",
            color: "from-neon-blue to-cyan-500",
            trend: `${missionStats.value?.activeMissions || 0} active`,
            percentage:
              Math.round(
                (missionStats.value?.activeMissions /
                  missionStats.value?.totalMissions) *
                  100
              ) || 0,
          },
          {
            id: "exoplanets-discovered",
            label: "Confirmed Exoplanets",
            value: exoStats.value?.totalPlanets || 0,
            icon: "satellite",
            color: "from-neon-purple to-pink-500",
            trend: `${exoStats.value?.totalSystems || 0} star systems`,
            percentage: 100,
          },
          {
            id: "satellites-tracked",
            label: "Satellites & Objects",
            value: satStats.value?.totalSatellites || 0,
            icon: "satellite",
            color: "from-neon-green to-emerald-500",
            trend: `${satStats.value?.activeSatellites || 0} active`,
            percentage:
              Math.round(
                (satStats.value?.activeSatellites /
                  satStats.value?.totalSatellites) *
                  100
              ) || 0,
          },
          {
            id: "near-earth-objects",
            label: "Near Earth Objects",
            value: satStats.value?.nearEarthObjects || 0,
            icon: "comet",
            color: "from-neon-orange to-yellow-500",
            trend: "Tracked today",
            percentage: 100,
          },
        ];

        // Return dashboard data with real NASA statistics
        return {
          data: {
            stats,
            recentActivity: [],
            achievements: [],
            quickLinks: [
              {
                title: "Explore Missions",
                description: "Discover NASA missions",
                path: "/missions",
                icon: "rocket",
                color: "bg-gradient-to-r from-blue-500 to-cyan-500",
              },
              {
                title: "Find Exoplanets",
                description: `${
                  exoStats.value?.totalPlanets || 0
                } confirmed planets`,
                path: "/exoplanets",
                icon: "satellite",
                color: "bg-gradient-to-r from-purple-500 to-pink-500",
              },
              {
                title: "Track Satellites",
                description: "Monitor space objects",
                path: "/satellites",
                icon: "satellite",
                color: "bg-gradient-to-r from-green-500 to-emerald-500",
              },
              {
                title: "AI Assistant",
                description: "Ask space questions",
                path: "/ai",
                icon: "gear",
                color: "bg-gradient-to-r from-orange-500 to-yellow-500",
              },
            ],
            userProfile: {
              name: "NASA Explorer",
              level: 10,
              dataSource: "NASA APIs",
            },
          },
        };
      } catch (error) {
        console.error("❌ Failed to get dashboard stats, using mockup:", error);
        return mockApi.get("dashboard-stats.json");
      }
    }
  },

  // AI Chat
  sendChatMessage: (message) => {
    // Mock AI response for now
    return Promise.resolve({
      data: {
        message: `AI Response to: "${message}"`,
        timestamp: new Date().toISOString(),
      },
    });
  },

  // NASA Mission specific methods
  getMissionStatistics: async () => {
    try {
      const data = await nasaMissionsService.getMissionStatistics();
      return { data };
    } catch (error) {
      console.error("❌ Failed to get mission statistics:", error);
      return { data: {} };
    }
  },

  searchMissions: async (keyword) => {
    try {
      const data = await nasaMissionsService.searchMissions(keyword);
      return { data };
    } catch (error) {
      console.error("❌ Failed to search missions:", error);
      return { data: [] };
    }
  },

  getMarsRoverMissions: async () => {
    try {
      const data = await nasaMissionsService.getMarsRoverMissions();
      return { data };
    } catch (error) {
      console.error("❌ Failed to get Mars rover missions:", error);
      return { data: [] };
    }
  },

  // NASA Satellites specific methods
  getSatelliteStatistics: async () => {
    try {
      const data = await nasaSatellitesService.getSatelliteStatistics();
      return { data };
    } catch (error) {
      console.error("❌ Failed to get satellite statistics:", error);
      return { data: {} };
    }
  },

  searchSatellites: async (keyword) => {
    try {
      const data = await nasaSatellitesService.searchSatellites(keyword);
      return { data };
    } catch (error) {
      console.error("❌ Failed to search satellites:", error);
      return { data: [] };
    }
  },

  getNEOs: async (limit = 20) => {
    try {
      const data = await nasaSatellitesService.getNEOs(limit);
      return { data };
    } catch (error) {
      console.error("❌ Failed to get NEOs:", error);
      return { data: [] };
    }
  },

  getSpaceStations: async () => {
    try {
      const data = await nasaSatellitesService.getSpaceStations();
      return { data };
    } catch (error) {
      console.error("❌ Failed to get space stations:", error);
      return { data: [] };
    }
  },
};

// TODO: Replace with real NASA API endpoints
// const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY

// Real NASA API endpoints (commented out for now)
// apiService.getMissions = () => api.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
// apiService.getExoplanets = () => api.get(`https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI`)
// apiService.getSatellites = () => api.get(`https://api.n2yo.com/rest/v1/satellite/above/41.702/-76.014/0/70/18/&apiKey=${N2YO_API_KEY}`)

export default api;
export { apiService, api };
