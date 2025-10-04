import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const VRARSupport = ({ 
  className = '',
  mode = 'vr', // 'vr', 'ar', 'both'
  enableControllers = true,
  enableHandTracking = false,
  sceneType = 'space' // 'space', 'solar-system', 'galaxy'
}) => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)
  const controllerRef = useRef(null)
  const controllerGripRef = useRef(null)
  const [isVRSession, setIsVRSession] = useState(false)
  const [isARSession, setIsARSession] = useState(false)
  const [xrSupported, setXrSupported] = useState(false)

  // Check XR support
  useEffect(() => {
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setXrSupported(supported)
      })
    }
  }, [])

  // Create VR/AR scene
  const createXRScene = () => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000011)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 1.6, 3)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.xr.enabled = true
    rendererRef.current = renderer

    // Add XR buttons
    if (mode === 'vr' || mode === 'both') {
      const vrButton = VRButton.createButton(renderer)
      vrButton.style.position = 'absolute'
      vrButton.style.bottom = '20px'
      vrButton.style.left = '20px'
      document.body.appendChild(vrButton)
    }

    if (mode === 'ar' || mode === 'both') {
      const arButton = ARButton.createButton(renderer)
      arButton.style.position = 'absolute'
      arButton.style.bottom = '20px'
      arButton.style.left = mode === 'both' ? '120px' : '20px'
      document.body.appendChild(arButton)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Create scene content based on type
    createSceneContent(scene, sceneType)

    // VR/AR session handling
    renderer.xr.addEventListener('sessionstart', () => {
      setIsVRSession(true)
      setIsARSession(renderer.xr.isPresenting && renderer.xr.getSession().enabledFeatures.includes('local'))
    })

    renderer.xr.addEventListener('sessionend', () => {
      setIsVRSession(false)
      setIsARSession(false)
    })

    // Controller setup
    if (enableControllers) {
      setupControllers(scene, renderer)
    }

    // Hand tracking setup
    if (enableHandTracking) {
      setupHandTracking(scene, renderer)
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = renderer.setAnimationLoop(() => {
        renderer.render(scene, camera)
      })
    }

    animate()

    return { scene, camera, renderer }
  }

  // Create scene content
  const createSceneContent = (scene, type) => {
    switch (type) {
      case 'space':
        createSpaceScene(scene)
        break
      case 'solar-system':
        createSolarSystemScene(scene)
        break
      case 'galaxy':
        createGalaxyScene(scene)
        break
      default:
        createSpaceScene(scene)
    }
  }

  // Create space scene
  const createSpaceScene = (scene) => {
    // Stars
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 10000
    const starPositions = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      starPositions[i3] = (Math.random() - 0.5) * 2000
      starPositions[i3 + 1] = (Math.random() - 0.5) * 2000
      starPositions[i3 + 2] = (Math.random() - 0.5) * 2000

      const color = new THREE.Color()
      color.setHSL(Math.random() * 0.1 + 0.5, 0.8, Math.random() * 0.5 + 0.5)
      starColors[i3] = color.r
      starColors[i3 + 1] = color.g
      starColors[i3 + 2] = color.b
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

    const starMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Planets
    const planets = []
    for (let i = 0; i < 8; i++) {
      const radius = Math.random() * 2 + 0.5
      const geometry = new THREE.SphereGeometry(radius, 32, 32)
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
      })
      const planet = new THREE.Mesh(geometry, material)
      
      const distance = 5 + i * 3
      planet.position.x = distance
      planet.userData = {
        radius: radius,
        distance: distance,
        speed: 0.01 / (i + 1),
        angle: Math.random() * Math.PI * 2
      }
      
      scene.add(planet)
      planets.push(planet)
    }

    // Sun
    const sunGeometry = new THREE.SphereGeometry(2, 32, 32)
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      emissive: 0xff4400
    })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    sun.position.set(0, 0, 0)
    scene.add(sun)

    // Animate planets
    const animatePlanets = () => {
      planets.forEach(planet => {
        const { distance, speed, angle } = planet.userData
        planet.userData.angle += speed
        planet.position.x = Math.cos(planet.userData.angle) * distance
        planet.position.z = Math.sin(planet.userData.angle) * distance
        planet.rotation.y += 0.01
      })
      requestAnimationFrame(animatePlanets)
    }
    animatePlanets()
  }

  // Create solar system scene
  const createSolarSystemScene = (scene) => {
    // More detailed solar system with realistic planets
    const planets = [
      { name: 'Mercury', radius: 0.4, distance: 3, color: 0x8c7853, speed: 0.02 },
      { name: 'Venus', radius: 0.6, distance: 4, color: 0xffc649, speed: 0.015 },
      { name: 'Earth', radius: 0.6, distance: 5, color: 0x6b93d6, speed: 0.01 },
      { name: 'Mars', radius: 0.5, distance: 6, color: 0xc1440e, speed: 0.008 },
      { name: 'Jupiter', radius: 1.5, distance: 8, color: 0xd8ca9d, speed: 0.005 },
      { name: 'Saturn', radius: 1.2, distance: 10, color: 0xfad5a5, speed: 0.003 },
      { name: 'Uranus', radius: 0.8, distance: 12, color: 0x4fd0e7, speed: 0.002 },
      { name: 'Neptune', radius: 0.8, distance: 14, color: 0x4b70dd, speed: 0.001 }
    ]

    planets.forEach((planetData, index) => {
      const geometry = new THREE.SphereGeometry(planetData.radius, 32, 32)
      const material = new THREE.MeshPhongMaterial({
        color: planetData.color
      })
      const planet = new THREE.Mesh(geometry, material)
      
      planet.position.x = planetData.distance
      planet.userData = {
        ...planetData,
        angle: Math.random() * Math.PI * 2
      }
      
      scene.add(planet)

      // Add rings for Saturn
      if (planetData.name === 'Saturn') {
        const ringGeometry = new THREE.RingGeometry(planetData.radius * 1.5, planetData.radius * 2.5, 32)
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0x888888,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide
        })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.rotation.x = Math.PI / 2
        planet.add(ring)
      }
    })

    // Sun
    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32)
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      emissive: 0xff4400
    })
    const sun = new THREE.Mesh(sunGeometry, sunMaterial)
    sun.position.set(0, 0, 0)
    scene.add(sun)
  }

  // Create galaxy scene
  const createGalaxyScene = (scene) => {
    // Galaxy spiral
    const galaxyGeometry = new THREE.BufferGeometry()
    const galaxyCount = 5000
    const galaxyPositions = new Float32Array(galaxyCount * 3)
    const galaxyColors = new Float32Array(galaxyCount * 3)

    for (let i = 0; i < galaxyCount; i++) {
      const i3 = i * 3
      const radius = Math.random() * 50
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 10

      galaxyPositions[i3] = Math.cos(angle) * radius
      galaxyPositions[i3 + 1] = height
      galaxyPositions[i3 + 2] = Math.sin(angle) * radius

      const color = new THREE.Color()
      if (radius < 20) {
        color.setHSL(0.1, 0.8, 0.8) // Yellow center
      } else {
        color.setHSL(0.6, 0.8, 0.6) // Blue arms
      }
      galaxyColors[i3] = color.r
      galaxyColors[i3 + 1] = color.g
      galaxyColors[i3 + 2] = color.b
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3))
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3))

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    })

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial)
    scene.add(galaxy)
  }

  // Setup VR controllers
  const setupControllers = (scene, renderer) => {
    const controller1 = renderer.xr.getController(0)
    const controller2 = renderer.xr.getController(1)

    // Controller models
    const controllerModelFactory = new THREE.XRControllerModelFactory()
    const controllerGrip1 = renderer.xr.getControllerGrip(0)
    const controllerGrip2 = renderer.xr.getControllerGrip(1)

    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1))
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2))

    scene.add(controller1)
    scene.add(controller2)
    scene.add(controllerGrip1)
    scene.add(controllerGrip2)

    // Controller interactions
    controller1.addEventListener('selectstart', () => {
      createLaserPointer(controller1, scene)
    })

    controller2.addEventListener('selectstart', () => {
      createLaserPointer(controller2, scene)
    })

    controllerRef.current = { controller1, controller2 }
    controllerGripRef.current = { controllerGrip1, controllerGrip2 }
  }

  // Create laser pointer
  const createLaserPointer = (controller, scene) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -10)
    ])

    const material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.8
    })

    const line = new THREE.Line(geometry, material)
    line.name = 'laser'
    controller.add(line)
  }

  // Setup hand tracking
  const setupHandTracking = (scene, renderer) => {
    const hand1 = renderer.xr.getHand(0)
    const hand2 = renderer.xr.getHand(1)

    const handModelFactory = new THREE.XRHandModelFactory()
    hand1.add(handModelFactory.createHandModel(hand1, 'mesh'))
    hand2.add(handModelFactory.createHandModel(hand2, 'mesh'))

    scene.add(hand1)
    scene.add(hand2)
  }

  // Initialize VR/AR scene
  useEffect(() => {
    if (!mountRef.current || !xrSupported) return

    const { scene, camera, renderer } = createXRScene()

    mountRef.current.appendChild(renderer.domElement)

    // Handle resize
    const handleResize = () => {
      if (!renderer || !camera) return
      
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (animationIdRef.current) {
        renderer.setAnimationLoop(null)
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      // Remove XR buttons
      const vrButton = document.querySelector('.vr-button')
      const arButton = document.querySelector('.ar-button')
      if (vrButton) document.body.removeChild(vrButton)
      if (arButton) document.body.removeChild(arButton)
      
      renderer.dispose()
    }
  }, [xrSupported, mode, enableControllers, enableHandTracking, sceneType])

  if (!xrSupported) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center text-red-500">
          <p>WebXR not supported</p>
          <p className="text-sm">Your browser or device doesn't support WebXR</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* VR/AR Status */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white z-10">
        <div>Mode: {mode.toUpperCase()}</div>
        <div>VR Session: {isVRSession ? 'Active' : 'Inactive'}</div>
        <div>AR Session: {isARSession ? 'Active' : 'Inactive'}</div>
        <div>Controllers: {enableControllers ? 'Enabled' : 'Disabled'}</div>
        <div>Hand Tracking: {enableHandTracking ? 'Enabled' : 'Disabled'}</div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white z-10">
        <div className="space-y-1">
          <div>Click VR/AR button to start</div>
          <div>Use controllers to interact</div>
          <div>Look around to explore</div>
        </div>
      </div>

      <div ref={mountRef} className="w-full h-full" />
    </div>
  )
}

export default VRARSupport
