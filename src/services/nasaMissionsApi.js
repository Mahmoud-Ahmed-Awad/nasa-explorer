import axios from "axios";

/**
 * NASA Missions and Projects API Service
 * Integrates multiple NASA APIs for mission data
 */

// NASA API endpoints
const NASA_APOD_API = "https://api.nasa.gov/planetary/apod";
const NASA_INSIGHT_API = "https://api.nasa.gov/insight_weather";
const NASA_MARS_ROVER_API = "https://api.nasa.gov/mars-photos/api/v1";
const NASA_EPIC_API = "https://api.nasa.gov/EPIC/api";
const NASA_TECHPORT_API = "https://api.nasa.gov/techport/api";
const NASA_NEO_API = "https://api.nasa.gov/neo/rest/v1";
const NASA_DONKI_API = "https://api.nasa.gov/DONKI";
const CORS_PROXY = "https://corsproxy.io/?url=";

// API key (use your own key via .env: VITE_NASA_API_KEY). Falls back to DEMO_KEY
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";

// Simple in-memory cache and backoff to respect rate limits
const RESPECT_RATE_LIMIT = true;
const CACHE = new Map();
const TTL = {
  apod: 10 * 60 * 1000,
  rovers: 30 * 60 * 1000,
  epic: 10 * 60 * 1000,
  techport: 60 * 60 * 1000, // 1 hour
  neo: 30 * 60 * 1000,
  donki: 30 * 60 * 1000,
};

const getCache = (key) => {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > entry.ttl) {
    CACHE.delete(key);
    return null;
  }
  return entry.data;
};

