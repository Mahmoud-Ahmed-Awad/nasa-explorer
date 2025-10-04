import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import Icon from "./UI/Icon";

const MissionModal = ({ mission, onClose }) => {
  const { t } = useI18n();

  if (!mission) return null;

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-t-2xl flex items-center justify-center">
              {mission.image ? (
                <img
                  src={mission.image}
                  alt={mission.name}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              ) : (
                <Icon name="rocket" size={48} className="text-white" />
              )}
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
            {/* Mission Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-white">
                  {mission.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">
                    {t("missions.details.launchYear")}:
                  </span>
                  <div className="text-white font-medium">
                    {mission.launchYear}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">
                    {t("missions.details.type")}:
                  </span>
                  <div className="text-white font-medium">{mission.type}</div>
                </div>
                <div>
                  <span className="text-slate-400">
                    {t("missions.details.duration")}:
                  </span>
                  <div className="text-white font-medium">
                    {mission.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Description
              </h2>
              <p className="text-slate-300 leading-relaxed">
                {mission.description}
              </p>
            </div>

            {/* Launch Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Launch Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400">
                      {t("missions.details.launchDate")}:
                    </span>
                    <div className="text-white font-medium">
                      {new Date(mission.launchDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">
                      {t("missions.details.launchVehicle")}:
                    </span>
                    <div className="text-white font-medium">
                      {mission.launchVehicle}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">
                      {t("missions.details.launchSite")}:
                    </span>
                    <div className="text-white font-medium">
                      {mission.launchSite}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400">
                      {t("missions.details.cost")}:
                    </span>
                    <div className="text-white font-medium">{mission.cost}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">
                      {t("missions.details.duration")}:
                    </span>
                    <div className="text-white font-medium">
                      {mission.duration}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives */}
            {mission.objectives && mission.objectives.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Objectives
                </h2>
                <ul className="space-y-2">
                  {mission.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-300">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {mission.achievements && mission.achievements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Key Achievements
                </h2>
                <ul className="space-y-2">
                  {mission.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-300">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* External Links */}
            <div className="flex flex-wrap gap-4">
              {mission.website && (
                <a
                  href={mission.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Official Website
                </a>
              )}
              {mission.nasaPage && (
                <a
                  href={mission.nasaPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  NASA Page
                </a>
              )}
              {mission.wikiPage && (
                <a
                  href={mission.wikiPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Wikipedia
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MissionModal;
