import axios from "axios";

/**
 * NASA Satellites and Space Objects API Service
 * Integrates NASA satellite tracking and space object data
 */

// NASA and tracking API endpoints
const NASA_NEO_API = "https://api.nasa.gov/neo/rest/v1";
const NASA_DONKI_API = "https://api.nasa.gov/DONKI";
const TLE_API = "https://tle.ivanstanojevic.me/api/tle";
const ISS_API = "http://api.open-notify.org/iss-now.json";
const CELESTRAK_API = "https://celestrak.org/NORAD/elements/gp.php";
const CORS_PROXY = "https://corsproxy.io/?url=";

// Demo API key (replace with your own for production)
const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";

/**
 * Transform satellite data to match app format
 */
const transformSatelliteData = (satellites) => {
  return satellites.map((sat, index) => ({
    id: sat.id || `satellite-${index}`,
    name: sat.name || "Unknown Satellite",
    type: sat.type || "Satellite",
    status: sat.status || "Active",
    launchYear: sat.launch_year || new Date().getFullYear(),
    agency: sat.agency || "NASA",
    altitude: sat.altitude || 0,
    orbitalPeriod: sat.orbital_period || 0,
    purpose: sat.purpose || "Scientific Research",
    description: sat.description || "",
    applications: sat.applications || [],
    specifications: sat.specifications || {},
    sensors: sat.sensors || [],
    imageUrl: sat.image_url || "/assets/satellites/default.jpg",
    position: sat.position || { latitude: 0, longitude: 0, altitude: 0 },
  }));
};

/**
 * NASA Satellites Service
 */
