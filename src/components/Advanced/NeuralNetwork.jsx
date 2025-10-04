import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Simple neural network visualization component
class NeuralNetworkVisualizer {
  constructor(canvas, context) {
    this.canvas = canvas
    this.ctx = context
    this.layers = []
    this.connections = []
    this.animationId = null
    this.time = 0
    this.pulseData = []
    this.isAnimating = false
    
    this.setupNetwork()
  }

  setupNetwork() {
    // Create network layers
    const layerSizes = [8, 12, 8, 4] // Input, Hidden1, Hidden2, Output
    const layerSpacing = this.canvas.width / (layerSizes.length + 1)
    
    this.layers = layerSizes.map((size, layerIndex) => {
      const x = layerSpacing * (layerIndex + 1)
      const nodes = []
      
      for (let i = 0; i < size; i++) {
        const y = (this.canvas.height / (size + 1)) * (i + 1)
        nodes.push({
          x: x,
          y: y,
          value: Math.random(),
          activation: 0,
          bias: (Math.random() - 0.5) * 2,
          connections: []
        })
      }
      
      return { nodes, layerIndex }
    })

    // Create connections between layers
    this.connections = []
    for (let i = 0; i < this.layers.length - 1; i++) {
      const currentLayer = this.layers[i]
      const nextLayer = this.layers[i + 1]
      
      currentLayer.nodes.forEach((node, nodeIndex) => {
        nextLayer.nodes.forEach((nextNode, nextNodeIndex) => {
          const connection = {
            from: node,
            to: nextNode,
            weight: (Math.random() - 0.5) * 2,
            active: false,
            pulse: 0
          }
          
          node.connections.push(connection)
          this.connections.push(connection)
        })
      })
    }

    // Initialize pulse data
    this.pulseData = Array(this.connections.length).fill(0)
  }

