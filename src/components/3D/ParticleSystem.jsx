import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";

const ParticleSystem = ({
  count = 1000,
  type = "stars", // 'stars', 'nebula', 'comet', 'solar-wind', 'debris'
  position = [0, 0, 0],
  size = 1,
  speed = 1,
  color = [1, 1, 1],
  opacity = 1,
  enablePhysics = true,
  enableTrails = false,
  trailLength = 10,
  className = "",
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const particlesRef = useRef([]);
  const trailsRef = useRef([]);

  // Particle system configurations
  const systemConfigs = useMemo(
    () => ({
      stars: {
        geometry: () => new THREE.BufferGeometry(),
        material: () =>
          new THREE.PointsMaterial({
            size: 2,
            transparent: true,
            opacity: 0.8,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
          }),
        behavior: (particle, time, particleSystem) => {
          // Twinkling effect - handled in the animation loop
          // No direct manipulation needed, particles twinkle via shader/material
        },
      },
      nebula: {
        geometry: () => new THREE.BufferGeometry(),
        material: () =>
          new THREE.ShaderMaterial({
            uniforms: {
              time: { value: 0 },
              size: { value: 3 },
              opacity: { value: 0.6 },
            },
            vertexShader: `
          precision mediump float;
          
          attribute float size;
          attribute float alpha;
          uniform float time;
          varying float vAlpha;
          
          void main() {
            vAlpha = alpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
            fragmentShader: `
          precision mediump float;
          
          varying float vAlpha;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = (1.0 - smoothstep(0.0, 0.5, distanceToCenter)) * vAlpha;
            gl_FragColor = vec4(0.5, 0.2, 1.0, alpha);
          }
        `,
            transparent: true,
            blending: THREE.AdditiveBlending,
          }),
        behavior: (particle, time) => {
          // Gentle floating motion around initial position
          if (particle.userData.initialPos) {
            particle.position.y =
              particle.userData.initialPos.y +
              Math.sin(time * 0.5 + particle.userData.phase) * 5;
            particle.position.x =
              particle.userData.initialPos.x +
              Math.cos(time * 0.3 + particle.userData.phase) * 3;
          }
        },
      },
      comet: {
        geometry: () => new THREE.BufferGeometry(),
        material: () =>
          new THREE.ShaderMaterial({
            uniforms: {
              time: { value: 0 },
              size: { value: 5 },
            },
            vertexShader: `
          precision mediump float;
          
          attribute float size;
          attribute vec3 velocity;
          uniform float time;
          varying float vAlpha;
          
          void main() {
            vec3 pos = position + velocity * time;
            vAlpha = 1.0 - (time - position.z) / 100.0;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
            fragmentShader: `
          precision mediump float;
          
          varying float vAlpha;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = (1.0 - smoothstep(0.0, 0.5, distanceToCenter)) * vAlpha;
            gl_FragColor = vec4(1.0, 1.0, 0.8, alpha);
          }
        `,
            transparent: true,
            blending: THREE.AdditiveBlending,
          }),
        behavior: (particle, time) => {
          // Comet tail effect
          if (!particle || !particle.position || !particle.userData) return;
          if (!particle.userData.velocity) return;

          particle.position.add(particle.userData.velocity);
          particle.userData.life -= 0.01;
          if (particle.userData.life <= 0) {
            particle.userData.life = 1;
            particle.position.set(
              (Math.random() - 0.5) * 100,
              (Math.random() - 0.5) * 100,
              -50
            );
          }
        },
      },
      "solar-wind": {
        geometry: () => new THREE.BufferGeometry(),
        material: () =>
          new THREE.ShaderMaterial({
            uniforms: {
              time: { value: 0 },
              size: { value: 1 },
            },
            vertexShader: `
          precision mediump float;
          
          attribute float size;
          attribute vec3 velocity;
          uniform float time;
          varying float vAlpha;
          
          void main() {
            vec3 pos = position + velocity * time * 0.1;
            vAlpha = 1.0 - (time * 0.01);
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
            fragmentShader: `
          precision mediump float;
          
          varying float vAlpha;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = (1.0 - smoothstep(0.0, 0.3, distanceToCenter)) * vAlpha;
            gl_FragColor = vec4(0.0, 0.8, 1.0, alpha);
          }
        `,
            transparent: true,
            blending: THREE.AdditiveBlending,
          }),
        behavior: (particle, time) => {
          // Solar wind streaming
          if (!particle || !particle.position || !particle.userData) return;
          if (!particle.userData.velocity) return;

          particle.position.add(particle.userData.velocity);
          if (particle.position.length() > 200) {
            particle.position.set(
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              -100
            );
          }
        },
      },
      debris: {
        geometry: () => new THREE.BufferGeometry(),
        material: () =>
          new THREE.PointsMaterial({
            size: 1,
            transparent: true,
            opacity: 0.7,
            color: 0x888888,
            blending: THREE.NormalBlending,
          }),
        behavior: (particle, time) => {
          // Chaotic debris motion
          if (!particle || !particle.position || !particle.userData) return;
          if (!particle.userData.velocity) return;

          particle.position.add(particle.userData.velocity);
          particle.userData.velocity.add(
            new THREE.Vector3(
              (Math.random() - 0.5) * 0.01,
              (Math.random() - 0.5) * 0.01,
              (Math.random() - 0.5) * 0.01
            )
          );

          // Damping
          particle.userData.velocity.multiplyScalar(0.99);

          // Reset if too far
          if (particle.position.length() > 150) {
            particle.position.set(
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 50
            );
            particle.userData.velocity.set(
              (Math.random() - 0.5) * 0.5,
              (Math.random() - 0.5) * 0.5,
              (Math.random() - 0.5) * 0.5
            );
          }
        },
      },
    }),
    []
  );

  // Create particle geometry
  const createParticleGeometry = (config) => {
    const geometry = config.geometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    const alphas = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Position
      positions[i3] = (Math.random() - 0.5) * 100 + position[0];
      positions[i3 + 1] = (Math.random() - 0.5) * 100 + position[1];
      positions[i3 + 2] = (Math.random() - 0.5) * 100 + position[2];

      // Color
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
      } else {
        colors[i3] = color[0];
        colors[i3 + 1] = color[1];
        colors[i3 + 2] = color[2];
      }

      // Size
      sizes[i] = Math.random() * size * 2 + size * 0.5;

      // Velocity
      velocities[i3] = (Math.random() - 0.5) * speed;
      velocities[i3 + 1] = (Math.random() - 0.5) * speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * speed;

      // Alpha
      alphas[i] = Math.random() * opacity;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    return geometry;
  };

  // Create trail system
  const createTrailSystem = () => {
    if (!enableTrails) return null;

    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(count * trailLength * 3);
    const trailColors = new Float32Array(count * trailLength * 3);
    const trailAlphas = new Float32Array(count * trailLength);

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < trailLength; j++) {
        const index = (i * trailLength + j) * 3;
        trailPositions[index] = (Math.random() - 0.5) * 100;
        trailPositions[index + 1] = (Math.random() - 0.5) * 100;
        trailPositions[index + 2] = (Math.random() - 0.5) * 100;

        trailColors[index] = color[0];
        trailColors[index + 1] = color[1];
        trailColors[index + 2] = color[2];

        trailAlphas[i * trailLength + j] = (1 - j / trailLength) * 0.3;
      }
    }

    trailGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(trailPositions, 3)
    );
    trailGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(trailColors, 3)
    );
    trailGeometry.setAttribute(
      "alpha",
      new THREE.BufferAttribute(trailAlphas, 1)
    );

    const trailMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        precision mediump float;
        
        attribute float alpha;
        varying float vAlpha;
        
        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 2.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision mediump float;
        
        varying float vAlpha;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = (1.0 - smoothstep(0.0, 0.5, distanceToCenter)) * vAlpha;
          gl_FragColor = vec4(0.5, 0.5, 1.0, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: trailGeometry, material: trailMaterial };
  };

  // Initialize particle system
  useEffect(() => {
    if (!mountRef.current) return;

    const config = systemConfigs[type];
    if (!config) {
      console.error(`Unknown particle system type: ${type}`);
      return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create particle system
    const geometry = createParticleGeometry(config);
    const material = config.material();

    // Clear any existing particles
    particlesRef.current = [];

    // Add user data to particles
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const velocityVec = new THREE.Vector3(
        geometry.attributes.velocity.array[i3],
        geometry.attributes.velocity.array[i3 + 1],
        geometry.attributes.velocity.array[i3 + 2]
      );

      const particle = {
        position: new THREE.Vector3(
          geometry.attributes.position.array[i3],
          geometry.attributes.position.array[i3 + 1],
          geometry.attributes.position.array[i3 + 2]
        ),
        velocity: velocityVec,
        userData: {
          phase: Math.random() * Math.PI * 2,
          life: 1,
          age: 0,
          velocity: velocityVec.clone(), // Also store in userData for behaviors
          initialPos: new THREE.Vector3(
            geometry.attributes.position.array[i3],
            geometry.attributes.position.array[i3 + 1],
            geometry.attributes.position.array[i3 + 2]
          ),
        },
      };
      particlesRef.current.push(particle);
    }

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Create trail system
    let trails = null;
    if (enableTrails) {
      const trailSystem = createTrailSystem();
      if (trailSystem) {
        trails = new THREE.Points(trailSystem.geometry, trailSystem.material);
        scene.add(trails);
        trailsRef.current = trails;
      }
    }

    // Animation loop
    const animate = (currentTime) => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = currentTime * 0.001;

      // Update material uniforms
      if (material.uniforms && material.uniforms.time) {
        material.uniforms.time.value = time;
      }

      // Update trail uniforms
      if (trails && trails.material.uniforms && trails.material.uniforms.time) {
        trails.material.uniforms.time.value = time;
      }

      // Update particle behavior
      if (particlesRef.current && particlesRef.current.length > 0) {
        particlesRef.current.forEach((particle, index) => {
          if (!particle || !particle.position || !particle.velocity) return;

          config.behavior(particle, time);

          // Update geometry attributes
          const i3 = index * 3;
          geometry.attributes.position.array[i3] = particle.position.x;
          geometry.attributes.position.array[i3 + 1] = particle.position.y;
          geometry.attributes.position.array[i3 + 2] = particle.position.z;

          geometry.attributes.velocity.array[i3] = particle.velocity.x;
          geometry.attributes.velocity.array[i3 + 1] = particle.velocity.y;
          geometry.attributes.velocity.array[i3 + 2] = particle.velocity.z;

          particle.userData.age += 0.016; // Assuming 60fps
        });
      }

      // Mark attributes as needing update
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.velocity.needsUpdate = true;

      // Update trail positions
      if (
        enableTrails &&
        trails &&
        particlesRef.current &&
        particlesRef.current.length > 0
      ) {
        particlesRef.current.forEach((particle, index) => {
          if (!particle || !particle.position) return;

          for (let j = 0; j < trailLength; j++) {
            const trailIndex = (index * trailLength + j) * 3;
            const alpha = (1 - j / trailLength) * 0.3;

            trails.geometry.attributes.position.array[trailIndex] =
              particle.position.x + (Math.random() - 0.5) * 2;
            trails.geometry.attributes.position.array[trailIndex + 1] =
              particle.position.y + (Math.random() - 0.5) * 2;
            trails.geometry.attributes.position.array[trailIndex + 2] =
              particle.position.z + (Math.random() - 0.5) * 2;

            trails.geometry.attributes.alpha.array[index * trailLength + j] =
              alpha;
          }
        });

        trails.geometry.attributes.position.needsUpdate = true;
        trails.geometry.attributes.alpha.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate(0);

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;

      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
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

      // Clear particles
      particlesRef.current = [];

      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [
    count,
    type,
    position,
    size,
    speed,
    color,
    opacity,
    enablePhysics,
    enableTrails,
    trailLength,
    systemConfigs,
  ]);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
};

export default ParticleSystem;
