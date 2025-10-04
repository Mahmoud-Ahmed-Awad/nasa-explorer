import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@contexts/I18nContext";
import { apiService } from "@services/api";
import LoadingSpinner from "@components/LoadingSpinner";
import ExoplanetCharts from "@components/ExoplanetCharts";
import Pagination from "@components/Pagination";
import ExoplanetDetailsModal from "@components/ExoplanetDetailsModal";
import Icon from "../components/UI/Icon";

const Exoplanets = () => {
  const { t } = useI18n();
  const [filters, setFilters] = useState({
    massMin: "",
    massMax: "",
    radiusMin: "",
    radiusMax: "",
    distanceMin: "",
    distanceMax: "",
    type: "",
    habitable: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dataSource, setDataSource] = useState("all"); // 'all', 'habitable', 'recent'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedExoplanet, setSelectedExoplanet] = useState(null);

  // Force NASA API usage for fresh data (disable mockup)
  const useMockup = false; // Always use NASA API for real data

  // Fetch exoplanets data based on selected source
  const {
    data: exoplanetsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exoplanets", dataSource],
    queryFn: async () => {
      // Always fetch fresh NASA data based on dataSource
      switch (dataSource) {
        case "habitable":
          return apiService.getHabitableExoplanets(500);
        case "recent":
          return apiService.getRecentExoplanets(800);
        default:
          return apiService.getExoplanets({ limit: 2000 });
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for NASA data
  });

  // Extract exoplanets array from response
  const exoplanets = exoplanetsResponse?.data || [];

  // Filter, sort and paginate exoplanets
  const { filteredExoplanets, paginatedExoplanets, totalPages } =
    useMemo(() => {
      const filtered =
        exoplanets
          ?.filter((planet) => {
            const massMin = filters.massMin ? parseFloat(filters.massMin) : 0;
            const massMax = filters.massMax
              ? parseFloat(filters.massMax)
              : Infinity;
            const radiusMin = filters.radiusMin
              ? parseFloat(filters.radiusMin)
              : 0;
            const radiusMax = filters.radiusMax
              ? parseFloat(filters.radiusMax)
              : Infinity;
            const distanceMin = filters.distanceMin
              ? parseFloat(filters.distanceMin)
              : 0;
            const distanceMax = filters.distanceMax
              ? parseFloat(filters.distanceMax)
              : Infinity;

            return (
              planet.mass >= massMin &&
              planet.mass <= massMax &&
              planet.radius >= radiusMin &&
              planet.radius <= radiusMax &&
              planet.distance >= distanceMin &&
              planet.distance <= distanceMax &&
              (!filters.type || planet.type === filters.type) &&
              (filters.habitable === "" ||
                planet.habitable.toString() === filters.habitable)
            );
          })
          .sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return sortOrder === "asc" ? comparison : -comparison;
          }) || [];

      const totalPages = Math.ceil(filtered.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

      return {
        filteredExoplanets: filtered,
        paginatedExoplanets: paginated,
        totalPages,
      };
    }, [exoplanets, filters, sortBy, sortOrder, currentPage, itemsPerPage]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, sortOrder, dataSource]);

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Type",
      "Mass (Earth Masses)",
      "Radius (Earth Radii)",
      "Distance (Light Years)",
      "Temperature (K)",
      "Habitable",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredExoplanets.map((planet) =>
        [
          planet.name,
          planet.type,
          planet.mass,
          planet.radius,
          planet.distance,
          planet.temperature,
          planet.habitable,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exoplanets.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 py-20">
        <LoadingSpinner text="Loading exoplanets..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 text-xl mb-4">
            Failed to load exoplanets
          </div>
          <p className="text-slate-400">{error.message}</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold text-gradient font-space mb-4">
              {t("exoplanets.title")}
            </h1>
            <p className="text-xl text-slate-400">{t("exoplanets.subtitle")}</p>

            {/* Data Source Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/50 rounded-full"
            >
              <span className="text-neon-blue text-sm font-medium">
                <Icon name="satellite" size={20} className="mr-2" /> NASA
                Exoplanet Archive Data
              </span>
              <span className="text-slate-400 text-xs">
                ({exoplanets.length} planets)
              </span>
              {isLoading && (
                <div className="animate-spin h-4 w-4 border-2 border-neon-blue border-t-transparent rounded-full"></div>
              )}
            </motion.div>

            {/* Network Status Indicator */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full"
              >
                <span className="text-yellow-400 text-xs">
                  <Icon name="warning" size={20} className="mr-2" /> Using
                  offline data - NASA APIs temporarily unavailable
                </span>
              </motion.div>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Filters
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setDataSource("all")}
                className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                  dataSource === "all"
                    ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                    : "border-slate-600 text-slate-300 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name="globe" size={24} className="text-white" />
                  <div className="text-left">
                    <div className="font-semibold">All Exoplanets</div>
                    <div className="text-xs opacity-75">
                      Latest 100 discoveries
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setDataSource("habitable")}
                className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                  dataSource === "habitable"
                    ? "border-neon-green bg-neon-green/20 text-neon-green"
                    : "border-slate-600 text-slate-300 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  <div className="text-left">
                    <div className="font-semibold">Potentially Habitable</div>
                    <div className="text-xs opacity-75">
                      Earth-like conditions
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setDataSource("recent")}
                className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                  dataSource === "recent"
                    ? "border-neon-purple bg-neon-purple/20 text-neon-purple"
                    : "border-slate-600 text-slate-300 hover:border-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <div className="text-left">
                    <div className="font-semibold">Recently Discovered</div>
                    <div className="text-xs opacity-75">Newest findings</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Charts Section */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Data Visualization
            </h2>
            <ExoplanetCharts exoplanets={filteredExoplanets} />
          </div>

          {/* Filters */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mass Range */}
              <div>
                <label className="block text-slate-300 mb-2">
                  {t("exoplanets.filters.mass")}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.massMin}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        massMin: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.massMax}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        massMax: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>
              </div>

              {/* Radius Range */}
              <div>
                <label className="block text-slate-300 mb-2">
                  {t("exoplanets.filters.radius")}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.radiusMin}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        radiusMin: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.radiusMax}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        radiusMax: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>
              </div>

              {/* Distance Range */}
              <div>
                <label className="block text-slate-300 mb-2">
                  {t("exoplanets.filters.distance")}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.distanceMin}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        distanceMin: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.distanceMax}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        distanceMax: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Type Filter */}
              <div>
                <label className="block text-slate-300 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="">All Types</option>
                  <option value="Terrestrial">Terrestrial</option>
                  <option value="Super-Earth">Super-Earth</option>
                  <option value="Hot Jupiter">Hot Jupiter</option>
                  <option value="Gas Giant">Gas Giant</option>
                </select>
              </div>

              {/* Habitable Filter */}
              <div>
                <label className="block text-slate-300 mb-2">Habitable</label>
                <select
                  value={filters.habitable}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      habitable: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="">All</option>
                  <option value="true">Habitable</option>
                  <option value="false">Not Habitable</option>
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-slate-300 mb-2">Sort By</label>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  >
                    <option value="name">Name</option>
                    <option value="mass">Mass</option>
                    <option value="radius">Radius</option>
                    <option value="distance">Distance</option>
                    <option value="temperature">Temperature</option>
                  </select>
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white hover:bg-slate-600 transition-colors duration-300"
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </button>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="mt-6 flex justify-end">
              <button onClick={exportToCSV} className="btn-secondary">
                {t("common.export")} CSV
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="text-center mb-6">
            <p className="text-slate-400">
              Showing {filteredExoplanets.length} of {exoplanets?.length || 0}{" "}
              exoplanets
            </p>
          </div>

          {/* Exoplanets Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Name</th>
                  <th className="text-left py-3 px-4 text-slate-300">Type</th>
                  <th className="text-left py-3 px-4 text-slate-300">
                    Mass (M⊕)
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300">
                    Radius (R⊕)
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300">
                    Distance (ly)
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300">
                    Temperature (K)
                  </th>
                  <th className="text-left py-3 px-4 text-slate-300">
                    Habitable
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedExoplanets.map((planet, index) => (
                  <motion.tr
                    key={planet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors duration-300 cursor-pointer"
                    onClick={() => setSelectedExoplanet(planet)}
                  >
                    <td className="py-3 px-4 text-white font-medium">
                      <div className="flex items-center gap-2">
                        {planet.name}
                        <span className="text-slate-500 text-xs">👆</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{planet.type}</td>
                    <td className="py-3 px-4 text-slate-300">{planet.mass}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {planet.radius}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {planet.distance}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {planet.temperature}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          planet.habitable
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {planet.habitable ? "Yes" : "No"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredExoplanets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredExoplanets.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                className="justify-center"
                itemsPerPageOptions={[10, 20, 50, 100]}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Exoplanet Details Modal */}
      <ExoplanetDetailsModal
        exoplanet={selectedExoplanet}
        onClose={() => setSelectedExoplanet(null)}
      />
    </div>
  );
};

export default Exoplanets;
