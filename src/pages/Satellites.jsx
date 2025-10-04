import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@contexts/I18nContext";
import { apiService } from "@services/api";
import LoadingSpinner from "@components/LoadingSpinner";
import SatelliteMap from "@components/SatelliteMap";
import Pagination from "@components/Pagination";
import SatelliteDetailsModal from "@components/SatelliteDetailsModal";
import Icon from "../components/UI/Icon";

const Satellites = () => {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState("map"); // 'map' or 'list'
  const [selectedSatellite, setSelectedSatellite] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    agency: "",
  });

  // Fetch satellites data
  const {
    data: satellitesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["satellites"],
    queryFn: () => apiService.getSatellites(),
    staleTime: 5 * 60 * 1000,
  });

  // Extract satellites array from response
  const satellites = satellitesResponse?.data || [];

  // Filter satellites based on selected filters
  const filteredSatellites = useMemo(() => {
    return satellites.filter((satellite) => {
      const matchesType = !filters.type || satellite.type === filters.type;
      const matchesStatus =
        !filters.status || satellite.status === filters.status;
      const matchesAgency =
        !filters.agency || satellite.agency.includes(filters.agency);

      return matchesType && matchesStatus && matchesAgency;
    });
  }, [satellites, filters]);

  // Paginate satellites for list view
  const { paginatedSatellites, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(filteredSatellites.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filteredSatellites.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return {
      paginatedSatellites: paginated,
      totalPages,
    };
  }, [filteredSatellites, currentPage, itemsPerPage]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Reset pagination when view mode or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode, filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 py-20">
        <LoadingSpinner text="Loading satellites..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 text-xl mb-4">
            Failed to load satellites
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
              {t("satellites.title")}
            </h1>
            <p className="text-xl text-slate-400">{t("satellites.subtitle")}</p>

            {/* Data Source Indicator */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/50 rounded-full">
              <span className="text-neon-blue text-sm font-medium">
                <Icon name="satellite" size={20} className="mr-2" /> NASA
                Satellites Data
              </span>
              <span className="text-slate-400 text-xs">
                ({satellites.length} satellites)
              </span>
              {isLoading && (
                <div className="animate-spin h-4 w-4 border-2 border-neon-blue border-t-transparent rounded-full"></div>
              )}
            </div>

            {/* Network Status Indicator */}
            {error && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                <span className="text-yellow-400 text-xs">
                  <Icon name="warning" size={20} className="mr-2" /> Using
                  offline data - NASA APIs temporarily unavailable
                </span>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center">
            <div className="glass rounded-lg p-1">
              <button
                onClick={() => setViewMode("map")}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  viewMode === "map"
                    ? "bg-neon-blue text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {t("satellites.map")}
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-6 py-2 rounded-md transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-neon-blue text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {t("satellites.list")}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-white mb-6">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Satellite Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="">All Types</option>
                  <option value="Space Station">Space Station</option>
                  <option value="Earth Observation">Earth Observation</option>
                  <option value="Solar Observatory">Solar Observatory</option>
                  <option value="Space Telescope">Space Telescope</option>
                  <option value="Near Earth Object">Near Earth Object</option>
                  <option value="Solar Probe">Solar Probe</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-slate-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Potentially Hazardous">
                    Potentially Hazardous
                  </option>
                  <option value="Tracked">Tracked</option>
                </select>
              </div>

              {/* Agency Filter */}
              <div>
                <label className="block text-slate-300 mb-2">Agency</label>
                <select
                  value={filters.agency}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, agency: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="">All Agencies</option>
                  <option value="NASA">NASA</option>
                  <option value="ESA">ESA</option>
                  <option value="CNSA">CNSA</option>
                  <option value="Roscosmos">Roscosmos</option>
                  <option value="JAXA">JAXA</option>
                </select>
              </div>
            </div>

            {/* Filter Results */}
            <div className="mt-4 text-center">
              <p className="text-slate-400">
                Showing {filteredSatellites.length} of {satellites.length}{" "}
                satellites
              </p>
            </div>
          </div>

          {/* Map View */}
          {viewMode === "map" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <SatelliteMap
                satellites={filteredSatellites}
                selectedSatellite={selectedSatellite}
                onSatelliteSelect={setSelectedSatellite}
              />
            </motion.div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedSatellites?.map((satellite, index) => (
                <motion.div
                  key={satellite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="card-holographic cursor-pointer"
                  onClick={() => setSelectedSatellite(satellite)}
                >
                  <div className="aspect-video bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg mb-4 flex items-center justify-center">
                    {satellite.image ? (
                      <img
                        src={satellite.image}
                        alt={satellite.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Icon name="satellite" size={32} className="text-white" />
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">
                        {satellite.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          satellite.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {satellite.status}
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm">
                      {satellite.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">
                          {t("satellites.details.altitude")}:
                        </span>
                        <div className="text-white font-medium">
                          {satellite.altitude} km
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">
                          {t("satellites.details.period")}:
                        </span>
                        <div className="text-white font-medium">
                          {satellite.period} min
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">
                          {t("satellites.details.inclination")}:
                        </span>
                        <div className="text-white font-medium">
                          {satellite.inclination}°
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">
                          {t("satellites.details.velocity")}:
                        </span>
                        <div className="text-white font-medium">
                          {satellite.velocity} km/s
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{satellite.agency}</span>
                      <span>{satellite.type}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSatellite(satellite);
                      }}
                      className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg hover:from-neon-purple hover:to-neon-blue transition-all duration-300 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination for List View */}
          {viewMode === "list" && filteredSatellites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredSatellites.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                className="justify-center"
                itemsPerPageOptions={[9, 15, 30, 45]}
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Satellite Details Modal */}
      <SatelliteDetailsModal
        satellite={selectedSatellite}
        onClose={() => setSelectedSatellite(null)}
      />
    </div>
  );
};

export default Satellites;
