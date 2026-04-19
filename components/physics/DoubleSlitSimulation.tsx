"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";

interface DoubleSlitSimulationProps {
  locale: string;
}

const CANVAS_W = 700;
const CANVAS_H = 420;

export function DoubleSlitSimulation({ locale }: DoubleSlitSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wavelength, setWavelength] = useState(550); // nm
  const [slitSep, setSlitSep] = useState(4); // mm
  const [slitWidth, setSlitWidth] = useState(1); // mm
  const [screenDist, setScreenDist] = useState(2); // m

  const L = locale;

  // Wavelength → RGB color
  const waveToRGB = (wl: number): string => {
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; g = 0; b = 1; }
    else if (wl < 490) { r = 0; g = (wl - 440) / 50; b = 1; }
    else if (wl < 510) { r = 0; g = 1; b = -(wl - 510) / 20; }
    else if (wl < 580) { r = (wl - 510) / 70; g = 1; b = 0; }
    else if (wl < 645) { r = 1; g = -(wl - 645) / 65; b = 0; }
    else if (wl <= 780) { r = 1; g = 0; b = 0; }
    const ir = Math.round(r * 255);
    const ig = Math.round(g * 255);
    const ib = Math.round(b * 255);
    return `rgb(${ir},${ig},${ib})`;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains("dark");
    ctx.fillStyle = isDark ? "#0a0a0a" : "#0a0a14";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const λ = wavelength * 1e-9; // m
    const d = slitSep * 1e-3;    // m
    const a = slitWidth * 1e-3;  // m
    const L_dist = screenDist;   // m

    const centerX = CANVAS_W / 2;
    const patternY = 60;
    const patternH = 300;

    // Screen range: ±30 mm
    const yMax = 0.03; // m

    // Draw intensity pattern
    for (let px = 0; px < CANVAS_W; px++) {
      const y = ((px - centerX) / (CANVAS_W / 2)) * yMax;
      const theta = Math.atan2(y, L_dist);

      // Double-slit intensity: I = I0 * sinc²(β) * cos²(δ)
      const beta = (Math.PI * a * Math.sin(theta)) / λ;
      const delta = (Math.PI * d * Math.sin(theta)) / λ;

      let sinc = 1;
      if (Math.abs(beta) > 1e-10) {
        sinc = Math.sin(beta) / beta;
      }

      const I = sinc * sinc * Math.cos(delta) * Math.cos(delta);

      const col = waveToRGB(wavelength);
      // Parse color
      const m = col.match(/\d+/g)!;
      const br = parseInt(m[0]);
      const bg = parseInt(m[1]);
      const bb = parseInt(m[2]);

      for (let py = patternY; py < patternY + patternH; py++) {
        const alpha = I;
        ctx.fillStyle = `rgba(${br},${bg},${bb},${alpha})`;
        ctx.fillRect(px, py, 1, 1);
      }
    }

    // Border of pattern area
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, patternY, CANVAS_W, patternH);

    // Intensity curve overlay
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1.5;
    for (let px = 0; px < CANVAS_W; px++) {
      const y = ((px - centerX) / (CANVAS_W / 2)) * yMax;
      const theta = Math.atan2(y, L_dist);
      const beta = (Math.PI * a * Math.sin(theta)) / λ;
      const delta = (Math.PI * d * Math.sin(theta)) / λ;
      let sinc = 1;
      if (Math.abs(beta) > 1e-10) sinc = Math.sin(beta) / beta;
      const I = sinc * sinc * Math.cos(delta) * Math.cos(delta);
      const py = patternY + patternH - I * patternH;
      px === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Labels
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";

    const scaleLabel = (L === "ru") ? "Положение на экране (мм)" : "Screen position (mm)";
    ctx.fillText(scaleLabel, CANVAS_W / 2, patternY + patternH + 20);

    // Fringe spacing
    const fringe = (λ * L_dist / d) * 1000; // mm
    const info = `Δy = λL/d = ${fringe.toFixed(2)} mm   λ = ${wavelength} nm   d = ${slitSep} mm   L = ${L_dist} m`;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "11px system-ui";
    ctx.fillText(info, CANVAS_W / 2, CANVAS_H - 12);

    // Axis ticks
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "10px system-ui";
    for (let mm = -25; mm <= 25; mm += 5) {
      const px = centerX + (mm / 1000 / yMax) * (CANVAS_W / 2);
      ctx.fillText(`${mm}`, px, patternY + patternH + 15);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.moveTo(px, patternY);
      ctx.lineTo(px, patternY + patternH);
      ctx.stroke();
    }
  }, [wavelength, slitSep, slitWidth, screenDist, L]);

  useEffect(() => {
    draw();
  }, [draw]);

  const waveColor = waveToRGB(wavelength);

  return (
    <div className="space-y-6">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full rounded-2xl border border-border shadow-sm"
        style={{ height: "auto" }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-xl border">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">
              {L === "ru" ? "Длина волны" : "Wavelength"}
            </label>
            <span className="font-mono" style={{ color: waveColor }}>
              {wavelength} nm
            </span>
          </div>
          <Slider min={380} max={780} step={5} value={[wavelength]} onValueChange={([v]) => setWavelength(v)} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">
              {L === "ru" ? "Расстояние между щелями" : "Slit separation"}
            </label>
            <span className="text-muted-foreground font-mono">{slitSep} mm</span>
          </div>
          <Slider min={0.5} max={10} step={0.5} value={[slitSep]} onValueChange={([v]) => setSlitSep(v)} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">
              {L === "ru" ? "Ширина щели" : "Slit width"}
            </label>
            <span className="text-muted-foreground font-mono">{slitWidth} mm</span>
          </div>
          <Slider min={0.1} max={5} step={0.1} value={[slitWidth]} onValueChange={([v]) => setSlitWidth(v)} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">
              {L === "ru" ? "Расстояние до экрана" : "Screen distance"}
            </label>
            <span className="text-muted-foreground font-mono">{screenDist} m</span>
          </div>
          <Slider min={0.5} max={5} step={0.5} value={[screenDist]} onValueChange={([v]) => setScreenDist(v)} />
        </div>
      </div>
    </div>
  );
}
