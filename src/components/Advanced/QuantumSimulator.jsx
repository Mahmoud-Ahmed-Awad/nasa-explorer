import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Quantum state simulator
class QuantumSimulator {
  constructor(canvas, context) {
    this.canvas = canvas
    this.ctx = context
    this.qubits = []
    this.gates = []
    this.measurements = []
    this.animationId = null
    this.time = 0
    this.isAnimating = false
    this.quantumState = { amplitude: 0, phase: 0 }
    
    this.setupQuantumSystem()
  }

  setupQuantumSystem() {
    // Create quantum qubits
    this.qubits = []
    const qubitCount = 4
    const spacing = this.canvas.width / (qubitCount + 1)
    
    for (let i = 0; i < qubitCount; i++) {
      const x = spacing * (i + 1)
      const y = this.canvas.height / 2
      
      this.qubits.push({
        id: i,
        x: x,
        y: y,
        state: { amplitude: 1, phase: 0 },
        entangled: false,
        measured: false,
        measurement: null,
        probability: 0.5,
        radius: 20,
        color: '#3b82f6'
      })
    }

    // Create quantum gates
    this.gates = [
      {
        id: 'hadamard',
        name: 'Hadamard',
        x: this.canvas.width * 0.2,
        y: this.canvas.height * 0.3,
        type: 'unitary',
        matrix: [[1, 1], [1, -1]],
        active: false
      },
      {
        id: 'pauli-x',
        name: 'Pauli-X',
        x: this.canvas.width * 0.4,
        y: this.canvas.height * 0.3,
        type: 'unitary',
        matrix: [[0, 1], [1, 0]],
        active: false
      },
      {
        id: 'pauli-y',
        name: 'Pauli-Y',
        x: this.canvas.width * 0.6,
        y: this.canvas.height * 0.3,
        type: 'unitary',
        matrix: [[0, -1], [1, 0]],
        active: false
      },
      {
        id: 'pauli-z',
        name: 'Pauli-Z',
        x: this.canvas.width * 0.8,
        y: this.canvas.height * 0.3,
        type: 'unitary',
        matrix: [[1, 0], [0, -1]],
        active: false
      }
    ]

    // Initialize measurements
    this.measurements = []
  }

  update() {
    this.time += 0.016 // Assuming 60fps
    
    // Update quantum states
    this.qubits.forEach((qubit, index) => {
      if (!qubit.measured) {
        // Simulate quantum evolution
        qubit.state.phase += 0.02
        qubit.state.amplitude = Math.cos(this.time + index) * 0.5 + 0.5
        
        // Update probability
        qubit.probability = Math.abs(qubit.state.amplitude) ** 2
        
        // Update visual properties
        qubit.radius = 15 + qubit.probability * 10
        qubit.color = this.getQubitColor(qubit.state)
      }
    })

    // Update gate states
    this.gates.forEach(gate => {
      gate.active = Math.sin(this.time * 2 + gate.x * 0.01) > 0.5
    })

    // Simulate quantum entanglement
    this.simulateEntanglement()
  }

