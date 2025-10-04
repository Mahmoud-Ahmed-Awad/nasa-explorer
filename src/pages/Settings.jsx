import React, { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import { useTheme } from "@contexts/ThemeContext";

const Settings = () => {
  const { t, language, changeLanguage } = useI18n();
  const {
    currentTime,
    settings,
    updateSettings,
    resetSettings,
    formatTime,
    formatDateTime,
  } = useTheme();

  const [localSettings, setLocalSettings] = useState(settings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(settings);
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient font-space mb-4">
              {t("settings.title")}
            </h1>
            <p className="text-slate-400">
              Customize your NASA Explorer experience
            </p>
          </div>

          {/* Current Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-holographic"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Current Status
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-2">
                  {t("settings.currentTime")}
                </div>
                <div className="text-2xl font-mono font-bold text-neon-blue">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {formatDateTime(currentTime)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Language Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t("settings.language")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-slate-300">Language:</label>
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Accessibility Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Accessibility
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-slate-300">
                    {t("settings.enableCursor")}
                  </label>
                  <p className="text-sm text-slate-500">
                    Enable spaceship cursor with particle effects
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "enableCursor",
                      !localSettings.enableCursor
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    localSettings.enableCursor
                      ? "bg-neon-green"
                      : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      localSettings.enableCursor
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-slate-300">
                    {t("settings.enableSounds")}
                  </label>
                  <p className="text-sm text-slate-500">
                    Enable sound effects for interactions
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSettingChange(
                      "enableSounds",
                      !localSettings.enableSounds
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    localSettings.enableSounds
                      ? "bg-neon-orange"
                      : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      localSettings.enableSounds
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Reset Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card text-center"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Reset Settings
            </h2>
            <p className="text-slate-300 mb-6">
              Reset all settings to their default values
            </p>

            {showResetConfirm ? (
              <div className="space-y-4">
                <p className="text-red-400">
                  Are you sure you want to reset all settings?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="btn-secondary"
              >
                {t("settings.resetSettings")}
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
