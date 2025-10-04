import React, { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Simple physics engine for space simulations
class SpacePhysicsEngine {
  constructor() {
    this.objects = []
    this.gravity = 0.0001
    this.timeStep = 0.016 // 60fps
    this.collisionDetection = true
    this.orbitalMechanics = true
  }

  addObject(object) {
    this.objects.push({
      mesh: object,
      mass: object.userData.mass || 1,
      velocity: object.userData.velocity || new THREE.Vector3(0, 0, 0),
      acceleration: new THREE.Vector3(0, 0, 0),
      force: new THREE.Vector3(0, 0, 0),
      isStatic: object.userData.isStatic || false,
      radius: object.userData.radius || 1,
      trail: object.userData.trail || null
    })
  }

  removeObject(object) {
    const index = this.objects.findIndex(obj => obj.mesh === object)
    if (index !== -1) {
      this.objects.splice(index, 1)
    }
  }

  update() {
    // Apply gravitational forces
    if (this.orbitalMechanics) {
      this.applyGravitationalForces()
    }

    // Update physics for each object
    this.objects.forEach(obj => {
      if (obj.isStatic) return

      // Apply forces
      obj.acceleration.copy(obj.force).divideScalar(obj.mass)
      
      // Update velocity
      obj.velocity.add(obj.acceleration.clone().multiplyScalar(this.timeStep))
      
      // Update position
      obj.mesh.position.add(obj.velocity.clone().multiplyScalar(this.timeStep))
      
      // Reset forces
      obj.force.set(0, 0, 0)
      
      // Update trail
      if (obj.trail) {
        this.updateTrail(obj)
      }
    })

    // Handle collisions
    if (this.collisionDetection) {
      this.handleCollisions()
    }
  }

  applyGravitationalForces() {
    for (let i = 0; i < this.objects.length; i++) {
      for (let j = i + 1; j < this.objects.length; j++) {
        const obj1 = this.objects[i]
        const obj2 = this.objects[j]

        const distance = obj1.mesh.position.distanceTo(obj2.mesh.position)
        if (distance < 0.1) continue // Avoid division by zero

        const force = (this.gravity * obj1.mass * obj2.mass) / (distance * distance)
        
        const direction = new THREE.Vector3()
          .subVectors(obj2.mesh.position, obj1.mesh.position)
          .normalize()

        const forceVector = direction.clone().multiplyScalar(force)
        
        obj1.force.add(forceVector)
        obj2.force.sub(forceVector)
      }
    }
  }

  handleCollisions() {
    for (let i = 0; i < this.objects.length; i++) {
      for (let j = i + 1; j < this.objects.length; j++) {
        const obj1 = this.objects[i]
        const obj2 = this.objects[j]

        const distance = obj1.mesh.position.distanceTo(obj2.mesh.position)
        const minDistance = obj1.radius + obj2.radius

        if (distance < minDistance) {
          this.resolveCollision(obj1, obj2)
        }
      }
    }
  }

  resolveCollision(obj1, obj2) {
    // Simple elastic collision resolution
    const normal = new THREE.Vector3()
      .subVectors(obj2.mesh.position, obj1.mesh.position)
      .normalize()

    const relativeVelocity = new THREE.Vector3()
      .subVectors(obj2.velocity, obj1.velocity)

    const velocityAlongNormal = relativeVelocity.dot(normal)

    if (velocityAlongNormal > 0) return // Objects are separating

    const restitution = 0.8 // Elasticity
    const impulse = -(1 + restitution) * velocityAlongNormal
    const totalMass = obj1.mass + obj2.mass

    const impulseVector = normal.clone().multiplyScalar(impulse)

    obj1.velocity.add(impulseVector.clone().multiplyScalar(obj2.mass / totalMass))
    obj2.velocity.sub(impulseVector.clone().multiplyScalar(obj1.mass / totalMass))

    // Separate objects
    const overlap = (obj1.radius + obj2.radius) - obj1.mesh.position.distanceTo(obj2.mesh.position)
    const separation = normal.clone().multiplyScalar(overlap * 0.5)

    obj1.mesh.position.sub(separation)
    obj2.mesh.position.add(separation)
  }

  updateTrail(obj) {
    if (!obj.trail) return

    const trail = obj.trail
    const positions = trail.geometry.attributes.position.array

    // Shift trail positions
    for (let i = positions.length - 3; i >= 3; i -= 3) {
      positions[i] = positions[i - 3]
      positions[i + 1] = positions[i - 2]
      positions[i + 2] = positions[i - 1]
    }

    // Add new position
    positions[0] = obj.mesh.position.x
    positions[1] = obj.mesh.position.y
    positions[2] = obj.mesh.position.z

    trail.geometry.attributes.position.needsUpdate = true
  }

  createTrail(object, length = 100) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(length * 3)
    const colors = new Float32Array(length * 3)

    for (let i = 0; i < length; i++) {
      const i3 = i * 3
      positions[i3] = object.position.x
      positions[i3 + 1] = object.position.y
      positions[i3 + 2] = object.position.z

      const alpha = 1 - (i / length)
      colors[i3] = 1 * alpha
      colors[i3 + 1] = 0.5 * alpha
      colors[i3 + 2] = 0 * alpha
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    })

    const trail = new THREE.Line(geometry, material)
    object.userData.trail = trail
    return trail
  }
}

