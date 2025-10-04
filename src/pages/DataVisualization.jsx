import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import { useQuery } from "@tanstack/react-query";
import AdvancedDataVisualization from "@components/Charts/AdvancedDataVisualization";
import { api } from "@services/api";

const DataVisualization = () => {
  const { t } = useI18n();
  const [activeView, setActiveView] = useState("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [chartTheme, setChartTheme] = useState("dark");
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [enableInteractions, setEnableInteractions] = useState(true);

  // Fetch data for visualizations
  const { data: missionsData, isLoading: missionsLoading } = useQuery({
    queryKey: ["missions"],
    queryFn: () => api.getMissions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: exoplanetsData, isLoading: exoplanetsLoading } = useQuery({
    queryKey: ["exoplanets"],
    queryFn: () => api.getExoplanets(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: satellitesData, isLoading: satellitesLoading } = useQuery({
    queryKey: ["satellites"],
    queryFn: () => api.getSatellites(),
    staleTime: 5 * 60 * 1000,
  });

  // Process and combine data
  const processedData = React.useMemo(() => {
    if (!missionsData || !exoplanetsData || !satellitesData) return null;

    return {
      missions: missionsData.data || [],
      exoplanets: exoplanetsData.data || [],
      satellites: satellitesData.data || [],
    };
  }, [missionsData, exoplanetsData, satellitesData]);

  const isLoading = missionsLoading || exoplanetsLoading || satellitesLoading;

  // Statistics calculations
  const statistics = React.useMemo(() => {
    if (!processedData) return null;

    const { missions, exoplanets, satellites } = processedData;

    // Mission statistics
    const missionStats = {
      total: missions.length,
      active: missions.filter((m) => m.status === "Active").length,
      completed: missions.filter((m) => m.status === "Completed").length,
      planned: missions.filter((m) => m.status === "Planned").length,
      totalCost: missions.reduce((sum, m) => {
        const cost = parseFloat(m.cost?.replace(/[^0-9.]/g, "")) || 0;
        return sum + cost;
      }, 0),
      averageCost: 0,
      byType: {},
      byYear: {},
    };

    missionStats.averageCost = missionStats.totalCost / missionStats.total || 0;

    missions.forEach((mission) => {
      // By type
      missionStats.byType[mission.type] =
        (missionStats.byType[mission.type] || 0) + 1;

      // By year
      const year = mission.launchYear;
      missionStats.byYear[year] = (missionStats.byYear[year] || 0) + 1;
    });

    // Exoplanet statistics
    const exoplanetStats = {
      total: exoplanets.length,
      habitable: exoplanets.filter((e) => e.habitable).length,
      byType: {},
      byDistance: {
        close: exoplanets.filter((e) => e.distance < 100).length,
        medium: exoplanets.filter((e) => e.distance >= 100 && e.distance < 1000)
          .length,
        far: exoplanets.filter((e) => e.distance >= 1000).length,
      },
      averageMass: 0,
      averageRadius: 0,
      averageTemperature: 0,
    };

    exoplanetStats.averageMass =
      exoplanets.reduce((sum, e) => sum + e.mass, 0) / exoplanets.length || 0;
    exoplanetStats.averageRadius =
      exoplanets.reduce((sum, e) => sum + e.radius, 0) / exoplanets.length || 0;
    exoplanetStats.averageTemperature =
      exoplanets.reduce((sum, e) => sum + e.temperature, 0) /
        exoplanets.length || 0;

    exoplanets.forEach((exoplanet) => {
      exoplanetStats.byType[exoplanet.type] =
        (exoplanetStats.byType[exoplanet.type] || 0) + 1;
    });

    // Satellite statistics
    const satelliteStats = {
      total: satellites.length,
      active: satellites.filter((s) => s.status === "Active").length,
      inactive: satellites.filter((s) => s.status === "Inactive").length,
      byCountry: {},
      byType: {},
      byAltitude: {
        low: satellites.filter((s) => s.altitude < 2000).length,
        medium: satellites.filter(
          (s) => s.altitude >= 2000 && s.altitude < 35786
        ).length,
        high: satellites.filter((s) => s.altitude >= 35786).length,
      },
      averageAltitude: 0,
      averagePeriod: 0,
    };

    satelliteStats.averageAltitude =
      satellites.reduce((sum, s) => sum + s.altitude, 0) / satellites.length ||
      0;
    satelliteStats.averagePeriod =
      satellites.reduce((sum, s) => sum + s.period, 0) / satellites.length || 0;

    satellites.forEach((satellite) => {
      satelliteStats.byCountry[satellite.country] =
        (satelliteStats.byCountry[satellite.country] || 0) + 1;
      satelliteStats.byType[satellite.type] =
        (satelliteStats.byType[satellite.type] || 0) + 1;
    });

    return {
      missions: missionStats,
      exoplanets: exoplanetStats,
      satellites: satelliteStats,
    };
  }, [processedData]);

  const views = [
    {
      id: "overview",
      name: "Overview",
      description: "Comprehensive data visualization dashboard",
    },
    {
      id: "missions",
      name: "Missions",
      description: "Space mission analysis and trends",
    },
    {
      id: "exoplanets",
      name: "Exoplanets",
      description: "Exoplanet discovery and characteristics",
    },
    {
      id: "satellites",
      name: "Satellites",
      description: "Satellite tracking and orbital data",
    },
  ];

  const timeframes = [
    { id: "all", name: "All Time", description: "Complete dataset" },
    { id: "recent", name: "Recent (5 years)", description: "Last 5 years" },
    { id: "decade", name: "This Decade", description: "2020-2029" },
    { id: "century", name: "This Century", description: "2000-2099" },
  ];

  const categories = [
    { id: "all", name: "All Categories", description: "All data types" },
    { id: "missions", name: "Missions", description: "Space missions only" },
    {
      id: "exoplanets",
      name: "Exoplanets",
      description: "Exoplanet data only",
    },
    {
      id: "satellites",
      name: "Satellites",
      description: "Satellite data only",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-slate-300">
            Loading data visualizations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gradient font-space mb-4">
            Data Visualization Hub
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore NASA's space data through interactive charts, graphs, and
            visualizations
          </p>
        </motion.div>

        {/* View Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`px-6 py-3 rounded-lg border transition-all duration-300 ${
                  activeView === view.id
                    ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                    : "border-slate-600 text-slate-300 hover:border-slate-500"
                }`}
              >
                {view.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Controls Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Visualization Controls
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Timeframe
                </label>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  {timeframes.map((timeframe) => (
                    <option key={timeframe.id} value={timeframe.id}>
                      {timeframe.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Theme
                </label>
                <select
                  value={chartTheme}
                  onChange={(e) => setChartTheme(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={enableAnimations}
                    onChange={(e) => setEnableAnimations(e.target.checked)}
                    className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                  />
                  <span className="text-slate-300">Enable Animations</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={enableInteractions}
                    onChange={(e) => setEnableInteractions(e.target.checked)}
                    className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                  />
                  <span className="text-slate-300">Enable Interactions</span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Overview */}
        {statistics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Missions
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-white font-semibold">
                      {statistics.missions.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active:</span>
                    <span className="text-green-400 font-semibold">
                      {statistics.missions.active}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Completed:</span>
                    <span className="text-blue-400 font-semibold">
                      {statistics.missions.completed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Cost:</span>
                    <span className="text-neon-blue font-semibold">
                      ${statistics.missions.totalCost.toFixed(1)}B
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Exoplanets
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-white font-semibold">
                      {statistics.exoplanets.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Habitable:</span>
                    <span className="text-green-400 font-semibold">
                      {statistics.exoplanets.habitable}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Mass:</span>
                    <span className="text-neon-blue font-semibold">
                      {statistics.exoplanets.averageMass.toFixed(1)} Earth
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Radius:</span>
                    <span className="text-neon-purple font-semibold">
                      {statistics.exoplanets.averageRadius.toFixed(1)} Earth
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Satellites
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-white font-semibold">
                      {statistics.satellites.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active:</span>
                    <span className="text-green-400 font-semibold">
                      {statistics.satellites.active}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Countries:</span>
                    <span className="text-neon-blue font-semibold">
                      {Object.keys(statistics.satellites.byCountry).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Altitude:</span>
                    <span className="text-neon-purple font-semibold">
                      {statistics.satellites.averageAltitude.toFixed(0)} km
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {processedData && (
                <AdvancedDataVisualization
                  data={processedData}
                  type="multi-chart"
                  theme={chartTheme}
                  enableAnimations={enableAnimations}
                  enableInteractions={enableInteractions}
                  className="min-h-[600px]"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Data Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Export & Share
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn-secondary">Export as CSV</button>
            <button className="btn-secondary">Export as JSON</button>
            <button className="btn-secondary">Share Visualization</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataVisualization;
