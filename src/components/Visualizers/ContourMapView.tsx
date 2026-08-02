import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GridPoint, SiteDimensions } from '../../types/survey';
import { TranslationDictionary } from '../../utils/translations';
import { Sliders, Eye, RotateCcw } from 'lucide-react';

interface ContourMapViewProps {
  points: GridPoint[];
  site: SiteDimensions;
  interval: number;
  onChangeInterval: (val: number) => void;
  t: TranslationDictionary;
}

const INTERVAL_PRESETS = [0.25, 0.5, 1, 2, 5];

export const ContourMapView: React.FC<ContourMapViewProps> = ({
  points,
  site,
  interval,
  onChangeInterval,
  t,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const spacingX = site.gridSpacingX || 5;
  const spacingY = site.gridSpacingY || 5;
  const cols = Math.floor(site.length / spacingX) + 1;
  const rows = Math.floor(site.width / spacingY) + 1;

  const renderContour = useCallback(() => {
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

    const isMobile = rect.width < 640;
    const padding = isMobile ? 35 : 50;
    const availableW = rect.width - padding * 2;
    const availableH = rect.height - padding * 2;
    const scaleX = availableW / (site.length || 1);
    const scaleY = availableH / (site.width || 1);
    const baseScale = Math.min(scaleX, scaleY);

    // Find min and max elevations
    const rls = points.map((p) => p.existingRL);
    const minRL = Math.min(...rls);
    const maxRL = Math.max(...rls);

    // Contour elevation levels
    const minLevel = Math.floor(minRL / interval) * interval;
    const maxLevel = Math.ceil(maxRL / interval) * interval;

    // Background CAD Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let c = 0; c < cols; c++) {
      const x = padding + c * spacingX * baseScale;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + site.width * baseScale);
      ctx.stroke();
    }
    for (let r = 0; r < rows; r++) {
      const y = padding + r * spacingY * baseScale;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + site.length * baseScale, y);
      ctx.stroke();
    }

    // Marching Squares Contour Algorithm
    for (let lvl = minLevel; lvl <= maxLevel; lvl += interval) {
      const targetZ = Number(lvl.toFixed(3));
      if (targetZ < minRL || targetZ > maxRL) continue;

      const isMajor = Math.abs(targetZ % (interval * 5)) < 0.001 || targetZ % 1 === 0;

      ctx.strokeStyle = isMajor ? '#1BBF89' : 'rgba(52, 211, 153, 0.45)';
      ctx.lineWidth = isMajor ? 2.0 : 1.0;

      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const p1 = points[r * cols + c];
          const p2 = points[r * cols + (c + 1)];
          const p3 = points[(r + 1) * cols + (c + 1)];
          const p4 = points[(r + 1) * cols + c];

          if (!p1 || !p2 || !p3 || !p4) continue;

          const z1 = p1.existingRL;
          const z2 = p2.existingRL;
          const z3 = p3.existingRL;
          const z4 = p4.existingRL;

          const interp = (v1: number, v2: number, zA: number, zB: number) => {
            if (Math.abs(zB - zA) < 0.0001) return v1;
            return v1 + ((targetZ - zA) / (zB - zA)) * (v2 - v1);
          };

          const ptsOnEdges: Array<{ x: number; y: number }> = [];

          if ((z1 <= targetZ && z2 >= targetZ) || (z1 >= targetZ && z2 <= targetZ)) {
            ptsOnEdges.push({ x: interp(p1.x, p2.x, z1, z2), y: p1.y });
          }
          if ((z2 <= targetZ && z3 >= targetZ) || (z2 >= targetZ && z3 <= targetZ)) {
            ptsOnEdges.push({ x: p2.x, y: interp(p2.y, p3.y, z2, z3) });
          }
          if ((z4 <= targetZ && z3 >= targetZ) || (z4 >= targetZ && z3 <= targetZ)) {
            ptsOnEdges.push({ x: interp(p4.x, p3.x, z4, z3), y: p4.y });
          }
          if ((z1 <= targetZ && z4 >= targetZ) || (z1 >= targetZ && z4 <= targetZ)) {
            ptsOnEdges.push({ x: p1.x, y: interp(p1.y, p4.y, z1, z4) });
          }

          if (ptsOnEdges.length >= 2) {
            const screen1 = {
              x: padding + ptsOnEdges[0].x * baseScale,
              y: padding + (site.width - ptsOnEdges[0].y) * baseScale,
            };
            const screen2 = {
              x: padding + ptsOnEdges[1].x * baseScale,
              y: padding + (site.width - ptsOnEdges[1].y) * baseScale,
            };

            ctx.beginPath();
            ctx.moveTo(screen1.x, screen1.y);
            ctx.lineTo(screen2.x, screen2.y);
            ctx.stroke();

            if (isMajor && c % 3 === 0 && r % 3 === 0) {
              ctx.fillStyle = '#34d399';
              ctx.font = 'bold 9px "JetBrains Mono", monospace';
              ctx.fillText(`${targetZ.toFixed(1)}m`, (screen1.x + screen2.x) / 2, (screen1.y + screen2.y) / 2);
            }
          }
        }
      }
    }

    // Render Station Nodes
    points.forEach((p) => {
      const cx = padding + p.x * baseScale;
      const cy = padding + (site.width - p.y) * baseScale;

      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();

      if (!isMobile) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(p.station, cx, cy - 6);
      }
    });
  }, [points, site, interval]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const observer = new ResizeObserver(() => {
      animationFrameId = window.requestAnimationFrame(() => {
        renderContour();
      });
    });
    observer.observe(container);
    renderContour();

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [renderContour]);

  return (
    <div className="relative flex flex-col h-full w-full rounded-2xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3 py-2 gap-2 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sliders className="h-4 w-4 text-emerald-400" />
            {t.contourInterval}:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {INTERVAL_PRESETS.map((iv) => (
              <button
                key={iv}
                onClick={() => onChangeInterval(iv)}
                className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition ${
                  interval === iv
                    ? 'bg-[#105b48] text-white ring-1 ring-emerald-400'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {iv}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contour Canvas */}
      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <canvas ref={canvasRef} className="h-full w-full block" />
      </div>
    </div>
  );
};
