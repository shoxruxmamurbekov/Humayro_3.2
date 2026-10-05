import React, { useEffect, useRef, useState } from 'react';
import { CONTINENT_LAND_POINTS } from '../data/globeLandData';

interface CapitalNode {
  name: string;
  code: string;
  lat: number;
  lon: number;
  statusColor: string;
}

const CAPITAL_NODES: CapitalNode[] = [
  { name: 'Toshkent', code: 'UZ', lat: 41.3, lon: 69.2, statusColor: '#FF6A00' },
  { name: 'Seul', code: 'KR', lat: 37.5, lon: 127.0, statusColor: '#00E5FF' },
  { name: 'Bryussel', code: 'EU', lat: 50.8, lon: 4.3, statusColor: '#FFA84D' },
  { name: 'Vashington', code: 'US', lat: 38.9, lon: -77.0, statusColor: '#FF2A55' },
  { name: 'Dubay', code: 'UAE', lat: 25.2, lon: 55.3, statusColor: '#00E5FF' }
];

export const EarthCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Precalculate 3D Points for Continent Landmasses
    const land3D = CONTINENT_LAND_POINTS.map(pt => {
      const phi = (pt.lat * Math.PI) / 180;
      const theta = (pt.lon * Math.PI) / 180;
      return {
        x: Math.cos(phi) * Math.sin(theta),
        y: -Math.sin(phi),
        z: Math.cos(phi) * Math.cos(theta),
        importance: pt.importance || 1.2
      };
    });

    // Precalculate Capital Nodes
    const nodes3D = CAPITAL_NODES.map(c => {
      const phi = (c.lat * Math.PI) / 180;
      const theta = (c.lon * Math.PI) / 180;
      return {
        ...c,
        x: Math.cos(phi) * Math.sin(theta),
        y: -Math.sin(phi),
        z: Math.cos(phi) * Math.cos(theta)
      };
    });

    // Wireframe parallels & meridians
    const wireframeRings: Array<Array<{ x: number; y: number; z: number }>> = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const ring: Array<{ x: number; y: number; z: number }> = [];
      const phi = (lat * Math.PI) / 180;
      for (let lon = 0; lon <= 360; lon += 15) {
        const theta = (lon * Math.PI) / 180;
        ring.push({
          x: Math.cos(phi) * Math.sin(theta),
          y: -Math.sin(phi),
          z: Math.cos(phi) * Math.cos(theta)
        });
      }
      wireframeRings.push(ring);
    }

    for (let lon = 0; lon < 360; lon += 45) {
      const ring: Array<{ x: number; y: number; z: number }> = [];
      const theta = (lon * Math.PI) / 180;
      for (let lat = -80; lat <= 80; lat += 15) {
        const phi = (lat * Math.PI) / 180;
        ring.push({
          x: Math.cos(phi) * Math.sin(theta),
          y: -Math.sin(phi),
          z: Math.cos(phi) * Math.cos(theta)
        });
      }
      wireframeRings.push(ring);
    }

    // Dynamic rotation & mouse tilt
    let yaw = 0.5;
    let pitch = 0.22;
    let targetPitch = 0.22;
    let targetYawVelocity = 0.0035;
    let pulseTime = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetPitch = 0.22 + ny * 0.35;
      targetYawVelocity = 0.0035 + nx * 0.004;
    };

    window.addEventListener('mousemove', onMouseMove);

    const project = (
      p: { x: number; y: number; z: number },
      cx: number,
      cy: number,
      radius: number,
      cosY: number,
      sinY: number,
      cosP: number,
      sinP: number
    ) => {
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y2 = p.y * cosP - z1 * sinP;
      const z2 = p.y * sinP + z1 * cosP;
      const scale = radius / (1.85 - z2 * 0.35);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        z: z2,
        scale
      };
    };

    const draw = () => {
      const rect = wrap.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w <= 20 || h <= 20) {
        animId = requestAnimationFrame(draw);
        return;
      }
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.max(50, Math.min(w, h) * 0.42);

      pulseTime += 0.03;
      yaw += targetYawVelocity;
      pitch += (targetPitch - pitch) * 0.05;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      ctx.clearRect(0, 0, w, h);

      // 1. Radiant Atmospheric Glow
      const atmGrad = ctx.createRadialGradient(
        cx,
        cy,
        Math.max(1, radius * 0.6),
        cx,
        cy,
        Math.max(2, radius * 1.55)
      );
      atmGrad.addColorStop(0, 'rgba(255, 106, 0, 0.12)');
      atmGrad.addColorStop(0.5, 'rgba(255, 106, 0, 0.05)');
      atmGrad.addColorStop(0.85, 'rgba(255, 106, 0, 0.015)');
      atmGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = atmGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(2, radius * 1.55), 0, Math.PI * 2);
      ctx.fill();

      // 2. Planet Horizon Disc
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      const innerGrad = ctx.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.3,
        Math.max(1, radius * 0.2),
        cx,
        cy,
        Math.max(2, radius)
      );
      innerGrad.addColorStop(0, 'rgba(18, 18, 26, 0.7)');
      innerGrad.addColorStop(0.8, 'rgba(10, 10, 14, 0.85)');
      innerGrad.addColorStop(1, 'rgba(255, 106, 0, 0.28)');
      ctx.fillStyle = innerGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 106, 0, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 3. 3D Wireframe Grids
      ctx.lineWidth = 0.5;
      for (const ring of wireframeRings) {
        ctx.beginPath();
        let first = true;
        for (const pt of ring) {
          const p = project(pt, cx, cy, radius, cosY, sinY, cosP, sinP);
          if (p.z < -0.15) {
            first = true;
            continue;
          }
          if (first) {
            ctx.moveTo(p.x, p.y);
            first = false;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = 'rgba(255, 106, 0, 0.07)';
        ctx.stroke();
      }

      // 4. Continent Dot Matrix (Realistic Earth Continents)
      for (const pt of land3D) {
        const p = project(pt, cx, cy, radius, cosY, sinY, cosP, sinP);
        if (p.z < -0.1) continue;

        const alpha = Math.max(0.12, Math.min(0.9, (p.z + 0.3) / 1.3));
        const r = pt.importance * (alpha * 0.8 + 0.4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 120, 30, ${alpha})`;
        ctx.fill();
      }

      // 5. Great-Circle Arcs between Tashkent & Key Global Capitals
      const projNodes = nodes3D.map(n => project(n, cx, cy, radius, cosY, sinY, cosP, sinP));
      const tashkent = projNodes[0]; // UZ Node

      for (let i = 1; i < projNodes.length; i++) {
        const dest = projNodes[i];
        if (tashkent.z < -0.2 && dest.z < -0.2) continue;

        ctx.beginPath();
        const steps = 20;
        let arcVisible = false;

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const ax = nodes3D[0].x * (1 - t) + nodes3D[i].x * t;
          const ay = nodes3D[0].y * (1 - t) + nodes3D[i].y * t;
          const az = nodes3D[0].z * (1 - t) + nodes3D[i].z * t;
          const len = Math.sqrt(ax * ax + ay * ay + az * az);
          const altitude = 1 + Math.sin(t * Math.PI) * 0.24;

          const pt = project(
            { x: (ax / len) * altitude, y: (ay / len) * altitude, z: (az / len) * altitude },
            cx,
            cy,
            radius,
            cosY,
            sinY,
            cosP,
            sinP
          );

          if (pt.z > -0.2) arcVisible = true;
          if (s === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }

        if (arcVisible) {
          ctx.strokeStyle = i === 1 ? '#00E5FF' : '#FF6A00';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.45;
          ctx.stroke();
          ctx.globalAlpha = 1.0;

          // Moving photon energy packet
          const packetT = (pulseTime * 0.5 + i * 0.25) % 1;
          const ax = nodes3D[0].x * (1 - packetT) + nodes3D[i].x * packetT;
          const ay = nodes3D[0].y * (1 - packetT) + nodes3D[i].y * packetT;
          const az = nodes3D[0].z * (1 - packetT) + nodes3D[i].z * packetT;
          const len = Math.sqrt(ax * ax + ay * ay + az * az);
          const altitude = 1 + Math.sin(packetT * Math.PI) * 0.24;

          const pkt = project(
            { x: (ax / len) * altitude, y: (ay / len) * altitude, z: (az / len) * altitude },
            cx,
            cy,
            radius,
            cosY,
            sinY,
            cosP,
            sinP
          );

          if (pkt.z > -0.2) {
            ctx.beginPath();
            ctx.arc(pkt.x, pkt.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#FF6A00';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 6. Capital Beacon Nodes
      for (let i = 0; i < projNodes.length; i++) {
        const p = projNodes[i];
        if (p.z < 0) continue;

        const node = CAPITAL_NODES[i];
        const isTashkent = i === 0;

        // Pulse ring
        const rawProg = (pulseTime * 1.5 + i * 0.3) % 1;
        const ringProgress = (rawProg + 1) % 1;
        const ringRadius = Math.max(0.5, 4 + ringProgress * 16);
        ctx.beginPath();
        ctx.arc(p.x, p.y, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = node.statusColor;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = (1 - ringProgress) * 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Core pin
        ctx.beginPath();
        ctx.arc(p.x, p.y, isTashkent ? 4.5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isTashkent ? '#FFFFFF' : node.statusColor;
        ctx.shadowColor = node.statusColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Tiny Badge
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = isTashkent ? '#FF6A00' : '#FFFFFF';
        ctx.fillText(node.code, p.x + 6, p.y - 4);
      }

      // 7. Outer Orbital Satellite Telemetry Ring
      const orbitProgress = pulseTime * 0.2;
      const orbX = cx + Math.cos(orbitProgress) * radius * 1.22;
      const orbY = cy + Math.sin(orbitProgress) * radius * 0.65;

      ctx.beginPath();
      ctx.arc(orbX, orbY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6A00';
      ctx.shadowColor = '#FF6A00';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-90 transition-opacity duration-700"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
