import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@contexts/I18nContext'

// Simple game engine for space simulation
class SpaceGameEngine {
  constructor(canvas, context) {
    this.canvas = canvas
    this.ctx = context
    this.gameState = 'menu' // 'menu', 'playing', 'paused', 'gameOver'
    this.score = 0
    this.lives = 3
    this.level = 1
    this.asteroids = []
    this.bullets = []
    this.powerUps = []
    this.particles = []
    this.player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      angle: 0,
      velocity: { x: 0, y: 0 },
      thrust: false,
      radius: 15
    }
    this.keys = {}
    this.lastTime = 0
    this.asteroidSpawnTimer = 0
    this.powerUpSpawnTimer = 0
  }

  // Game loop
  update(deltaTime) {
    if (this.gameState !== 'playing') return

    this.updatePlayer(deltaTime)
    this.updateAsteroids(deltaTime)
    this.updateBullets(deltaTime)
    this.updatePowerUps(deltaTime)
    this.updateParticles(deltaTime)
    this.checkCollisions()
    this.spawnAsteroids(deltaTime)
    this.spawnPowerUps(deltaTime)
    this.updateLevel()
  }

  // Render game
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Draw starfield
    this.drawStarfield()
    
    if (this.gameState === 'menu') {
      this.drawMenu()
    } else if (this.gameState === 'playing' || this.gameState === 'paused') {
      this.drawGame()
    } else if (this.gameState === 'gameOver') {
      this.drawGameOver()
    }
  }

  // Update player
  updatePlayer(deltaTime) {
    const player = this.player
    
    // Handle input
    if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
      player.angle -= 0.1
    }
    if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
      player.angle += 0.1
    }
    if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'] || this.keys[' ']) {
      player.thrust = true
      const thrustForce = 0.3
      player.velocity.x += Math.cos(player.angle) * thrustForce
      player.velocity.y += Math.sin(player.angle) * thrustForce
    } else {
      player.thrust = false
    }

    // Apply velocity
    player.x += player.velocity.x * deltaTime
    player.y += player.velocity.y * deltaTime

    // Apply friction
    player.velocity.x *= 0.98
    player.velocity.y *= 0.98

    // Wrap around screen
    if (player.x < 0) player.x = this.canvas.width
    if (player.x > this.canvas.width) player.x = 0
    if (player.y < 0) player.y = this.canvas.height
    if (player.y > this.canvas.height) player.y = 0
  }

  // Update asteroids
  updateAsteroids(deltaTime) {
    this.asteroids.forEach(asteroid => {
      asteroid.x += asteroid.velocity.x * deltaTime
      asteroid.y += asteroid.velocity.y * deltaTime
      asteroid.angle += asteroid.rotationSpeed * deltaTime

      // Wrap around screen
      if (asteroid.x < -asteroid.radius) asteroid.x = this.canvas.width + asteroid.radius
      if (asteroid.x > this.canvas.width + asteroid.radius) asteroid.x = -asteroid.radius
      if (asteroid.y < -asteroid.radius) asteroid.y = this.canvas.height + asteroid.radius
      if (asteroid.y > this.canvas.height + asteroid.radius) asteroid.y = -asteroid.radius
    })
  }

  // Update bullets
  updateBullets(deltaTime) {
    this.bullets = this.bullets.filter(bullet => {
      bullet.x += bullet.velocity.x * deltaTime
      bullet.y += bullet.velocity.y * deltaTime
      bullet.life -= deltaTime

      // Remove bullets that are off screen or expired
      return bullet.life > 0 && 
             bullet.x > 0 && bullet.x < this.canvas.width &&
             bullet.y > 0 && bullet.y < this.canvas.height
    })
  }

  // Update power-ups
  updatePowerUps(deltaTime) {
    this.powerUps = this.powerUps.filter(powerUp => {
      powerUp.life -= deltaTime
      powerUp.angle += 0.02 * deltaTime
      return powerUp.life > 0
    })
  }

  // Update particles
  updateParticles(deltaTime) {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.velocity.x * deltaTime
      particle.y += particle.velocity.y * deltaTime
      particle.life -= deltaTime
      particle.alpha = particle.life / particle.maxLife
      return particle.life > 0
    })
  }

  // Check collisions
  checkCollisions() {
    // Bullet vs Asteroid
    this.bullets.forEach((bullet, bulletIndex) => {
      this.asteroids.forEach((asteroid, asteroidIndex) => {
        const dx = bullet.x - asteroid.x
        const dy = bullet.y - asteroid.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < asteroid.radius) {
          // Create explosion particles
          this.createExplosion(asteroid.x, asteroid.y, asteroid.radius)
          
          // Remove bullet and asteroid
          this.bullets.splice(bulletIndex, 1)
          this.asteroids.splice(asteroidIndex, 1)
          
          // Add score
          this.score += Math.floor(100 / asteroid.radius)
          
          // Split large asteroids
          if (asteroid.radius > 20) {
            this.splitAsteroid(asteroid)
          }
        }
      })
    })

    // Player vs Asteroid
    this.asteroids.forEach(asteroid => {
      const dx = this.player.x - asteroid.x
      const dy = this.player.y - asteroid.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < this.player.radius + asteroid.radius) {
        this.lives--
        this.createExplosion(this.player.x, this.player.y, 20)
        
        if (this.lives <= 0) {
          this.gameState = 'gameOver'
        } else {
          // Reset player position
          this.player.x = this.canvas.width / 2
          this.player.y = this.canvas.height / 2
          this.player.velocity = { x: 0, y: 0 }
        }
      }
    })

    // Player vs Power-up
    this.powerUps.forEach((powerUp, index) => {
      const dx = this.player.x - powerUp.x
      const dy = this.player.y - powerUp.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < this.player.radius + powerUp.radius) {
        this.collectPowerUp(powerUp)
        this.powerUps.splice(index, 1)
      }
    })
  }

  // Spawn asteroids
  spawnAsteroids(deltaTime) {
    this.asteroidSpawnTimer += deltaTime
    const spawnRate = Math.max(1000 - this.level * 100, 200)

    if (this.asteroidSpawnTimer > spawnRate) {
      this.asteroidSpawnTimer = 0
      this.createAsteroid()
    }
  }

  // Spawn power-ups
  spawnPowerUps(deltaTime) {
    this.powerUpSpawnTimer += deltaTime

    if (this.powerUpSpawnTimer > 10000) { // Every 10 seconds
      this.powerUpSpawnTimer = 0
      this.createPowerUp()
    }
  }

  // Create asteroid
  createAsteroid() {
    const side = Math.floor(Math.random() * 4)
    let x, y

    switch (side) {
      case 0: // Top
        x = Math.random() * this.canvas.width
        y = -50
        break
      case 1: // Right
        x = this.canvas.width + 50
        y = Math.random() * this.canvas.height
        break
      case 2: // Bottom
        x = Math.random() * this.canvas.width
        y = this.canvas.height + 50
        break
      case 3: // Left
        x = -50
        y = Math.random() * this.canvas.height
        break
    }

    const angle = Math.atan2(this.player.y - y, this.player.x - x)
    const speed = 0.1 + Math.random() * 0.1

    this.asteroids.push({
      x: x,
      y: y,
      radius: 20 + Math.random() * 30,
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      },
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    })
  }

  // Split asteroid
  splitAsteroid(asteroid) {
    const newRadius = asteroid.radius / 2
    if (newRadius < 10) return

    for (let i = 0; i < 2; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.1 + Math.random() * 0.1

      this.asteroids.push({
        x: asteroid.x,
        y: asteroid.y,
        radius: newRadius,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      })
    }
  }

  // Create power-up
  createPowerUp() {
    this.powerUps.push({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: 15,
      type: Math.random() > 0.5 ? 'health' : 'multishot',
      angle: 0,
      life: 5000 // 5 seconds
    })
  }

  // Collect power-up
  collectPowerUp(powerUp) {
    if (powerUp.type === 'health') {
      this.lives = Math.min(this.lives + 1, 5)
    } else if (powerUp.type === 'multishot') {
      // Implement multishot logic
      this.score += 50
    }
  }

  // Create explosion
  createExplosion(x, y, size) {
    const particleCount = Math.floor(size / 2)
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount
      const speed = 0.1 + Math.random() * 0.2
      
      this.particles.push({
        x: x,
        y: y,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        life: 1000,
        maxLife: 1000,
        alpha: 1,
        size: 2 + Math.random() * 3
      })
    }
  }

  // Shoot bullet
  shoot() {
    if (this.gameState !== 'playing') return

    const bulletSpeed = 0.5
    this.bullets.push({
      x: this.player.x,
      y: this.player.y,
      velocity: {
        x: Math.cos(this.player.angle) * bulletSpeed,
        y: Math.sin(this.player.angle) * bulletSpeed
      },
      life: 2000 // 2 seconds
    })
  }

  // Draw starfield
  drawStarfield() {
    this.ctx.fillStyle = '#000011'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw stars
    this.ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 100; i++) {
      const x = (i * 7) % this.canvas.width
      const y = (i * 11) % this.canvas.height
      this.ctx.fillRect(x, y, 1, 1)
    }
  }

  // Draw menu
  drawMenu() {
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '48px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('SPACE SIMULATION', this.canvas.width / 2, this.canvas.height / 2 - 50)
    
    this.ctx.font = '24px Arial'
    this.ctx.fillText('Press SPACE to Start', this.canvas.width / 2, this.canvas.height / 2 + 50)
    
    this.ctx.font = '16px Arial'
    this.ctx.fillText('Use Arrow Keys or WASD to move, SPACE to shoot', this.canvas.width / 2, this.canvas.height / 2 + 100)
  }

  // Draw game
  drawGame() {
    // Draw player
    this.ctx.save()
    this.ctx.translate(this.player.x, this.player.y)
    this.ctx.rotate(this.player.angle)
    
    this.ctx.strokeStyle = '#00ff00'
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(20, 0)
    this.ctx.lineTo(-10, -10)
    this.ctx.lineTo(-5, 0)
    this.ctx.lineTo(-10, 10)
    this.ctx.closePath()
    this.ctx.stroke()
    
    // Draw thrust
    if (this.player.thrust) {
      this.ctx.strokeStyle = '#ff0000'
      this.ctx.beginPath()
      this.ctx.moveTo(-10, 0)
      this.ctx.lineTo(-20, -5)
      this.ctx.lineTo(-15, 0)
      this.ctx.lineTo(-20, 5)
      this.ctx.stroke()
    }
    
    this.ctx.restore()

    // Draw asteroids
    this.asteroids.forEach(asteroid => {
      this.ctx.save()
      this.ctx.translate(asteroid.x, asteroid.y)
      this.ctx.rotate(asteroid.angle)
      
      this.ctx.strokeStyle = '#888888'
      this.ctx.lineWidth = 2
      this.ctx.beginPath()
      this.ctx.arc(0, 0, asteroid.radius, 0, Math.PI * 2)
      this.ctx.stroke()
      
      this.ctx.restore()
    })

    // Draw bullets
    this.bullets.forEach(bullet => {
      this.ctx.fillStyle = '#ffff00'
      this.ctx.beginPath()
      this.ctx.arc(bullet.x, bullet.y, 2, 0, Math.PI * 2)
      this.ctx.fill()
    })

    // Draw power-ups
    this.powerUps.forEach(powerUp => {
      this.ctx.save()
      this.ctx.translate(powerUp.x, powerUp.y)
      this.ctx.rotate(powerUp.angle)
      
      this.ctx.fillStyle = powerUp.type === 'health' ? '#00ff00' : '#ff00ff'
      this.ctx.beginPath()
      this.ctx.arc(0, 0, powerUp.radius, 0, Math.PI * 2)
      this.ctx.fill()
      
      this.ctx.restore()
    })

    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.save()
      this.ctx.globalAlpha = particle.alpha
      this.ctx.fillStyle = '#ff8800'
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fill()
      this.ctx.restore()
    })

    // Draw UI
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '20px Arial'
    this.ctx.textAlign = 'left'
    this.ctx.fillText(`Score: ${this.score}`, 20, 30)
    this.ctx.fillText(`Lives: ${this.lives}`, 20, 60)
    this.ctx.fillText(`Level: ${this.level}`, 20, 90)

    if (this.gameState === 'paused') {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      
      this.ctx.fillStyle = '#ffffff'
      this.ctx.font = '48px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2)
    }
  }

  // Draw game over
  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '48px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50)
    
    this.ctx.font = '24px Arial'
    this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20)
    
    this.ctx.font = '16px Arial'
    this.ctx.fillText('Press R to Restart', this.canvas.width / 2, this.canvas.height / 2 + 60)
  }

  // Update level
  updateLevel() {
    const newLevel = Math.floor(this.score / 1000) + 1
    if (newLevel > this.level) {
      this.level = newLevel
      this.lives++ // Bonus life every level
    }
  }

  // Start game
  start() {
    this.gameState = 'playing'
    this.score = 0
    this.lives = 3
    this.level = 1
    this.asteroids = []
    this.bullets = []
    this.powerUps = []
    this.particles = []
    this.player.x = this.canvas.width / 2
    this.player.y = this.canvas.height / 2
    this.player.velocity = { x: 0, y: 0 }
  }

  // Pause/Resume game
  togglePause() {
    if (this.gameState === 'playing') {
      this.gameState = 'paused'
    } else if (this.gameState === 'paused') {
      this.gameState = 'playing'
    }
  }

  // Restart game
  restart() {
    this.start()
  }
}

