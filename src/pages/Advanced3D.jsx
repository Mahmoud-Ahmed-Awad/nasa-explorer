import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@contexts/I18nContext";
import AdvancedSpaceScene from "@components/3D/AdvancedSpaceScene";
import ParticleSystem from "@components/3D/ParticleSystem";
import PhysicsEngine from "@components/3D/PhysicsEngine";
import WebGLShaders from "@components/3D/WebGLShaders";
import VRARSupport from "@components/3D/VRARSupport";

const Advanced3D = () => {
  const { t } = useI18n();
  const [activeDemo, setActiveDemo] = useState("advanced-scene");
  const [sceneComplexity, setSceneComplexity] = useState("high");
  const [enablePostProcessing, setEnablePostProcessing] = useState(true);
  const [enableLensFlare, setEnableLensFlare] = useState(true);
  const [enableParticleSystems, setEnableParticleSystems] = useState(true);
  const [enablePhysics, setEnablePhysics] = useState(true);
  const [shaderType, setShaderType] = useState("nebula");
  const [shaderIntensity, setShaderIntensity] = useState(1.0);
  const [shaderSpeed, setShaderSpeed] = useState(1.0);
  const [particleCount, setParticleCount] = useState(1000);
  const [particleType, setParticleType] = useState("stars");
  const [vrMode, setVrMode] = useState("vr");
  const [enableControllers, setEnableControllers] = useState(true);
  const [enableHandTracking, setEnableHandTracking] = useState(false);

  const demos = [
    {
      id: "advanced-scene",
      name: "Advanced Space Scene",
      description:
        "Complex 3D space environment with planets, asteroids, and effects",
      component: AdvancedSpaceScene,
      props: {
        sceneComplexity,
        enablePostProcessing,
        enableLensFlare,
        enableParticleSystems,
      },
    },
    {
      id: "particle-system",
      name: "Particle Systems",
      description:
        "Advanced particle effects for stars, nebula, and cosmic phenomena",
      component: ParticleSystem,
      props: {
        count: particleCount,
        type: particleType,
        enablePhysics,
        enableTrails: true,
        trailLength: 20,
      },
    },
    {
      id: "physics-engine",
      name: "Physics Simulation",
      description:
        "Real-time physics simulation with gravity, collisions, and orbital mechanics",
      component: PhysicsEngine,
      props: {
        enableGravity: true,
        enableCollisions: true,
        enableOrbitalMechanics: true,
        objectCount: 50,
        simulationSpeed: 1,
      },
    },
    {
      id: "webgl-shaders",
      name: "WebGL Shaders",
      description:
        "Custom shader effects for nebula, aurora, black holes, and galaxies",
      component: WebGLShaders,
      props: {
        shaderType,
        intensity: shaderIntensity,
        speed: shaderSpeed,
        colors: {
          primary: [0.0, 0.5, 1.0],
          secondary: [1.0, 0.0, 0.5],
          tertiary: [0.5, 1.0, 0.0],
        },
      },
    },
    {
      id: "vr-ar",
      name: "VR/AR Support",
      description:
        "Immersive VR and AR experiences with hand tracking and controllers",
      component: VRARSupport,
      props: {
        mode: vrMode,
        enableControllers,
        enableHandTracking,
        sceneType: "space",
      },
    },
  ];

  const shaderTypes = [
    {
      id: "nebula",
      name: "Nebula",
      description: "Cosmic gas clouds with fractal noise",
    },
    {
      id: "aurora",
      name: "Aurora",
      description: "Northern lights effect with flowing patterns",
    },
    {
      id: "blackhole",
      name: "Black Hole",
      description: "Gravitational lensing and accretion disk",
    },
    {
      id: "wormhole",
      name: "Wormhole",
      description: "Spacetime tunnel with energy rings",
    },
    {
      id: "galaxy",
      name: "Galaxy",
      description: "Spiral galaxy with dust lanes and star fields",
    },
  ];

  const particleTypes = [
    { id: "stars", name: "Stars", description: "Twinkling star field" },
    { id: "nebula", name: "Nebula", description: "Cosmic gas particles" },
    {
      id: "comet",
      name: "Comet",
      description: "Comet with trailing particles",
    },
    {
      id: "solar-wind",
      name: "Solar Wind",
      description: "Streaming charged particles",
    },
    { id: "debris", name: "Space Debris", description: "Chaotic debris field" },
  ];

  const complexityLevels = [
    {
      id: "low",
      name: "Low",
      description: "1000 stars, 3 planets, 50 asteroids",
    },
    {
      id: "medium",
      name: "Medium",
      description: "2500 stars, 6 planets, 150 asteroids",
    },
    {
      id: "high",
      name: "High",
      description: "5000 stars, 12 planets, 300 asteroids",
    },
    {
      id: "ultra",
      name: "Ultra",
      description: "10000 stars, 20 planets, 500 asteroids",
    },
  ];

  const currentDemo = demos.find((demo) => demo.id === activeDemo);
  const DemoComponent = currentDemo?.component;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gradient font-space mb-4">
            Advanced 3D Experiences
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Explore cutting-edge 3D graphics, physics simulations, and immersive
            VR/AR experiences
          </p>
        </motion.div>

        {/* Demo Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`px-6 py-3 rounded-lg border transition-all duration-300 ${
                  activeDemo === demo.id
                    ? "border-neon-blue bg-neon-blue/20 text-neon-blue"
                    : "border-slate-600 text-slate-300 hover:border-slate-500"
                }`}
              >
                {demo.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Demo Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-semibold text-white mb-2">
            {currentDemo?.name}
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            {currentDemo?.description}
          </p>
        </motion.div>

        {/* Controls Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Controls & Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Advanced Scene Controls */}
              {activeDemo === "advanced-scene" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Scene Complexity
                    </label>
                    <select
                      value={sceneComplexity}
                      onChange={(e) => setSceneComplexity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      {complexityLevels.map((level) => (
                        <option key={level.id} value={level.id}>
                          {level.name} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enablePostProcessing}
                        onChange={(e) =>
                          setEnablePostProcessing(e.target.checked)
                        }
                        className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                      />
                      <span className="text-slate-300">
                        Post-Processing Effects
                      </span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enableLensFlare}
                        onChange={(e) => setEnableLensFlare(e.target.checked)}
                        className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                      />
                      <span className="text-slate-300">Lens Flare</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enableParticleSystems}
                        onChange={(e) =>
                          setEnableParticleSystems(e.target.checked)
                        }
                        className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                      />
                      <span className="text-slate-300">Particle Systems</span>
                    </label>
                  </div>
                </>
              )}

              {/* Particle System Controls */}
              {activeDemo === "particle-system" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Particle Type
                    </label>
                    <select
                      value={particleType}
                      onChange={(e) => setParticleType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      {particleTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} - {type.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Particle Count: {particleCount}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="100"
                      value={particleCount}
                      onChange={(e) =>
                        setParticleCount(parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enablePhysics}
                        onChange={(e) => setEnablePhysics(e.target.checked)}
                        className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                      />
                      <span className="text-slate-300">Physics Simulation</span>
                    </label>
                  </div>
                </>
              )}

              {/* Shader Controls */}
              {activeDemo === "webgl-shaders" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Shader Type
                    </label>
                    <select
                      value={shaderType}
                      onChange={(e) => setShaderType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      {shaderTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} - {type.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Intensity: {shaderIntensity.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3.0"
                      step="0.1"
                      value={shaderIntensity}
                      onChange={(e) =>
                        setShaderIntensity(parseFloat(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Speed: {shaderSpeed.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="5.0"
                      step="0.1"
                      value={shaderSpeed}
                      onChange={(e) =>
                        setShaderSpeed(parseFloat(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                </>
              )}

              {/* VR/AR Controls */}
              {activeDemo === "vr-ar" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Mode
                    </label>
                    <select
                      value={vrMode}
                      onChange={(e) => setVrMode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="vr">Virtual Reality</option>
                      <option value="ar">Augmented Reality</option>
                      <option value="both">Both VR & AR</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enableControllers}
                        onChange={(e) => setEnableControllers(e.target.checked)}
                        className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                      />
                      <span className="text-slate-300">Enable Controllers</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enableHandTracking}
                        onChange={(e) =>
                          setEnableHandTracking(e.target.checked)
                        }
                        className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                      />
                      <span className="text-slate-300">Hand Tracking</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Demo Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-slate-800/30 rounded-lg p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="h-96"
              >
                {DemoComponent && (
                  <DemoComponent
                    {...currentDemo.props}
                    className="w-full h-full"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Technical Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Performance
            </h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div>• GPU-accelerated rendering</div>
              <div>• Adaptive quality settings</div>
              <div>• Real-time performance monitoring</div>
              <div>• Optimized for 60fps</div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Technologies
            </h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div>• Three.js WebGL engine</div>
              <div>• Custom shader programming</div>
              <div>• Physics simulation</div>
              <div>• WebXR for VR/AR</div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div>• Real-time particle systems</div>
              <div>• Advanced lighting models</div>
              <div>• Post-processing effects</div>
              <div>• Immersive interactions</div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-slate-800/50 rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Instructions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Mouse Controls:</h4>
              <div className="space-y-1">
                <div>• Left click + drag: Rotate view</div>
                <div>• Right click + drag: Pan view</div>
                <div>• Scroll wheel: Zoom in/out</div>
                <div>• Hover: Interactive elements</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">
                Keyboard Shortcuts:
              </h4>
              <div className="space-y-1">
                <div>• WASD: Move camera</div>
                <div>• Space: Toggle effects</div>
                <div>• R: Reset view</div>
                <div>• F: Fullscreen</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Advanced3D;