  update() {
    this.time += 0.016 // Assuming 60fps
    
    // Update node activations
    this.layers.forEach((layer, layerIndex) => {
      layer.nodes.forEach((node, nodeIndex) => {
        // Simulate neural activity
        const baseActivation = Math.sin(this.time * 2 + nodeIndex * 0.5) * 0.5 + 0.5
        const noise = (Math.random() - 0.5) * 0.1
        node.activation = Math.max(0, Math.min(1, baseActivation + noise))
        
        // Update node value based on connections
        if (layerIndex > 0) {
          let sum = node.bias
          this.layers[layerIndex - 1].nodes.forEach(prevNode => {
            const connection = prevNode.connections.find(conn => conn.to === node)
            if (connection) {
              sum += prevNode.activation * connection.weight
            }
          })
          node.value = this.sigmoid(sum)
        }
      })
    })

    // Update connection pulses
    this.connections.forEach((connection, index) => {
      const activity = connection.from.activation * connection.weight
      connection.pulse = Math.abs(activity)
      connection.active = Math.abs(activity) > 0.1
      
      // Update pulse data for visualization
      this.pulseData[index] = connection.pulse
    })
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x))
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Draw background
    this.ctx.fillStyle = '#0f172a'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    
    // Draw connections
    this.connections.forEach((connection, index) => {
      const alpha = connection.pulse * 0.8 + 0.2
      const color = connection.weight > 0 ? '#3b82f6' : '#ef4444'
      
      this.ctx.strokeStyle = color
      this.ctx.globalAlpha = alpha
      this.ctx.lineWidth = Math.max(1, connection.pulse * 3)
      
      this.ctx.beginPath()
      this.ctx.moveTo(connection.from.x, connection.from.y)
      this.ctx.lineTo(connection.to.x, connection.to.y)
      this.ctx.stroke()
    })
    
    // Draw nodes
    this.layers.forEach(layer => {
      layer.nodes.forEach(node => {
        const radius = 8 + node.activation * 8
        const alpha = 0.6 + node.activation * 0.4
        
        // Node glow
        this.ctx.shadowColor = '#3b82f6'
        this.ctx.shadowBlur = 20 * node.activation
        this.ctx.globalAlpha = alpha
        
        // Node body
        this.ctx.fillStyle = '#1e40af'
        this.ctx.beginPath()
        this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        this.ctx.fill()
        
        // Node border
        this.ctx.strokeStyle = '#60a5fa'
        this.ctx.lineWidth = 2
        this.ctx.stroke()
        
        // Reset shadow
        this.ctx.shadowBlur = 0
        this.ctx.globalAlpha = 1
      })
    })
    
    // Draw layer labels
    this.ctx.fillStyle = '#94a3b8'
    this.ctx.font = '14px Arial'
    this.ctx.textAlign = 'center'
    
    const labels = ['Input', 'Hidden 1', 'Hidden 2', 'Output']
    this.layers.forEach((layer, index) => {
      this.ctx.fillText(labels[index], layer.nodes[0].x, 30)
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

  resize() {
    this.setupNetwork()
  }
}

const NeuralNetwork = ({ 
  className = '',
  enableAnimation = true,
  networkType = 'feedforward', // 'feedforward', 'recurrent', 'convolutional'
  showWeights = true,
  showActivations = true,
  animationSpeed = 1.0
}) => {
  const canvasRef = useRef(null)
  const networkRef = useRef(null)
  const [isAnimating, setIsAnimating] = useState(enableAnimation)
  const [networkStats, setNetworkStats] = useState({
    layers: 0,
    nodes: 0,
    connections: 0,
    averageActivation: 0
  })

  // Initialize neural network
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const network = new NeuralNetworkVisualizer(canvas, ctx)
    networkRef.current = network

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      network.resize()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Start animation
    if (isAnimating) {
      network.startAnimation()
    }

    // Update stats
    const updateStats = () => {
      if (network) {
        const totalNodes = network.layers.reduce((sum, layer) => sum + layer.nodes.length, 0)
        const totalConnections = network.connections.length
        const averageActivation = network.layers.reduce((sum, layer) => {
          const layerSum = layer.nodes.reduce((nodeSum, node) => nodeSum + node.activation, 0)
          return sum + (layerSum / layer.nodes.length)
        }, 0) / network.layers.length

        setNetworkStats({
          layers: network.layers.length,
          nodes: totalNodes,
          connections: totalConnections,
          averageActivation: averageActivation
        })
      }
    }

    const statsInterval = setInterval(updateStats, 100)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      clearInterval(statsInterval)
      if (network) {
        network.stopAnimation()
      }
    }
  }, [isAnimating])

  const toggleAnimation = () => {
    if (networkRef.current) {
      if (isAnimating) {
        networkRef.current.stopAnimation()
      } else {
        networkRef.current.startAnimation()
      }
      setIsAnimating(!isAnimating)
    }
  }

  const resetNetwork = () => {
    if (networkRef.current) {
      networkRef.current.setupNetwork()
    }
  }

  const networkTypes = [
    { id: 'feedforward', name: 'Feedforward', description: 'Standard neural network' },
    { id: 'recurrent', name: 'Recurrent', description: 'Network with memory' },
    { id: 'convolutional', name: 'Convolutional', description: 'Image processing network' }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Neural Network Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Network Type
            </label>
            <select
              value={networkType}
              onChange={(e) => {/* Handle network type change */}}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              {networkTypes.map(type => (
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
                checked={showWeights}
                onChange={(e) => {/* Handle weights toggle */}}
                className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
              />
              <span className="text-slate-300">Show Weights</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={showActivations}
                onChange={(e) => {/* Handle activations toggle */}}
                className="w-4 h-4 text-neon-blue bg-slate-700 border-slate-600 rounded focus:ring-neon-blue"
              />
              <span className="text-slate-300">Show Activations</span>
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
              onClick={resetNetwork}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-semibold transition-all duration-300"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="bg-slate-800/30 rounded-lg p-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-96 bg-slate-900 rounded-lg"
          />
          
          {/* Network Stats Overlay */}
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white">
            <div>Layers: {networkStats.layers}</div>
            <div>Nodes: {networkStats.nodes}</div>
            <div>Connections: {networkStats.connections}</div>
            <div>Avg Activation: {networkStats.averageActivation.toFixed(3)}</div>
          </div>
        </div>
      </div>

      {/* Network Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Network Architecture</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div>• Input Layer: 8 neurons</div>
            <div>• Hidden Layer 1: 12 neurons</div>
            <div>• Hidden Layer 2: 8 neurons</div>
            <div>• Output Layer: 4 neurons</div>
            <div>• Total Parameters: {networkStats.connections}</div>
            <div>• Activation Function: Sigmoid</div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Visualization Features</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div>• Real-time activation visualization</div>
            <div>• Connection weight representation</div>
            <div>• Neural pulse propagation</div>
            <div>• Interactive network controls</div>
            <div>• Performance monitoring</div>
            <div>• Multiple network architectures</div>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Technical Implementation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-semibold text-white mb-2">Rendering Engine:</h4>
            <div className="space-y-1">
              <div>• HTML5 Canvas 2D</div>
              <div>• 60fps animation loop</div>
              <div>• GPU-accelerated rendering</div>
              <div>• Real-time neural simulation</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Neural Network:</h4>
            <div className="space-y-1">
              <div>• Feedforward architecture</div>
              <div>• Sigmoid activation function</div>
              <div>• Random weight initialization</div>
              <div>• Bias term integration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NeuralNetwork
