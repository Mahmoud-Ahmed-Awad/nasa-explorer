import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import Icon from "./UI/Icon";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
    { code: "ar", name: "العربية", flag: "🇸🇦", nativeName: "العربية" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 text-white group"
        aria-label="Change language"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 flex items-center justify-center">
          <span className="text-sm">{currentLanguage?.flag}</span>
        </div>
        <span className="text-sm font-medium hidden sm:block">
          {currentLanguage?.name}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10">
                <h3 className="text-sm font-semibold text-white flex items-center">
                  <Icon
                    name="globe"
                    size={16}
                    className="mr-2 text-neon-blue"
                  />
                  Select Language
                </h3>
              </div>

              {/* Language Options */}
              <div className="py-2">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-white/5 transition-all duration-200 group ${
                      language === lang.code
                        ? "text-neon-blue bg-neon-blue/10 border-r-2 border-neon-blue"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        language === lang.code
                          ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 shadow-lg shadow-neon-blue/25"
                          : "bg-slate-700/50 group-hover:bg-slate-600/50"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{lang.name}</div>
                      <div className="text-xs text-slate-400">
                        {lang.nativeName}
                      </div>
                    </div>
                    {language === lang.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-neon-blue flex items-center justify-center"
                      >
                        <Icon
                          name="close"
                          size={12}
                          className="rotate-45 text-white"
                        />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/10 bg-slate-800/50">
                <p className="text-xs text-slate-400 text-center">
                  Language settings
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
