import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GridPoint, SiteDimensions } from '../../types/survey';
import { TranslationDictionary } from '../../utils/translations';
import { Layers, RotateCcw, Box, Eye, Maximize2, ZoomIn, ZoomOut, Smartphone } from 'lucide-react';

interface Surface3DViewProps {
  points: GridPoint[];
  site: SiteDimensions;
  t: TranslationDictionary;
}

export const Surface3DView: React.FC<Surface3DViewProps> = ({ points, site, t }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isWireframe, setIsWireframe] = useState(false);
  const [showDesignPlane, setShowDesignPlane] = useState(true);

  // 3D Orbit Camera angles
  const [rotX, setRotX] = useState(0.85); // Pitch
  const [rotZ, setRotZ] = useState(-0.65); // Yaw
  const [zoom3D, setZoom3D] = useState(1.0);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  // Touch state
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1.0);

  const spacingX = site.gridSpacingX || 5;
  const spacingY = site.gridSpacingY || 5;
  const cols = Math.floor(site.length / spacingX) + 1;
  const rows = Math.floor(site.width / spacingY) + 1;

  const render3D = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const cx = rect.width / 2;
    const cy = rect.height / 2 + 15;

    const maxDim = Math.max(site.length, site.width) || 1;
    const scale = (Math.min(rect.width, rect.height) / (maxDim * 1.8)) * zoom3D;

    // Project 3D point (x, y, z) to 2D Screen
    const project3D = (x: number, y: number, z: number) => {
      const nx = x - site.length / 2;
      const ny = y - site.width / 2;
      const nz = (z - 100) * 1.5;

      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);
      const x1 = nx * cosZ - ny * sinZ;
      const y1 = nx * sinZ + ny * cosZ;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y1 * cosX - nz * sinX;
      const z2 = y1 * sinX + nz * cosX;

      const screenX = cx + x1 * scale;
      const screenY = cy - y2 * scale;

      return { screenX, screenY, zDepth: z2 };
    };

    const polygons: Array<{
      pts: Array<{ screenX: number; screenY: number }>;
      avgZDepth: number;
      avgDiff: number;
      isDesign: boolean;
    }> = [];

    // 1. Design Surface Mesh
    if (showDesignPlane) {
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const pA = points[r * cols + c];
          const pB = points[r * cols + (c + 1)];
          const pC = points[(r + 1) * cols + c];
          const pD = points[(r + 1) * cols + (c + 1)];

          if (pA && pB && pC && pD) {
            const pt3dA = project3D(pA.x, pA.y, pA.designRL);
            const pt3dB = project3D(pB.x, pB.y, pB.designRL);
            const pt3dD = project3D(pD.x, pD.y, pD.designRL);
            const pt3dC = project3D(pC.x, pC.y, pC.designRL);

            const avgDepth = (pt3dA.zDepth + pt3dB.zDepth + pt3dC.zDepth + pt3dD.zDepth) / 4;

            polygons.push({
              pts: [pt3dA, pt3dB, pt3dD, pt3dC],
              avgZDepth: avgDepth - 1,
              avgDiff: 0,
              isDesign: true,
            });
          }
        }
      }
    }

    // 2. Existing Terrain Mesh
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const pA = points[r * cols + c];
        const pB = points[r * cols + (c + 1)];
        const pC = points[(r + 1) * cols + c];
        const pD = points[(r + 1) * cols + (c + 1)];

        if (pA && pB && pC && pD) {
          const pt3dA = project3D(pA.x, pA.y, pA.existingRL);
          const pt3dB = project3D(pB.x, pB.y, pB.existingRL);
          const pt3dD = project3D(pD.x, pD.y, pD.existingRL);
          const pt3dC = project3D(pC.x, pC.y, pC.existingRL);

          const avgDiff = (pA.difference + pB.difference + pC.difference + pD.difference) / 4;
          const avgDepth = (pt3dA.zDepth + pt3dB.zDepth + pt3dC.zDepth + pt3dD.zDepth) / 4;

          polygons.push({
            pts: [pt3dA, pt3dB, pt3dD, pt3dC],
            avgZDepth: avgDepth,
            avgDiff,
            isDesign: false,
          });
        }
      }
    }

    polygons.sort((a, b) => a.avgZDepth - b.avgZDepth);

    polygons.forEach((poly) => {
      ctx.beginPath();
      ctx.moveTo(poly.pts[0].screenX, poly.pts[0].screenY);
      for (let i = 1; i < poly.pts.length; i++) {
        ctx.lineTo(poly.pts[i].screenX, poly.pts[i].screenY);
      }
      ctx.closePath();

      if (poly.isDesign) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        if (!isWireframe) {
          if (poly.avgDiff > 0.001) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.75)';
          } else if (poly.avgDiff < -0.001) {
            ctx.fillStyle = 'rgba(16, 185, 129, 0.75)';
          } else {
            ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
          }
          ctx.fill();
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }, [points, site, rotX, rotZ, zoom3D, isWireframe, showDesignPlane]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const observer = new ResizeObserver(() => {
      animationFrameId = window.requestAnimationFrame(() => {
        render3D();
      });
    });
    observer.observe(container);
    render3D();

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [render3D]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsOrbiting(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isOrbiting) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;

    setRotZ((z) => z + dx * 0.008);
    setRotX((x) => Math.max(0.1, Math.min(Math.PI / 2.1, x + dy * 0.008)));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsOrbiting(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const t1 = e.touches[0];
      setIsOrbiting(true);
      setLastMouse({ x: t1.clientX, y: t1.clientY });
    } else if (e.touches.length === 2) {
      setIsOrbiting(false);
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      touchStartDistRef.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchStartZoomRef.current = zoom3D;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isOrbiting) {
      const t1 = e.touches[0];
      const dx = t1.clientX - lastMouse.x;
      const dy = t1.clientY - lastMouse.y;

      setRotZ((z) => z + dx * 0.008);
      setRotX((x) => Math.max(0.1, Math.min(Math.PI / 2.1, x + dy * 0.008)));
      setLastMouse({ x: t1.clientX, y: t1.clientY });
    } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const scaleRatio = currentDist / touchStartDistRef.current;
      setZoom3D(Math.max(0.4, Math.min(3.5, touchStartZoomRef.current * scaleRatio)));
    }
  };

  const handleTouchEnd = () => {
    setIsOrbiting(false);
    touchStartDistRef.current = null;
  };

  return (
    <div className="relative flex flex-col h-full w-full rounded-2xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-2xl">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3 py-2 gap-2 z-10 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`rounded-lg px-2.5 py-1 font-semibold transition ${
              isWireframe ? 'bg-[#105b48] text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isWireframe ? t.wireframeMesh : t.solidMesh}
          </button>

          <button
            onClick={() => setShowDesignPlane(!showDesignPlane)}
            className={`rounded-lg px-2.5 py-1 font-semibold transition ${
              showDesignPlane ? 'bg-[#105b48] text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Design Surface Mesh
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom3D((z) => Math.min(3.5, z + 0.2))}
            className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom3D((z) => Math.max(0.4, z - 0.2))}
            className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setRotX(0.85);
              setRotZ(-0.65);
              setZoom3D(1.0);
            }}
            className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700"
            title={t.resetView}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div
        ref={containerRef}
        className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} className="h-full w-full block" />

        {/* 3D Legend */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2.5 rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-[11px] backdrop-blur-md">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-red-500" />
            <span className="text-slate-300">{t.cutColor}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-emerald-500" />
            <span className="text-slate-300">{t.fillColor}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded bg-sky-400/50 border border-sky-400" />
            <span className="text-slate-300">Design Target</span>
          </div>
        </div>
      </div>
    </div>
  );
};
