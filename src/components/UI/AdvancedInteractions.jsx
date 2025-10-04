import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import Icon from "./Icon";

const AdvancedInteractions = ({
  className = "",
  enableGestures = true,
  enableHoverEffects = true,
  enableDragAndDrop = true,
  enableVoiceControl = false,
}) => {
  const { t } = useI18n();
  const [activeCard, setActiveCard] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [gestureData, setGestureData] = useState({ x: 0, y: 0, scale: 1 });
  const [voiceCommands, setVoiceCommands] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const gestureAreaRef = useRef(null);

  // Motion values for advanced animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [30, -30]);
  const rotateY = useTransform(mouseX, [-300, 300], [-30, 30]);
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  // Sample data for interactive cards
  const spaceData = [
    {
      id: 1,
      title: "James Webb Space Telescope",
      description: "The most powerful space telescope ever built",
      image: "/assets/missions/james-webb.jpg",
      type: "telescope",
      status: "active",
      data: { launchYear: 2021, cost: 10, distance: 1.5 },
    },
    {
      id: 2,
      title: "Mars Perseverance Rover",
      description: "Searching for signs of ancient life on Mars",
      image: "/assets/missions/perseverance.jpg",
      type: "rover",
      status: "active",
      data: { launchYear: 2020, cost: 2.7, distance: 0.0001 },
    },
    {
      id: 3,
      title: "International Space Station",
      description: "A modular space station in low Earth orbit",
      image: "/assets/satellites/iss.jpg",
      type: "station",
      status: "active",
      data: { launchYear: 1998, cost: 150, distance: 0.0004 },
    },
    {
      id: 4,
      title: "Kepler-452b",
      description: "A potentially habitable exoplanet",
      image: "/assets/exoplanets/kepler-452b.jpg",
      type: "exoplanet",
      status: "discovered",
      data: { discoveryYear: 2015, mass: 5, distance: 1400 },
    },
  ];

  // Voice recognition setup
  useEffect(() => {
    if (enableVoiceControl && "webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript;
        setVoiceCommands((prev) => [...prev.slice(-4), command]);
        handleVoiceCommand(command);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognitionRef.current = recognition;
    }
  }, [enableVoiceControl]);

  // Gesture handling
  useEffect(() => {
    if (!enableGestures || !gestureAreaRef.current) return;

    const handleMouseMove = (e) => {
      const rect = gestureAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      mouseX.set(x);
      mouseY.set(y);

      setGestureData({
        x: x / rect.width,
        y: y / rect.height,
        scale: 1 + Math.sqrt(x * x + y * y) / 1000,
      });
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      setGestureData({ x: 0, y: 0, scale: 1 });
    };

    const gestureArea = gestureAreaRef.current;
    gestureArea.addEventListener("mousemove", handleMouseMove);
    gestureArea.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      gestureArea.removeEventListener("mousemove", handleMouseMove);
      gestureArea.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enableGestures, mouseX, mouseY]);

  // Voice command handling
  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes("show") || lowerCommand.includes("display")) {
      if (lowerCommand.includes("telescope")) {
        setActiveCard(spaceData.find((item) => item.type === "telescope"));
      } else if (lowerCommand.includes("rover")) {
        setActiveCard(spaceData.find((item) => item.type === "rover"));
      } else if (lowerCommand.includes("station")) {
        setActiveCard(spaceData.find((item) => item.type === "station"));
      } else if (lowerCommand.includes("planet")) {
        setActiveCard(spaceData.find((item) => item.type === "exoplanet"));
      }
    } else if (
      lowerCommand.includes("close") ||
      lowerCommand.includes("hide")
    ) {
      setActiveCard(null);
    }
  };

  // Start/stop voice recognition
  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    if (!enableDragAndDrop) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  const handleDragOver = (e) => {
    if (!enableDragAndDrop) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    if (!enableDragAndDrop) return;
    e.preventDefault();
    setDraggedItem(null);
  };

  // Card variants for animations
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      rotateX: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 30,
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Voice Control Panel */}
      {enableVoiceControl && (
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Voice Control
          </h2>
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={toggleVoiceRecognition}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-neon-blue hover:bg-neon-blue/80 text-white"
              }`}
            >
              {isListening ? "Stop Listening" : "Start Voice Control"}
            </button>
            <div
              className={`w-3 h-3 rounded-full ${
                isListening ? "bg-red-500 animate-pulse" : "bg-gray-500"
              }`}
            ></div>
            <span className="text-slate-300">
              {isListening ? "Listening..." : "Voice control ready"}
            </span>
          </div>

          {voiceCommands.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">
                Recent Commands:
              </h3>
              <div className="space-y-1">
                {voiceCommands.map((command, index) => (
                  <div
                    key={index}
                    className="text-sm text-slate-300 bg-slate-700/50 rounded px-3 py-2"
                  >
                    "{command}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gesture Area */}
      {enableGestures && (
        <div
          ref={gestureAreaRef}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-8 min-h-[300px] relative overflow-hidden"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            Gesture Interaction
          </h2>
          <p className="text-slate-300 mb-6">
            Move your mouse around to see the 3D effect
          </p>

          <motion.div
            className="w-32 h-32 mx-auto bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center"
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              scale: scale,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-white font-bold text-lg">3D</span>
          </motion.div>

          <div className="mt-6 text-center text-sm text-slate-400">
            <div>X: {gestureData.x.toFixed(2)}</div>
            <div>Y: {gestureData.y.toFixed(2)}</div>
            <div>Scale: {gestureData.scale.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Interactive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {spaceData.map((item, index) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={enableHoverEffects ? "hover" : {}}
            whileTap="tap"
            drag={enableDragAndDrop}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="card-holographic cursor-pointer"
            onClick={() => setActiveCard(item)}
            style={{
              zIndex: draggedItem?.id === item.id ? 1000 : 1,
            }}
          >
            <div className="aspect-video bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-4xl">
                {item.type === "telescope" && (
                  <Icon name="telescope" size={20} />
                )}
                {item.type === "rover" && <Icon name="gear" size={20} />}
                {item.type === "station" && <Icon name="satellite" size={20} />}
                {item.type === "exoplanet" && (
                  <Icon name="satellite" size={20} />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <p className="text-slate-300 text-sm">{item.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Year:</span>
                  <div className="text-white font-medium">
                    {item.data.launchYear || item.data.discoveryYear}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Cost:</span>
                  <div className="text-white font-medium">
                    ${item.data.cost}B
                  </div>
                </div>
              </div>

              {enableDragAndDrop && (
                <div className="text-xs text-slate-500 text-center">
                  Drag to move
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Active Card */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveCard(null)}
          >
            <motion.div
              className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-white">
                    {activeCard.title}
                  </h2>
                  <button
                    onClick={() => setActiveCard(null)}
                    className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-white transition-colors duration-300"
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

                <div className="aspect-video bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-6xl">
                    {activeCard.type === "telescope" && (
                      <Icon name="telescope" size={24} />
                    )}
                    {activeCard.type === "rover" && (
                      <Icon name="gear" size={24} />
                    )}
                    {activeCard.type === "station" && (
                      <Icon name="satellite" size={24} />
                    )}
                    {activeCard.type === "exoplanet" && (
                      <Icon name="satellite" size={24} />
                    )}
                  </div>
                </div>

                <p className="text-slate-300 text-lg mb-6">
                  {activeCard.description}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="text-white capitalize">
                          {activeCard.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-white capitalize">
                          {activeCard.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Year:</span>
                        <span className="text-white">
                          {activeCard.data.launchYear ||
                            activeCard.data.discoveryYear}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Cost:</span>
                        <span className="text-white">
                          ${activeCard.data.cost}B
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Interactive Features
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-slate-300 text-sm">
                          3D Hover Effects
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-slate-300 text-sm">
                          Gesture Recognition
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-slate-300 text-sm">
                          Voice Commands
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-slate-300 text-sm">
                          Drag & Drop
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedInteractions;
