"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

export interface PhysicsCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
  getCtx: () => CanvasRenderingContext2D | null;
  clear: () => void;
}

interface PhysicsCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  onReady?: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void;
}

export const PhysicsCanvas = forwardRef<PhysicsCanvasHandle, PhysicsCanvasProps>(
  ({ width = 600, height = 400, className = "", onReady }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getCtx: () => canvasRef.current?.getContext("2d") ?? null,
      clear: () => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      onReady?.(canvas, ctx);
    }, []);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`rounded-xl border border-border bg-background ${className}`}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    );
  }
);
PhysicsCanvas.displayName = "PhysicsCanvas";