const SpaceSimulationGame = ({ className = '' }) => {
  const { t } = useI18n()
  const canvasRef = useRef(null)
  const gameEngineRef = useRef(null)
  const animationIdRef = useRef(null)
  const [gameState, setGameState] = useState('menu')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [level, setLevel] = useState(1)

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const gameEngine = new SpaceGameEngine(canvas, ctx)
    gameEngineRef.current = gameEngine

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Game loop
    let lastTime = 0
    const gameLoop = (currentTime) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      gameEngine.update(deltaTime)
      gameEngine.render()

      // Update state
      setGameState(gameEngine.gameState)
      setScore(gameEngine.score)
      setLives(gameEngine.lives)
      setLevel(gameEngine.level)

      animationIdRef.current = requestAnimationFrame(gameLoop)
    }

    animationIdRef.current = requestAnimationFrame(gameLoop)

    // Event listeners
    const handleKeyDown = (e) => {
      gameEngine.keys[e.key] = true

      if (e.key === ' ') {
        e.preventDefault()
        if (gameEngine.gameState === 'menu') {
          gameEngine.start()
        } else if (gameEngine.gameState === 'playing') {
          gameEngine.shoot()
        }
      } else if (e.key === 'p' || e.key === 'P') {
        gameEngine.togglePause()
      } else if (e.key === 'r' || e.key === 'R') {
        if (gameEngine.gameState === 'gameOver') {
          gameEngine.restart()
        }
      }
    }

    const handleKeyUp = (e) => {
      gameEngine.keys[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  const startGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.start()
    }
  }

  const togglePause = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.togglePause()
    }
  }

  const restartGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restart()
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gradient font-space">Space Simulation Game</h2>
        <div className="flex items-center space-x-4">
          <div className="text-white">
            <span className="text-slate-400">Score: </span>
            <span className="font-bold text-neon-blue">{score}</span>
          </div>
          <div className="text-white">
            <span className="text-slate-400">Lives: </span>
            <span className="font-bold text-neon-green">{lives}</span>
          </div>
          <div className="text-white">
            <span className="text-slate-400">Level: </span>
            <span className="font-bold text-neon-purple">{level}</span>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-96 bg-black rounded-lg border border-slate-700"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Game Overlay */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-4">Space Simulation</h3>
              <p className="text-slate-300 mb-6">Navigate through space and destroy asteroids!</p>
              <button
                onClick={startGame}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Controls</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Move:</span>
              <span>Arrow Keys or WASD</span>
            </div>
            <div className="flex justify-between">
              <span>Shoot:</span>
              <span>Spacebar</span>
            </div>
            <div className="flex justify-between">
              <span>Pause:</span>
              <span>P</span>
            </div>
            <div className="flex justify-between">
              <span>Restart:</span>
              <span>R (when game over)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Game Rules</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div>• Destroy asteroids to earn points</div>
            <div>• Avoid colliding with asteroids</div>
            <div>• Collect power-ups for bonuses</div>
            <div>• Gain extra life every 1000 points</div>
            <div>• Game gets harder each level</div>
          </div>
        </div>
      </div>

      {/* Game Actions */}
      <div className="flex justify-center space-x-4">
        {gameState === 'menu' && (
          <button onClick={startGame} className="btn-primary">
            Start Game
          </button>
        )}
        
        {gameState === 'playing' && (
          <button onClick={togglePause} className="btn-secondary">
            Pause
          </button>
        )}
        
        {gameState === 'paused' && (
          <button onClick={togglePause} className="btn-primary">
            Resume
          </button>
        )}
        
        {gameState === 'gameOver' && (
          <button onClick={restartGame} className="btn-primary">
            Play Again
          </button>
        )}
      </div>
    </div>
  )
}

export default SpaceSimulationGame
