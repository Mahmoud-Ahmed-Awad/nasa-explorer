import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@contexts/I18nContext";
import Starfield from "@components/Starfield";
import ThreeScene from "@components/ThreeScene";
import Icon from "../components/UI/Icon";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { t } = useI18n();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    // Hero animation
    const heroTl = gsap.timeline();
    heroTl
      .from(".hero-title", {
        duration: 1,
        y: 100,

        ease: "power3.out",
      })
      .from(
        ".hero-subtitle",
        { duration: 1, y: 50, ease: "power3.out" },
        "-=0.5"
      )
      .from(".hero-cta", { duration: 1, y: 30, ease: "power3.out" }, "-=0.5");

    // Features animation - handled by Framer Motion instead of GSAP to avoid conflicts

    // Rocket launch animation on scroll
    gsap.to(".rocket-launch", {
      duration: 2,
      y: -200,
      rotation: 10,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: "rocket",
      title: t("home.features.missions"),
      description: t("home.features.missionsDesc"),
      link: "/missions",
      color: "from-neon-blue to-cyan-500",
    },
    {
      icon: "satellite",
      title: t("home.features.exoplanets"),
      description: t("home.features.exoplanetsDesc"),
      link: "/exoplanets",
      color: "from-neon-purple to-pink-500",
    },
    {
      icon: "satellite",
      title: t("home.features.satellites"),
      description: t("home.features.satellitesDesc"),
      link: "/satellites",
      color: "from-neon-green to-emerald-500",
    },
    {
      icon: "robot",
      title: t("home.features.ai"),
      description: t("home.features.aiDesc"),
      link: "/ai",
      color: "from-neon-orange to-yellow-500",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Starfield Background */}
      <Starfield
        starCount={1500}
        speed={0.3}
        enableParallax={true}
        particleDensity={1.2}
      />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4"
      >
        <div className="max-w-7xl mx-auto text-center flex flex-col justify-center items-center min-h-screen">
          {/* 3D Scene */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <ThreeScene
              className="w-full h-full"
              enableRocket={true}
              enablePlanets={true}
              enableAmbientGlow={true}
            />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 pointer-events-auto text-center">
            <motion.h1
              className="hero-title text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-space mb-6 sm:mb-8 md:mb-12"
              initial={{ y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                background:
                  "linear-gradient(to right, #00f5ff, #bf00ff, #00f5ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "#00f5ff", // Fallback color
              }}
            >
              {t("home.title") || "Explore the Universe"}
            </motion.h1>

            <motion.p
              className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-6 sm:mb-8 md:mb-10 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
              initial={{ y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              style={{ color: "#cbd5e1" }} // Ensure text is visible
            >
              {t("home.subtitle") ||
                "Discover NASA missions, exoplanets, and satellites with interactive 3D visualizations and real-time data."}
            </motion.p>

            <motion.div
              className="hero-cta flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0"
              initial={{ y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              <Link
                to="/missions"
                className="btn-primary btn-large w-full sm:w-auto hover:scale-105 transform transition-all duration-300 shadow-2xl touch-target"
                style={{
                  background: "linear-gradient(to right, #00f5ff, #06b6d4)",
                  color: "white",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t("home.getStarted") || "Get Started"}
              </Link>

              <Link
                to="/exoplanets"
                className="btn-secondary btn-large w-full sm:w-auto hover:scale-105 transform transition-all duration-300 shadow-2xl touch-target"
                style={{
                  backgroundColor: "#374151",
                  color: "white",
                  border: "1px solid #4b5563",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t("home.exploreMissions") || "Explore Missions"}
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-neon-blue rounded-full flex justify-center">
              <div className="w-1 h-3 bg-neon-blue rounded-full mt-2"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-space mb-4 sm:mb-6"
              style={{
                background:
                  "linear-gradient(to right, #00f5ff, #bf00ff, #00f5ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "#00f5ff", // Fallback color
              }}
            >
              {t("home.features.title") || "Explore the Cosmos"}
            </h2>
            <p
              className="text-lg sm:text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto px-4 sm:px-0"
              style={{ color: "#cbd5e1" }}
            >
              Discover the universe through interactive experiences and real
              NASA data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card group"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                whileHover={{ y: -10 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
              >
                <Link to={feature.link} className="block">
                  <div className="card-holographic h-full text-center hover:shadow-2xl transition-all duration-300 spacing-responsive-sm">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-xl sm:text-2xl transform group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon
                        name={feature.icon}
                        size={24}
                        className="text-white"
                      />
                    </div>
                    <h3
                      className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-4"
                      style={{ color: "white" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed"
                      style={{ color: "#cbd5e1" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            {[
              { number: "5000+", label: "Exoplanets Discovered" },
              { number: "100+", label: "Active Missions" },
              { number: "3000+", label: "Satellites Tracked" },
              { number: "24/7", label: "Real-time Data" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="glass rounded-xl spacing-responsive-sm"
                initial={{ scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-neon-blue mb-2"
                  style={{ color: "#00f5ff" }}
                >
                  {stat.number}
                </div>
                <div
                  className="text-xs sm:text-sm md:text-base text-slate-300"
                  style={{ color: "#cbd5e1" }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass rounded-2xl spacing-responsive-lg"
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-space mb-4 sm:mb-6"
              style={{
                background:
                  "linear-gradient(to right, #00f5ff, #bf00ff, #00f5ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "#00f5ff", // Fallback color
              }}
            >
              Ready to Explore?
            </h2>
            <p
              className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-6 sm:mb-8 px-4 sm:px-0"
              style={{ color: "#cbd5e1" }}
            >
              Join thousands of space enthusiasts exploring the universe with
              NASA data
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Link
                to="/missions"
                className="btn-primary btn-large w-full sm:w-auto hover:scale-105 transform transition-all duration-300 shadow-2xl touch-target"
                style={{
                  background: "linear-gradient(to right, #00f5ff, #06b6d4)",
                  color: "white",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t("home.viewExoplanets") || "View Exoplanets"}
              </Link>
              <Link
                to="/satellites"
                className="btn-secondary btn-large w-full sm:w-auto hover:scale-105 transform transition-all duration-300 shadow-2xl touch-target"
                style={{
                  backgroundColor: "#374151",
                  color: "white",
                  border: "1px solid #4b5563",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t("home.trackSatellites") || "Track Satellites"}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
