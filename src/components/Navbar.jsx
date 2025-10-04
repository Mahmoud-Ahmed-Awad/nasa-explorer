import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import { useTheme } from "@contexts/ThemeContext";
import LanguageSwitcher from "./LanguageSwitcher";
import TimerWidget from "./TimerWidget";
import Icon from "./UI/Icon";

const Navbar = () => {
  const { t } = useI18n();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    {
      path: "/",
      label: t("nav.home"),
      icon: "home",
      description: "Home page",
    },
    {
      path: "/missions",
      label: t("nav.missions"),
      icon: "rocket",
      description: "NASA missions",
    },
    {
      path: "/exoplanets",
      label: t("nav.exoplanets"),
      icon: "satellite",
      description: "Exoplanet data",
    },
    {
      path: "/satellites",
      label: t("nav.satellites"),
      icon: "satellite",
      description: "Satellite tracking",
    },
    {
      path: "/dashboard",
      label: t("nav.dashboard"),
      icon: "gear",
      description: "Data dashboard",
    },
    {
      path: "/team",
      label: t("nav.team"),
      icon: "astronaut",
      description: "Our team",
    },
    // {
    //   path: "/ai",
    //   label: t("nav.ai"),
    //   icon: "gear",
    //   description: "AI assistant",
    // },
    {
      path: "/advanced-3d",
      label: "3D",
      icon: "globe",
      description: "3D visualization",
    },
    {
      path: "/data-visualization",
      label: "Charts",
      icon: "trendingUp",
      description: "Data charts",
    },
    {
      path: "/interactive-demo",
      label: "Demo",
      icon: "gamepad",
      description: "Interactive demo",
    },
    {
      path: "/contact",
      label: t("nav.contact"),
      icon: "mail",
      description: "Contact us",
    },
  ];

  const isActive = (path) => location.pathname === path;

  // Filter nav items based on search
  const filteredNavItems = navItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass border-b border-white/30 shadow-lg backdrop-blur-xl"
          : "glass border-b border-white/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="flex items-center space-x-2 touch-target group"
            >
              {(
                <img src="/logo.png" className="w-12 h-12 sm:w-12 sm:h-12" />
              ) || (
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-neon-blue/25 transition-all duration-300">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    N
                  </span>
                </div>
              )}
              <span className="text-lg sm:text-xl font-bold text-gradient font-space group-hover:text-neon-blue transition-colors duration-300">
                NASA Explorer
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Show only 3 main options */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {navItems.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`relative flex items-center px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all duration-300 touch-target group ${
                    isActive(item.path)
                      ? "text-neon-blue bg-white/10 shadow-lg shadow-neon-blue/20"
                      : "text-slate-300 hover:text-neon-blue hover:bg-white/5"
                  }`}
                  title={item.description}
                >
                  <Icon name={item.icon} size={16} className="mr-1" />
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 rounded-lg -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}

            {/* More button to open offcanvas */}
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center px-3 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium text-slate-300 hover:text-neon-blue hover:bg-white/5 transition-all duration-300 touch-target"
            >
              <span className="mr-1">⋯</span>
              <span>More</span>
            </motion.button> */}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Search Button */}
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 touch-target"
              title="Search"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </motion.button> */}

            {/* Timer Widget */}
            {/* <div className="hidden xl:block">
              <TimerWidget />
            </div> */}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Settings Link */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/settings"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 touch-target text-white"
                title={t("nav.settings")}
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </Link>
            </motion.div>

            {/* Menu button - Works on both mobile and desktop */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 touch-target text-white"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        {
          // <AnimatePresence>
          //   {showSearch && (
          //     <motion.div
          //       initial={{ opacity: 0, height: 0 }}
          //       animate={{ opacity: 1, height: "auto" }}
          //       exit={{ opacity: 0, height: 0 }}
          //       className="border-t border-white/20"
          //     >
          //       <div className="px-4 py-3">
          //         <div className="relative">
          //           <input
          //             type="text"
          //             placeholder="Search pages..."
          //             value={searchQuery}
          //             onChange={(e) => setSearchQuery(e.target.value)}
          //             className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue/50 transition-all duration-300"
          //           />
          //           <svg
          //             className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"
          //             fill="none"
          //             stroke="currentColor"
          //             viewBox="0 0 24 24"
          //           >
          //             <path
          //               strokeLinecap="round"
          //               strokeLinejoin="round"
          //               strokeWidth={2}
          //               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          //             />
          //           </svg>
          //         </div>
          //         {/* Search Results */}
          //         {searchQuery && (
          //           <div className="mt-2 max-h-48 overflow-y-auto">
          //             {filteredNavItems.length > 0 ? (
          //               <div className="space-y-1">
          //                 {filteredNavItems.map((item) => (
          //                   <Link
          //                     key={item.path}
          //                     to={item.path}
          //                     onClick={() => {
          //                       setSearchQuery("");
          //                       setShowSearch(false);
          //                     }}
          //                     className="flex items-center px-3 py-2 rounded-md text-sm transition-colors duration-200 hover:bg-white/10"
          //                   >
          //                     <span className="mr-2 flex-shrink-0">
          //                       <Icon
          //                         name={item.icon}
          //                         size={16}
          //                         className="text-white"
          //                       />
          //                     </span>
          //                     <div className="min-w-0">
          //                       <div className="font-medium text-white truncate">
          //                         {item.label}
          //                       </div>
          //                       <div className="text-xs text-slate-400 truncate">
          //                         {item.description}
          //                       </div>
          //                     </div>
          //                   </Link>
          //                 ))}
          //               </div>
          //             ) : (
          //               <div className="px-3 py-2 text-sm text-slate-400">
          //                 No results found
          //               </div>
          //             )}
          //           </div>
          //         )}
          //       </div>
          //     </motion.div>
          //   )}
          // </AnimatePresence>
        }

        {/* Offcanvas Navigation - Works on both mobile and desktop */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />

              {/* Offcanvas Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-screen overflow-auto w-80 max-w-[85vw] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-l border-white/20 shadow-2xl z-50"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 via-transparent to-neon-purple/20"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.1),transparent_50%)]"></div>
                  <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-neon-blue/5 rounded-full blur-xl"></div>
                  <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-neon-purple/5 rounded-full blur-xl"></div>
                </div>
                {/* Header */}
                <div className="relative flex items-center justify-between p-4 border-b border-white/20">
                  <div className="flex items-center space-x-2">
                    {<img src="/logo.png" className="w-8 h-8" /> || (
                      <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">N</span>
                      </div>
                    )}
                    <span className="text-xl font-bold text-gradient font-space">
                      NASA Explorer
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                  >
                    <Icon name="close" size={20} className="text-white" />
                  </motion.button>
                </div>

                {/* Navigation Items */}
                <div className="relative flex-1 overflow-y-auto py-4">
                  <div className="px-4 space-y-2">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 group ${
                            isActive(item.path)
                              ? "text-neon-blue bg-neon-blue/10 border border-neon-blue/20"
                              : "text-slate-300 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center mr-3 group-hover:from-neon-blue/20 group-hover:to-neon-purple/20 transition-all duration-300">
                            <Icon
                              name={item.icon}
                              size={18}
                              className="text-white"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {item.label}
                            </div>
                            <div className="text-xs text-slate-400 truncate mt-1">
                              {item.description}
                            </div>
                          </div>
                          {isActive(item.path) && (
                            <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Additional Controls */}
                  <div className="relative px-4 mt-6 pt-6 border-t border-white/10">
                    <div className="space-y-3">
                      {/* Language Switcher */}
                      <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5">
                        <span className="text-slate-300 font-medium">
                          Language
                        </span>
                        <LanguageSwitcher />
                      </div>

                      {/* Timer Widget */}
                      <div className="px-4 py-3 rounded-lg bg-white/5">
                        <TimerWidget />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="relative p-4 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-xs text-slate-400">
                      Explore the universe with NASA Explorer
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
