'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  radius: number;
  color: string;
  speed: number;
  label?: string;
}

export default function Hero3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates with damping
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX - width / 2) * 0.0008;
      mouse.targetY = (clientY - height / 2) * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 3D Particles
    const PARTICLE_COUNT = 90;
    const particles: Particle[] = [];
    const focalLength = 320;

    const goldHues = ['#fbbf24', '#f59e0b', '#d97706', '#60a5fa', '#34d399', '#a78bfa'];
    const keyDestinations = [
      'Pokhara Phewa 🏔️',
      'Kathmandu Heritage 🏛️',
      'Nagarkot Ridge 🌅',
      'Baneshwor Hub 🎓',
      'Jhamsikhel Expat 🌟',
      'Annapurna Sanctuary ❄️',
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const distance = 140 + Math.random() * 260;

      const x = distance * Math.sin(phi) * Math.cos(theta);
      const y = distance * Math.sin(phi) * Math.sin(theta) * 0.6; // Slightly flattened disc
      const z = distance * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        radius: Math.random() * 2.2 + 1.2,
        color: goldHues[Math.floor(Math.random() * goldHues.length)],
        speed: 0.002 + Math.random() * 0.003,
        label: i < keyDestinations.length ? keyDestinations[i] : undefined,
      });
    }

    let angleY = 0;
    let angleX = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!prefersReducedMotion) {
        angleY += 0.0025 + mouse.x;
        angleX = mouse.y * 0.8;
      }

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Projected particles
      const projected = particles.map(p => {
        // Rotation around Y
        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseZ * cosY + p.baseX * sinY;

        // Rotation around X
        let y2 = p.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.baseY * sinX;

        // Perspective projection
        const scale = focalLength / (focalLength + z2 + 250);
        const projX = x1 * scale + width / 2;
        const projY = y2 * scale + height / 2 - 20;

        return {
          ...p,
          projX,
          projY,
          scale,
          z2,
        };
      });

      // Sort by depth for correct 3D occlusions
      projected.sort((a, b) => b.z2 - a.z2);

      // Draw connecting filaments in 3D
      ctx.lineWidth = 0.7;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 95) {
            const alpha = (1 - dist / 95) * 0.22 * Math.min(p1.scale, p2.scale);
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }

      // Draw nodes and luxury tags
      projected.forEach(p => {
        if (p.scale <= 0) return;

        const size = p.radius * p.scale;
        const alpha = Math.max(0.15, Math.min(1, (p.scale - 0.4) * 1.5));

        // Outer glow
        const gradient = ctx.createRadialGradient(
          p.projX,
          p.projY,
          0,
          p.projX,
          p.projY,
          size * 4
        );
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Inner solid core
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, size, 0, Math.PI * 2);
        ctx.fill();

        // Key Destination Callouts in 3D
        if (p.label && p.scale > 0.8) {
          ctx.font = `600 ${Math.max(9, Math.floor(10 * p.scale))}px Inter, system-ui, sans-serif`;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
          ctx.fillText(p.label, p.projX + 8, p.projY - 6);

          // Small leader line
          ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(p.projX, p.projY);
          ctx.lineTo(p.projX + 6, p.projY - 4);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-65 transition-opacity duration-1000"
      />
      {/* Vignette gradients to blend seamlessly with obsidian background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
    </div>
  );
}

