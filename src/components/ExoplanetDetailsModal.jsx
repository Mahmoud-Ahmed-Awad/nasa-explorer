import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@contexts/I18nContext";
import Icon from "./UI/Icon";

const ExoplanetDetailsModal = ({ exoplanet, onClose }) => {
  const { t } = useI18n();
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (exoplanet) {
      document.body.style.overflow = "hidden";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [exoplanet]);

  if (!exoplanet) return null;

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "Unknown";
    return typeof num === "number" ? num.toFixed(2) : num;
  };

  // Helper function to get planet type color
  const getTypeColor = (type) => {
    const colors = {
      Terrestrial: "text-green-400 bg-green-500/20",
      "Super-Earth": "text-blue-400 bg-blue-500/20",
      "Hot Jupiter": "text-red-400 bg-red-500/20",
      "Gas Giant": "text-purple-400 bg-purple-500/20",
      "Ice Giant": "text-cyan-400 bg-cyan-500/20",
      "Mini-Neptune": "text-indigo-400 bg-indigo-500/20",
    };
    return colors[type] || "text-gray-400 bg-gray-500/20";
  };

  // Helper function to get habitable zone indicator
  const getHabitableZoneInfo = (planet) => {
    if (planet.habitable) {
      return {
        status: "In Habitable Zone",
        color: "text-green-400 bg-green-500/20",
        icon: "🌱",
      };
    } else {
      return {
        status: "Outside Habitable Zone",
        color: "text-red-400 bg-red-500/20",
        icon: "snowflake",
      };
    }
  };

  const habitableInfo = getHabitableZoneInfo(exoplanet);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="sticky inset-0 bg-black/50 backdrop-blur-sm z-50 p-4 flex items-center justify-center w-full max-h-screen h-full"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            // margin: "auto",
            // transform: "translateY(0)",
          }}
        >
          {/* Header */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-t-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">
                  {exoplanet.habitable ? (
                    <Icon name="globe" size={20} />
                  ) : (
                    <Icon name="satellite" size={20} />
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white">
                  {exoplanet.name}
                </h1>
                <p className="text-slate-300 mt-2">
                  {exoplanet.type} Exoplanet
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Planet Overview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Planet Overview
                </h2>
                <div className="flex gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                      exoplanet.type
                    )}`}
                  >
                    {exoplanet.type}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${habitableInfo.color}`}
                  >
                    {habitableInfo.icon} {habitableInfo.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Mass</div>
                  <div className="text-white font-semibold text-lg">
                    {formatNumber(exoplanet.mass)} M⊕
                  </div>
                  <div className="text-slate-500 text-xs">Earth masses</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Radius</div>
                  <div className="text-white font-semibold text-lg">
                    {formatNumber(exoplanet.radius)} R⊕
                  </div>
                  <div className="text-slate-500 text-xs">Earth radii</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Distance</div>
                  <div className="text-white font-semibold text-lg">
                    {formatNumber(exoplanet.distance)} ly
                  </div>
                  <div className="text-slate-500 text-xs">Light years</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Temperature</div>
                  <div className="text-white font-semibold text-lg">
                    {formatNumber(exoplanet.temperature)} K
                  </div>
                  <div className="text-slate-500 text-xs">Kelvin</div>
                </div>
              </div>
            </div>

            {/* Physical Characteristics */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Physical Characteristics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400">Planet Type:</span>
                    <div className="text-white font-medium">
                      {exoplanet.type}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Mass:</span>
                    <div className="text-white font-medium">
                      {formatNumber(exoplanet.mass)} Earth masses
                      {exoplanet.mass && (
                        <span className="text-slate-500 ml-2">
                          ({exoplanet.mass > 1 ? "Heavier" : "Lighter"} than
                          Earth)
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Radius:</span>
                    <div className="text-white font-medium">
                      {formatNumber(exoplanet.radius)} Earth radii
                      {exoplanet.radius && (
                        <span className="text-slate-500 ml-2">
                          ({exoplanet.radius > 1 ? "Larger" : "Smaller"} than
                          Earth)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400">Surface Temperature:</span>
                    <div className="text-white font-medium">
                      {formatNumber(exoplanet.temperature)} K
                      {exoplanet.temperature && (
                        <span className="text-slate-500 ml-2">
                          ({Math.round(exoplanet.temperature - 273.15)}°C)
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Distance from Earth:</span>
                    <div className="text-white font-medium">
                      {formatNumber(exoplanet.distance)} light years
                      {exoplanet.distance && (
                        <span className="text-slate-500 ml-2">
                          ({Math.round((exoplanet.distance * 9.461e12) / 1e9)}{" "}
                          billion km)
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Discovery Method:</span>
                    <div className="text-white font-medium">
                      {exoplanet.discoveryMethod || "Transit Method"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Habitability Assessment */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Habitability Assessment
              </h2>
              <div className="bg-slate-700/50 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{habitableInfo.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {habitableInfo.status}
                    </h3>
                    <p className="text-slate-300">
                      {exoplanet.habitable
                        ? "This planet lies within the habitable zone of its star, where liquid water could potentially exist on the surface."
                        : "This planet is located outside the habitable zone, making it unlikely to support life as we know it."}
                    </p>
                  </div>
                </div>

                {exoplanet.habitable && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <Icon name="temperature" size={24} className="mb-2" />
                      <div className="text-sm text-slate-400">Temperature</div>
                      <div className="text-white font-medium">Suitable</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">💧</div>
                      <div className="text-sm text-slate-400">
                        Water Potential
                      </div>
                      <div className="text-white font-medium">Possible</div>
                    </div>
                    <div className="text-center">
                      <Icon name="globe" size={24} className="mb-2" />
                      <div className="text-sm text-slate-400">
                        Earth Similarity
                      </div>
                      <div className="text-white font-medium">High</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400">Discovery Year:</span>
                    <div className="text-white font-medium">
                      {exoplanet.discoveryYear || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Orbital Period:</span>
                    <div className="text-white font-medium">
                      {exoplanet.orbitalPeriod
                        ? `${exoplanet.orbitalPeriod} days`
                        : "Unknown"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Host Star:</span>
                    <div className="text-white font-medium">
                      {exoplanet.hostStar || "Unknown"}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400">Eccentricity:</span>
                    <div className="text-white font-medium">
                      {exoplanet.eccentricity
                        ? exoplanet.eccentricity.toFixed(3)
                        : "Unknown"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Inclination:</span>
                    <div className="text-white font-medium">
                      {exoplanet.inclination
                        ? `${exoplanet.inclination}°`
                        : "Unknown"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Semi-Major Axis:</span>
                    <div className="text-white font-medium">
                      {exoplanet.semiMajorAxis
                        ? `${exoplanet.semiMajorAxis} AU`
                        : "Unknown"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison with Earth */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Comparison with Earth
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Size Comparison
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mass Ratio:</span>
                      <span className="text-white font-medium">
                        {exoplanet.mass
                          ? `${formatNumber(exoplanet.mass)}x Earth`
                          : "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Radius Ratio:</span>
                      <span className="text-white font-medium">
                        {exoplanet.radius
                          ? `${formatNumber(exoplanet.radius)}x Earth`
                          : "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Volume:</span>
                      <span className="text-white font-medium">
                        {exoplanet.radius
                          ? `${formatNumber(
                              Math.pow(exoplanet.radius, 3)
                            )}x Earth`
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Environmental Comparison
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Temperature:</span>
                      <span className="text-white font-medium">
                        {exoplanet.temperature
                          ? `${Math.round(exoplanet.temperature - 273.15)}°C`
                          : "Unknown"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Habitable Zone:</span>
                      <span
                        className={`font-medium ${
                          exoplanet.habitable
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {exoplanet.habitable ? "Within Zone" : "Outside Zone"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Distance:</span>
                      <span className="text-white font-medium">
                        {exoplanet.distance
                          ? `${formatNumber(exoplanet.distance)} ly`
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() =>
                  navigate(`/exoplanets/${exoplanet.id || exoplanet.name}`)
                }
                className="btn-primary"
              >
                📄 View Full Details
              </button>

              <button
                onClick={() => {
                  // Copy planet info to clipboard
                  const planetInfo = `${exoplanet.name} - ${
                    exoplanet.type
                  } Exoplanet\nMass: ${exoplanet.mass} M⊕\nRadius: ${
                    exoplanet.radius
                  } R⊕\nDistance: ${exoplanet.distance} ly\nTemperature: ${
                    exoplanet.temperature
                  } K\nHabitable: ${exoplanet.habitable ? "Yes" : "No"}`;
                  navigator.clipboard.writeText(planetInfo);
                }}
                className="btn-secondary"
              >
                <Icon name="copy" size={16} className="mr-2" />
                Copy Info
              </button>

              <button
                onClick={() => {
                  // Share planet info
                  if (navigator.share) {
                    navigator.share({
                      title: `${exoplanet.name} Exoplanet Details`,
                      text: `Check out this ${exoplanet.type} exoplanet: ${exoplanet.name}`,
                      url: window.location.href,
                    });
                  }
                }}
                className="btn-secondary"
              >
                <Icon name="share" size={16} className="mr-2" />
                Share
              </button>

              <button
                onClick={() => {
                  // Open NASA Exoplanet Archive
                  window.open(
                    `https://exoplanetarchive.ipac.caltech.edu/`,
                    "_blank"
                  );
                }}
                className="btn-secondary"
              >
                <Icon name="satellite" size={16} className="mr-2" />
                NASA Archive
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExoplanetDetailsModal;
