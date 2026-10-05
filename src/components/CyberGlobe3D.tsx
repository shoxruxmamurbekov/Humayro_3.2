import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Layers, Radio, Youtube, ExternalLink, Sparkles } from 'lucide-react';
import { REGIONS_INTELLIGENCE_DATA, RegionIntelligence } from '../data/regionsData';
import { CONTINENT_LAND_POINTS } from '../data/globeLandData';

export interface Hotspot3D {
  regionKey: string;
  name: string;
  code: string;
  lat: number;
  lon: number;
  status: 'critical' | 'elevated' | 'monitored';
  statusBadge: string;
  headline: string;
  videoCount: number;
  issueCount: number;
  liveCount?: number;
}

export const DEFAULT_HOTSPOTS_3D: Hotspot3D[] = [
  {
    regionKey: 'central-asia',
    name: "O'zbekiston va Markaziy Osiyo",
    code: 'UZ/CA',
    lat: 41.3,
    lon: 69.2,
    status: 'elevated',
    statusBadge: 'Yuqori faollik',
    headline: 'Raqamli iqtisodiyot, yashil energetika yoʻlaklari va suv xavfsizligi',
    videoCount: 3,
    issueCount: 3,
    liveCount: 5
  },
  {
    regionKey: 'east-asia',
    name: 'Sharqiy Osiyo va Tinch Okeani',
    code: 'KR/EA',
    lat: 37.5,
    lon: 127.0,
    status: 'critical',
    statusBadge: 'Kritik diqqat',
    headline: 'Yarimoʻtkazgichlar ishlab chiqarish va sunʼiy intellekt chip poygasi',
    videoCount: 2,
    issueCount: 2,
    liveCount: 3
  },
  {
    regionKey: 'europe',
    name: 'Yevropa Ittifoqi',
    code: 'EU/BRU',
    lat: 50.8,
    lon: 4.3,
    status: 'elevated',
    statusBadge: 'Qonunchilik',
    headline: 'Energetika mustaqilligi, yangi AI Act qoidalari va iqtisodiy islohotlar',
    videoCount: 2,
    issueCount: 2,
    liveCount: 4
  },
  {
    regionKey: 'north-america',
    name: 'Shimoliy Amerika (AQSH / Kanada)',
    code: 'US/NA',
    lat: 38.9,
    lon: -77.0,
    status: 'critical',
    statusBadge: 'Kritik diqqat',
    headline: 'Silikon vodiysi AI inqilobi, maʼlumot markazlari va moliya bozorlari',
    videoCount: 2,
    issueCount: 2,
    liveCount: 4
  },
  {
    regionKey: 'middle-east',
    name: 'Yaqin Sharq va Fors koʻrfazi',
    code: 'ME/GULF',
    lat: 25.2,
    lon: 55.3,
    status: 'elevated',
    statusBadge: 'Strategik hab',
    headline: 'AI investitsiya fondlari, Vision 2030 va tinchlik diplomatiyasi',
    videoCount: 2,
    issueCount: 2,
    liveCount: 2
  },
  {
    regionKey: 'africa',
    name: 'Afrika qitʼasi',
    code: 'AFR',
    lat: -1.3,
    lon: 36.8,
    status: 'monitored',
    statusBadge: 'Rivojlanish',
    headline: 'Raqamli startaplar, togʻ-kon sanoati va energetika loyihalari',
    videoCount: 2,
    issueCount: 2,
    liveCount: 2
  },
  {
    regionKey: 'south-america',
    name: 'Janubiy Amerika',
    code: 'SA/BRA',
    lat: -23.5,
    lon: -46.6,
    status: 'monitored',
    statusBadge: 'Monitoring',
    headline: 'Bio-xavfsizlik, agrotexnologiyalar va qayta tiklanuvchi energiya',
    videoCount: 2,
    issueCount: 2,
    liveCount: 1
  },
  {
    regionKey: 'oceania',
    name: 'Avstraliya va Okeaniya',
    code: 'OC/SYD',
    lat: -33.8,
    lon: 151.2,
    status: 'monitored',
    statusBadge: 'Monitoring',
    headline: 'Kosmik kuzatuv stansiyalari, yashil vodorod va dengiz ekologiyasi',
    videoCount: 2,
    issueCount: 2,
    liveCount: 1
  }
];