  getQubitColor(state) {
    const hue = (state.phase * 180 / Math.PI + 180) % 360
    const saturation = Math.abs(state.amplitude) * 100
    const lightness = 50 + Math.abs(state.amplitude) * 30
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  simulateEntanglement() {
    // Simple entanglement simulation between first two qubits
    if (this.qubits.length >= 2) {
      const qubit1 = this.qubits[0]
      const qubit2 = this.qubits[1]
      
      if (Math.random() < 0.1) { // 10% chance to entangle
        qubit1.entangled = true
        qubit2.entangled = true
        
        // Correlate their states
        qubit2.state.phase = qubit1.state.phase + Math.PI
        qubit2.state.amplitude = -qubit1.state.amplitude
      }
    }
  }

  applyGate(gateId, qubitId) {
    const gate = this.gates.find(g => g.id === gateId)
    const qubit = this.qubits.find(q => q.id === qubitId)
    
    if (gate && qubit && !qubit.measured) {
      // Apply quantum gate transformation
      const matrix = gate.matrix
      const oldState = { ...qubit.state }
      
      // Simple matrix multiplication simulation
      qubit.state.amplitude = matrix[0][0] * oldState.amplitude + matrix[0][1] * oldState.phase
      qubit.state.phase = matrix[1][0] * oldState.amplitude + matrix[1][1] * oldState.phase
      
      // Normalize state
      const norm = Math.sqrt(qubit.state.amplitude ** 2 + qubit.state.phase ** 2)
      qubit.state.amplitude /= norm
      qubit.state.phase /= norm
      
      // Trigger gate animation
      gate.active = true
      setTimeout(() => {
        gate.active = false
      }, 500)
    }
  }

  measureQubit(qubitId) {
    const qubit = this.qubits.find(q => q.id === qubitId)
    
    if (qubit && !qubit.measured) {
      // Quantum measurement collapses the state
      const probability = qubit.probability
      qubit.measured = true
      qubit.measurement = Math.random() < probability ? 1 : 0
      
      // Collapse the state
      qubit.state.amplitude = qubit.measurement
      qubit.state.phase = 0
      qubit.probability = qubit.measurement
      
      // Add measurement to history
      this.measurements.push({
        qubitId: qubitId,
        result: qubit.measurement,
        time: this.time,
        probability: probability
      })
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Draw background
    this.ctx.fillStyle = '#0f172a'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Draw quantum field background
    this.drawQuantumField()
    
    // Draw quantum gates
    this.gates.forEach(gate => {
      this.drawGate(gate)
    })
    
    // Draw qubits
    this.qubits.forEach(qubit => {
      this.drawQubit(qubit)
    })
    
    // Draw entanglement connections
    this.drawEntanglement()
    
    // Draw measurements
    this.drawMeasurements()
  }

  drawQuantumField() {
    // Draw quantum field visualization
    this.ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)'
    this.ctx.lineWidth = 1
    
    for (let x = 0; x < this.canvas.width; x += 20) {
      for (let y = 0; y < this.canvas.height; y += 20) {
        const wave = Math.sin(this.time * 2 + x * 0.01 + y * 0.01)
        if (Math.abs(wave) > 0.8) {
          this.ctx.beginPath()
          this.ctx.arc(x, y, 2, 0, Math.PI * 2)
          this.ctx.stroke()
        }
      }
    }
  }

  drawGate(gate) {
    const alpha = gate.active ? 1 : 0.6
    this.ctx.globalAlpha = alpha
    
    // Gate background
    this.ctx.fillStyle = gate.active ? '#3b82f6' : '#1e40af'
    this.ctx.fillRect(gate.x - 30, gate.y - 15, 60, 30)
    
    // Gate border
    this.ctx.strokeStyle = gate.active ? '#60a5fa' : '#3b82f6'
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(gate.x - 30, gate.y - 15, 60, 30)
    
    // Gate label
    this.ctx.fillStyle = '#ffffff'
    this.ctx.font = '12px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(gate.name, gate.x, gate.y + 4)
    
    this.ctx.globalAlpha = 1
  }

  drawQubit(qubit) {
    // Qubit glow
    this.ctx.shadowColor = qubit.color
    this.ctx.shadowBlur = 20
    
    // Qubit body
    this.ctx.fillStyle = qubit.color
    this.ctx.beginPath()
    this.ctx.arc(qubit.x, qubit.y, qubit.radius, 0, Math.PI * 2)
    this.ctx.fill()
    
    // Qubit border
    this.ctx.strokeStyle = qubit.entangled ? '#f59e0b' : '#60a5fa'
    this.ctx.lineWidth = qubit.entangled ? 3 : 2
    this.ctx.stroke()
    
    // Measurement indicator
    if (qubit.measured) {
      this.ctx.fillStyle = '#ffffff'
      this.ctx.font = 'bold 16px Arial'
      this.ctx.textAlign = 'center'
      this.ctx.fillText(qubit.measurement.toString(), qubit.x, qubit.y + 5)
    }
    
    // Probability visualization
    if (!qubit.measured) {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      this.ctx.lineWidth = 1
      this.ctx.beginPath()
      this.ctx.arc(qubit.x, qubit.y, qubit.radius + 5, 0, Math.PI * 2 * qubit.probability)
      this.ctx.stroke()
    }
    
    // Reset shadow
    this.ctx.shadowBlur = 0
  }

  drawEntanglement() {
    // Draw entanglement connections
    this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)'
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([5, 5])
    
    for (let i = 0; i < this.qubits.length - 1; i++) {
      if (this.qubits[i].entangled && this.qubits[i + 1].entangled) {
        this.ctx.beginPath()
        this.ctx.moveTo(this.qubits[i].x, this.qubits[i].y)
        this.ctx.lineTo(this.qubits[i + 1].x, this.qubits[i + 1].y)
        this.ctx.stroke()
      }
    }
    
    this.ctx.setLineDash([])
  }

  drawMeasurements() {
    // Draw measurement history
    this.ctx.fillStyle = '#94a3b8'
    this.ctx.font = '12px Arial'
    this.ctx.textAlign = 'left'
    
    this.measurements.slice(-5).forEach((measurement, index) => {
      const y = this.canvas.height - 100 + index * 15
      this.ctx.fillText(
        `Q${measurement.qubitId}: ${measurement.result} (p=${measurement.probability.toFixed(2)})`,
        10, y
      )
    })
  }

  startAnimation() {
    if (this.isAnimating) return
    
    this.isAnimating = true
    const animate = () => {
      if (!this.isAnimating) return
      
      this.update()
      this.render()
      
      this.animationId = requestAnimationFrame(animate)
    }
    
    animate()
  }

  stopAnimation() {
    this.isAnimating = false
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }

  reset() {
    this.setupQuantumSystem()
  }

  resize() {
    this.setupQuantumSystem()
  }
}

