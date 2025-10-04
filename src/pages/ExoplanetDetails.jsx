import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@contexts/I18nContext";
import { apiService } from "@services/api";
import LoadingSpinner from "@components/LoadingSpinner";
import ExoplanetCharts from "@components/ExoplanetCharts";
import Icon from "../components/UI/Icon";

const ExoplanetDetails = () => {
  const { planetId } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [selectedChart, setSelectedChart] = useState("overview");

  // Fetch all exoplanets to find the specific one
  const {
    data: exoplanetsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exoplanets", "all"],
    queryFn: () => apiService.getExoplanets({ limit: 2000 }),
    staleTime: 10 * 60 * 1000,
  });

  const exoplanets = exoplanetsResponse?.data || [];
  const exoplanet = exoplanets.find(
    (p) => p.id === planetId || p.name === planetId
  );

  // Helper functions
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "Unknown";
    return typeof num === "number" ? num.toFixed(2) : num;
  };

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

  const getHabitableZoneInfo = (planet) => {
    if (planet?.habitable) {
      return {
        status: "In Habitable Zone",
        color: "text-green-400 bg-green-500/20",
        icon: <Icon name="leaf" size={20} className="text-green-400" />,
      };
    } else {
      return {
        status: "Outside Habitable Zone",
        color: "text-red-400 bg-red-500/20",
        icon: <Icon name="snowflake" size={20} className="text-cyan-400" />,
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 py-20">
        <LoadingSpinner text="Loading exoplanet details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 text-xl mb-4">
            Failed to load exoplanet details
          </div>
          <p className="text-slate-400 mb-6">{error.message}</p>
          <button
            onClick={() => navigate("/exoplanets")}
            className="btn-primary"
          >
            Back to Exoplanets
          </button>
        </div>
      </div>
    );
  }

  if (!exoplanet) {
    return (
      <div className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 text-xl mb-4">Exoplanet not found</div>
          <p className="text-slate-400 mb-6">
            The exoplanet "{planetId}" could not be found in our database.
          </p>
          <button
            onClick={() => navigate("/exoplanets")}
            className="btn-primary"
          >
            Back to Exoplanets
          </button>
        </div>
      </div>
    );
  }

  const habitableInfo = getHabitableZoneInfo(exoplanet);

  return (
    <div className="min-h-screen bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <button
              onClick={() => navigate("/exoplanets")}
              className="mb-6 inline-flex items-center gap-2 text-neon-blue hover:text-neon-purple transition-colors duration-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Exoplanets
            </button>

            <div className="mb-6">
              <div className="text-8xl mb-4">
                {exoplanet.habitable ? (
                  <Icon name="globe" size={80} />
                ) : (
                  <Icon name="snowflake" size={80} className="text-cyan-400" />
                )}
              </div>
              <h1 className="text-5xl font-bold text-gradient font-space mb-4">
                {exoplanet.name}
              </h1>
              <p className="text-2xl text-slate-400">
                {exoplanet.type} Exoplanet
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-8">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(
                  exoplanet.type
                )}`}
              >
                {exoplanet.type}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${habitableInfo.color}`}
              >
                {typeof habitableInfo.icon === "string" ? (
                  <span className="mr-2">{habitableInfo.icon}</span>
                ) : (
                  <span className="mr-2">{habitableInfo.icon}</span>
                )}
                {habitableInfo.status}
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Planet Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                <Icon name="scale" size={24} className="mb-2" />
                <div className="text-slate-400 text-sm mb-1">Mass</div>
                <div className="text-white font-bold text-2xl">
                  {formatNumber(exoplanet.mass)} M⊕
                </div>
                <div className="text-slate-500 text-xs">Earth masses</div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                <Icon name="ruler" size={24} className="mb-2" />
                <div className="text-slate-400 text-sm mb-1">Radius</div>
                <div className="text-white font-bold text-2xl">
                  {formatNumber(exoplanet.radius)} R⊕
                </div>
                <div className="text-slate-500 text-xs">Earth radii</div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                <Icon name="satellite" size={24} className="mb-2" />
                <div className="text-slate-400 text-sm mb-1">Distance</div>
                <div className="text-white font-bold text-2xl">
                  {formatNumber(exoplanet.distance)} ly
                </div>
                <div className="text-slate-500 text-xs">Light years</div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-6 text-center">
                <Icon name="temperature" size={24} className="mb-2" />
                <div className="text-slate-400 text-sm mb-1">Temperature</div>
                <div className="text-white font-bold text-2xl">
                  {formatNumber(exoplanet.temperature)} K
                </div>
                <div className="text-slate-500 text-xs">Kelvin</div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Physical Characteristics */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">
                Physical Characteristics
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Basic Properties
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Planet Type:</span>
                      <span className="text-white font-medium">
                        {exoplanet.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mass:</span>
                      <span className="text-white font-medium">
                        {formatNumber(exoplanet.mass)} Earth masses
                        {exoplanet.mass && (
                          <span className="text-slate-500 ml-2">
                            ({exoplanet.mass > 1 ? "Heavier" : "Lighter"} than
                            Earth)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Radius:</span>
                      <span className="text-white font-medium">
                        {formatNumber(exoplanet.radius)} Earth radii
                        {exoplanet.radius && (
                          <span className="text-slate-500 ml-2">
                            ({exoplanet.radius > 1 ? "Larger" : "Smaller"} than
                            Earth)
                          </span>
                        )}
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

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Environmental Conditions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Surface Temperature:
                      </span>
                      <span className="text-white font-medium">
                        {formatNumber(exoplanet.temperature)} K
                        {exoplanet.temperature && (
                          <span className="text-slate-500 ml-2">
                            ({Math.round(exoplanet.temperature - 273.15)}°C)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Distance from Earth:
                      </span>
                      <span className="text-white font-medium">
                        {formatNumber(exoplanet.distance)} light years
                        {exoplanet.distance && (
                          <span className="text-slate-500 ml-2">
                            ({Math.round((exoplanet.distance * 9.461e12) / 1e9)}{" "}
                            billion km)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Discovery Method:</span>
                      <span className="text-white font-medium">
                        {exoplanet.discoveryMethod || "Transit Method"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Habitability Assessment */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">
                Habitability Assessment
              </h2>
              <div className="bg-slate-700/50 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-5xl">
                    {typeof habitableInfo.icon === "string" ? (
                      <span className="text-5xl">{habitableInfo.icon}</span>
                    ) : (
                      habitableInfo.icon
                    )}
                  </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <Icon name="temperature" size={24} className="mb-2" />
                      <div className="text-sm text-slate-400">Temperature</div>
                      <div className="text-white font-medium">Suitable</div>
                    </div>
                    <div className="text-center">
                      <Icon name="droplets" size={24} className="mb-2" />
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
          </div>

          {/* Orbital Information */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white mb-6">
              Orbital Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <Icon name="rotateCcw" size={20} className="mb-2" />
                <div className="text-slate-400 text-sm mb-1">
                  Orbital Period
                </div>
                <div className="text-white font-semibold text-lg">
                  {exoplanet.orbitalPeriod
                    ? `${exoplanet.orbitalPeriod} days`
                    : "Unknown"}
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <Icon name="star" size={20} className="mb-2" />
                <div className="text-slate-400 text-sm mb-1">Host Star</div>
                <div className="text-white font-semibold text-lg">
                  {exoplanet.hostStar || "Unknown"}
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <Icon name="triangle" size={20} className="mb-2" />
                <div className="text-slate-400 text-sm mb-1">Eccentricity</div>
                <div className="text-white font-semibold text-lg">
                  {exoplanet.eccentricity
                    ? exoplanet.eccentricity.toFixed(3)
                    : "Unknown"}
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <Icon name="ruler" size={20} className="mb-2" />
                <div className="text-slate-400 text-sm mb-1">
                  Semi-Major Axis
                </div>
                <div className="text-white font-semibold text-lg">
                  {exoplanet.semiMajorAxis
                    ? `${exoplanet.semiMajorAxis} AU`
                    : "Unknown"}
                </div>
              </div>
            </div>
          </div>

          {/* Data Visualization */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Data Visualization
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedChart("overview")}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    selectedChart === "overview"
                      ? "bg-neon-blue text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setSelectedChart("comparison")}
                  className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                    selectedChart === "comparison"
                      ? "bg-neon-blue text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Comparison
                </button>
              </div>
            </div>

            {selectedChart === "overview" && (
              <ExoplanetCharts exoplanets={[exoplanet]} />
            )}

            {selectedChart === "comparison" && (
              <div className="space-y-6">
                <div className="bg-slate-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Comparison with Earth
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => {
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
                window.open(
                  `https://exoplanetarchive.ipac.caltech.edu/`,
                  "_blank"
                );
              }}
              className="btn-primary"
            >
              <Icon name="satellite" size={16} className="mr-2" />
              NASA Archive
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExoplanetDetails;
