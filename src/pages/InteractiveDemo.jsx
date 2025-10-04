import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@contexts/I18nContext'
import AdvancedInteractions from '@components/UI/AdvancedInteractions'
import SpaceSimulationGame from '@components/Games/SpaceSimulationGame'

const InteractiveDemo = () => {
  const { t } = useI18n()
  const [activeDemo, setActiveDemo] = useState('interactions')
  const [enableGestures, setEnableGestures] = useState(true)
  const [enableHoverEffects, setEnableHoverEffects] = useState(true)
  const [enableDragAndDrop, setEnableDragAndDrop] = useState(true)
  const [enableVoiceControl, setEnableVoiceControl] = useState(false)
  const [gameDifficulty, setGameDifficulty] = useState('normal')
  const [gameMode, setGameMode] = useState('classic')

  const demos = [
    {
      id: 'interactions',
      name: 'Advanced Interactions',
      description: 'Gesture recognition, voice control, and immersive UI interactions',
      component: AdvancedInteractions,
      props: {
        enableGestures,
        enableHoverEffects,
        enableDragAndDrop,
        enableVoiceControl
      }
    },
    {
      id: 'game',
      name: 'Space Simulation Game',
      description: 'Interactive space game with physics simulation and real-time gameplay',
      component: SpaceSimulationGame,
      props: {
        difficulty: gameDifficulty,
        mode: gameMode
      }
    }
  ]

  const difficulties = [
    { id: 'easy', name: 'Easy', description: 'Slower asteroids, more lives' },
    { id: 'normal', name: 'Normal', description: 'Balanced gameplay' },
    { id: 'hard', name: 'Hard', description: 'Faster asteroids, fewer lives' },
    { id: 'expert', name: 'Expert', description: 'Maximum challenge' }
  ]

  const gameModes = [
    { id: 'classic', name: 'Classic', description: 'Traditional asteroid game' },
    { id: 'survival', name: 'Survival', description: 'Endless wave mode' },
    { id: 'time-attack', name: 'Time Attack', description: 'Score as much as possible in time limit' },
    { id: 'boss-rush', name: 'Boss Rush', description: 'Face powerful boss asteroids' }
  ]

  const currentDemo = demos.find(demo => demo.id === activeDemo)
  const DemoComponent = currentDemo?.component

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
            Interactive Demonstrations
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience cutting-edge web interactions, gesture recognition, voice control, and immersive gameplay
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
                    ? 'border-neon-blue bg-neon-blue/20 text-neon-blue'
                    : 'border-slate-600 text-slate-300 hover:border-slate-500'
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
            <h3 className="text-xl font-semibold text-white mb-4">Demo Controls</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Advanced Interactions Controls */}
              {activeDemo === 'interactions' && (
                <>
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-white">Interaction Features</h4>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enableGestures}
                        onChange={(e) => setEnableGestures(e.target.checked)}
                        className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                      />
                      <span className="text-slate-300">Gesture Recognition</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enableHoverEffects}
                        onChange={(e) => setEnableHoverEffects(e.target.checked)}
                        className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                      />
                      <span className="text-slate-300">3D Hover Effects</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enableDragAndDrop}
                        onChange={(e) => setEnableDragAndDrop(e.target.checked)}
                        className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                      />
                      <span className="text-slate-300">Drag & Drop</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enableVoiceControl}
                        onChange={(e) => setEnableVoiceControl(e.target.checked)}
                        className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
                      />
                      <span className="text-slate-300">Voice Control</span>
                    </label>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Voice Commands</h4>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div>• "Show telescope" - Display telescope info</div>
                      <div>• "Show rover" - Display rover info</div>
                      <div>• "Show station" - Display space station info</div>
                      <div>• "Show planet" - Display exoplanet info</div>
                      <div>• "Close" - Close current modal</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Gesture Controls</h4>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div>• Mouse movement - 3D rotation effects</div>
                      <div>• Hover - Interactive card animations</div>
                      <div>• Click - Open detailed views</div>
                      <div>• Drag - Move interactive elements</div>
                    </div>
                  </div>
                </>
              )}

              {/* Game Controls */}
              {activeDemo === 'game' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={gameDifficulty}
                      onChange={(e) => setGameDifficulty(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty.id} value={difficulty.id}>
                          {difficulty.name} - {difficulty.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Game Mode
                    </label>
                    <select
                      value={gameMode}
                      onChange={(e) => setGameMode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      {gameModes.map(mode => (
                        <option key={mode.id} value={mode.id}>
                          {mode.name} - {mode.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Game Controls</h4>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div>• Arrow Keys / WASD - Move ship</div>
                      <div>• Spacebar - Shoot</div>
                      <div>• P - Pause/Resume</div>
                      <div>• R - Restart (when game over)</div>
                    </div>
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
              >
                {DemoComponent && (
                  <DemoComponent
                    {...currentDemo.props}
                    className="w-full"
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
            <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div>• React with Hooks</div>
              <div>• Framer Motion animations</div>
              <div>• Web Speech API</div>
              <div>• Canvas 2D rendering</div>
              <div>• Gesture recognition</div>
              <div>• Real-time physics</div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div>• Voice command recognition</div>
              <div>• 3D hover effects</div>
              <div>• Drag and drop interactions</div>
              <div>• Real-time game engine</div>
              <div>• Particle systems</div>
              <div>• Collision detection</div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Performance</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div>• 60fps animations</div>
              <div>• Optimized rendering</div>
              <div>• Memory management</div>
              <div>• Event throttling</div>
              <div>• Lazy loading</div>
              <div>• Error boundaries</div>
            </div>
          </div>
        </motion.div>

        {/* Browser Compatibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-slate-800/50 rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Browser Compatibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Required Features:</h4>
              <div className="space-y-1">
                <div>• WebGL support</div>
                <div>• Canvas 2D context</div>
                <div>• Web Speech API (for voice control)</div>
                <div>• Modern JavaScript (ES6+)</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Recommended Browsers:</h4>
              <div className="space-y-1">
                <div>• Chrome 80+</div>
                <div>• Firefox 75+</div>
                <div>• Safari 13+</div>
                <div>• Edge 80+</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-slate-800/50 rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Getting Started</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div>
              <h4 className="font-semibold text-white mb-2">For Advanced Interactions:</h4>
              <div className="space-y-1">
                <div>1. Enable voice control if desired</div>
                <div>2. Move your mouse around for 3D effects</div>
                <div>3. Click on cards to see detailed information</div>
                <div>4. Try dragging elements around</div>
                <div>5. Use voice commands to control the interface</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">For Space Game:</h4>
              <div className="space-y-1">
                <div>1. Click "Start Game" to begin</div>
                <div>2. Use arrow keys or WASD to move</div>
                <div>3. Press spacebar to shoot asteroids</div>
                <div>4. Collect power-ups for bonuses</div>
                <div>5. Avoid colliding with asteroids</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default InteractiveDemo