const QuantumSimulator = ({ 
  className = '',
  enableAnimation = true,
  simulationType = 'basic', // 'basic', 'advanced', 'entangled'
  showProbabilities = true,
  showEntanglement = true,
  animationSpeed = 1.0
}) => {
  const canvasRef = useRef(null)
  const simulatorRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(enableAnimation)
  const [selectedQubit, setSelectedQubit] = useState(null)
  const [selectedGate, setSelectedGate] = useState(null)
  const [quantumStats, setQuantumStats] = useState({
    qubits: 0,
    gates: 0,
    measurements: 0,
    entanglement: 0
  })

  // Initialize quantum simulator
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const simulator = new QuantumSimulator(canvas, ctx)
    simulatorRef.current = simulator

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      simulator.resize()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Start animation
    if (isAnimating) {
      simulator.startAnimation()
    }

    // Update stats
    const updateStats = () => {
      if (simulator) {
        setQuantumStats({
          qubits: simulator.qubits.length,
          gates: simulator.gates.length,
          measurements: simulator.measurements.length,
          entanglement: simulator.qubits.filter(q => q.entangled).length
        })
      }
    }

    const statsInterval = setInterval(updateStats, 100)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      clearInterval(statsInterval)
      if (simulator) {
        simulator.stopAnimation()
      }
    }
  }, [isAnimating])

  const toggleAnimation = () => {
    if (simulatorRef.current) {
      if (isAnimating) {
        simulatorRef.current.stopAnimation()
      } else {
        simulatorRef.current.startAnimation()
      }
      setIsAnimating(!isAnimating)
    }
  }

  const resetSimulator = () => {
    if (simulatorRef.current) {
      simulatorRef.current.reset()
    }
  }

  const applyGate = (gateId) => {
    if (simulatorRef.current && selectedQubit !== null) {
      simulatorRef.current.applyGate(gateId, selectedQubit)
    }
  }

  const measureQubit = (qubitId) => {
    if (simulatorRef.current) {
      simulatorRef.current.measureQubit(qubitId)
    }
  }

  const simulationTypes = [
    { id: 'basic', name: 'Basic', description: 'Simple quantum states' },
    { id: 'advanced', name: 'Advanced', description: 'Complex quantum operations' },
    { id: 'entangled', name: 'Entangled', description: 'Quantum entanglement simulation' }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Quantum Simulator Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Simulation Type
            </label>
            <select
              value={simulationType}
              onChange={(e) => {/* Handle simulation type change */}}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              {simulationTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showProbabilities}
                onChange={(e) => {/* Handle probabilities toggle */}}
                className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
              />
              <span className="text-slate-300">Show Probabilities</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showEntanglement}
                onChange={(e) => {/* Handle entanglement toggle */}}
                className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
              />
              <span className="text-slate-300">Show Entanglement</span>
            </label>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={toggleAnimation}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isAnimating
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-neon-blue hover:bg-neon-blue/80 text-white'
              }`}
            >
              {isAnimating ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={resetSimulator}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold transition-all duration-300"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Quantum Visualization */}
      <div className="bg-slate-800/30 rounded-lg p-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-96 bg-slate-900 rounded-lg"
          />
          
          {/* Quantum Stats Overlay */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white">
            <div>Qubits: {quantumStats.qubits}</div>
            <div>Gates: {quantumStats.gates}</div>
            <div>Measurements: {quantumStats.measurements}</div>
            <div>Entangled: {quantumStats.entanglement}</div>
          </div>
        </div>
      </div>

      {/* Quantum Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quantum Gates</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => applyGate('hadamard')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300"
            >
              Hadamard
            </button>
            <button
              onClick={() => applyGate('pauli-x')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300"
            >
              Pauli-X
            </button>
            <button
              onClick={() => applyGate('pauli-y')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300"
            >
              Pauli-Y
            </button>
            <button
              onClick={() => applyGate('pauli-z')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-300"
            >
              Pauli-Z
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Qubit Operations</h3>
          <div className="space-y-3">
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map(qubitId => (
                <button
                  key={qubitId}
                  onClick={() => setSelectedQubit(qubitId)}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    selectedQubit === qubitId
                      ? 'bg-neon-blue text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  Q{qubitId}
                </button>
              ))}
            </div>
            <button
              onClick={() => selectedQubit !== null && measureQubit(selectedQubit)}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300"
            >
              Measure Selected Qubit
            </button>
          </div>
        </div>
      </div>

      {/* Quantum Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quantum Principles</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div>• Superposition: Qubits exist in multiple states</div>
            <div>• Entanglement: Qubits can be correlated</div>
            <div>• Measurement: Collapses quantum state</div>
            <div>• Unitarity: Quantum gates are reversible</div>
            <div>• Probability: Born rule determines outcomes</div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Visualization Features</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div>• Real-time quantum state evolution</div>
            <div>• Gate operation visualization</div>
            <div>• Entanglement connection display</div>
            <div>• Measurement history tracking</div>
            <div>• Probability amplitude visualization</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuantumSimulator
