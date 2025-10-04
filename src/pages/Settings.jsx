import React, { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import { useTheme } from "@contexts/ThemeContext";

const Settings = () => {
  const { t, language, changeLanguage } = useI18n();
  const {
    currentTheme,
    currentTime,
    countdown,
    settings,
    updateSettings,
    resetSettings,
    applyThemeNow,
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

  const handleTimeOverrideChange = (field, value) => {
    const newOverride = { ...localSettings.manualTimeOverride, [field]: value };
    const newSettings = { ...localSettings, manualTimeOverride: newOverride };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(settings);
    setShowResetConfirm(false);
  };

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Dubai",
    "Australia/Sydney",
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
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
            <p className="text-slate-600 dark:text-slate-400">
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

              {/* <div className="text-center">
                <div className="text-sm text-slate-400 mb-2">Current Theme</div>
                <div className="text-2xl font-bold text-neon-purple capitalize">
                  {currentTheme}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {settings.autoSwitch ? 'Auto-switching enabled' : 'Manual mode'}
                </div>
              </div>
              
              {settings.autoSwitch && (
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">{t('settings.nextSwitch')}</div>
                  <div className="text-2xl font-mono font-bold text-neon-green">
                    {countdown}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Until next theme change
                  </div>
                </div>
              )} */}
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

          {/* Theme Settings */}
          {
            // <motion.div
            //   initial={{ opacity: 0, y: 20 }}
            //   animate={{ opacity: 1, y: 0 }}
            //   transition={{ delay: 0.3 }}
            //   className="card"
            // >
            //   <h2 className="text-2xl font-semibold text-white mb-6">
            //     {t("settings.theme")}
            //   </h2>
            //   <div className="space-y-6">
            //     {/* Theme Mode */}
            //     <div>
            //       <label className="block text-slate-300 mb-3">
            //         Theme Mode:
            //       </label>
            //       <div className="flex space-x-4">
            //         {["light", "dark", "system"].map((mode) => (
            //           <button
            //             key={mode}
            //             onClick={() => handleSettingChange("theme", mode)}
            //             className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
            //               localSettings.theme === mode
            //                 ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
            //                 : "border-slate-600 text-slate-300 hover:border-slate-500"
            //             }`}
            //           >
            //             {t(`theme.${mode}`)}
            //           </button>
            //         ))}
            //       </div>
            //     </div>
            //     {/* Auto Theme Switching */}
            //     <div className="flex items-center justify-between">
            //       <div>
            //         <label className="text-slate-300">
            //           {t("settings.autoTheme")}
            //         </label>
            //         <p className="text-sm text-slate-500">
            //           Automatically switch between light and dark themes
            //         </p>
            //       </div>
            //       <button
            //         onClick={() =>
            //           handleSettingChange(
            //             "autoSwitch",
            //             !localSettings.autoSwitch
            //           )
            //         }
            //         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
            //           localSettings.autoSwitch ? "bg-neon-blue" : "bg-slate-600"
            //         }`}
            //       >
            //         <span
            //           className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            //             localSettings.autoSwitch
            //               ? "translate-x-6"
            //               : "translate-x-1"
            //           }`}
            //         />
            //       </button>
            //     </div>
            //     {/* Manual Time Override */}
            //     {localSettings.autoSwitch && (
            //       <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg">
            //         <div className="flex items-center justify-between">
            //           <div>
            //             <label className="text-slate-300">
            //               {t("settings.manualTime")}
            //             </label>
            //             <p className="text-sm text-slate-500">
            //               Override the current time for theme switching
            //             </p>
            //           </div>
            //           <button
            //             onClick={() =>
            //               handleSettingChange(
            //                 "manualTimeOverride",
            //                 localSettings.manualTimeOverride
            //                   ? null
            //                   : { time: "12:00", timezone: settings.timezone }
            //               )
            //             }
            //             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
            //               localSettings.manualTimeOverride
            //                 ? "bg-neon-purple"
            //                 : "bg-slate-600"
            //             }`}
            //           >
            //             <span
            //               className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            //                 localSettings.manualTimeOverride
            //                   ? "translate-x-6"
            //                   : "translate-x-1"
            //               }`}
            //             />
            //           </button>
            //         </div>
            //         {localSettings.manualTimeOverride && (
            //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            //             <div>
            //               <label className="block text-slate-300 mb-2">
            //                 Time (HH:MM):
            //               </label>
            //               <input
            //                 type="time"
            //                 value={localSettings.manualTimeOverride.time}
            //                 onChange={(e) =>
            //                   handleTimeOverrideChange("time", e.target.value)
            //                 }
            //                 className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            //               />
            //             </div>
            //             <div>
            //               <label className="block text-slate-300 mb-2">
            //                 Timezone:
            //               </label>
            //               <select
            //                 value={localSettings.manualTimeOverride.timezone}
            //                 onChange={(e) =>
            //                   handleTimeOverrideChange(
            //                     "timezone",
            //                     e.target.value
            //                   )
            //                 }
            //                 className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            //               >
            //                 {timezones.map((tz) => (
            //                   <option key={tz} value={tz}>
            //                     {tz}
            //                   </option>
            //                 ))}
            //               </select>
            //             </div>
            //           </div>
            //         )}
            //       </div>
            //     )}
            //     {/* Day/Night Start Times */}
            //     {localSettings.autoSwitch && (
            //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            //         <div>
            //           <label className="block text-slate-300 mb-2">
            //             {t("settings.dayStart")}:
            //           </label>
            //           <input
            //             type="time"
            //             value={localSettings.dayStart}
            //             onChange={(e) =>
            //               handleSettingChange("dayStart", e.target.value)
            //             }
            //             className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            //           />
            //         </div>
            //         <div>
            //           <label className="block text-slate-300 mb-2">
            //             {t("settings.nightStart")}:
            //           </label>
            //           <input
            //             type="time"
            //             value={localSettings.nightStart}
            //             onChange={(e) =>
            //               handleSettingChange("nightStart", e.target.value)
            //             }
            //             className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-blue"
            //           />
            //         </div>
            //       </div>
            //     )}
            //     {/* Apply Theme Now Button */}
            //     <div className="flex justify-center">
            //       <button onClick={applyThemeNow} className="btn-primary">
            //         {t("settings.applyNow")}
            //       </button>
            //     </div>
            //   </div>
            // </motion.div>
          }

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
