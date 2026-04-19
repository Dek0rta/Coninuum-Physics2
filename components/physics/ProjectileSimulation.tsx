"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw } from "lucide-react";

interface ProjectileSimulationProps {
  locale: string;
}

const DEG = Math.PI / 180;
const CANVAS_W = 700;
const CANVAS_H = 400;
const SCALE = 4; // pixels per meter
const GROUND_Y = CANVAS_H - 40;

export function ProjectileSimulation({ locale }: ProjectileSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef(0);
  const trailRef = useRef<{ x: number; y: number }[]>([]);

  const [v0, setV0] = useState(30);
  const [angle, setAngle] = useState(45);
  const [g, setG] = useState(9.8);
  const [running, setRunning] = useState(false);

  const L = locale;
  const labels = {
    v0: L === "ru" ? "Начальная скорость" : "Initial velocity",
    angle: L === "ru" ? "Угол броска" : "Launch angle",
    g: L === "ru" ? "Ускорение g" : "Gravity g",
    start: L === "ru" ? "Запустить" : "Launch",
    stop: L === "ru" ? "Стоп" : "Stop",
    reset: L === "ru" ? "Сброс" : "Reset",
    range: L === "ru" ? "Дальность" : "Range",
    height: L === "ru" ? "Высота" : "Height",
    time: L === "ru" ? "Время" : "Time",
  };

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    // Sky
    const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    grad.addColorStop(0, "#e8f4fd");
    grad.addColorStop(1, "#c9e8f5");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, GROUND_Y);

    // Ground
    ctx.fillStyle = "#5d8a3c";
    ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

    // Grid lines
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_W; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GROUND_Y);
      ctx.stroke();
    }
    for (let y = 0; y < GROUND_Y; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.font = "11px system-ui";
    for (let x = 0; x <= CANVAS_W; x += 100) {
      ctx.fillText(`${Math.round(x / SCALE)}m`, x + 2, GROUND_Y + 15);
    }
  }, []);

  const projectileY = useCallback(
    (t: number) =>
      v0 * Math.sin(angle * DEG) * t - 0.5 * g * t * t,
    [v0, angle, g]
  );
  const projectileX = useCallback(
    (t: number) => v0 * Math.cos(angle * DEG) * t,
    [v0, angle]
  );

  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, t: number) => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawBackground(ctx);

      const trail = trailRef.current;

      // Draw trail
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0,113,227,0.5)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.moveTo(trail[0].x, trail[0].y);
        for (const pt of trail) ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Current position
      const px = projectileX(t) * SCALE;
      const py = GROUND_Y - projectileY(t) * SCALE;

      if (px >= 0 && px <= CANVAS_W && py <= GROUND_Y) {
        trail.push({ x: px, y: py });

        // Ball
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        const ballGrad = ctx.createRadialGradient(px - 3, py - 3, 1, px, py, 8);
        ballGrad.addColorStop(0, "#34aadc");
        ballGrad.addColorStop(1, "#0071e3");
        ctx.fillStyle = ballGrad;
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Velocity vector
        const vx = v0 * Math.cos(angle * DEG);
        const vy = v0 * Math.sin(angle * DEG) - g * t;
        const scale = 3;
        ctx.beginPath();
        ctx.strokeStyle = "#ff3b30";
        ctx.lineWidth = 2;
        ctx.moveTo(px, py);
        ctx.lineTo(px + vx * scale, py - vy * scale);
        ctx.stroke();
        // Arrowhead
        const vLen = Math.sqrt(vx * vx + vy * vy);
        if (vLen > 0) {
          const nx = vx / vLen;
          const ny = -vy / vLen;
          const ax = px + vx * scale;
          const ay = py - vy * scale;
          ctx.beginPath();
          ctx.fillStyle = "#ff3b30";
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax - nx * 8 + ny * 4, ay - ny * 8 - nx * 4);
          ctx.lineTo(ax - nx * 8 - ny * 4, ay - ny * 8 + nx * 4);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Stats
      const range = (v0 * v0 * Math.sin(2 * angle * DEG)) / g;
      const maxH = (v0 * v0 * Math.sin(angle * DEG) ** 2) / (2 * g);
      const totalT = (2 * v0 * Math.sin(angle * DEG)) / g;

      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.font = "bold 13px system-ui";
      ctx.fillText(`${labels.range}: ${range.toFixed(1)} m`, 12, 24);
      ctx.fillText(`${labels.height}: ${maxH.toFixed(1)} m`, 12, 42);
      ctx.fillText(`${labels.time}: ${t.toFixed(2)} / ${totalT.toFixed(2)} s`, 12, 60);
    },
    [drawBackground, projectileX, projectileY, v0, angle, g, labels]
  );

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    tRef.current = 0;
    trailRef.current = [];
    setRunning(true);

    const totalT = (2 * v0 * Math.sin(angle * DEG)) / g;
    let lastTime: number | null = null;

    const animate = (timestamp: number) => {
      if (lastTime === null) lastTime = timestamp;
      const dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;
      tRef.current += dt;

      drawFrame(ctx, tRef.current);

      if (tRef.current < totalT) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        drawFrame(ctx, totalT);
        setRunning(false);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [v0, angle, g, drawFrame]);

  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    setRunning(false);
  }, []);

  const resetAnimation = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    tRef.current = 0;
    trailRef.current = [];
    setRunning(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) drawFrame(ctx, 0);
  }, [drawFrame]);

  // Initial draw
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) drawFrame(ctx, 0);
    return () => cancelAnimationFrame(animRef.current);
  }, [drawFrame]);

  return (
    <div className="space-y-6">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full rounded-2xl border border-border shadow-sm"
        style={{ height: "auto" }}
      />

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted/30 rounded-xl border">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">{labels.v0}</label>
            <span className="text-muted-foreground font-mono">{v0} m/s</span>
          </div>
          <Slider
            min={5}
            max={80}
            step={1}
            value={[v0]}
            onValueChange={([val]) => { setV0(val); resetAnimation(); }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">{labels.angle}</label>
            <span className="text-muted-foreground font-mono">{angle}°</span>
          </div>
          <Slider
            min={1}
            max={89}
            step={1}
            value={[angle]}
            onValueChange={([val]) => { setAngle(val); resetAnimation(); }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">{labels.g}</label>
            <span className="text-muted-foreground font-mono">{g} m/s²</span>
          </div>
          <Slider
            min={1}
            max={25}
            step={0.1}
            value={[g]}
            onValueChange={([val]) => { setG(val); resetAnimation(); }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {running ? (
          <Button onClick={stopAnimation} variant="secondary">
            <Square className="h-4 w-4 mr-2" />
            {labels.stop}
          </Button>
        ) : (
          <Button onClick={startAnimation}>
            <Play className="h-4 w-4 mr-2" />
            {labels.start}
          </Button>
        )}
        <Button onClick={resetAnimation} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          {labels.reset}
        </Button>
      </div>
    </div>
  );
}