const PhysicsEngine = ({ 
  className = '',
  enableGravity = true,
  enableCollisions = true,
  enableOrbitalMechanics = true,
  gravityStrength = 0.0001,
  objectCount = 50,
  simulationSpeed = 1
}) => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)
  const controlsRef = useRef(null)
  const physicsEngineRef = useRef(null)
  const objectsRef = useRef([])

  const [stats, setStats] = useState({
    objects: 0,
    collisions: 0,
    fps: 0
  })

  // Create physics objects
  const createPhysicsObjects = useMemo(() => {
    const objects = []
    
    for (let i = 0; i < objectCount; i++) {
      // Random object type
      const objectType = Math.random()
      let geometry, material, mass, radius

      if (objectType < 0.3) {
        // Planet
        radius = Math.random() * 5 + 2
        geometry = new THREE.SphereGeometry(radius, 16, 16)
        material = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
        })
        mass = radius * radius * radius
      } else if (objectType < 0.6) {
        // Asteroid
        radius = Math.random() * 2 + 0.5
        geometry = new THREE.DodecahedronGeometry(radius, 0)
        material = new THREE.MeshLambertMaterial({
          color: new THREE.Color().setHSL(0.1, 0.3, 0.3)
        })
        mass = radius * radius * radius * 0.5
      } else {
        // Space debris
        radius = Math.random() * 1 + 0.2
        geometry = new THREE.BoxGeometry(radius, radius, radius)
        material = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0, 0, 0.5)
        })
        mass = radius * radius * radius * 0.1
      }

      const mesh = new THREE.Mesh(geometry, material)
      
      // Random position
      mesh.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      )

      // Random velocity
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      )

      mesh.userData = {
        mass: mass,
        velocity: velocity,
        radius: radius,
        isStatic: false
      }

      objects.push(mesh)
    }

    return objects
  }, [objectCount])

  // Initialize physics simulation
  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000011)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      2000
    )
    camera.position.set(100, 100, 100)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxDistance = 500
    controls.minDistance = 10
    controlsRef.current = controls

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(50, 50, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Initialize physics engine
    const physicsEngine = new SpacePhysicsEngine()
    physicsEngine.gravity = gravityStrength
    physicsEngine.collisionDetection = enableCollisions
    physicsEngine.orbitalMechanics = enableOrbitalMechanics
    physicsEngineRef.current = physicsEngine

    // Add objects to scene and physics engine
    createPhysicsObjects.forEach(obj => {
      scene.add(obj)
      physicsEngine.addObject(obj)
      
      // Create trail for larger objects
      if (obj.userData.mass > 10) {
        const trail = physicsEngine.createTrail(obj, 50)
        scene.add(trail)
      }
    })

    objectsRef.current = createPhysicsObjects

    // Add central massive object (sun)
    const sunGeometry = new THREE.SphereGeometry(10, 32, 32)
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      emissive: 0xff4400
    })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    sun.position.set(0, 0, 0)
    sun.userData = {
      mass: 1000,
      velocity: new THREE.Vector3(0, 0, 0),
      radius: 10,
      isStatic: true
    }
    scene.add(sun)
    physicsEngine.addObject(sun)

    // Animation loop
    let frameCount = 0
    let lastTime = 0

    const animate = (currentTime) => {
      animationIdRef.current = requestAnimationFrame(animate)

      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      // Update physics
      physicsEngine.update()

      // Update controls
      controls.update()

      // Update stats
      frameCount++
      if (frameCount % 60 === 0) {
        setStats({
          objects: physicsEngine.objects.length,
          collisions: 0, // Would need to track this in physics engine
          fps: Math.round(1000 / deltaTime)
        })
      }

      renderer.render(scene, camera)
    }

    animate(0)

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return
      
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose()
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      
      renderer.dispose()
    }
  }, [enableGravity, enableCollisions, enableOrbitalMechanics, gravityStrength, objectCount, simulationSpeed, createPhysicsObjects])

  return (
    <div className={`relative ${className}`}>
      {/* Physics Stats */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white z-10">
        <div>Objects: {stats.objects}</div>
        <div>FPS: {stats.fps}</div>
        <div>Gravity: {enableGravity ? 'ON' : 'OFF'}</div>
        <div>Collisions: {enableCollisions ? 'ON' : 'OFF'}</div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white z-10">
        <div className="space-y-2">
          <div>Mouse: Rotate view</div>
          <div>Scroll: Zoom</div>
          <div>Right drag: Pan</div>
        </div>
      </div>

      <div ref={mountRef} className="w-full h-full" />
    </div>
  )
}

export default PhysicsEngine