const setCache = (key, data, ttl) => {
  CACHE.set(key, { data, ttl, time: Date.now() });
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWithBackoff(fullUrl, retries = 2, timeout = 30000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await axios.get(fullUrl, { timeout });
    } catch (err) {
      const status = err.response?.status;
      if ((status === 429 || status >= 500) && attempt < retries) {
        const delay = 1000 * Math.pow(2, attempt);
        console.warn(
          `Rate limited or server error (${status}). Retrying in ${delay}ms...`
        );
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }
}

// Try direct NASA URL first; if CORS/network fails, fall back to CORS proxy
async function getWithCorsFallback(nasaUrl, retries = 2, timeout = 30000) {
  try {
    return await getWithBackoff(nasaUrl, retries, timeout);
  } catch (err) {
    const status = err.response?.status;

    // Log specific error types for better debugging
    if (status === 503) {
      console.warn(
        `Service Unavailable (503) for ${nasaUrl} - API may be down`
      );
    } else if (status === 429) {
      console.warn(`Rate limit exceeded (429) for ${nasaUrl}`);
    } else if (status >= 500) {
      console.warn(`Server error (${status}) for ${nasaUrl}`);
    }

    // If status is 4xx/5xx we still may prefer proxy (which might have separate limits)
    console.warn(
      "Direct NASA fetch failed, trying CORS proxy...",
      err?.message || err
    );

    try {
      const proxied = `${CORS_PROXY}${encodeURIComponent(nasaUrl)}`;
      return await getWithBackoff(proxied, retries, timeout);
    } catch (proxyErr) {
      console.warn("CORS proxy also failed:", proxyErr?.message || proxyErr);
      throw err; // Throw original error
    }
  }
}

/**
 * Transform mission data to match app format
 */
const transformMissionData = (missions) => {
  return missions.map((mission, index) => ({
    id: mission.id || `mission-${index}`,
    name: mission.name || mission.title || "Unknown Mission",
    type: mission.type || "Space Mission",
    status: mission.status || "Active",
    launchYear: mission.launch_year || mission.year || new Date().getFullYear(),
    endYear: mission.end_year || null,
    agency: mission.agency || "NASA",
    cost: mission.cost || 0,
    description: mission.description || mission.explanation || "",
    objectives: mission.objectives || [],
    achievements: mission.achievements || [],
    instruments: mission.instruments || [],
    imageUrl:
      mission.image_url || mission.url || "/assets/missions/default.jpg",
    details: mission.details || {},
  }));
};

/**
 * NASA Missions Service
 */
const nasaMissionsService = {
  /**
   * Get Astronomy Picture of the Day (represents daily mission highlights)
   */
  async getAPOD(count = 30) {
    try {
      const effectiveCount =
        NASA_API_KEY === "DEMO_KEY" && RESPECT_RATE_LIMIT
          ? Math.min(count, 5)
          : count;
      const cacheKey = `apod-${effectiveCount}`;
      const cached = getCache(cacheKey);
      if (cached) return transformMissionData(cached);

      const nasaUrl = `${NASA_APOD_API}?api_key=${NASA_API_KEY}&count=${effectiveCount}`;
      const response = await getWithCorsFallback(nasaUrl, 2, 30000);
      const apodData = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // Transform APOD data to mission format
      const missions = apodData.map((item, index) => ({
        id: `apod-${index}`,
        name: item.title,
        type: "Astronomy Discovery",
        status: "Published",
        launchYear: new Date(item.date).getFullYear(),
        launchDate: item.date,
        agency: "NASA",
        description: item.explanation,
        imageUrl: item.hdurl || item.url,
        details: {
          copyright: item.copyright,
          media_type: item.media_type,
          service_version: item.service_version,
        },
      }));

      setCache(cacheKey, missions, TTL.apod);
      return transformMissionData(missions);
    } catch (error) {
      console.warn("❌ Error fetching APOD:", error?.message || error);
      throw error;
    }
  },

  /**
   * Get Mars Rover missions data
   */
  async getMarsRoverMissions() {
    try {
      const cacheKey = "rovers-all";
      const cached = getCache(cacheKey);
      if (cached) return transformMissionData(cached);

      // Single call to list all rovers instead of 4 separate calls
      const nasaUrl = `${NASA_MARS_ROVER_API}/rovers?api_key=${NASA_API_KEY}`;
      const response = await getWithCorsFallback(nasaUrl, 2, 15000);
      const rovers = response.data?.rovers || [];

      const missionsData = rovers.map((rover) => ({
        id: `rover-${rover.name.toLowerCase()}`,
        name: rover.name,
        type: "Mars Rover",
        status: rover.status,
        launchYear: new Date(rover.launch_date).getFullYear(),
        launchDate: rover.launch_date,
        landingDate: rover.landing_date,
        agency: "NASA",
        description: `Mars rover mission launched on ${rover.launch_date}`,
        objectives: [
          "Explore Mars surface",
          "Search for signs of past life",
          "Study Mars geology",
        ],
        achievements: [
          `${rover.total_photos} photos taken`,
          `${rover.max_sol} sols on Mars`,
        ],
        instruments: rover.cameras?.map((cam) => cam.full_name) || [],
        imageUrl: `/assets/missions/mars-${rover.name.toLowerCase()}.jpg`,
        details: {
          total_photos: rover.total_photos,
          max_sol: rover.max_sol,
          max_date: rover.max_date,
        },
      }));

      setCache(cacheKey, missionsData, TTL.rovers);
      return transformMissionData(missionsData);
    } catch (error) {
      console.warn(
        "❌ Error fetching Mars Rover missions:",
        error?.message || error
      );
      throw error;
    }
  },

  /**
   * Get EPIC Earth imaging mission data
   * TEMPORARILY DISABLED: EPIC API experiencing connectivity issues (Oct 2025)
   */
  async getEPICMission() {
    try {
      const cacheKey = "epic-natural";
      const cached = getCache(cacheKey);
      if (cached) return transformMissionData(cached);

      console.log("🌍 Fetching EPIC Earth imagery data...");
      const nasaUrl = `${NASA_EPIC_API}/natural?api_key=${NASA_API_KEY}`;
      const response = await getWithCorsFallback(nasaUrl, 2, 30000);
      const epicData = response.data;

      if (epicData && epicData.length > 0) {
        const latestImage = epicData[0];
        const imageDate = latestImage.date.split(" ")[0].replace(/-/g, "/");
        const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${imageDate}/png/${latestImage.image}.png`;

        const mission = {
          id: "epic-mission",
          name: "EPIC (Earth Polychromatic Imaging Camera)",
          type: "Earth Observation",
          status: "Active",
          launchYear: 2015,
          agency: "NASA/NOAA",
          description:
            "DSCOVR's Earth Polychromatic Imaging Camera (EPIC) provides full disc imagery of the Earth and captures unique perspectives of certain astronomical events.",
          objectives: [
            "Monitor ozone and aerosol levels",
            "Monitor cloud height and vegetation properties",
            "Provide UV reflectivity measurements",
          ],
          achievements: [`${epicData.length} recent Earth images captured`],
          instruments: ["Earth Polychromatic Imaging Camera"],
          imageUrl: imageUrl,
          details: {
            spacecraft: "DSCOVR",
            orbit: "L1 Lagrange Point",
            distance_from_earth: "1.5 million km",
            latest_image_date: latestImage.date,
          },
        };

        setCache(cacheKey, [mission], TTL.epic);
        return transformMissionData([mission]);
      }

      return [];
    } catch (error) {
      console.warn(
        "⚠️ EPIC API unavailable (503), using static fallback:",
        error?.message || error
      );

      // Return static EPIC mission data when API is down
      const staticEPICMission = {
        id: "epic-mission-static",
        name: "EPIC (Earth Polychromatic Imaging Camera)",
        type: "Earth Observation",
        status: "Active",
        launchYear: 2015,
        agency: "NASA/NOAA",
        description:
          "DSCOVR's Earth Polychromatic Imaging Camera (EPIC) provides full disc imagery of the Earth and captures unique perspectives of certain astronomical events.",
        objectives: [
          "Monitor ozone and aerosol levels",
          "Monitor cloud height and vegetation properties",
          "Provide UV reflectivity measurements",
        ],
        achievements: ["Continuous Earth monitoring from L1 Lagrange Point"],
        instruments: ["Earth Polychromatic Imaging Camera"],
        imageUrl: "/assets/missions/epic.jpg",
        details: {
          spacecraft: "DSCOVR",
          orbit: "L1 Lagrange Point",
          distance_from_earth: "1.5 million km",
          latest_image_date: new Date().toISOString(),
        },
      };

      // Cache the static data for 1 hour to avoid repeated API calls
      setCache(cacheKey, [staticEPICMission], 60 * 60 * 1000);
      return transformMissionData([staticEPICMission]);
    }
  },

  /**
   * Get NASA TechPort missions (technology transfer projects)
   */
  async getTechPortMissions(limit = 20) {
    try {
      const cacheKey = `techport-${limit}`;
      const cached = getCache(cacheKey);
      if (cached) return transformMissionData(cached);

      console.log("🔬 Fetching NASA TechPort technology projects...");

      // First get list of projects
      const listUrl = `${NASA_TECHPORT_API}/projects?api_key=${NASA_API_KEY}`;
      const listResponse = await getWithCorsFallback(listUrl, 2, 30000);
      const projects = listResponse.data?.projects || [];

      // Get detailed info for first few projects
      const missions = [];
      const projectsToFetch = projects.slice(0, Math.min(limit, 10));

      for (const project of projectsToFetch) {
        try {
          const detailUrl = `${NASA_TECHPORT_API}/projects/${project.projectId}?api_key=${NASA_API_KEY}`;
          const detailResponse = await getWithCorsFallback(detailUrl, 1, 15000);
          const detail = detailResponse.data?.project;

          if (detail) {
            missions.push({
              id: `techport-${detail.projectId}`,
              name: detail.title,
              type: "Technology Development",
              status: detail.status?.description || "Active",
              launchYear: new Date(
                detail.startDateString || detail.lastUpdated
              ).getFullYear(),
              launchDate: detail.startDateString || detail.lastUpdated,
              agency: "NASA",
              description:
                detail.description || "Advanced technology development project",
              objectives: detail.benefits ? [detail.benefits] : [],
              achievements: [],
              instruments: detail.technologyAreas?.map((ta) => ta.name) || [],
              imageUrl: "/assets/missions/techport.jpg",
              details: {
                projectId: detail.projectId,
                budget: detail.budget,
                workLocations: detail.workLocations,
                programDirectors: detail.programDirectors,
                principalInvestigators: detail.principalInvestigators,
              },
            });
          }

          await sleep(500); // Rate limiting
        } catch (err) {
          console.warn(
            `Failed to fetch TechPort project ${project.projectId}:`,
            err.message
          );
        }
      }

      setCache(cacheKey, missions, TTL.techport);
      return transformMissionData(missions);
    } catch (error) {
      console.warn(
        "⚠️ Error fetching TechPort missions:",
        error?.message || error
      );
      return [];
    }
  },

  /**
   * Get Near Earth Objects as space missions
   */
  async getNEOMissions(limit = 15) {
    try {
      const cacheKey = `neo-${limit}`;
      const cached = getCache(cacheKey);
      if (cached) return transformMissionData(cached);

      console.log("☄️ Fetching Near Earth Objects data...");

      const today = new Date().toISOString().split("T")[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      const neoUrl = `${NASA_NEO_API}/feed?start_date=${today}&end_date=${nextWeek}&api_key=${NASA_API_KEY}`;
      const response = await getWithCorsFallback(neoUrl, 2, 30000);
      const neoData = response.data;

      const missions = [];
      const nearEarthObjects = neoData?.near_earth_objects || {};

      // Flatten all NEOs from all dates
      const allNEOs = [];
      Object.values(nearEarthObjects).forEach((dateNEOs) => {
        allNEOs.push(...dateNEOs.slice(0, 3)); // Limit per date
      });

      allNEOs.slice(0, limit).forEach((neo, index) => {
        const closeApproach = neo.close_approach_data?.[0];
        missions.push({
          id: `neo-${neo.id}`,
          name: `NEO: ${neo.name}`,
          type: "Near Earth Object Tracking",
          status: neo.is_potentially_hazardous_asteroid
            ? "Potentially Hazardous"
            : "Monitored",
          launchYear:
            new Date(closeApproach?.close_approach_date).getFullYear() ||
            new Date().getFullYear(),
          launchDate:
            closeApproach?.close_approach_date || new Date().toISOString(),
          agency: "NASA/JPL",
          description: `Near Earth Object ${neo.name}. ${
            neo.is_potentially_hazardous_asteroid
              ? "Classified as potentially hazardous."
              : "Safe trajectory confirmed."
          }`,
          objectives: [
            "Monitor asteroid trajectory",
            "Assess impact risk",
            "Study composition and structure",
          ],
          achievements: [
            `Diameter: ${neo.estimated_diameter?.meters?.estimated_diameter_min?.toFixed(
              0
            )}-${neo.estimated_diameter?.meters?.estimated_diameter_max?.toFixed(
              0
            )} meters`,
          ],
          instruments: ["Ground-based telescopes", "Radar tracking"],
          imageUrl: "/assets/missions/asteroid.jpg",
          details: {
            neo_reference_id: neo.neo_reference_id,
            absolute_magnitude: neo.absolute_magnitude_h,
            estimated_diameter: neo.estimated_diameter,
            is_potentially_hazardous: neo.is_potentially_hazardous_asteroid,
            close_approach_date: closeApproach?.close_approach_date,
            miss_distance: closeApproach?.miss_distance,
            relative_velocity: closeApproach?.relative_velocity,
          },
        });
      });

      setCache(cacheKey, missions, TTL.neo);
      return transformMissionData(missions);
    } catch (error) {
      console.warn("⚠️ Error fetching NEO missions:", error?.message || error);
      return [];
    }
  },

  /**
   * Get comprehensive static missions when network is unavailable
   */
  getStaticMissions() {
    console.log("📦 Loading comprehensive static mission data");

    const staticMissions = [
      {
        id: "jwst",
        name: "James Webb Space Telescope",
        type: "Space Telescope",
        status: "Active",
        launchYear: 2021,
        agency: "NASA/ESA/CSA",
        description:
          "The most powerful space telescope ever built, designed to study the universe in infrared light.",
        objectives: [
          "Study the formation of stars and planets",
          "Investigate the origins of galaxies",
          "Search for signs of life on exoplanets",
        ],
        achievements: [
          "First deep field image",
          "Atmospheric analysis of exoplanets",
          "Detailed study of star formation",
        ],
        instruments: ["NIRCam", "NIRSpec", "MIRI", "FGS/NIRISS"],
        imageUrl: "/assets/missions/jwst.jpg",
        details: {
          mirror_diameter: "6.5 meters",
          orbit: "L2 Lagrange Point",
          wavelength_range: "0.6-28.5 micrometers",
        },
      },
      {
        id: "hubble",
        name: "Hubble Space Telescope",
        type: "Space Telescope",
        status: "Active",
        launchYear: 1990,
        agency: "NASA/ESA",
        description:
          "A space telescope that has revolutionized our understanding of the universe.",
        objectives: [
          "Study the universe in visible, ultraviolet, and near-infrared light",
          "Investigate cosmic phenomena",
          "Support planetary science missions",
        ],
        achievements: [
          "Over 1.5 million observations",
          "Determined the age of the universe",
          "Discovered dark energy",
        ],
        instruments: ["WFC3", "ACS", "STIS", "COS", "NICMOS"],
        imageUrl: "/assets/missions/hubble.jpg",
        details: {
          mirror_diameter: "2.4 meters",
          orbit: "Low Earth Orbit",
          altitude: "547 km",
        },
      },
      {
        id: "perseverance",
        name: "Mars 2020 Perseverance Rover",
        type: "Mars Rover",
        status: "Active",
        launchYear: 2020,
        agency: "NASA",
        description:
          "The most advanced Mars rover, designed to search for signs of ancient life and collect samples.",
        objectives: [
          "Search for signs of ancient microbial life",
          "Collect and cache Martian rock and soil samples",
          "Test technologies for future human exploration",
        ],
        achievements: [
          "First powered flight on another planet (Ingenuity helicopter)",
          "Collected multiple rock samples",
          "Analyzed Martian atmosphere",
        ],
        instruments: ["SuperCam", "PIXL", "SHERLOC", "MOXIE", "MEDA"],
        imageUrl: "/assets/missions/perseverance.jpg",
        details: {
          landing_site: "Jezero Crater",
          mission_duration: "At least one Mars year (687 Earth days)",
          sample_tubes: "43",
        },
      },
      {
        id: "curiosity",
        name: "Mars Science Laboratory Curiosity",
        type: "Mars Rover",
        status: "Active",
        launchYear: 2011,
        agency: "NASA",
        description:
          "A car-sized rover designed to explore Gale Crater and assess Mars' habitability.",
        objectives: [
          "Determine if Mars could have supported life",
          "Study the Martian climate and geology",
          "Prepare for human exploration",
        ],
        achievements: [
          "Discovered evidence of ancient freshwater lake",
          "Detected organic molecules",
          "Measured radiation levels",
        ],
        instruments: ["ChemCam", "SAM", "CheMin", "Mastcam", "MAHLI"],
        imageUrl: "/assets/missions/curiosity.jpg",
        details: {
          landing_site: "Gale Crater",
          mission_duration: "Extended indefinitely",
          distance_traveled: "Over 30 km",
        },
      },
      {
        id: "artemis-1",
        name: "Artemis I",
        type: "Lunar Mission",
        status: "Completed",
        launchYear: 2022,
        agency: "NASA",
        description:
          "The first integrated test of NASA's deep space exploration systems.",
        objectives: [
          "Test the Space Launch System (SLS) rocket",
          "Validate the Orion spacecraft",
          "Prepare for human lunar missions",
        ],
        achievements: [
          "Successful uncrewed flight around the Moon",
          "Validated deep space navigation",
          "Tested heat shield performance",
        ],
        instruments: ["Orion spacecraft", "SLS rocket", "Ground systems"],
        imageUrl: "/assets/missions/artemis1.jpg",
        details: {
          mission_duration: "25.5 days",
          distance_traveled: "1.4 million miles",
          orbit: "Distant retrograde orbit around Moon",
        },
      },
      {
        id: "dart",
        name: "DART (Double Asteroid Redirection Test)",
        type: "Planetary Defense",
        status: "Completed",
        launchYear: 2021,
        agency: "NASA",
        description:
          "The first mission to test asteroid deflection technology.",
        objectives: [
          "Test kinetic impactor technology",
          "Measure asteroid deflection",
          "Validate planetary defense techniques",
        ],
        achievements: [
          "Successfully impacted asteroid Dimorphos",
          "Changed asteroid's orbit by 32 minutes",
          "Demonstrated planetary defense capability",
        ],
        instruments: ["DRACO camera", "NEXT-C ion engine", "LICIACube"],
        imageUrl: "/assets/missions/dart.jpg",
        details: {
          target: "Asteroid Dimorphos",
          impact_velocity: "6.6 km/s",
          deflection_achieved: "32 minutes",
        },
      },
      {
        id: "osiris-rex",
        name: "OSIRIS-REx",
        type: "Asteroid Sample Return",
        status: "Active",
        launchYear: 2016,
        agency: "NASA",
        description:
          "Asteroid sample return mission to study the origins of our solar system.",
        objectives: [
          "Collect samples from asteroid Bennu",
          "Study asteroid composition and structure",
          "Return samples to Earth for analysis",
        ],
        achievements: [
          "Successfully collected 250g of asteroid material",
          "Mapped asteroid surface in detail",
          "Identified potential sample sites",
        ],
        instruments: ["TAGSAM", "OCAMS", "OTES", "OVIRS", "OLA"],
        imageUrl: "/assets/missions/osiris-rex.jpg",
        details: {
          target_asteroid: "Bennu",
          sample_mass: "250 grams",
          return_date: "2023",
        },
      },
      {
        id: "juno",
        name: "Juno",
        type: "Planetary Mission",
        status: "Active",
        launchYear: 2011,
        agency: "NASA",
        description:
          "Mission to study Jupiter's composition, gravity field, and magnetic field.",
        objectives: [
          "Determine Jupiter's water content",
          "Study atmospheric composition",
          "Investigate magnetic field structure",
        ],
        achievements: [
          "Revealed Jupiter's complex atmospheric dynamics",
          "Discovered new details about the Great Red Spot",
          "Mapped Jupiter's magnetic field",
        ],
        instruments: ["JIRAM", "JADE", "JEDI", "MWR", "Gravity Science"],
        imageUrl: "/assets/missions/juno.jpg",
        details: {
          orbit: "Polar orbit around Jupiter",
          mission_duration: "Extended to 2025",
          perijove_distance: "4,200 km",
        },
      },
      {
        id: "cassini",
        name: "Cassini-Huygens",
        type: "Planetary Mission",
        status: "Completed",
        launchYear: 1997,
        agency: "NASA/ESA/ASI",
        description:
          "Mission to study Saturn and its moons, including the Huygens probe to Titan.",
        objectives: [
          "Study Saturn's atmosphere and rings",
          "Investigate Saturn's moons",
          "Deploy Huygens probe to Titan",
        ],
        achievements: [
          "Discovered subsurface ocean on Enceladus",
          "Revealed Titan's methane lakes",
          "Studied Saturn's ring system",
        ],
        instruments: ["ISS", "VIMS", "CIRS", "MIMI", "RPWS"],
        imageUrl: "/assets/missions/cassini.jpg",
        details: {
          mission_duration: "20 years",
          orbits_completed: "294",
          grand_finale: "2017",
        },
      },
      {
        id: "new-horizons",
        name: "New Horizons",
        type: "Planetary Mission",
        status: "Active",
        launchYear: 2006,
        agency: "NASA",
        description: "Mission to study Pluto and the Kuiper Belt.",
        objectives: [
          "Study Pluto and its moons",
          "Investigate Kuiper Belt objects",
          "Explore the outer solar system",
        ],
        achievements: [
          "First close-up images of Pluto",
          "Discovered Pluto's complex geology",
          "Studied Kuiper Belt object Arrokoth",
        ],
        instruments: ["LORRI", "Ralph", "Alice", "REX", "SWAP", "PEPSSI"],
        imageUrl: "/assets/missions/new-horizons.jpg",
        details: {
          pluto_flyby: "2015",
          kuiper_belt_object: "Arrokoth (2019)",
          current_status: "Continuing Kuiper Belt exploration",
        },
      },
    ];

    return transformMissionData(staticMissions);
  },

  /**
   * Get all NASA missions (combining multiple sources)
   */
  async getAllMissions() {
    try {
      const allMissions = [];
      let hasNetworkConnectivity = true;

      // // Test network connectivity first with a simple endpoint
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
      //   hasNetworkConnectivity = false;
      // }

      // // If network test fails, immediately return static data
      // if (!hasNetworkConnectivity) {
      //   console.log(
      //     "🔄 Network unavailable, using comprehensive static mission data"
      //   );
      //   return this.getStaticMissions();
      // }

      // Additional safety check - if we get connection errors during API calls, fall back to static
      let apiCallFailed = false;

      if (NASA_API_KEY === "DEMO_KEY") {
        // With DEMO_KEY, avoid parallel calls and throttle requests to reduce 429s
        console.log(
          "🔄 Using DEMO_KEY - Sequential API calls with rate limiting"
        );
        try {
          const apod = await this.getAPOD(3);
          allMissions.push(...apod);
        } catch (e) {
          console.warn("APOD failed:", e?.message || e);
          if (
            e?.message?.includes("connect") ||
            e?.message?.includes("ECONNABORTED")
          ) {
            apiCallFailed = true;
          }
        }
        await sleep(1200);
        try {
          const rovers = await this.getMarsRoverMissions();
          allMissions.push(...rovers);
        } catch (e) {
          console.warn("Rovers failed:", e?.message || e);
          if (
            e?.message?.includes("connect") ||
            e?.message?.includes("ECONNABORTED")
          ) {
            apiCallFailed = true;
          }
        }
        await sleep(1200);
        try {
          const epic = await this.getEPICMission();
          allMissions.push(...epic);
        } catch (e) {
          console.warn("EPIC failed:", e?.message || e);
          if (
            e?.message?.includes("connect") ||
            e?.message?.includes("ECONNABORTED")
          ) {
            apiCallFailed = true;
          }
        }
        await sleep(1200);
        try {
          const neo = await this.getNEOMissions(5);
          allMissions.push(...neo);
        } catch (e) {
          console.warn("NEO failed:", e?.message || e);
          if (
            e?.message?.includes("connect") ||
            e?.message?.includes("ECONNABORTED")
          ) {
            apiCallFailed = true;
          }
        }
        await sleep(1200);
        try {
          const techport = await this.getTechPortMissions(3);
          allMissions.push(...techport);
        } catch (e) {
          console.warn("TechPort failed:", e?.message || e);
          if (
            e?.message?.includes("connect") ||
            e?.message?.includes("ECONNABORTED")
          ) {
            apiCallFailed = true;
          }
        }
      } else {
        // With a real API key, we can fetch in parallel for speed
        console.log(
          "🚀 Using NASA API Key - Parallel API calls for maximum data"
        );
        const results = await Promise.allSettled([
          this.getAPOD(15),
          this.getMarsRoverMissions(),
          this.getEPICMission(),
          this.getNEOMissions(10),
          this.getTechPortMissions(8),
        ]);

        results.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value) {
            allMissions.push(...result.value);
          } else if (result.status === "rejected") {
            console.warn(`Mission source ${index} failed:`, result.reason);
            if (
              result.reason?.message?.includes("connect") ||
              result.reason?.message?.includes("ECONNABORTED")
            ) {
              apiCallFailed = true;
            }
          }
        });
      }

      // If any API calls failed with connection errors, fall back to static data
      if (apiCallFailed) {
        console.log(
          "🔄 API connection errors detected, using comprehensive static mission data"
        );
        return this.getStaticMissions();
      }

      // Add some static important missions
      const staticMissions = [
        {
          id: "jwst",
          name: "James Webb Space Telescope",
          type: "Space Observatory",
          status: "Active",
          launchYear: 2021,
          agency: "NASA/ESA/CSA",
          cost: 10000000000,
          description:
            "The most powerful space telescope ever built, observing the universe in infrared.",
          objectives: [
            "Study the early universe",
            "Observe galaxy formation",
            "Study star and planet formation",
            "Search for signs of life",
          ],
          achievements: [
            "Deepest infrared images of universe",
            "Detected water on exoplanets",
            "Observed earliest galaxies",
          ],
          instruments: ["NIRCam", "NIRSpec", "MIRI", "FGS/NIRISS"],
          imageUrl: "/assets/missions/jwst.jpg",
        },
        {
          id: "artemis",
          name: "Artemis Program",
          type: "Lunar Exploration",
          status: "Active",
          launchYear: 2022,
          agency: "NASA",
          cost: 93000000000,
          description:
            "NASA's program to return humans to the Moon and establish sustainable lunar exploration.",
          objectives: [
            "Land the first woman on the Moon",
            "Establish sustainable lunar base",
            "Prepare for Mars missions",
            "Develop lunar economy",
          ],
          achievements: [
            "Artemis I successful uncrewed mission",
            "SLS rocket development complete",
            "Orion spacecraft tested",
          ],
          instruments: ["SLS", "Orion", "Gateway", "HLS"],
          imageUrl: "/assets/missions/artemis.jpg",
        },
        {
          id: "iss",
          name: "International Space Station",
          type: "Space Station",
          status: "Active",
          launchYear: 1998,
          agency: "NASA/Roscosmos/ESA/JAXA/CSA",
          cost: 150000000000,
          description:
            "Largest international scientific collaboration in space, serving as a microgravity laboratory.",
          objectives: [
            "Conduct scientific research",
            "Test technologies for deep space",
            "Foster international cooperation",
            "Study effects of spaceflight on humans",
          ],
          achievements: [
            "Continuous human presence since 2000",
            "Over 3,000 research investigations",
            "270+ spacewalks completed",
          ],
          instruments: [
            "Multiple research laboratories",
            "Robotic arms",
            "Solar arrays",
          ],
          imageUrl: "/assets/missions/iss.jpg",
        },
      ];

      allMissions.push(...transformMissionData(staticMissions));

      console.log(`📊 Fetched ${allMissions.length} NASA missions`);
      return allMissions;
    } catch (error) {
      console.error("❌ Error fetching all missions:", error);
      throw error;
    }
  },

  /**
   * Search missions by name or keyword
   */
  async searchMissions(keyword) {
    try {
      const allMissions = await this.getAllMissions();
      const searchTerm = keyword.toLowerCase();

      return allMissions.filter(
        (mission) =>
          mission.name.toLowerCase().includes(searchTerm) ||
          mission.description.toLowerCase().includes(searchTerm) ||
          mission.type.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error("❌ Error searching missions:", error);
      throw error;
    }
  },

  /**
   * Get mission statistics
   */
  async getMissionStatistics() {
    try {
      const missions = await this.getAllMissions();

      return {
        totalMissions: missions.length,
        activeMissions: missions.filter((m) => m.status === "Active").length,
        completedMissions: missions.filter(
          (m) => m.status === "Completed" || m.status === "Retired"
        ).length,
        totalCost: missions.reduce((sum, m) => sum + (m.cost || 0), 0),
        agencies: [...new Set(missions.map((m) => m.agency))],
        missionTypes: [...new Set(missions.map((m) => m.type))],
      };
    } catch (error) {
      console.error("❌ Error fetching mission statistics:", error);
      return {
        totalMissions: 0,
        activeMissions: 0,
        completedMissions: 0,
        totalCost: 0,
        agencies: [],
        missionTypes: [],
      };
    }
  },
};

export default nasaMissionsService;
export { transformMissionData };
