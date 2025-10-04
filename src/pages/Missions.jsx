import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@contexts/I18nContext";
import { apiService } from "@services/api";
import LoadingSpinner from "@components/LoadingSpinner";
import MissionModal from "@components/MissionModal";
import Pagination from "@components/Pagination";
import Icon from "../components/UI/Icon";

const Missions = () => {
  const { t } = useI18n();
  const [selectedMission, setSelectedMission] = useState(null);
  const [filters, setFilters] = useState({
    year: "",
    type: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Fetch missions data (tuned to respect NASA rate limits)
  const {
    data: missionsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["missions"],
    queryFn: () => apiService.getMissions(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // cache retained for 30 minutes
    retry: false, // don't auto-retry to avoid extra API hits
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Extract missions array from response
  const missions = missionsResponse?.data || [];

  // Filter and paginate missions
  const { filteredMissions, paginatedMissions, totalPages } = useMemo(() => {
    const filtered =
      missions?.filter((mission) => {
        const matchesSearch =
          mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mission.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesYear =
          !filters.year || mission.launchYear === parseInt(filters.year);
        const matchesType = !filters.type || mission.type === filters.type;
        const matchesStatus =
          !filters.status || mission.status === filters.status;

        return matchesSearch && matchesYear && matchesType && matchesStatus;
      }) || [];

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      filteredMissions: filtered,
      paginatedMissions: paginated,
      totalPages,
    };
  }, [missions, searchTerm, filters, currentPage, itemsPerPage]);

  const missionTypes = [...new Set(missions?.map((m) => m.type) || [])];
  const missionStatuses = [...new Set(missions?.map((m) => m.status) || [])];
  const missionYears = [
    ...new Set(missions?.map((m) => m.launchYear) || []),
  ].sort((a, b) => b - a);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
        <LoadingSpinner text="Loading missions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-red-500 text-xl mb-4">
            Failed to load missions
          </div>
          <p className="text-slate-600 dark:text-slate-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient font-space mb-4">
              {t("missions.title")}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              {t("missions.subtitle")}
            </p>

            {/* API Status Indicator */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-neon-blue/50 rounded-full">
              <span className="text-neon-blue text-sm font-medium">
                <Icon name="rocket" size={20} className="mr-2" /> NASA Missions
                Data
              </span>
              <span className="text-slate-400 text-xs">
                ({missions?.length || 0} missions)
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

          {/* Search and Filters */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-slate-300 mb-2">
                  Search Missions
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                />
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-slate-300 mb-2">
                  {t("missions.filters.year")}
                </label>
                <select
                  value={filters.year}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, year: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="">All Years</option>
                  {missionYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-slate-300 mb-2">
                  {t("missions.filters.type")}
                </label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="">All Types</option>
                  {missionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Filter */}
            <div className="mt-4">
              <label className="block text-slate-300 mb-2">
                {t("missions.filters.status")}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, status: "" }))
                  }
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                    filters.status === ""
                      ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                      : "border-slate-600 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  All Status
                </button>
                {missionStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilters((prev) => ({ ...prev, status }))}
                    className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                      filters.status === status
                        ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                        : "border-slate-600 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Showing {filteredMissions.length} of {missions?.length || 0}{" "}
              missions
            </p>
          </div>

          {/* Missions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {paginatedMissions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="card-holographic cursor-pointer"
                  onClick={() => setSelectedMission(mission)}
                >
                  {/* Mission Image */}
                  <div className="aspect-video bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg mb-4 flex items-center justify-center">
                    {mission.image ? (
                      <img
                        src={mission.image}
                        alt={mission.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Icon name="rocket" size={32} className="text-white" />
                    )}
                  </div>

                  {/* Mission Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">
                        {mission.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mission.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : mission.status === "Completed"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {mission.status}
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm line-clamp-3">
                      {mission.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{mission.launchYear}</span>
                      <span>{mission.type}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        {t("missions.details.launchDate")}:{" "}
                        {new Date(mission.launchDate).toLocaleDateString()}
                      </span>
                      <button className="text-neon-blue hover:text-neon-purple transition-colors duration-300">
                        Learn More →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {filteredMissions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredMissions.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                className="justify-center"
              />
            </motion.div>
          )}

          {/* No Results */}
          {filteredMissions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Icon
                name="telescope"
                size={48}
                className="text-slate-400 mb-4"
              />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                No missions found
              </h3>
              <p className="text-slate-500">
                Try adjusting your search criteria
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Mission Modal */}
      <AnimatePresence>
        {selectedMission && (
          <MissionModal
            mission={selectedMission}
            onClose={() => setSelectedMission(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Missions;