const nasaSatellitesService = {
  /**
   * Get Near Earth Objects (asteroids, comets)
   */
  async getNEOs(limit = 20) {
    try {
      const today = new Date().toISOString().split("T")[0];
      const url = `${CORS_PROXY}${encodeURIComponent(
        `${NASA_NEO_API}/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
      )}`;

      const response = await axios.get(url, { timeout: 30000 });
      const neoData = response.data;

      const satellites = [];
      const nearEarthObjects = neoData.near_earth_objects[today] || [];

      nearEarthObjects.slice(0, limit).forEach((neo, index) => {
        const closeApproach = neo.close_approach_data[0] || {};

        satellites.push({
          id: `neo-${neo.id}`,
          name: neo.name,
          type: "Near Earth Object",
          status: neo.is_potentially_hazardous_asteroid
            ? "Potentially Hazardous"
            : "Tracked",
          launchYear: new Date(
            closeApproach.close_approach_date || today
          ).getFullYear(),
          agency: "NASA NEO Program",
          altitude: parseFloat(closeApproach.miss_distance?.kilometers || 0),
          orbitalPeriod: neo.orbital_data?.orbital_period || 0,
          purpose: "Asteroid/Comet Tracking",
          description: `Near Earth Object with estimated diameter between ${neo.estimated_diameter?.meters?.estimated_diameter_min?.toFixed(
            2
          )} and ${neo.estimated_diameter?.meters?.estimated_diameter_max?.toFixed(
            2
          )} meters`,
          applications: ["Planetary Defense", "Scientific Study"],
          specifications: {
            absolute_magnitude: neo.absolute_magnitude_h,
            estimated_diameter_min:
              neo.estimated_diameter?.meters?.estimated_diameter_min,
            estimated_diameter_max:
              neo.estimated_diameter?.meters?.estimated_diameter_max,
            velocity: closeApproach.relative_velocity?.kilometers_per_hour,
            miss_distance_km: closeApproach.miss_distance?.kilometers,
          },
          sensors: [],
          imageUrl: "/assets/satellites/asteroid.jpg",
          position: {
            latitude: 0,
            longitude: 0,
            altitude: parseFloat(closeApproach.miss_distance?.kilometers || 0),
          },
        });
      });

      return transformSatelliteData(satellites);
    } catch (error) {
      console.error("❌ Error fetching NEOs:", error);
      throw error;
    }
  },

  /**
   * Get space weather events and satellites monitoring them
   * Optimized to fetch only recent data for better performance
   */
  async getSpaceWeatherSatellites() {
    // Static satellite definitions (used as base and fallback)
    const satellites = [
      {
        id: "soho",
        name: "SOHO (Solar and Heliospheric Observatory)",
        type: "Solar Observatory",
        status: "Active",
        launchYear: 1995,
        agency: "NASA/ESA",
        altitude: 1500000, // L1 point
        orbitalPeriod: 365,
        purpose: "Solar observation and space weather monitoring",
        description:
          "Monitors the Sun and solar wind for space weather prediction",
        applications: [
          "Solar monitoring",
          "Space weather forecasting",
          "CME detection",
        ],
        specifications: {
          orbit: "L1 Lagrange Point",
          instruments: 12,
          data_rate: "200 kbps",
          power: "1350 watts",
        },
        sensors: ["EIT", "LASCO", "MDI", "SWAN"],
        imageUrl: "/assets/satellites/soho.jpg",
        position: {
          latitude: 0,
          longitude: 0,
          altitude: 1500000,
        },
      },
      {
        id: "sdo",
        name: "SDO (Solar Dynamics Observatory)",
        type: "Solar Observatory",
        status: "Active",
        launchYear: 2010,
        agency: "NASA",
        altitude: 35786, // Geosynchronous
        orbitalPeriod: 1436,
        purpose: "High-resolution solar imaging",
        description: "Studies solar magnetic field and its influence on Earth",
        applications: [
          "Solar flare prediction",
          "Magnetic field study",
          "Space weather",
        ],
        specifications: {
          orbit: "Geosynchronous",
          resolution: "0.6 arcsec",
          data_volume: "1.5 TB per day",
          instruments: 3,
        },
        sensors: ["AIA", "EVE", "HMI"],
        imageUrl: "/assets/satellites/sdo.jpg",
        position: {
          latitude: 0,
          longitude: -102,
          altitude: 35786,
        },
      },
      {
        id: "parker-solar-probe",
        name: "Parker Solar Probe",
        type: "Solar Probe",
        status: "Active",
        launchYear: 2018,
        agency: "NASA",
        altitude: 6900000, // Closest approach to Sun
        orbitalPeriod: 88,
        purpose: "Close solar observation",
        description: "First spacecraft to 'touch' the Sun's corona",
        applications: [
          "Corona study",
          "Solar wind origins",
          "Magnetic field research",
        ],
        specifications: {
          closest_approach: "6.9 million km from Sun",
          max_speed: "700,000 km/h",
          heat_shield_temp: "1,377°C",
          mission_duration: "7 years",
        },
        sensors: ["FIELDS", "WISPR", "ISʘIS", "SWEAP"],
        imageUrl: "/assets/satellites/parker.jpg",
        position: {
          latitude: 0,
          longitude: 0,
          altitude: 6900000,
        },
      },
    ];

    // Try to fetch real-time space weather data
    try {
      // Use last 30 days instead of whole year to avoid timeout
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      // Try direct API first (faster if CORS is allowed)
      const directUrl = `${NASA_DONKI_API}/CME?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_KEY}`;

      console.log("🌞 Fetching space weather data from NASA DONKI API...");

      let response;
      try {
        // Try direct first with shorter timeout
        response = await axios.get(directUrl, { timeout: 15000 });
      } catch (directError) {
        // If direct fails, try CORS proxy with longer timeout
        console.warn("Direct API failed, trying CORS proxy...");
        const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(directUrl)}`;
        response = await axios.get(proxiedUrl, { timeout: 45000 });
      }

      const events = response.data.slice(0, 5); // Get recent events

      if (events && events.length > 0) {
        satellites[0].specifications.recent_cme_events = events.length;
        satellites[0].description += ` Recently detected ${events.length} CME events in the last 30 days.`;
        console.log(
          `✅ Successfully fetched ${events.length} space weather events`
        );
      } else {
        console.log("ℹ️ No recent space weather events found");
      }

      return transformSatelliteData(satellites);
    } catch (error) {
      console.warn(
        "⚠️ Space weather API failed, using static data:",
        error?.message || error
      );
      // Return static data as fallback
      return transformSatelliteData(satellites);
    }
  },

  /**
   * Get ISS and other space stations
   */
  async getSpaceStations() {
    try {
      // Get ISS current position
      const issUrl = "http://api.open-notify.org/iss-now.json";
      const response = await axios.get(
        `${CORS_PROXY}${encodeURIComponent(issUrl)}`,
        {
          timeout: 10000,
        }
      );

      const issPosition = response.data.iss_position || {};

      const stations = [
        {
          id: "iss",
          name: "International Space Station",
          type: "Space Station",
          status: "Active",
          launchYear: 1998,
          agency: "NASA/Roscosmos/ESA/JAXA/CSA",
          altitude: 408,
          orbitalPeriod: 92.5,
          purpose: "Scientific research and international cooperation",
          description:
            "Largest human-made structure in space, continuously inhabited since 2000",
          applications: [
            "Microgravity research",
            "Technology demonstration",
            "Earth observation",
            "Astronomy",
          ],
          specifications: {
            mass: "450,000 kg",
            volume: "916 cubic meters",
            speed: "27,724 km/h",
            crew_capacity: 7,
            solar_array_area: "2,500 m²",
            laboratories: 6,
          },
          sensors: [
            "Earth observation cameras",
            "Radiation monitors",
            "Scientific instruments",
          ],
          imageUrl: "/assets/satellites/iss.jpg",
          position: {
            latitude: parseFloat(issPosition.latitude || 0),
            longitude: parseFloat(issPosition.longitude || 0),
            altitude: 408,
          },
        },
        {
          id: "tiangong",
          name: "Tiangong Space Station",
          type: "Space Station",
          status: "Active",
          launchYear: 2021,
          agency: "CNSA",
          altitude: 389,
          orbitalPeriod: 92,
          purpose: "Scientific research",
          description:
            "Chinese space station for scientific experiments and technology development",
          applications: [
            "Scientific research",
            "Technology testing",
            "Space medicine",
          ],
          specifications: {
            mass: "100,000 kg",
            modules: 3,
            crew_capacity: 3,
            design_life: "15 years",
          },
          sensors: ["Scientific instruments", "Earth observation equipment"],
          imageUrl: "/assets/satellites/tiangong.jpg",
          position: {
            latitude: 0,
            longitude: 120,
            altitude: 389,
          },
        },
      ];

      return transformSatelliteData(stations);
    } catch (error) {
      console.error("❌ Error fetching space stations:", error);
      // Return static ISS data if API fails
      return transformSatelliteData([
        {
          id: "iss",
          name: "International Space Station",
          type: "Space Station",
          status: "Active",
          launchYear: 1998,
          agency: "NASA/Roscosmos/ESA/JAXA/CSA",
          altitude: 408,
          orbitalPeriod: 92.5,
          purpose: "Scientific research",
          description: "International Space Station",
          applications: ["Research", "Technology", "Education"],
          specifications: {},
          sensors: [],
          imageUrl: "/assets/satellites/iss.jpg",
          position: { latitude: 0, longitude: 0, altitude: 408 },
        },
      ]);
    }
  },

  /**
   * Get Earth observation satellites
   */
  async getEarthObservationSatellites() {
    const satellites = [
      {
        id: "landsat-9",
        name: "Landsat 9",
        type: "Earth Observation",
        status: "Active",
        launchYear: 2021,
        agency: "NASA/USGS",
        altitude: 705,
        orbitalPeriod: 99,
        purpose: "Earth observation and land monitoring",
        description:
          "Latest in the Landsat series for continuous Earth observation",
        applications: [
          "Agriculture",
          "Forest management",
          "Water resources",
          "Climate research",
        ],
        specifications: {
          resolution: "30 meters",
          swath_width: "185 km",
          revisit_time: "16 days",
          spectral_bands: 11,
        },
        sensors: ["OLI-2", "TIRS-2"],
        imageUrl: "/assets/satellites/landsat.jpg",
        position: { latitude: 0, longitude: -75, altitude: 705 },
      },
      {
        id: "terra",
        name: "Terra",
        type: "Earth Observation",
        status: "Active",
        launchYear: 1999,
        agency: "NASA",
        altitude: 705,
        orbitalPeriod: 99,
        purpose: "Climate and environmental monitoring",
        description:
          "Flagship Earth observation satellite studying land, ocean, and atmosphere",
        applications: [
          "Climate monitoring",
          "Natural disasters",
          "Air quality",
          "Ocean color",
        ],
        specifications: {
          instruments: 5,
          data_rate: "18.5 Mbps",
          design_life: "6 years",
          actual_life: "25+ years",
        },
        sensors: ["MODIS", "ASTER", "CERES", "MISR", "MOPITT"],
        imageUrl: "/assets/satellites/terra.jpg",
        position: { latitude: 40, longitude: -100, altitude: 705 },
      },
      {
        id: "aqua",
        name: "Aqua",
        type: "Earth Observation",
        status: "Active",
        launchYear: 2002,
        agency: "NASA",
        altitude: 705,
        orbitalPeriod: 99,
        purpose: "Water cycle observation",
        description:
          "Studies Earth's water cycle including evaporation from oceans",
        applications: [
          "Water cycle",
          "Weather forecasting",
          "Climate research",
        ],
        specifications: {
          instruments: 6,
          crossing_time: "1:30 PM",
          data_products: 89,
          global_coverage: "Every 1-2 days",
        },
        sensors: ["MODIS", "AIRS", "AMSU", "CERES", "AMSR-E"],
        imageUrl: "/assets/satellites/aqua.jpg",
        position: { latitude: -20, longitude: 30, altitude: 705 },
      },
    ];

    return transformSatelliteData(satellites);
  },

  /**
   * Get comprehensive static satellites when network is unavailable
   */
  getStaticSatellites() {
    console.log("📦 Loading comprehensive static satellite data");

    const staticSatellites = [
      {
        id: "iss",
        name: "International Space Station (ISS)",
        type: "Space Station",
        status: "Active",
        launchYear: 1998,
        agency: "NASA/ESA/Roscosmos/JAXA",
        altitude: 408,
        orbitalPeriod: 92.68,
        purpose: "Human spaceflight and research",
        description:
          "The International Space Station is a modular space station in low Earth orbit.",
        applications: [
          "Scientific research",
          "Technology demonstration",
          "International cooperation",
          "Human spaceflight",
        ],
        specifications: {
          orbit: "Low Earth Orbit",
          crew_capacity: 7,
          mass: "420,000 kg",
          solar_array_wingspan: "73 meters",
          pressurized_volume: "915 cubic meters",
        },
        sensors: [
          "Earth observation cameras",
          "Research equipment",
          "Docking systems",
          "Life support systems",
        ],
        imageUrl: "/assets/satellites/iss.jpg",
        position: {
          latitude: 0,
          longitude: 0,
          altitude: 408,
        },
      },
      {
        id: "hubble",
        name: "Hubble Space Telescope",
        type: "Space Telescope",
        status: "Active",
        launchYear: 1990,
        agency: "NASA/ESA",
        altitude: 547,
        orbitalPeriod: 95.4,
        purpose: "Astronomical observations",
        description:
          "A space telescope that has revolutionized our understanding of the universe.",
        applications: [
          "Deep space observations",
          "Planetary studies",
          "Cosmology research",
          "Star formation studies",
        ],
        specifications: {
          orbit: "Low Earth Orbit",
          mirror_diameter: "2.4 meters",
          wavelength_range: "115-2500 nm",
          mass: "11,110 kg",
        },
        sensors: ["WFC3", "ACS", "STIS", "COS", "NICMOS"],
        imageUrl: "/assets/satellites/hubble.jpg",
        position: {
          latitude: 0,
          longitude: 0,
          altitude: 547,
        },
      },
      {
        id: "landsat-9",
        name: "Landsat 9",
        type: "Earth Observation",
        status: "Active",
        launchYear: 2021,
        agency: "NASA/USGS",
        altitude: 705,
        orbitalPeriod: 99,
        purpose: "Land surface imaging",
        description:
          "Landsat 9 continues the Landsat program's 40+ year record of Earth observation.",
        applications: [
          "Land use mapping",
          "Forest monitoring",
          "Urban planning",
          "Climate research",
        ],
        specifications: {
          orbit: "Sun-synchronous",
          swath_width: "185 km",
          revisit_time: "16 days",
          spatial_resolution: "15-100 meters",
        },
        sensors: ["OLI-2", "TIRS-2"],
        imageUrl: "/assets/satellites/landsat9.jpg",
        position: {
          latitude: 0,
          longitude: 0,
          altitude: 705,
        },
      },
      {
        id: "soho",
        name: "SOHO (Solar and Heliospheric Observatory)",
        type: "Solar Observatory",
        status: "Active",
        launchYear: 1995,
        agency: "NASA/ESA",
        altitude: 1500000,
        orbitalPeriod: 365,
        purpose: "Solar observation and space weather monitoring",
        description:
          "Monitors the Sun and solar wind for space weather prediction",
        applications: [
          "Solar monitoring",
          "Space weather forecasting",
          "CME detection",
        ],
        specifications: {
          orbit: "L1 Lagrange Point",
          instruments: 12,
          data_rate: "200 kbps",
          power: "1350 watts",
        },
        sensors: ["EIT", "LASCO", "MDI", "SWAN"],
        imageUrl: "/assets/satellites/soho.jpg",
        position: {
          latitude: 0,
          longitude: 0,
          altitude: 1500000,
        },
      },
      {
        id: "sdo",
        name: "SDO (Solar Dynamics Observatory)",
        type: "Solar Observatory",
        status: "Active",
        launchYear: 2010,
        agency: "NASA",
        altitude: 35786,
        orbitalPeriod: 1436,
        purpose: "High-resolution solar imaging",
        description: "Studies solar magnetic field and its influence on Earth",
        applications: [
          "Solar flare prediction",
          "Magnetic field study",
          "Space weather",
        ],
        specifications: {
          orbit: "Geosynchronous",
          resolution: "0.6 arcsec",
          data_volume: "1.5 TB per day",
          instruments: 3,
        },
        sensors: ["AIA", "EVE", "HMI"],
        imageUrl: "/assets/satellites/sdo.jpg",
        position: {
          latitude: 0,
          longitude: -102,
          altitude: 35786,
        },
      },
      {
        id: "parker-solar-probe",
        name: "Parker Solar Probe",
        type: "Solar Probe",
        status: "Active",
        launchYear: 2018,
        agency: "NASA",
        altitude: 6900000,
        orbitalPeriod: 88,
        purpose: "Close solar observation",
        description: "First spacecraft to 'touch' the Sun's corona",
        applications: [
          "Corona study",
          "Solar wind origins",
          "Magnetic field research",
        ],
        specifications: {
          closest_approach: "6.9 million km from Sun",
          max_speed: "700,000 km/h",
          heat_shield_temp: "1,377°C",
          mission_duration: "7 years",
        },
        sensors: ["FIELDS", "WISPR", "ISʘIS", "SWEAP"],
        imageUrl: "/assets/satellites/parker.jpg",
        position: {
          latitude: 0,
          longitude: 0,
          altitude: 6900000,
        },
      },
    ];

    return staticSatellites;
  },

  /**
   * Get all satellites (combining multiple sources)
   */
  async getAllSatellites() {
    try {
      // // Test network connectivity first with a simple endpoint
      // let hasNetworkConnectivity = true;
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

      // if (!hasNetworkConnectivity) {
      //   console.log(
      //     "🔄 Network unavailable, using comprehensive static satellite data"
      //   );
      //   return this.getStaticSatellites();
      // }

      const results = await Promise.allSettled([
        this.getNEOs(10),
        this.getSpaceWeatherSatellites(),
        this.getSpaceStations(),
        this.getEarthObservationSatellites(),
      ]);

      const allSatellites = [];

      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value) {
          allSatellites.push(...result.value);
        } else if (result.status === "rejected") {
          console.warn(`Satellite source ${index} failed:`, result.reason);
        }
      });

      console.log(
        `📊 Fetched ${allSatellites.length} satellites and space objects`
      );
      return allSatellites;
    } catch (error) {
      console.error("❌ Error fetching all satellites:", error);
      // Return static data as fallback
      return this.getStaticSatellites();
    }
  },

  /**
   * Search satellites by name or type
   */
  async searchSatellites(keyword) {
    try {
      const allSatellites = await this.getAllSatellites();
      const searchTerm = keyword.toLowerCase();

      return allSatellites.filter(
        (sat) =>
          sat.name.toLowerCase().includes(searchTerm) ||
          sat.type.toLowerCase().includes(searchTerm) ||
          sat.purpose.toLowerCase().includes(searchTerm) ||
          sat.agency.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error("❌ Error searching satellites:", error);
      throw error;
    }
  },

  /**
   * Get satellite statistics
   */
  async getSatelliteStatistics() {
    try {
      const satellites = await this.getAllSatellites();

      return {
        totalSatellites: satellites.length,
        activeSatellites: satellites.filter((s) => s.status === "Active")
          .length,
        earthObservation: satellites.filter(
          (s) => s.type === "Earth Observation"
        ).length,
        spaceStations: satellites.filter((s) => s.type === "Space Station")
          .length,
        nearEarthObjects: satellites.filter(
          (s) => s.type === "Near Earth Object"
        ).length,
        averageAltitude: Math.round(
          satellites.reduce((sum, s) => sum + s.altitude, 0) / satellites.length
        ),
        agencies: [...new Set(satellites.map((s) => s.agency))],
      };
    } catch (error) {
      console.error("❌ Error fetching satellite statistics:", error);
      return {
        totalSatellites: 0,
        activeSatellites: 0,
        earthObservation: 0,
        spaceStations: 0,
        nearEarthObjects: 0,
        averageAltitude: 0,
        agencies: [],
      };
    }
  },
};

export default nasaSatellitesService;
export { transformSatelliteData };
