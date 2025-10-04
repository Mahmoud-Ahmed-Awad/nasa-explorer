import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import Icon from "./UI/Icon";

const SatelliteDetailsModal = ({ satellite, onClose }) => {
  const { t } = useI18n();

  if (!satellite) return null;

  // Helper function to format numbers
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "Unknown";
    return typeof num === "number" ? num.toLocaleString() : num;
  };

  // Helper function to get satellite type color
  const getTypeColor = (type) => {
    const colors = {
      "Space Station": "text-green-400 bg-green-500/20",
      "Earth Observation": "text-red-400 bg-red-500/20",
      "Solar Observatory": "text-yellow-400 bg-yellow-500/20",
      "Space Telescope": "text-teal-400 bg-teal-500/20",
      "Near Earth Object": "text-pink-400 bg-pink-500/20",
      "Solar Probe": "text-orange-400 bg-orange-500/20",
    };
    return colors[type] || "text-gray-400 bg-gray-500/20";
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    const colors = {
      Active: "text-green-400 bg-green-500/20",
      "Potentially Hazardous": "text-red-400 bg-red-500/20",
      Tracked: "text-blue-400 bg-blue-500/20",
      Inactive: "text-gray-400 bg-gray-500/20",
    };
    return colors[status] || "text-gray-400 bg-gray-500/20";
  };

  // Helper function to get satellite icon
  const getSatelliteIcon = (type) => {
    const icons = {
      "Space Station": "spaceStation",
      "Earth Observation": "antenna",
      "Solar Observatory": "sun",
      "Space Telescope": "telescope",
      "Near Earth Object": "comet",
      "Solar Probe": "rocket",
    };
    return icons[type] || "satellite";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="sticky inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 w-full max-h-screen h-full"
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
            margin: "auto",
            transform: "translateY(0)",
          }}
        >
          {/* Header */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-t-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">
                  <Icon
                    name={getSatelliteIcon(satellite.type)}
                    size={80}
                    className="text-white"
                  />
                </div>
                <h1 className="text-3xl font-bold text-white">
                  {satellite.name}
                </h1>
                <p className="text-slate-300 mt-2">{satellite.type}</p>
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
            {/* Satellite Overview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Satellite Overview
                </h2>
                <div className="flex gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                      satellite.type
                    )}`}
                  >
                    {satellite.type}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      satellite.status
                    )}`}
                  >
                    {satellite.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Altitude</div>
                  <div className="text-white font-semibold text-lg">
                    {formatNumber(satellite.altitude)} km
                  </div>
                  <div className="text-slate-500 text-xs">Above Earth</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">
                    Orbital Period
                  </div>
                  <div className="text-white font-semibold text-lg">
                    {formatNumber(satellite.orbitalPeriod)} min
                  </div>
                  <div className="text-slate-500 text-xs">Revolution time</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Launch Year</div>
                  <div className="text-white font-semibold text-lg">
                    {satellite.launchYear || "Unknown"}
                  </div>
                  <div className="text-slate-500 text-xs">Mission start</div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-1">Agency</div>
                  <div className="text-white font-semibold text-lg">
                    {satellite.agency || "Unknown"}
                  </div>
                  <div className="text-slate-500 text-xs">Operating agency</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Mission Description
              </h2>
              <div className="bg-slate-700/50 rounded-lg p-6">
                <p className="text-slate-300 leading-relaxed text-lg">
                  {satellite.description ||
                    satellite.purpose ||
                    "No description available for this satellite."}
                </p>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Technical Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400">Satellite Type:</span>
                    <div className="text-white font-medium">
                      {satellite.type}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Operational Status:</span>
                    <div className="text-white font-medium">
                      {satellite.status}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Altitude:</span>
                    <div className="text-white font-medium">
                      {formatNumber(satellite.altitude)} km
                      {satellite.altitude && (
                        <span className="text-slate-500 ml-2">
                          (
                          {satellite.altitude > 1000
                            ? "High altitude"
                            : satellite.altitude > 500
                            ? "Medium altitude"
                            : "Low altitude"}
                          )
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Orbital Period:</span>
                    <div className="text-white font-medium">
                      {formatNumber(satellite.orbitalPeriod)} minutes
                      {satellite.orbitalPeriod && (
                        <span className="text-slate-500 ml-2">
                          ({Math.round(satellite.orbitalPeriod / 60)} hours)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400">Launch Year:</span>
                    <div className="text-white font-medium">
                      {satellite.launchYear || "Unknown"}
                      {satellite.launchYear && (
                        <span className="text-slate-500 ml-2">
                          ({new Date().getFullYear() - satellite.launchYear}{" "}
                          years ago)
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Operating Agency:</span>
                    <div className="text-white font-medium">
                      {satellite.agency || "Unknown"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Mission Purpose:</span>
                    <div className="text-white font-medium">
                      {satellite.purpose || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Current Position:</span>
                    <div className="text-white font-medium">
                      {satellite.position
                        ? `${satellite.position.latitude.toFixed(
                            2
                          )}°N, ${satellite.position.longitude.toFixed(2)}°E`
                        : "Position unknown"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications */}
            {satellite.applications && satellite.applications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Applications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {satellite.applications.map((application, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                        <span className="text-white font-medium">
                          {application}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sensors/Instruments */}
            {satellite.sensors && satellite.sensors.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Sensors & Instruments
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {satellite.sensors.map((sensor, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                        <span className="text-white font-medium">{sensor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            {satellite.specifications &&
              Object.keys(satellite.specifications).length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Detailed Specifications
                  </h2>
                  <div className="bg-slate-700/50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(satellite.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-slate-400 capitalize">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <span className="text-white font-medium">
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => {
                  // Copy satellite info to clipboard
                  const satelliteInfo = `${satellite.name} - ${satellite.type}\nStatus: ${satellite.status}\nAltitude: ${satellite.altitude} km\nOrbital Period: ${satellite.orbitalPeriod} min\nAgency: ${satellite.agency}\nLaunch Year: ${satellite.launchYear}`;
                  navigator.clipboard.writeText(satelliteInfo);
                }}
                className="btn-secondary"
              >
                <Icon name="copy" size={16} className="mr-2" />
                Copy Info
              </button>

              <button
                onClick={() => {
                  // Share satellite info
                  if (navigator.share) {
                    navigator.share({
                      title: `${satellite.name} Satellite Details`,
                      text: `Check out this ${satellite.type}: ${satellite.name}`,
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
                  // Open NASA satellite tracking
                  window.open(
                    `https://www.nasa.gov/mission_pages/satellites/`,
                    "_blank"
                  );
                }}
                className="btn-primary"
              >
                <Icon name="external" size={16} className="mr-2" />
                NASA Tracking
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SatelliteDetailsModal;
