import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GridPoint, SiteDimensions } from '../../types/survey';
import { TranslationDictionary } from '../../utils/translations';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Eye,
  Layers,
  Info,
  Sliders,
  Sparkles,
  Move,
  Smartphone,
} from 'lucide-react';

interface Grid2DViewProps {
  points: GridPoint[];
  site: SiteDimensions;
  t: TranslationDictionary;
  onSelectPoint: (point: GridPoint) => void;
}

export const Grid2DView: React.FC<Grid2DViewProps> = ({
  points,
  site,
  t,
  onSelectPoint,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Toggleable Layer Options
  const [showGridLines, setShowGridLines] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(false); // Default off on compact screens for clarity
  const [showStationLabels, setShowStationLabels] = useState(true);
  const [showHeatMap, setShowHeatMap] = useState(true);

  // View state: Zoom & Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 30, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState<GridPoint | null>(null);

  // Touch Gesture tracking
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartZoomRef = useRef<number>(1);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const touchMovedRef = useRef<boolean>(false);

  const spacingX = site.gridSpacingX || 5;
  const spacingY = site.gridSpacingY || 5;
  const cols = Math.floor(site.length / spacingX) + 1;
  const rows = Math.floor(site.width / spacingY) + 1;

  // Auto Reset / Center View
  const handleResetView = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const isMobile = rect.width < 640;
    setZoom(isMobile ? 0.9 : 1.0);
    setPan({ x: isMobile ? 20 : 40, y: isMobile ? 20 : 40 });
  }, []);

  // Responsive Canvas Rendering
  const renderCanvas = useCallback(() => {
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

    // Padding around survey rectangle
    const isMobile = rect.width < 640;
    const padding = isMobile ? 35 : 55;
    const availableW = rect.width - padding * 2;
    const availableH = rect.height - padding * 2;

    const scaleX = availableW / (site.length || 1);
    const scaleY = availableH / (site.width || 1);
    const baseScale = Math.min(scaleX, scaleY);

    // Calculate effective pixel spacing between adjacent station nodes
    const pixelNodeSpacing = spacingX * baseScale * zoom;
    const isLowLOD = pixelNodeSpacing < 36 || (isMobile && zoom <= 1.0);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // 1. Render Volumetric Heatmap Cells
    if (showHeatMap && points.length > 0) {
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const pA = points[r * cols + c];
          const pB = points[r * cols + (c + 1)];
          const pC = points[(r + 1) * cols + c];
          const pD = points[(r + 1) * cols + (c + 1)];

          if (pA && pB && pC && pD) {
            const avgDiff = (pA.difference + pB.difference + pC.difference + pD.difference) / 4;

            let fillColor = 'rgba(71, 85, 105, 0.2)';
            if (avgDiff > 0.001) {
              const alpha = Math.min(0.8, 0.2 + (avgDiff / 3.0) * 0.6);
              fillColor = `rgba(239, 68, 68, ${alpha})`; // Cut Red
            } else if (avgDiff < -0.001) {
              const alpha = Math.min(0.8, 0.2 + (Math.abs(avgDiff) / 3.0) * 0.6);
              fillColor = `rgba(16, 185, 129, ${alpha})`; // Fill Green
            }

            const x1 = padding + pA.x * baseScale;
            const y1 = padding + (site.width - pA.y) * baseScale;
            const cellW = spacingX * baseScale;
            const cellH = spacingY * baseScale;

            ctx.fillStyle = fillColor;
            ctx.fillRect(x1, y1 - cellH, cellW, cellH);
          }
        }
      }
    }

    // 2. Render Grid CAD Lines
    if (showGridLines) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1 / zoom;

      // Vertical grid lines
      for (let c = 0; c < cols; c++) {
        const x = padding + c * spacingX * baseScale;
        const yStart = padding;
        const yEnd = padding + site.width * baseScale;

        ctx.beginPath();
        ctx.moveTo(x, yStart);
        ctx.lineTo(x, yEnd);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let r = 0; r < rows; r++) {
        const y = padding + r * spacingY * baseScale;
        const xStart = padding;
        const xEnd = padding + site.length * baseScale;

        ctx.beginPath();
        ctx.moveTo(xStart, y);
        ctx.lineTo(xEnd, y);
        ctx.stroke();
      }
    }

    // 3. Render Station Nodes & Adaptive Labels
    points.forEach((p) => {
      const cx = padding + p.x * baseScale;
      const cy = padding + (site.width - p.y) * baseScale;

      const isHovered = hoveredPoint?.id === p.id;
      const nodeRadius = (isHovered ? (isMobile ? 8 : 7) : (isMobile ? 5.5 : 4.5)) / Math.max(0.7, Math.sqrt(zoom));

      ctx.beginPath();
      ctx.arc(cx, cy, nodeRadius, 0, Math.PI * 2);

      if (p.difference > 0.001) {
        ctx.fillStyle = '#ef4444'; // Red Cut
      } else if (p.difference < -0.001) {
        ctx.fillStyle = '#10b981'; // Green Fill
      } else {
        ctx.fillStyle = '#94a3b8'; // Zero
      }
      ctx.fill();

      ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(15, 23, 42, 0.9)';
      ctx.lineWidth = (isHovered ? 2.5 : 1) / zoom;
      ctx.stroke();

      // Station ID label (e.g. A1)
      if (showStationLabels) {
        ctx.fillStyle = '#f8fafc';
        const fontSize = Math.max(8, Math.min(13, 10 / Math.pow(zoom, 0.3)));
        ctx.font = `600 ${fontSize}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(p.station, cx, cy - (nodeRadius + 4));
      }

      // Optional Coordinates Label
      if (!isLowLOD && showCoordinates) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.font = '400 8px sans-serif';
        ctx.fillText(`(${p.x},${p.y})`, cx, cy + nodeRadius + 10);
      }
    });

    ctx.restore();
  }, [
    points,
    site,
    zoom,
    pan,
    showGridLines,
    showCoordinates,
    showStationLabels,
    showHeatMap,
    hoveredPoint,
  ]);

  // ResizeObserver for dynamic canvas sizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const observer = new ResizeObserver(() => {
      animationFrameId = window.requestAnimationFrame(() => {
        renderCanvas();
      });
    });

    observer.observe(container);
    renderCanvas();

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [renderCanvas]);

  // Mouse pan & hover handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only main click
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const findNearestPoint = useCallback(
    (clientX: number, clientY: number): GridPoint | null => {
      const container = containerRef.current;
      if (!container) return null;
      const rect = container.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      const isMobile = rect.width < 640;
      const padding = isMobile ? 35 : 55;
      const availableW = rect.width - padding * 2;
      const availableH = rect.height - padding * 2;
      const scaleX = availableW / (site.length || 1);
      const scaleY = availableH / (site.width || 1);
      const baseScale = Math.min(scaleX, scaleY);

      let found: GridPoint | null = null;
      let minDistance = 24; // Touch hit radius in pixels

      for (const p of points) {
        const cx = (padding + p.x * baseScale) * zoom + pan.x;
        const cy = (padding + (site.width - p.y) * baseScale) * zoom + pan.y;

        const dist = Math.hypot(mouseX - cx, mouseY - cy);
        if (dist < minDistance) {
          minDistance = dist;
          found = p;
        }
      }
      return found;
    },
    [points, site, zoom, pan]
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }
    const found = findNearestPoint(e.clientX, e.clientY);
    setHoveredPoint(found);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    const found = findNearestPoint(e.clientX, e.clientY);
    if (found) {
      onSelectPoint(found);
    }
  };

  // Touch Event Handlers for Mobile (Pinch zoom, drag pan, tap to select)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchMovedRef.current = false;
    if (e.touches.length === 1) {
      // Single finger drag start
      const t1 = e.touches[0];
      touchStartPosRef.current = { x: t1.clientX, y: t1.clientY };
      setDragStart({ x: t1.clientX - pan.x, y: t1.clientY - pan.y });
      setIsDragging(true);

      // Check point tap
      const found = findNearestPoint(t1.clientX, t1.clientY);
      setHoveredPoint(found);
    } else if (e.touches.length === 2) {
      // Two finger pinch start
      setIsDragging(false);
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchStartDistRef.current = dist;
      touchStartZoomRef.current = zoom;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const t1 = e.touches[0];
      if (touchStartPosRef.current) {
        const moveDist = Math.hypot(t1.clientX - touchStartPosRef.current.x, t1.clientY - touchStartPosRef.current.y);
        if (moveDist > 6) {
          touchMovedRef.current = true;
        }
      }
      setPan({
        x: t1.clientX - dragStart.x,
        y: t1.clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      touchMovedRef.current = true;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const scaleRatio = currentDist / touchStartDistRef.current;

      const newZoom = Math.max(0.3, Math.min(4.5, touchStartZoomRef.current * scaleRatio));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchMovedRef.current && e.changedTouches.length > 0) {
      // Tap gesture detected!
      const t1 = e.changedTouches[0];
      const found = findNearestPoint(t1.clientX, t1.clientY);
      if (found) {
        onSelectPoint(found);
      }
    }

    if (e.touches.length === 0) {
      setIsDragging(false);
      touchStartDistRef.current = null;
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full rounded-2xl border border-slate-800 bg-slate-950/95 overflow-hidden shadow-2xl">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-3 py-2 gap-2 z-10">
        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <button
            onClick={() => setShowGridLines(!showGridLines)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              showGridLines ? 'bg-[#105b48] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.showGridLines}
          </button>
          <button
            onClick={() => setShowStationLabels(!showStationLabels)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              showStationLabels ? 'bg-[#105b48] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.showStationLabels}
          </button>
          <button
            onClick={() => setShowHeatMap(!showHeatMap)}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              showHeatMap ? 'bg-[#105b48] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.heatMap}
          </button>
          <button
            onClick={() => setShowCoordinates(!showCoordinates)}
            className={`hidden sm:inline-block rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              showCoordinates ? 'bg-[#105b48] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.showCoordinates}
          </button>


        </div>

        {/* Zoom & Fit Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
            className="rounded-lg bg-slate-800 p-2 sm:p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
            title={t.zoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.3, z - 0.25))}
            className="rounded-lg bg-slate-800 p-2 sm:p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
            title={t.zoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleResetView}
            className="rounded-lg bg-slate-800 p-2 sm:p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
            title={t.resetView}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Touch Canvas Area */}
      <div
        ref={containerRef}
        className="relative flex-1 cursor-grab active:cursor-grabbing overflow-hidden touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas ref={canvasRef} className="h-full w-full block" />

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2.5 rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-[11px] backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm" />
            <span className="text-slate-300 font-medium">{t.cutColor}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-slate-300 font-medium">{t.fillColor}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500 shadow-sm" />
            <span className="text-slate-300 font-medium">{t.zeroColor}</span>
          </div>
        </div>

        {/* Touch Helper Hint on Mobile */}
        <div className="absolute bottom-3 right-3 z-10 hidden xs:flex items-center gap-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 px-2.5 py-1 text-[10px] text-slate-400 backdrop-blur-sm">
          <Smartphone className="h-3 w-3 text-emerald-400" />
          <span>Tap point for details • Pinch zoom</span>
        </div>

        {/* Floating Desktop Station Hover Inspector */}
        {hoveredPoint && (
          <div className="absolute top-3 right-3 z-20 pointer-events-none rounded-xl border border-emerald-500/40 bg-slate-900/95 p-2.5 text-xs shadow-2xl backdrop-blur-md min-w-[190px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1.5">
              <span className="font-mono font-bold text-emerald-400 text-xs">{hoveredPoint.station}</span>
              <span className="text-[10px] text-slate-400">({hoveredPoint.x}m, {hoveredPoint.y}m)</span>
            </div>
            <div className="space-y-0.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Existing RL:</span>
                <span className="font-bold">{hoveredPoint.existingRL.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Design RL:</span>
                <span className="font-bold">{hoveredPoint.designRL.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Diff:</span>
                <span className={`font-bold ${hoveredPoint.difference > 0 ? 'text-red-400' : hoveredPoint.difference < 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {hoveredPoint.difference > 0 ? `+${hoveredPoint.difference.toFixed(3)}` : hoveredPoint.difference.toFixed(3)} m
                </span>
              </div>
            </div>
            <p className="mt-1.5 text-[9px] text-emerald-400/80 font-sans italic text-center">
              Tap station to inspect/edit
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
