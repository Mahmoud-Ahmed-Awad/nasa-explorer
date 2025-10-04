import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";

const AdvancedSpaceScene = ({
  className = "",
  enablePostProcessing = true,
  enableLensFlare = true,
  enableParticleSystems = true,
  enablePhysics = true,
  sceneComplexity = "high", // 'low', 'medium', 'high', 'ultra'
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const composerRef = useRef(null);
  const animationIdRef = useRef(null);
  const controlsRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceStats, setPerformanceStats] = useState({
    fps: 0,
    triangles: 0,
    drawCalls: 0,
  });

  // Performance monitoring
  const statsRef = useRef({ frameCount: 0, lastTime: 0 });

  // Scene complexity settings
  const complexitySettings = useMemo(() => {
    const settings = {
      low: {
        starCount: 1000,
        planetCount: 3,
        asteroidCount: 50,
        nebulaDensity: 0.3,
        shadowMapSize: 1024,
        particleCount: 500,
      },
      medium: {
        starCount: 2500,
        planetCount: 6,
        asteroidCount: 150,
        nebulaDensity: 0.6,
        shadowMapSize: 2048,
        particleCount: 1500,
      },
      high: {
        starCount: 5000,
        planetCount: 12,
        asteroidCount: 300,
        nebulaDensity: 0.8,
        shadowMapSize: 4096,
        particleCount: 3000,
      },
      ultra: {
        starCount: 10000,
        planetCount: 20,
        asteroidCount: 500,
        nebulaDensity: 1.0,
        shadowMapSize: 8192,
        particleCount: 5000,
      },
    };
    return settings[sceneComplexity] || settings.high;
  }, [sceneComplexity]);

  // Advanced shader materials
  const createNebulaMaterial = () => {
    const vertexShader = `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      
      void main() {
        vPosition = position;
        vNormal = normal;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;
      
      float noise(vec3 p) {
        return sin(p.x * 10.0) * sin(p.y * 10.0) * sin(p.z * 10.0);
      }
      
      void main() {
        vec3 pos = vPosition * 0.1 + time * 0.01;
        float n1 = noise(pos);
        float n2 = noise(pos * 2.0 + time * 0.02);
        float n3 = noise(pos * 4.0 + time * 0.03);
        
        float combined = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;
        combined = smoothstep(-0.2, 0.8, combined);
        
        vec3 color = mix(color1, color2, combined);
        color = mix(color, color3, n3 * 0.5);
        
        gl_FragColor = vec4(color, combined * 0.8);
      }
    `;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x4a0080) },
        color2: { value: new THREE.Color(0x0080ff) },
        color3: { value: new THREE.Color(0x00ff80) },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
  };

  // Create advanced particle systems
  const createParticleSystem = (count, type = "stars") => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Position
      positions[i3] = (Math.random() - 0.5) * 2000;
      positions[i3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i3 + 2] = (Math.random() - 0.5) * 2000;

      // Color based on type
      if (type === "stars") {
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.1 + 0.5, 0.8, Math.random() * 0.5 + 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      } else if (type === "nebula") {
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.3 + 0.6, 0.8, Math.random() * 0.3 + 0.3);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      // Size
      sizes[i] = Math.random() * 3 + 1;

      // Velocity
      velocities[i3] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        precision mediump float;
        
        attribute float size;
        attribute vec3 velocity;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        
        void main() {
          vColor = color; // Use built-in color attribute from Three.js
          vec3 pos = position + velocity * time;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision mediump float;
        
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
    });

    return { geometry, material };
  };

  // Create advanced planet with atmosphere
  const createAdvancedPlanet = (radius, color, hasAtmosphere = true) => {
    const group = new THREE.Group();

    // Main planet
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 100,
      specular: 0x222222,
    });

    // Add texture coordinates for future texture mapping
    geometry.computeBoundingSphere();

    const planet = new THREE.Mesh(geometry, material);
    planet.castShadow = true;
    planet.receiveShadow = true;
    group.add(planet);

    // Atmosphere
    if (hasAtmosphere) {
      const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.1, 32, 32);
      const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          precision mediump float;
          
          varying vec3 vNormal;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          precision mediump float;
          
          varying vec3 vNormal;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      });

      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      group.add(atmosphere);
    }

    // Ring system
    if (Math.random() > 0.7) {
      const ringGeometry = new THREE.RingGeometry(
        radius * 1.5,
        radius * 2.5,
        64
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }

    return group;
  };

  // Create asteroid belt
  const createAsteroidBelt = (count, innerRadius, outerRadius) => {
    const group = new THREE.Group();
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.OctahedronGeometry(1),
      new THREE.TetrahedronGeometry(1),
      new THREE.DodecahedronGeometry(1),
    ];

    for (let i = 0; i < count; i++) {
      const geometry =
        geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color().setHSL(0.1, 0.3, Math.random() * 0.3 + 0.2),
      });

      const asteroid = new THREE.Mesh(geometry, material);

      // Random position in belt
      const angle = Math.random() * Math.PI * 2;
      const distance =
        innerRadius + Math.random() * (outerRadius - innerRadius);
      asteroid.position.x = Math.cos(angle) * distance;
      asteroid.position.z = Math.sin(angle) * distance;
      asteroid.position.y = (Math.random() - 0.5) * 20;

      // Random rotation and scale
      asteroid.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      const scale = Math.random() * 2 + 0.5;
      asteroid.scale.setScalar(scale);

      asteroid.castShadow = true;
      asteroid.receiveShadow = true;

      // Store orbital data
      asteroid.userData = {
        angle: angle,
        distance: distance,
        speed: (Math.random() * 0.01 + 0.005) * (innerRadius / distance),
      };

      group.add(asteroid);
    }

    return group;
  };

  // Create lens flare effect
  const createLensFlare = () => {
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load(
      "/assets/lensflare/lensflare0.png"
    );
    const textureFlare3 = textureLoader.load(
      "/assets/lensflare/lensflare3.png"
    );

    const lensFlare = new Lensflare();
    lensFlare.addElement(new LensflareElement(textureFlare0, 512, 0));
    lensFlare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensFlare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensFlare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensFlare.addElement(new LensflareElement(textureFlare3, 70, 1));

    return lensFlare;
  };

  // Initialize advanced scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 50, 200);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 1000;
    controls.minDistance = 10;
    controlsRef.current = controls;

    // Advanced lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
    scene.add(ambientLight);

    // Main sun light
    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(100, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = complexitySettings.shadowMapSize;
    sunLight.shadow.mapSize.height = complexitySettings.shadowMapSize;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    scene.add(sunLight);

    // Point lights for atmosphere
    const pointLights = [];
    for (let i = 0; i < 5; i++) {
      const pointLight = new THREE.PointLight(
        new THREE.Color().setHSL(Math.random(), 0.8, 0.8),
        0.5,
        200
      );
      pointLight.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 400
      );
      scene.add(pointLight);
      pointLights.push(pointLight);
    }

    // Create nebula
    const nebulaGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    const nebulaMaterial = createNebulaMaterial();
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.rotation.x = -Math.PI / 2;
    nebula.position.y = -200;
    scene.add(nebula);

    // Create particle systems
    let starSystem = null;
    let nebulaSystem = null;
    if (enableParticleSystems) {
      starSystem = createParticleSystem(complexitySettings.starCount, "stars");
      const starParticles = new THREE.Points(
        starSystem.geometry,
        starSystem.material
      );
      scene.add(starParticles);

      nebulaSystem = createParticleSystem(
        complexitySettings.particleCount,
        "nebula"
      );
      const nebulaParticles = new THREE.Points(
        nebulaSystem.geometry,
        nebulaSystem.material
      );
      scene.add(nebulaParticles);
    }

    // Create planets
    const planets = [];
    for (let i = 0; i < complexitySettings.planetCount; i++) {
      const radius = Math.random() * 20 + 10;
      const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.5);
      const planet = createAdvancedPlanet(radius, color, Math.random() > 0.5);

      const distance = 50 + i * 80;
      planet.position.x = distance;
      planet.userData = {
        radius: radius,
        distance: distance,
        speed: 0.01 / (i + 1),
        angle: Math.random() * Math.PI * 2,
      };

      scene.add(planet);
      planets.push(planet);
    }

    // Create asteroid belt
    const asteroidBelt = createAsteroidBelt(
      complexitySettings.asteroidCount,
      120,
      200
    );
    scene.add(asteroidBelt);

    // Add lens flare
    if (enableLensFlare) {
      try {
        const lensFlare = createLensFlare();
        sunLight.add(lensFlare);
      } catch (error) {
        console.warn(
          "Lens flare textures not found, skipping lens flare effect"
        );
      }
    }

    // Post-processing setup
    if (enablePostProcessing) {
      const composer = new EffectComposer(renderer);
      composerRef.current = composer;

      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      // Bloom effect
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(
          mountRef.current.clientWidth,
          mountRef.current.clientHeight
        ),
        1.5,
        0.4,
        0.85
      );
      composer.addPass(bloomPass);

      // Film grain effect
      const filmPass = new FilmPass(0.35, 0.025, 648, false);
      composer.addPass(filmPass);
    }

    // Animation loop
    const animate = (currentTime) => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Update performance stats
      statsRef.current.frameCount++;
      if (currentTime - statsRef.current.lastTime >= 1000) {
        setPerformanceStats({
          fps: Math.round(
            (statsRef.current.frameCount * 1000) /
              (currentTime - statsRef.current.lastTime)
          ),
          triangles: renderer.info.render.triangles,
          drawCalls: renderer.info.render.calls,
        });
        statsRef.current.frameCount = 0;
        statsRef.current.lastTime = currentTime;
      }

      const time = currentTime * 0.001;

      // Update nebula material
      nebulaMaterial.uniforms.time.value = time;

      // Update particle systems
      if (enableParticleSystems && starSystem && nebulaSystem) {
        starSystem.material.uniforms.time.value = time;
        nebulaSystem.material.uniforms.time.value = time;
      }

      // Animate planets
      planets.forEach((planet) => {
        const { distance, speed, angle } = planet.userData;
        planet.userData.angle += speed;
        planet.position.x = Math.cos(planet.userData.angle) * distance;
        planet.position.z = Math.sin(planet.userData.angle) * distance;
        planet.rotation.y += 0.01;
      });

      // Animate asteroids
      asteroidBelt.children.forEach((asteroid) => {
        const { angle, distance, speed } = asteroid.userData;
        asteroid.userData.angle += speed;
        asteroid.position.x = Math.cos(asteroid.userData.angle) * distance;
        asteroid.position.z = Math.sin(asteroid.userData.angle) * distance;
        asteroid.rotation.x += 0.005;
        asteroid.rotation.y += 0.01;
        asteroid.rotation.z += 0.003;
      });

      // Animate point lights
      pointLights.forEach((light, index) => {
        light.position.x = Math.sin(time * 0.5 + index) * 200;
        light.position.z = Math.cos(time * 0.5 + index) * 200;
        light.intensity = 0.3 + Math.sin(time * 2 + index) * 0.2;
      });

      // Update controls
      controls.update();

      // Render
      if (enablePostProcessing && composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    setLoading(false);
    animate(0);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      if (composerRef.current) {
        composerRef.current.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (composerRef.current) {
        composerRef.current.dispose();
      }
    };
  }, [
    enablePostProcessing,
    enableLensFlare,
    enableParticleSystems,
    complexitySettings,
  ]);

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center text-red-500">
          <p>Failed to load advanced 3D scene</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-300">
              Loading advanced 3D scene...
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Complexity: {sceneComplexity}
            </p>
          </div>
        </div>
      )}

      {/* Performance Stats */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white">
        <div>FPS: {performanceStats.fps}</div>
        <div>Triangles: {performanceStats.triangles.toLocaleString()}</div>
        <div>Draw Calls: {performanceStats.drawCalls}</div>
      </div>

      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default AdvancedSpaceScene;
