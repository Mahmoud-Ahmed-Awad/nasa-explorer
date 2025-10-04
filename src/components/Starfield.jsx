import React, { useRef, useEffect, useState } from "react";

const Starfield = ({
  starCount = 1000,
  speed = 0.5,
  enableParallax = true,
  particleDensity = 1.0,
}) => {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);
  const starsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Generate stars
  const generateStars = () => {
    const stars = [];
    const adjustedStarCount = Math.floor(starCount * particleDensity);

    for (let i = 0; i < adjustedStarCount; i++) {
      stars.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.8 ? "#00f5ff" : "#ffffff",
        velocity: Math.random() * speed + 0.1,
      });
    }

    return stars;
  };

  // Update star positions
  const updateStars = () => {
    starsRef.current.forEach((star) => {
      star.z -= star.velocity;

      // Reset star when it goes off screen
      if (star.z <= 0) {
        star.x = Math.random() * dimensions.width;
        star.y = Math.random() * dimensions.height;
        star.z = 1000;
      }
    });
  };

  // Render stars
  const renderStars = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Create radial gradient background
    const gradient = ctx.createRadialGradient(
      dimensions.width / 2,
      dimensions.height / 2,
      0,
      dimensions.width / 2,
      dimensions.height / 2,
      Math.max(dimensions.width, dimensions.height) / 2
    );
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.8)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Sort stars by depth for proper rendering
    const sortedStars = [...starsRef.current].sort((a, b) => b.z - a.z);

    sortedStars.forEach((star) => {
      // Calculate parallax effect
      const parallaxX = enableParallax
        ? (mouseRef.current.x - dimensions.width / 2) * 0.1
        : 0;
      const parallaxY = enableParallax
        ? (mouseRef.current.y - dimensions.height / 2) * 0.1
        : 0;

      // Calculate star position with perspective
      const x = (star.x + parallaxX) * (1000 / star.z);
      const y = (star.y + parallaxY) * (1000 / star.z);
      const size = star.size * (1000 / star.z);
      const opacity = star.opacity * (1000 / star.z);

      // Only render stars that are on screen
      if (x >= 0 && x <= dimensions.width && y >= 0 && y <= dimensions.height) {
        ctx.save();
        ctx.globalAlpha = Math.min(opacity, 1);
        ctx.fillStyle = star.color;

        // Create star glow effect
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        glowGradient.addColorStop(0, star.color);
        glowGradient.addColorStop(1, "transparent");

        ctx.fillStyle = glowGradient;
        ctx.fillRect(x - size * 3, y - size * 3, size * 6, size * 6);

        // Draw star
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    });
  };

  // Animation loop
  const animate = () => {
    updateStars();
    renderStars();
    animationIdRef.current = requestAnimationFrame(animate);
  };

  // Initialize canvas and stars
  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        // Use viewport dimensions for mobile compatibility
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        setDimensions({ width: viewportWidth, height: viewportHeight });

        // Set canvas size with device pixel ratio for crisp rendering
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = viewportWidth * pixelRatio;
        canvas.height = viewportHeight * pixelRatio;

        // Scale the canvas back down using CSS
        canvas.style.width = viewportWidth + "px";
        canvas.style.height = viewportHeight + "px";

        // Scale the drawing context so everything draws at the correct size
        const ctx = canvas.getContext("2d");
        ctx.scale(pixelRatio, pixelRatio);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("orientationchange", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
    };
  }, []);

  // Generate stars when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      starsRef.current = generateStars();
    }
  }, [dimensions, starCount, particleDensity]);

  // Start animation
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      animate();
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [dimensions]);

  // Handle mouse movement for parallax
  useEffect(() => {
    if (!enableParallax) return;

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enableParallax]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none sm:absolute sm:inset-0 sm:w-full sm:h-full"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)",
        width: "100%",
        height: "100%",
        minWidth: "100%",
        minHeight: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        position: "fixed",
        objectFit: "cover",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}
    />
  );
};

export default Starfield;
