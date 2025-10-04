import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import { Link } from "react-router-dom";
import Pagination from "@components/Pagination";
import Icon from "../components/UI/Icon";

const Dashboard = () => {
  const { t } = useI18n();

  const stats = [
    {
      label: "Missions Explored",
      value: "12",
      icon: "rocket",
      color: "from-neon-blue to-cyan-500",
    },
    {
      label: "Exoplanets Discovered",
      value: "47",
      icon: "satellite",
      color: "from-neon-purple to-pink-500",
    },
    {
      label: "Satellites Tracked",
      value: "23",
      icon: "satellite",
      color: "from-neon-green to-emerald-500",
    },
    {
      label: "AI Conversations",
      value: "156",
      icon: "gear",
      color: "from-neon-orange to-yellow-500",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const recentActivity = [
    {
      type: "mission",
      title: "Explored James Webb Space Telescope",
      time: "2 hours ago",
      icon: "rocket",
    },
    {
      type: "exoplanet",
      title: "Discovered Kepler-452b",
      time: "1 day ago",
      icon: "satellite",
    },
    {
      type: "satellite",
      title: "Tracked International Space Station",
      time: "2 days ago",
      icon: "satellite",
    },
    {
      type: "ai",
      title: "Asked about Mars exploration",
      time: "3 days ago",
      icon: "gear",
    },
  ];

  const achievements = [
    {
      title: "Space Explorer",
      description: "Explored 10+ missions",
      icon: "rocket",
      unlocked: true,
    },
    {
      title: "Exoplanet Hunter",
      description: "Discovered 25+ exoplanets",
      icon: "telescope",
      unlocked: true,
    },
    {
      title: "Satellite Tracker",
      description: "Tracked 20+ satellites",
      icon: "antenna",
      unlocked: true,
    },
    {
      title: "AI Conversationalist",
      description: "Had 100+ AI conversations",
      icon: "gear",
      unlocked: true,
    },
    {
      title: "Space Scholar",
      description: "Complete all tutorials",
      icon: "astronaut",
      unlocked: false,
    },
    {
      title: "Cosmic Navigator",
      description: "Visit all sections",
      icon: "satellite",
      unlocked: false,
    },
  ];

  // Paginate recent activity
  const { paginatedActivity, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(recentActivity.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = recentActivity.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return {
      paginatedActivity: paginated,
      totalPages,
    };
  }, [recentActivity, currentPage, itemsPerPage]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-responsive-2xl font-bold text-gradient font-space mb-4">
              {t("nav.dashboard")}
            </h1>
            <p className="text-responsive-lg text-slate-600 dark:text-slate-400 px-4 sm:px-0">
              Welcome back! Here's your space exploration progress.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-holographic spacing-responsive-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-responsive-xs">
                      {stat.label}
                    </p>
                    <p className="text-responsive-xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center text-xl sm:text-2xl`}
                  >
                    <Icon name={stat.icon} size={24} className="text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h2 className="text-responsive-xl font-semibold text-white mb-4 sm:mb-6">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {paginatedActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center space-x-3 sm:space-x-4 spacing-responsive-sm bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors duration-300"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-700 rounded-full flex items-center justify-center text-sm sm:text-lg">
                        <Icon
                          name={activity.icon}
                          size={16}
                          className="text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-responsive-sm">
                          {activity.title}
                        </h3>
                        <p className="text-slate-400 text-responsive-xs">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination for Recent Activity */}
                {recentActivity.length > itemsPerPage && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      itemsPerPage={itemsPerPage}
                      totalItems={recentActivity.length}
                      onPageChange={handlePageChange}
                      onItemsPerPageChange={handleItemsPerPageChange}
                      itemsPerPageOptions={[3, 5, 10]}
                      showItemsPerPage={false}
                    />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    to="/missions"
                    className="block p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="rocket" size={24} className="text-white" />
                      <div>
                        <h3 className="text-white font-medium">
                          Explore Missions
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Discover NASA missions
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/exoplanets"
                    className="block p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="satellite" size={24} className="text-white" />
                      <div>
                        <h3 className="text-white font-medium">
                          View Exoplanets
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Explore distant worlds
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/satellites"
                    className="block p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="satellite" size={24} className="text-white" />
                      <div>
                        <h3 className="text-white font-medium">
                          Track Satellites
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Real-time tracking
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/ai"
                    className="block p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="gear" size={24} className="text-white" />
                      <div>
                        <h3 className="text-white font-medium">AI Assistant</h3>
                        <p className="text-slate-400 text-sm">Ask questions</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/settings"
                    className="block p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="gear" size={24} className="text-white" />
                      <div>
                        <h3 className="text-white font-medium">Settings</h3>
                        <p className="text-slate-400 text-sm">
                          Customize experience
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Achievements
                </h2>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        achievement.unlocked
                          ? "bg-green-500/20 border border-green-500/50"
                          : "bg-slate-800/50 border border-slate-700"
                      }`}
                    >
                      <div
                        className={`text-2xl ${
                          achievement.unlocked ? "" : "grayscale opacity-50"
                        }`}
                      >
                        <Icon
                          name={achievement.icon}
                          size={24}
                          className="text-white"
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-medium ${
                            achievement.unlocked
                              ? "text-white"
                              : "text-slate-400"
                          }`}
                        >
                          {achievement.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            achievement.unlocked
                              ? "text-green-400"
                              : "text-slate-500"
                          }`}
                        >
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <div className="text-green-400">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Exploration Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg
                    className="w-24 h-24 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.8)}`}
                      className="text-neon-blue"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">80%</span>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Missions</h3>
                <p className="text-slate-400 text-sm">12 of 15 completed</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg
                    className="w-24 h-24 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.6)}`}
                      className="text-neon-purple"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">60%</span>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Exoplanets</h3>
                <p className="text-slate-400 text-sm">47 of 78 discovered</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  <svg
                    className="w-24 h-24 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.4)}`}
                      className="text-neon-green"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">40%</span>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2">Satellites</h3>
                <p className="text-slate-400 text-sm">23 of 58 tracked</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
