import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const WebGLShaders = ({ 
  className = '',
  shaderType = 'nebula', // 'nebula', 'aurora', 'blackhole', 'wormhole', 'galaxy'
  intensity = 1.0,
  speed = 1.0,
  colors = {
    primary: [0.0, 0.5, 1.0],
    secondary: [1.0, 0.0, 0.5],
    tertiary: [0.5, 1.0, 0.0]
  }
}) => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationIdRef = useRef(null)
  const controlsRef = useRef(null)
  const [loading, setLoading] = useState(true)

  // Advanced shader materials
  const shaderMaterials = {
    nebula: {
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          
          // Add some vertex displacement
          vec3 pos = position;
          pos.y += sin(pos.x * 0.1 + time) * 0.1;
          pos.z += cos(pos.z * 0.1 + time) * 0.1;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float speed;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        // Noise function
        float noise(vec3 p) {
          return sin(p.x * 10.0) * sin(p.y * 10.0) * sin(p.z * 10.0);
        }
        
        // Fractal noise
        float fbm(vec3 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for (int i = 0; i < 4; i++) {
            value += amplitude * noise(p * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
          }
          
          return value;
        }
        
        void main() {
          vec3 pos = vPosition * 0.1 + time * speed * 0.01;
          
          float n1 = fbm(pos);
          float n2 = fbm(pos * 2.0 + time * speed * 0.02);
          float n3 = fbm(pos * 4.0 + time * speed * 0.03);
          
          float combined = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;
          combined = smoothstep(-0.2, 0.8, combined);
          
          vec3 color = mix(color1, color2, combined);
          color = mix(color, color3, n3 * 0.5);
          
          float alpha = combined * intensity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `
    },
    aurora: {
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          vPosition = position;
          vUv = uv;
          
          vec3 pos = position;
          pos.y += sin(pos.x * 0.2 + time) * 0.2;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float speed;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return sin(p.x * 10.0) * sin(p.y * 10.0);
        }
        
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for (int i = 0; i < 6; i++) {
            value += amplitude * noise(p * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
          }
          
          return value;
        }
        
        void main() {
          vec2 pos = vUv * 10.0 + time * speed * 0.1;
          
          float n1 = fbm(pos);
          float n2 = fbm(pos * 2.0 + time * speed * 0.2);
          float n3 = fbm(pos * 4.0 + time * speed * 0.3);
          
          float combined = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;
          combined = smoothstep(-0.3, 0.7, combined);
          
          vec3 color = mix(color1, color2, combined);
          
          float alpha = combined * intensity * (1.0 - vUv.y);
          
          gl_FragColor = vec4(color, alpha);
        }
      `
    },
    blackhole: {
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          vPosition = position;
          vUv = uv;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float speed;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          vec2 pos = vUv - center;
          float dist = length(pos);
          
          // Event horizon
          float horizon = 0.1;
          float accretion = 0.3;
          
          // Gravitational lensing effect
          float lensing = 1.0 / (1.0 + dist * 10.0);
          
          // Accretion disk
          float disk = smoothstep(horizon, accretion, dist) * 
                      (1.0 - smoothstep(accretion, 0.5, dist));
          
          // Spiral pattern
          float angle = atan(pos.y, pos.x) + time * speed;
          float spiral = sin(angle * 5.0 + dist * 20.0) * 0.5 + 0.5;
          
          vec3 color = mix(color1, color2, spiral * disk);
          
          float alpha = (disk + lensing * 0.3) * intensity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `
    },
    wormhole: {
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          vPosition = position;
          vUv = uv;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float speed;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return sin(p.x * 10.0) * sin(p.y * 10.0);
        }
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          vec2 pos = vUv - center;
          float dist = length(pos);
          
          // Wormhole tunnel effect
          float tunnel = 1.0 - smoothstep(0.0, 0.5, dist);
          
          // Spiral motion
          float angle = atan(pos.y, pos.x) + time * speed;
          float spiral = sin(angle * 8.0 + dist * 30.0) * 0.5 + 0.5;
          
          // Energy rings
          float rings = sin(dist * 20.0 - time * speed * 5.0) * 0.5 + 0.5;
          
          vec3 color = mix(color1, color2, spiral);
          color = mix(color, color3, rings);
          
          float alpha = tunnel * intensity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `
    },
    galaxy: {
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        uniform float time;
        
        void main() {
          vPosition = position;
          vUv = uv;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        uniform float speed;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return sin(p.x * 10.0) * sin(p.y * 10.0);
        }
        
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = 1.0;
          
          for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
          }
          
          return value;
        }
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          vec2 pos = vUv - center;
          float dist = length(pos);
          float angle = atan(pos.y, pos.x);
          
          // Galaxy spiral arms
          float spiral1 = sin(angle * 2.0 + dist * 10.0 + time * speed) * 0.5 + 0.5;
          float spiral2 = sin(angle * 2.0 + dist * 10.0 + time * speed + 3.14159) * 0.5 + 0.5;
          
          // Central bulge
          float bulge = 1.0 - smoothstep(0.0, 0.2, dist);
          
          // Dust lanes
          float dust = fbm(pos * 5.0 + time * speed * 0.1) * 0.3 + 0.7;
          
          // Star field
          float stars = fbm(pos * 20.0) > 0.8 ? 1.0 : 0.0;
          
          vec3 color = mix(color1, color2, spiral1);
          color = mix(color, color3, spiral2);
          color = mix(color, vec3(1.0), stars * 0.5);
          
          float alpha = (spiral1 + spiral2 + bulge) * dust * intensity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `
    }
  }

  // Initialize WebGL shader scene
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
      1000
    )
    camera.position.set(0, 0, 5)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxDistance = 20
    controls.minDistance = 1
    controlsRef.current = controls

    // Create shader material
    const shaderConfig = shaderMaterials[shaderType]
    if (!shaderConfig) {
      console.error(`Unknown shader type: ${shaderType}`)
      setLoading(false)
      return
    }

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: intensity },
        speed: { value: speed },
        color1: { value: new THREE.Color(colors.primary[0], colors.primary[1], colors.primary[2]) },
        color2: { value: new THREE.Color(colors.secondary[0], colors.secondary[1], colors.secondary[2]) },
        color3: { value: new THREE.Color(colors.tertiary[0], colors.tertiary[1], colors.tertiary[2]) }
      },
      vertexShader: shaderConfig.vertexShader,
      fragmentShader: shaderConfig.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    })

    // Create geometry based on shader type
    let geometry
    if (shaderType === 'aurora') {
      geometry = new THREE.PlaneGeometry(10, 10, 100, 100)
    } else if (shaderType === 'blackhole' || shaderType === 'wormhole' || shaderType === 'galaxy') {
      geometry = new THREE.PlaneGeometry(8, 8, 200, 200)
    } else {
      geometry = new THREE.SphereGeometry(5, 64, 64)
    }

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Add lighting for some shader types
    if (shaderType === 'nebula') {
      const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
      directionalLight.position.set(10, 10, 5)
      scene.add(directionalLight)
    }

    setLoading(false)

    // Animation loop
    const animate = (currentTime) => {
      animationIdRef.current = requestAnimationFrame(animate)

      const time = currentTime * 0.001

      // Update shader uniforms
      material.uniforms.time.value = time
      material.uniforms.intensity.value = intensity
      material.uniforms.speed.value = speed

      // Update colors
      material.uniforms.color1.value.setRGB(colors.primary[0], colors.primary[1], colors.primary[2])
      material.uniforms.color2.value.setRGB(colors.secondary[0], colors.secondary[1], colors.secondary[2])
      material.uniforms.color3.value.setRGB(colors.tertiary[0], colors.tertiary[1], colors.tertiary[2])

      // Rotate mesh for some shader types
      if (shaderType === 'nebula' || shaderType === 'galaxy') {
        mesh.rotation.y += 0.001
      }

      // Update controls
      controls.update()

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
      
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [shaderType, intensity, speed, colors])

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-slate-300">Loading WebGL shader...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Shader Info */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white z-10">
        <div>Shader: {shaderType}</div>
        <div>Intensity: {intensity.toFixed(2)}</div>
        <div>Speed: {speed.toFixed(2)}</div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white z-10">
        <div className="space-y-1">
          <div>Mouse: Rotate</div>
          <div>Scroll: Zoom</div>
          <div>Right drag: Pan</div>
        </div>
      </div>

      <div ref={mountRef} className="w-full h-full" />
    </div>
  )
}

export default WebGLShaders