// 3D Communication Arcs connecting major hubs
const ARCS_CONFIG = [
  { from: 'central-asia', to: 'east-asia', color: '#FF6A00' },
  { from: 'central-asia', to: 'europe', color: '#FFA84D' },
  { from: 'central-asia', to: 'middle-east', color: '#00E5FF' },
  { from: 'europe', to: 'north-america', color: '#FF3366' },
  { from: 'middle-east', to: 'africa', color: '#00E5FF' },
  { from: 'east-asia', to: 'oceania', color: '#FFA84D' },
  { from: 'north-america', to: 'south-america', color: '#FF6A00' }
];

export interface CyberGlobe3DProps {
  selectedRegionKey: string;
  onSelectRegion: (regionKey: string) => void;
  customHotspots?: Hotspot3D[];
}

export const CyberGlobe3D: React.FC<CyberGlobe3DProps> = ({
  selectedRegionKey,
  onSelectRegion,
  customHotspots
}) => {
  const activeHotspotsList = (customHotspots && customHotspots.length > 0) ? customHotspots : DEFAULT_HOTSPOTS_3D;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction & Animation State
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoomScale, setZoomScale] = useState(1.0);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot3D | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Globe Physics State stored in refs for 60FPS loop without react re-renders
  const rotationRef = useRef({
    yaw: 0.8, // Radian angle (Central Asia initially facing)
    pitch: 0.25, // Slight top-down view
    yawVelocity: 0.003,
    pitchVelocity: 0,
    targetYaw: null as number | null,
    targetPitch: null as number | null
  });

  const mouseRef = useRef({
    isDown: false,
    lastX: 0,
    lastY: 0,
    downX: 0,
    downY: 0
  });

  const projectedHotspotsRef = useRef<
    Array<{ hotspot: Hotspot3D; screenX: number; screenY: number; z: number; visible: boolean }>
  >([]);

  // Smooth "Fly-To" animation towards a selected hotspot
  const flyToRegion = useCallback((regionKey: string) => {
    const spot = activeHotspotsList.find(h => h.regionKey === regionKey);
    if (!spot) return;

    // Convert latitude and longitude to target yaw and pitch
    // Lon maps to yaw (-lon converted to radians)
    const targetYaw = -((spot.lon * Math.PI) / 180) + Math.PI / 2;
    const targetPitch = (spot.lat * Math.PI) / 180 * 0.7; // slight dampening for natural view

    rotationRef.current.targetYaw = targetYaw;
    rotationRef.current.targetPitch = targetPitch;
  }, []);

  // Trigger Fly-To when selectedRegionKey changes from parent
  useEffect(() => {
    if (selectedRegionKey) {
      flyToRegion(selectedRegionKey);
    }
  }, [selectedRegionKey, flyToRegion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 560);

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', onResize);

    // Generate latitude / longitude grid lines for 3D sphere wireframe
    const gridRings: Array<Array<{ x: number; y: number; z: number }>> = [];
    const sphereRadius = Math.min(width, height) * 0.38;

    // 1. Latitude parallels (-60 to +60 in 30-deg steps)
    for (let lat = -60; lat <= 60; lat += 30) {
      const ring: Array<{ x: number; y: number; z: number }> = [];
      const phi = (lat * Math.PI) / 180;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      for (let lon = 0; lon <= 360; lon += 12) {
        const theta = (lon * Math.PI) / 180;
        ring.push({
          x: sphereRadius * cosPhi * Math.sin(theta),
          y: -sphereRadius * sinPhi,
          z: sphereRadius * cosPhi * Math.cos(theta)
        });
      }
      gridRings.push(ring);
    }

    // 2. Longitude meridians (every 45 deg)
    for (let lon = 0; lon < 360; lon += 45) {
      const ring: Array<{ x: number; y: number; z: number }> = [];
      const theta = (lon * Math.PI) / 180;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      for (let lat = -80; lat <= 80; lat += 10) {
        const phi = (lat * Math.PI) / 180;
        ring.push({
          x: sphereRadius * Math.cos(phi) * sinTheta,
          y: -sphereRadius * Math.sin(phi),
          z: sphereRadius * Math.cos(phi) * cosTheta
        });
      }
      gridRings.push(ring);
    }

    // Precalculate 3D points for landmass dots
    const land3DPoints: Array<{ x: number; y: number; z: number; size: number }> = [];
    for (const pt of CONTINENT_LAND_POINTS) {
      const phi = (pt.lat * Math.PI) / 180;
      const theta = (pt.lon * Math.PI) / 180;
      land3DPoints.push({
        x: sphereRadius * Math.cos(phi) * Math.sin(theta),
        y: -sphereRadius * Math.sin(phi),
        z: sphereRadius * Math.cos(phi) * Math.cos(theta),
        size: pt.importance || 1.3
      });
    }

    // Convert Hotspots into 3D positions
    const hotspots3D = activeHotspotsList.map(h => {
      const phi = (h.lat * Math.PI) / 180;
      const theta = (h.lon * Math.PI) / 180;
      return {
        ...h,
        x: sphereRadius * Math.cos(phi) * Math.sin(theta),
        y: -sphereRadius * Math.sin(phi),
        z: sphereRadius * Math.cos(phi) * Math.cos(theta)
      };
    });

    let pulseTime = 0;

    // Main 60 FPS Render Loop
    const render = () => {
      pulseTime += 0.035;
      const rot = rotationRef.current;

      // Handle Smooth "Fly-To" Slerp Interpolation
      if (rot.targetYaw !== null && rot.targetPitch !== null) {
        // Find shortest angular path
        let dy = rot.targetYaw - rot.yaw;
        while (dy < -Math.PI) dy += Math.PI * 2;
        while (dy > Math.PI) dy -= Math.PI * 2;

        const dp = rot.targetPitch - rot.pitch;

        rot.yaw += dy * 0.08;
        rot.pitch += dp * 0.08;

        if (Math.abs(dy) < 0.005 && Math.abs(dp) < 0.005) {
          rot.targetYaw = null;
          rot.targetPitch = null;
        }
      } else if (autoRotate && !mouseRef.current.isDown) {
        // Constant gentle planetary rotation
        rot.yaw += 0.0035;
      }

      // Apply drag inertia with damping
      if (!mouseRef.current.isDown && rot.targetYaw === null) {
        rot.yaw += rot.yawVelocity;
        rot.pitch += rot.pitchVelocity;
        rot.yawVelocity *= 0.92;
        rot.pitchVelocity *= 0.92;
      }

      // Clamp pitch to avoid gimbal flipping
      rot.pitch = Math.max(-1.1, Math.min(1.1, rot.pitch));

      if (width <= 20 || height <= 20) {
        animId = requestAnimationFrame(render);
        return;
      }

      const cx = width / 2;
      const cy = height / 2;
      const curRadius = Math.max(60, sphereRadius * zoomScale);
      const fovDistance = 900;

      // 3D rotation projection helper
      const cosY = Math.cos(rot.yaw);
      const sinY = Math.sin(rot.yaw);
      const cosP = Math.cos(rot.pitch);
      const sinP = Math.sin(rot.pitch);

      const project = (px: number, py: number, pz: number, rScale = 1) => {
        // 1. Yaw rotation around Y axis
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;

        // 2. Pitch rotation around X axis
        const y2 = py * cosP - z1 * sinP;
        const z2 = py * sinP + z1 * cosP;

        // Perspective projection
        const persp = fovDistance / (fovDistance - z2 * rScale);
        return {
          sx: cx + x1 * persp * rScale,
          sy: cy + y2 * persp * rScale,
          sz: z2,
          persp
        };
      };

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Atmospheric Halo / Glow
      const glowGrad = ctx.createRadialGradient(
        cx,
        cy,
        Math.max(1, curRadius * 0.75),
        cx,
        cy,
        Math.max(2, curRadius * 1.35)
      );
      glowGrad.addColorStop(0, 'rgba(255, 106, 0, 0.06)');
      glowGrad.addColorStop(0.6, 'rgba(255, 106, 0, 0.04)');
      glowGrad.addColorStop(0.85, 'rgba(255, 106, 0, 0.02)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(2, curRadius * 1.35), 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // 2. Draw Sphere Outer Horizon Border & Dark Inner Mass
      ctx.beginPath();
      ctx.arc(cx, cy, curRadius, 0, Math.PI * 2);
      const horizonGrad = ctx.createRadialGradient(
        cx - curRadius * 0.35,
        cy - curRadius * 0.35,
        Math.max(1, curRadius * 0.2),
        cx,
        cy,
        Math.max(2, curRadius)
      );
      horizonGrad.addColorStop(0, 'rgba(16, 16, 22, 0.95)');
      horizonGrad.addColorStop(0.8, 'rgba(8, 8, 12, 0.98)');
      horizonGrad.addColorStop(1, 'rgba(255, 106, 0, 0.35)');
      ctx.fillStyle = horizonGrad;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(255, 106, 0, 0.4)';
      ctx.stroke();

      // 3. Draw 3D Grid Meridian & Parallel Wireframe Lines
      ctx.lineWidth = 0.6;
      for (const ring of gridRings) {
        ctx.beginPath();
        let first = true;
        for (const pt of ring) {
          const { sx, sy, sz } = project(pt.x, pt.y, pt.z, zoomScale);
          if (first) {
            ctx.moveTo(sx, sy);
            first = false;
          } else {
            ctx.lineTo(sx, sy);
          }
        }
        ctx.strokeStyle = 'rgba(255, 106, 0, 0.09)';
        ctx.stroke();
      }

      // 4. Draw Landmass Hologram Dot Matrix
      for (let i = 0; i < land3DPoints.length; i++) {
        const pt = land3DPoints[i];
        const { sx, sy, sz } = project(pt.x, pt.y, pt.z, zoomScale);

        // Depth culling: Front hemisphere is sharp and luminous; back is faded
        const isFront = sz > -sphereRadius * 0.15;
        if (!isFront) continue; // Cull backside for crisp matrix look

        const alpha = Math.max(0.12, Math.min(0.95, (sz + sphereRadius * 0.5) / sphereRadius));
        const dotRadius = Math.max(0.7, pt.size * (alpha * 0.9 + 0.4) * zoomScale);

        ctx.beginPath();
        ctx.arc(sx, sy, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 140, 40, ${alpha})`;
        ctx.fill();
      }

      // 5. Draw 3D Great-Circle Communication Arcs between Hubs
      for (const arc of ARCS_CONFIG) {
        const h1 = hotspots3D.find(h => h.regionKey === arc.from);
        const h2 = hotspots3D.find(h => h.regionKey === arc.to);
        if (!h1 || !h2) continue;

        const p1 = project(h1.x, h1.y, h1.z, zoomScale);
        const p2 = project(h2.x, h2.y, h2.z, zoomScale);

        // Only draw if at least one endpoint is facing viewer
        if (p1.sz < -sphereRadius * 0.3 && p2.sz < -sphereRadius * 0.3) continue;

        ctx.beginPath();
        const steps = 24;
        let arcVisible = false;

        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          // Interpolate on sphere surface + parabolic arc lift
          const ax = h1.x * (1 - t) + h2.x * t;
          const ay = h1.y * (1 - t) + h2.y * t;
          const az = h1.z * (1 - t) + h2.z * t;
          const len = Math.sqrt(ax * ax + ay * ay + az * az);

          // Elevate arc peak by up to 28% of radius
          const arcAltitude = 1 + Math.sin(t * Math.PI) * 0.28;
          const px = (ax / len) * sphereRadius * arcAltitude;
          const py = (ay / len) * sphereRadius * arcAltitude;
          const pz = (az / len) * sphereRadius * arcAltitude;

          const pt = project(px, py, pz, zoomScale);
          if (pt.sz > -sphereRadius * 0.2) arcVisible = true;

          if (s === 0) ctx.moveTo(pt.sx, pt.sy);
          else ctx.lineTo(pt.sx, pt.sy);
        }

        if (arcVisible) {
          ctx.strokeStyle = arc.color;
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.55;
          ctx.stroke();
          ctx.globalAlpha = 1.0;

          // Animated flying photon packet along the arc
          const packetT = (pulseTime * 0.45 + (arc.from.length * 0.2)) % 1;
          const ax = h1.x * (1 - packetT) + h2.x * packetT;
          const ay = h1.y * (1 - packetT) + h2.y * packetT;
          const az = h1.z * (1 - packetT) + h2.z * packetT;
          const len = Math.sqrt(ax * ax + ay * ay + az * az);
          const arcAltitude = 1 + Math.sin(packetT * Math.PI) * 0.28;
          const pkt = project(
            (ax / len) * sphereRadius * arcAltitude,
            (ay / len) * sphereRadius * arcAltitude,
            (az / len) * sphereRadius * arcAltitude,
            zoomScale
          );

          if (pkt.sz > -sphereRadius * 0.2) {
            ctx.beginPath();
            ctx.arc(pkt.sx, pkt.sy, Math.max(0.5, 2.5 * zoomScale), 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = arc.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 6. Draw 3D Hotspot Beacons & Pulse Rings
      const currentProjectedHotspots: Array<{
        hotspot: Hotspot3D;
        screenX: number;
        screenY: number;
        z: number;
        visible: boolean;
      }> = [];

      for (const h of hotspots3D) {
        const p = project(h.x, h.y, h.z, zoomScale);
        const isFront = p.sz > 0;
        const isSelected = h.regionKey === selectedRegionKey;

        currentProjectedHotspots.push({
          hotspot: h,
          screenX: p.sx,
          screenY: p.sy,
          z: p.sz,
          visible: isFront
        });

        if (!isFront) continue; // Behind sphere horizon

        const beaconColor =
          h.status === 'critical' ? '#FF2A55' : h.status === 'elevated' ? '#FF6A00' : '#00E5FF';

        // Outer expanding radar pulse ring (guarantee strictly positive modulo in [0, 1))
        const rawRingProg = (pulseTime * 1.5 + (Math.abs(h.lat) * 0.1)) % 1;
        const ringProgress = (rawRingProg + 1) % 1;
        const ringRadius = Math.max(0.5, (5 + ringProgress * 18) * Math.max(0.2, zoomScale));
        const ringAlpha = Math.max(0, Math.min(1, (1 - ringProgress) * 0.8));

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = beaconColor;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = ringAlpha;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        // Second pulse ring for active/selected hotspot
        if (isSelected) {
          const rawRing2Prog = (pulseTime * 1.5 + 0.5) % 1;
          const ring2Progress = (rawRing2Prog + 1) % 1;
          const ring2Radius = Math.max(0.5, (5 + ring2Progress * 26) * Math.max(0.2, zoomScale));
          const ring2Alpha = Math.max(0, Math.min(1, (1 - ring2Progress) * 0.9));

          ctx.beginPath();
          ctx.arc(p.sx, p.sy, ring2Radius, 0, Math.PI * 2);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.globalAlpha = ring2Alpha;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }

        // Inner solid beacon core
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, Math.max(1, (isSelected ? 5.5 : 4) * zoomScale), 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#FFFFFF' : beaconColor;
        ctx.shadowColor = beaconColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Floating Code Label Billboard
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        const labelText = h.code;
        const textWidth = ctx.measureText(labelText).width;
        const lx = p.sx + 8 * zoomScale;
        const ly = p.sy - 8 * zoomScale;

        // Pill background
        ctx.fillStyle = isSelected ? 'rgba(255, 106, 0, 0.9)' : 'rgba(8, 8, 12, 0.85)';
        ctx.strokeStyle = isSelected ? '#FFFFFF' : 'rgba(255, 106, 0, 0.4)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        if (typeof (ctx as any).roundRect === 'function') {
          (ctx as any).roundRect(lx - 4, ly - 7, textWidth + 8, 14, 4);
        } else {
          ctx.rect(lx - 4, ly - 7, textWidth + 8, 14);
        }
        ctx.fill();
        ctx.stroke();

        // Pill text
        ctx.fillStyle = isSelected ? '#000000' : '#FFFFFF';
        ctx.fillText(labelText, lx, ly);
      }

      projectedHotspotsRef.current = currentProjectedHotspots;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [autoRotate, zoomScale, selectedRegionKey, activeHotspotsList]);

  // Mouse / Touch Event Handlers for 360° Drag & Hover
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    mouseRef.current.isDown = true;
    mouseRef.current.lastX = e.clientX;
    mouseRef.current.lastY = e.clientY;
    mouseRef.current.downX = e.clientX;
    mouseRef.current.downY = e.clientY;
    rotationRef.current.targetYaw = null;
    rotationRef.current.targetPitch = null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (mouseRef.current.isDown) {
      const dx = e.clientX - mouseRef.current.lastX;
      const dy = e.clientY - mouseRef.current.lastY;

      rotationRef.current.yaw += dx * 0.006;
      rotationRef.current.pitch += dy * 0.006;
      rotationRef.current.yawVelocity = dx * 0.005;
      rotationRef.current.pitchVelocity = dy * 0.005;

      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    } else {
      // Check hover on hotspots
      let found: Hotspot3D | null = null;
      for (const item of projectedHotspotsRef.current) {
        if (!item.visible) continue;
        const dist = Math.hypot(mouseX - item.screenX, mouseY - item.screenY);
        if (dist < 18) {
          found = item.hotspot;
          setTooltipPos({ x: item.screenX, y: item.screenY });
          break;
        }
      }
      setHoveredHotspot(found);
      if (!found) setTooltipPos(null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    mouseRef.current.isDown = false;

    // Check if it was a click (distance moved < 6px)
    const moveDist = Math.hypot(
      e.clientX - mouseRef.current.downX,
      e.clientY - mouseRef.current.downY
    );

    if (moveDist < 6) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Click hit test on hotspots
      for (const item of projectedHotspotsRef.current) {
        if (!item.visible) continue;
        const dist = Math.hypot(mouseX - item.screenX, mouseY - item.screenY);
        if (dist < 22) {
          onSelectRegion(item.hotspot.regionKey);
          flyToRegion(item.hotspot.regionKey);
          break;
        }
      }
    }
  };

  // Touch handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      mouseRef.current.isDown = true;
      mouseRef.current.lastX = e.touches[0].clientX;
      mouseRef.current.lastY = e.touches[0].clientY;
      mouseRef.current.downX = e.touches[0].clientX;
      mouseRef.current.downY = e.touches[0].clientY;
      rotationRef.current.targetYaw = null;
      rotationRef.current.targetPitch = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && mouseRef.current.isDown) {
      const dx = e.touches[0].clientX - mouseRef.current.lastX;
      const dy = e.touches[0].clientY - mouseRef.current.lastY;

      rotationRef.current.yaw += dx * 0.007;
      rotationRef.current.pitch += dy * 0.007;
      rotationRef.current.yawVelocity = dx * 0.006;
      rotationRef.current.pitchVelocity = dy * 0.006;

      mouseRef.current.lastX = e.touches[0].clientX;
      mouseRef.current.lastY = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    mouseRef.current.isDown = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoomScale(prev => Math.max(0.65, Math.min(1.85, prev + delta)));
  };

  const resetView = () => {
    flyToRegion('central-asia');
    setZoomScale(1.0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[540px] sm:h-[620px] select-none rounded-3xl overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#060608] to-[#040406] border border-white/10 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing"
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="w-full h-full block"
      />

      {/* Floating HUD: Top Left Status Monitor */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            Hologram 3D Sphere · 360° Realtime
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 pl-3">
          Drag to rotate · Scroll to zoom · Click beacon for Intel & YouTube
        </span>
      </div>

      {/* Floating HUD: Bottom Center Controls Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-xl shadow-2xl">
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
            autoRotate
              ? 'bg-[#FF6A00] text-black font-bold shadow-md'
              : 'text-zinc-300 hover:text-white bg-white/5'
          }`}
          title="Avtomatik aylanishni yoqish / to'xtatish"
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{autoRotate ? 'Aylanish: ON' : 'Aylanish: OFF'}</span>
        </button>

        <div className="w-px h-5 bg-white/10" />

        <button
          type="button"
          onClick={() => setZoomScale(prev => Math.min(1.85, prev + 0.15))}
          className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Kattalashtirish (Zoom in)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setZoomScale(prev => Math.max(0.65, prev - 0.15))}
          className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Kichraytirish (Zoom out)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={resetView}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Markaziy Osiyoga qaytish"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#FF6A00]" />
          <span className="hidden sm:inline">Qaytarish</span>
        </button>
      </div>

      {/* Floating Interactive Hover Tooltip */}
      {hoveredHotspot && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none transition-all duration-75"
          style={{
            left: `${tooltipPos.x + 14}px`,
            top: `${tooltipPos.y - 14}px`,
            transform: 'translate(0, -50%)'
          }}
        >
          <div className="w-64 p-3.5 rounded-2xl bg-[#0d0d12]/95 border border-[#FF6A00]/50 shadow-[0_10px_30px_rgba(255,106,0,0.25)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-[#FF6A00]">
                {hoveredHotspot.code}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {hoveredHotspot.statusBadge}
              </span>
            </div>

            <h4 className="font-bold text-sm text-white mb-1 leading-snug">
              {hoveredHotspot.name}
            </h4>
            <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2 leading-relaxed">
              {hoveredHotspot.headline}
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-[#FF6A00]">
                {hoveredHotspot.liveCount ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-semibold">{hoveredHotspot.liveCount} ta jonli xabar</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-zinc-400">{hoveredHotspot.videoCount} video</span>
                  </>
                ) : (
                  <>
                    <Youtube className="w-3.5 h-3.5" />
                    <span>{hoveredHotspot.videoCount} ta YouTube video</span>
                  </>
                )}
              </span>
              <span className="text-zinc-500">Bosing ↗</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
