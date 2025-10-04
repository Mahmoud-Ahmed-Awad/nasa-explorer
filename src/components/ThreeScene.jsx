import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ThreeScene = ({
  className = "",
  enableRocket = true,
  enablePlanets = true,
  enableAmbientGlow = true,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup with responsive FOV
    const isMobile = window.innerWidth < 768
    const fov = isMobile ? 85 : 75
    
    const camera = new THREE.PerspectiveCamera(
      fov,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, isMobile ? 6 : 5);

    // Renderer setup with mobile optimization
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile, // Disable on mobile for performance
      powerPreference: isMobile ? "low-power" : "high-performance",
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Point lights for ambient glow
    if (enableAmbientGlow) {
      const pointLight1 = new THREE.PointLight(0x00f5ff, 0.5, 100);
      pointLight1.position.set(-10, 0, 0);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0xbf00ff, 0.5, 100);
      pointLight2.position.set(10, 0, 0);
      scene.add(pointLight2);
    }

    // Create rocket model (GLTF or fallback)
    const createRocket = async () => {
      if (!enableRocket) return null;

      try {
        // Try to load GLTF model
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
          loader.load(
            "/assets/rocket.glb",
            resolve,
            undefined,
            (error) => reject(error) // Silent rejection, fallback will be used
          );
        });

        const rocket = gltf.scene;
        rocket.scale.set(0.5, 0.5, 0.5);
        rocket.position.set(0, -2, 0);
        rocket.castShadow = true;
        rocket.receiveShadow = true;

        // Add neon glow material
        rocket.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshPhongMaterial({
              color: 0x00f5ff,
              emissive: 0x001122,
              shininess: 100,
            });
          }
        });

        return rocket;
      } catch (error) {
        console.warn("GLTF rocket model not found, using fallback geometry");

        // Fallback rocket geometry
        const rocketGroup = new THREE.Group();

        // Rocket body
        const bodyGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
          color: 0x00f5ff,
          emissive: 0x001122,
          shininess: 100,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0;
        body.castShadow = true;
        rocketGroup.add(body);

        // Rocket nose
        const noseGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
        const nose = new THREE.Mesh(noseGeometry, bodyMaterial);
        nose.position.y = 0.65;
        nose.castShadow = true;
        rocketGroup.add(nose);

        // Rocket fins
        const finGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.05);
        const finMaterial = new THREE.MeshPhongMaterial({
          color: 0xbf00ff,
          emissive: 0x110022,
          shininess: 100,
        });

        for (let i = 0; i < 4; i++) {
          const fin = new THREE.Mesh(finGeometry, finMaterial);
          const angle = (i / 4) * Math.PI * 2;
          fin.position.set(
            Math.cos(angle) * 0.15,
            -0.4,
            Math.sin(angle) * 0.15
          );
          fin.rotation.z = angle;
          fin.castShadow = true;
          rocketGroup.add(fin);
        }

        rocketGroup.position.set(0, -2, 0);
        return rocketGroup;
      }
    };

    // Create orbiting planets
    const createPlanets = () => {
      if (!enablePlanets) return [];

      const planets = [];
      const planetData = [
        { radius: 0.3, distance: 3, color: 0xff6b6b, speed: 0.01 },
        { radius: 0.2, distance: 4, color: 0x4ecdc4, speed: 0.007 },
        { radius: 0.25, distance: 5, color: 0x45b7d1, speed: 0.005 },
      ];

      planetData.forEach((data, index) => {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
          color: data.color,
          emissive: data.color,
          emissiveIntensity: 0.1,
        });
        const planet = new THREE.Mesh(geometry, material);

        // Create orbit path
        const orbitGroup = new THREE.Group();
        orbitGroup.add(planet);
        planet.position.x = data.distance;

        // Add orbit ring
        const ringGeometry = new THREE.RingGeometry(
          data.distance - 0.05,
          data.distance + 0.05,
          64
        );
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0x00f5ff,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        orbitGroup.add(ring);

        orbitGroup.userData = {
          speed: data.speed,
          initialAngle: (index * Math.PI) / 3,
        };
        planets.push(orbitGroup);
        scene.add(orbitGroup);
      });

      return planets;
    };

    // Initialize scene
    const initScene = async () => {
      try {
        setLoading(true);

        // Create rocket
        const rocket = await createRocket();
        if (rocket) {
          scene.add(rocket);
        }

        // Create planets
        const planets = createPlanets();

        setLoading(false);

        // Animation loop
        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate);

          const time = Date.now() * 0.001;

          // Animate rocket
          if (rocket) {
            rocket.rotation.y += 0.01;
            rocket.position.y = -2 + Math.sin(time) * 0.1;
          }

          // Animate planets
          planets.forEach((planetGroup) => {
            const { speed, initialAngle } = planetGroup.userData;
            planetGroup.rotation.y = initialAngle + time * speed;
          });

          // Animate camera
          camera.position.x = Math.sin(time * 0.1) * 0.5;
          camera.position.z = 5 + Math.sin(time * 0.05) * 0.2;
          camera.lookAt(0, 0, 0);

          renderer.render(scene, camera);
        };

        animate();
      } catch (error) {
        console.error("Error initializing Three.js scene:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    initScene();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      const newIsMobile = window.innerWidth < 768;

      camera.aspect = width / height;
      camera.fov = newIsMobile ? 85 : 75;
      camera.position.z = newIsMobile ? 6 : 5;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, newIsMobile ? 1.5 : 2));
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
    };
  }, [enableRocket, enablePlanets, enableAmbientGlow]);

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center text-red-500">
          <p>Failed to load 3D scene</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-slate-300">Loading 3D scene...</p>
          </div>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default ThreeScene;
