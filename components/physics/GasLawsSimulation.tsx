"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";

interface GasLawsSimulationProps {
  locale: string;
}

const CANVAS_W = 700;
const CANVAS_H = 400;
const PADDING = { top: 40, right: 40, bottom: 60, left: 70 };
const N = 1; // moles
const R = 8.314;

export function GasLawsSimulation({ locale }: GasLawsSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [T, setT] = useState(300); // Kelvin
  const [V, setV] = useState(10); // liters

  const L = locale;
  const labels = {
    T: L === "ru" ? "Температура" : "Temperature",
    V: L === "ru" ? "Объём" : "Volume",
    P: L === "ru" ? "Давление" : "Pressure",
  };

  const P = (N * R * T) / (V / 1000); // Pa (V in m³ = V_liters/1000)
  const P_atm = P / 101325;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const { top, right, bottom, left } = PADDING;
    const w = CANVAS_W - left - right;
    const h = CANVAS_H - top - bottom;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    const isDark = document.documentElement.classList.contains("dark");
    ctx.fillStyle = isDark ? "#111" : "#fafafa";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Axis ranges
    const V_MIN = 1, V_MAX = 50; // liters
    const P_MAX_PA = (N * R * 600) / (V_MIN / 1000);
    const P_MAX_atm = P_MAX_PA / 101325;

    const toX = (v: number) =>
      left + ((v - V_MIN) / (V_MAX - V_MIN)) * w;
    const toY = (p_atm: number) =>
      top + h - (p_atm / P_MAX_atm) * h;

    // Grid
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    for (let v = V_MIN; v <= V_MAX; v += 10) {
      ctx.beginPath();
      ctx.moveTo(toX(v), top);
      ctx.lineTo(toX(v), top + h);
      ctx.stroke();
    }
    for (let p = 0; p <= P_MAX_atm; p += 5) {
      ctx.beginPath();
      ctx.moveTo(left, toY(p));
      ctx.lineTo(left + w, toY(p));
      ctx.stroke();
    }

    // Draw isotherms for T-50, T, T+100
    const temps = [
      { t: Math.max(50, T - 150), color: "rgba(100,150,255,0.3)", label: `${Math.max(50, T - 150)}K` },
      { t: T, color: "#0071e3", label: `${T}K` },
      { t: T + 150, color: "rgba(255,100,100,0.3)", label: `${T + 150}K` },
    ];

    for (const { t, color, label } of temps) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = t === T ? 2.5 : 1.5;
      let first = true;
      for (let vi = V_MIN; vi <= V_MAX; vi += 0.2) {
        const pi = (N * R * t) / (vi / 1000) / 101325;
        if (pi > P_MAX_atm) continue;
        const cx = toX(vi);
        const cy = toY(pi);
        if (first) {
          ctx.moveTo(cx, cy);
          first = false;
        } else {
          ctx.lineTo(cx, cy);
        }
      }
      ctx.stroke();

      // Label isotherms
      const labelV = V_MIN + (V_MAX - V_MIN) * 0.85;
      const labelP = (N * R * t) / (labelV / 1000) / 101325;
      if (labelP < P_MAX_atm && labelP > 0) {
        ctx.fillStyle = color === "#0071e3" ? "#0071e3" : isDark ? "#888" : "#aaa";
        ctx.font = "11px system-ui";
        ctx.fillText(label, toX(labelV) + 4, toY(labelP));
      }
    }

    // Current point
    const cx = toX(V);
    const cy = toY(P_atm);
    if (P_atm <= P_MAX_atm) {
      // Crosshairs
      ctx.strokeStyle = "rgba(255,59,48,0.4)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, top);
      ctx.lineTo(cx, top + h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(left, cy);
      ctx.lineTo(left + w, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#ff3b30";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, top + h);
    ctx.lineTo(left + w, top + h);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = isDark ? "#aaa" : "#555";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`${labels.V} (л)`, left + w / 2, CANVAS_H - 10);

    ctx.save();
    ctx.translate(16, top + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${labels.P} (атм)`, 0, 0);
    ctx.restore();

    // Tick labels
    ctx.textAlign = "center";
    ctx.font = "11px system-ui";
    for (let v = V_MIN; v <= V_MAX; v += 10) {
      ctx.fillText(`${v}`, toX(v), top + h + 18);
    }
    ctx.textAlign = "right";
    for (let p = 0; p <= Math.ceil(P_MAX_atm); p += 5) {
      ctx.fillText(`${p}`, left - 8, toY(p) + 4);
    }

    // Title
    ctx.textAlign = "center";
    ctx.font = "bold 13px system-ui";
    ctx.fillStyle = isDark ? "#ddd" : "#333";
    ctx.fillText(`PV = nRT  (T = ${T}K, P = ${P_atm.toFixed(2)} atm, V = ${V}L)`, CANVAS_W / 2, 20);
  }, [T, V, P_atm, labels]);

  useEffect(() => {
    draw();
  }, [draw]);

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
            <label className="font-medium">{labels.T}</label>
            <span className="text-muted-foreground font-mono">{T} K ({(T - 273).toFixed(0)}°C)</span>
          </div>
          <Slider
            min={50}
            max={1000}
            step={10}
            value={[T]}
            onValueChange={([val]) => setT(val)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="font-medium">{labels.V}</label>
            <span className="text-muted-foreground font-mono">{V} L</span>
          </div>
          <Slider
            min={1}
            max={50}
            step={0.5}
            value={[V]}
            onValueChange={([val]) => setV(val)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: labels.P, value: `${P_atm.toFixed(3)} atm`, sub: `${(P / 1000).toFixed(1)} kPa` },
          { label: labels.V, value: `${V} L`, sub: `${(V / 1000).toFixed(4)} m³` },
          { label: labels.T, value: `${T} K`, sub: `${(T - 273).toFixed(0)} °C` },
        ].map((s) => (
          <div key={s.label} className="text-center p-3 rounded-xl bg-muted/50 border">
            <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
            <div className="font-bold text-lg">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
