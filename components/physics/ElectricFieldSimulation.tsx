"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";

interface Charge {
  x: number;
  y: number;
  q: number; // +1 or -1
  id: number;
}

interface ElectricFieldSimulationProps {
  locale: string;
}

const CANVAS_W = 700;
const CANVAS_H = 450;
const K = 1; // normalized Coulomb constant
const NUM_LINES = 16; // field lines per charge
const LINE_STEPS = 200;
const DT = 2;

export function ElectricFieldSimulation({ locale }: ElectricFieldSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [charges, setCharges] = useState<Charge[]>([
    { x: 220, y: 225, q: 1, id: 1 },
    { x: 480, y: 225, q: -1, id: 2 },
  ]);
  const [nextId, setNextId] = useState(3);
  const [dragging, setDragging] = useState<number | null>(null);
  const [mode, setMode] = useState<"positive" | "negative" | "none">("none");

  const L = locale;
  const labels = {
    addPos: L === "ru" ? "+ Добавить +" : "+ Add +",
    addNeg: L === "ru" ? "− Добавить −" : "− Add −",
    reset: L === "ru" ? "Сброс" : "Reset",
    hint: L === "ru" ? "Кликните на холст для добавления заряда. Перетащите заряд." : "Click canvas to add charge. Drag charges.",
  };

  const fieldAt = useCallback(
    (x: number, y: number, excludeId?: number) => {
      let ex = 0;
      let ey = 0;
      for (const c of charges) {
        if (c.id === excludeId) continue;
        const dx = x - c.x;
        const dy = y - c.y;
        const r2 = dx * dx + dy * dy;
        if (r2 < 1) continue;
        const r = Math.sqrt(r2);
        const f = (K * c.q) / r2;
        ex += f * (dx / r);
        ey += f * (dy / r);
      }
      return { ex, ey };
    },
    [charges]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = "#fafafa";
    if (document.documentElement.classList.contains("dark")) {
      ctx.fillStyle = "#111";
    }
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw field lines from each positive charge
    for (const startCharge of charges) {
      if (startCharge.q <= 0) continue;
      for (let i = 0; i < NUM_LINES; i++) {
        const angleStart = (i / NUM_LINES) * 2 * Math.PI;
        let x = startCharge.x + 15 * Math.cos(angleStart);
        let y = startCharge.y + 15 * Math.sin(angleStart);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = "rgba(0,113,227,0.6)";
        ctx.lineWidth = 1.2;

        for (let step = 0; step < LINE_STEPS; step++) {
          const { ex, ey } = fieldAt(x, y);
          const len = Math.sqrt(ex * ex + ey * ey);
          if (len === 0) break;
          const nx = (ex / len) * DT;
          const ny = (ey / len) * DT;
          x += nx;
          y += ny;

          if (x < 0 || x > CANVAS_W || y < 0 || y > CANVAS_H) break;

          // Check if near negative charge
          let nearNeg = false;
          for (const c of charges) {
            if (c.q < 0) {
              const dx = x - c.x;
              const dy = y - c.y;
              if (dx * dx + dy * dy < 15 * 15) {
                nearNeg = true;
                break;
              }
            }
          }
          if (nearNeg) break;

          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    // Draw charges
    for (const c of charges) {
      const isPos = c.q > 0;
      const color = isPos ? "#0071e3" : "#ff3b30";

      // Glow
      const glow = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 28);
      glow.addColorStop(0, isPos ? "rgba(0,113,227,0.25)" : "rgba(255,59,48,0.25)");
      glow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(c.x, c.y, 28, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Circle
      ctx.beginPath();
      ctx.arc(c.x, c.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Sign
      ctx.fillStyle = "white";
      ctx.font = "bold 18px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(isPos ? "+" : "−", c.x, c.y);
    }

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }, [charges, fieldAt]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse events
  const getPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getPos(e);

    // Check if clicking existing charge
    for (const c of charges) {
      const dx = x - c.x;
      const dy = y - c.y;
      if (dx * dx + dy * dy < 20 * 20) {
        setDragging(c.id);
        return;
      }
    }

    // Add new charge
    if (mode !== "none") {
      const newCharge: Charge = {
        x,
        y,
        q: mode === "positive" ? 1 : -1,
        id: nextId,
      };
      setCharges((prev) => [...prev, newCharge]);
      setNextId((n) => n + 1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging === null) return;
    const { x, y } = getPos(e);
    setCharges((prev) =>
      prev.map((c) => (c.id === dragging ? { ...c, x, y } : c))
    );
  };

  const handleMouseUp = () => setDragging(null);

  const handleDblClick = (e: React.MouseEvent) => {
    const { x, y } = getPos(e);
    setCharges((prev) =>
      prev.filter((c) => {
        const dx = x - c.x;
        const dy = y - c.y;
        return dx * dx + dy * dy >= 20 * 20;
      })
    );
  };

  const reset = () => {
    setCharges([
      { x: 220, y: 225, q: 1, id: nextId },
      { x: 480, y: 225, q: -1, id: nextId + 1 },
    ]);
    setNextId((n) => n + 2);
  };

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="w-full rounded-2xl border border-border shadow-sm cursor-crosshair"
        style={{ height: "auto" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDblClick}
      />

      <p className="text-xs text-muted-foreground text-center">{labels.hint} • {locale === "ru" ? "Двойной клик" : "Double-click"} = {locale === "ru" ? "удалить" : "remove"}</p>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setMode(mode === "positive" ? "none" : "positive")}
          variant={mode === "positive" ? "default" : "outline"}
          className="text-blue-600 border-blue-300"
        >
          <Plus className="h-4 w-4 mr-1" />
          {labels.addPos}
        </Button>
        <Button
          onClick={() => setMode(mode === "negative" ? "none" : "negative")}
          variant={mode === "negative" ? "default" : "outline"}
          className="text-red-600 border-red-300"
        >
          <Minus className="h-4 w-4 mr-1" />
          {labels.addNeg}
        </Button>
        <Button onClick={reset} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          {labels.reset}
        </Button>
      </div>
    </div>
  );
}
