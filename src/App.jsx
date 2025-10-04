import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@contexts/I18nContext";
import { ThemeProvider } from "@contexts/ThemeContext";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import ChatBot from "@components/ChatBot";
import LoadingSpinner from "@components/LoadingSpinner";
import ErrorBoundary from "@components/ErrorBoundary";

// Lazy load pages for better performance
const Home = React.lazy(() => import("@pages/Home"));
const Missions = React.lazy(() => import("@pages/Missions"));
const Exoplanets = React.lazy(() => import("@pages/Exoplanets"));
const ExoplanetDetails = React.lazy(() => import("@pages/ExoplanetDetails"));
const Satellites = React.lazy(() => import("@pages/Satellites"));
const Team = React.lazy(() => import("@pages/Team"));
const Dashboard = React.lazy(() => import("@pages/Dashboard"));
const Contact = React.lazy(() => import("@pages/Contact"));
// const AI = React.lazy(() => import("@pages/AI"));
const Settings = React.lazy(() => import("@pages/Settings"));
const Advanced3D = React.lazy(() => import("@pages/Advanced3D"));
const DataVisualization = React.lazy(() => import("@pages/DataVisualization"));
const InteractiveDemo = React.lazy(() => import("@pages/InteractiveDemo"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <div className="min-h-screen bg-slate-900 transition-colors duration-300">
              <Navbar />

              <main className="pt-16">
                <Suspense
                  fallback={
                    <div className="min-h-screen flex items-center justify-center">
                      <LoadingSpinner size="lg" text="Loading page..." />
                    </div>
                  }
                >
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Home />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/missions"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Missions />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/exoplanets"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Exoplanets />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/exoplanets/:planetId"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <ExoplanetDetails />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/satellites"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Satellites />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/team"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Team />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Dashboard />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Contact />
                        </motion.div>
                      }
                    />
                    {/* <Route
                      path="/ai"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <AI />
                        </motion.div>
                      }
                    /> */}
                    <Route
                      path="/settings"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Settings />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/advanced-3d"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <Advanced3D />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/data-visualization"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <DataVisualization />
                        </motion.div>
                      }
                    />
                    <Route
                      path="/interactive-demo"
                      element={
                        <motion.div
                          initial="initial"
                          animate="in"
                          exit="out"
                          variants={pageVariants}
                          transition={pageTransition}
                        >
                          <InteractiveDemo />
                        </motion.div>
                      }
                    />
                  </Routes>
                </Suspense>
              </main>

              <Footer />
              <ChatBot />
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
