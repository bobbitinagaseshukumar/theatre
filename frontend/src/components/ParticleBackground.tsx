import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 200;

    // Respect the user's motion-reduction preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);

    // 4. Create particle geometry (kept light for smooth 60fps)
    const particleCount = 90;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Random coordinates inside a bounding box
      positions[i * 3] = (Math.random() - 0.5) * 400; // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // Z

      // Move speed
      velocities.push((Math.random() - 0.5) * 0.1, Math.random() * 0.15 + 0.05, 0);

      // Sizes
      sizes[i] = Math.random() * 3 + 1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // 5. Particle material using canvas texture for smooth rounded glow particles
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(0, 229, 255, 0.4)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 16, 16);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 4,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 6. Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip heavy work when the tab is hidden (saves CPU/GPU + battery)
      if (document.hidden) return;

      const positionsAttr = geometry.attributes.position as THREE.BufferAttribute;
      const p = positionsAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Update Y position (float upwards)
        p[i * 3 + 1] += velocities[i * 3 + 1];
        
        // Add subtle horizontal drift
        p[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.02;

        // Wrap around boundaries
        if (p[i * 3 + 1] > 200) {
          p[i * 3 + 1] = -200;
        }
      }
      positionsAttr.needsUpdate = true;

      // Slow rotation of the whole cloud
      points.rotation.y += 0.0003;
      points.rotation.x += 0.0001;

      renderer.render(scene, camera);
    };
    // Render one static frame for reduced-motion users; otherwise animate.
    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />;
};

export default ParticleBackground;
