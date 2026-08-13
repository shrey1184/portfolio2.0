"use client";

import { useEffect, useRef } from "react";

// --- Tunable config -----------------------------------------------------
const CHARS =
  "01234567890/\\.:*+=-_[]{}<>()|~^%$#@!?ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const FONT_SIZE = 10; // px
const CELL_W = 6; // horizontal cell pitch — smaller = denser
const CELL_H = 11; // vertical cell pitch — smaller = denser
const SCRAMBLE_FPS = 10; // ticks per second
const FLIP_PROBABILITY = 0.02; // chance a cell re-randomizes per tick
const WORD_INJECT_PROBABILITY = 0.0012; // chance per tick (scaled by cols) to stamp a word
const WORDS = [
  "AGENT",
  "SCHEMA",
  "DRAFT",
  "CACHE",
  "WEBHOOK",
  "PUBLISH",
  "SEO",
  "NATIVE",
  "SYSTEM",
  "FIELD",
  "STUDIO",
  "CLONE",
  "RUNTIME",
  "TOKEN",
  "BUILD",
  "DEPLOY",
];

// Brightness tuning — raised floor so the whole grid reads as dense texture
const HOT_CELL_CHANCE = 0.15;
const HOT_MIN = 0.28;
const HOT_RANGE = 0.2;
const BASE_MIN = 0.1;
const BASE_RANGE = 0.1;
const DECAY_FLOOR = 0.1;
const DECAY_FLOOR_RANGE = 0.08;

interface AsciiBackgroundProps {
  /** CSS color used for the characters, e.g. "255,255,255" as an RGB triplet */
  color?: string;
  /** Overall opacity multiplier (0-1) applied on top of each cell's own brightness */
  maxOpacity?: number;
  /** How dense the grid is; smaller values = more characters on screen */
  cellWidth?: number;
  cellHeight?: number;
  fontSize?: number;
  /** Extra className passed to the wrapping div, e.g. for positioning */
  className?: string;
}

export default function AsciiBackground({
  color = "255,255,255",
  maxOpacity = 0.65,
  cellWidth = CELL_W,
  cellHeight = CELL_H,
  fontSize = FONT_SIZE,
  className = "",
}: AsciiBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let grid: string[] = [];
    let brightness: Float32Array = new Float32Array(0);
    let lastTick = 0;

    const randChar = () => CHARS[(Math.random() * CHARS.length) | 0];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / cellWidth) + 1;
      rows = Math.ceil(height / cellHeight) + 1;

      grid = new Array(cols * rows);
      brightness = new Float32Array(cols * rows);
      for (let i = 0; i < grid.length; i++) {
        grid[i] = randChar();
        brightness[i] =
          Math.random() < HOT_CELL_CHANCE
            ? HOT_MIN + Math.random() * HOT_RANGE
            : BASE_MIN + Math.random() * BASE_RANGE;
      }
    };

    const injectWord = () => {
      const word = WORDS[(Math.random() * WORDS.length) | 0];
      const row = (Math.random() * rows) | 0;
      const startCol = (Math.random() * Math.max(1, cols - word.length)) | 0;
      for (let i = 0; i < word.length; i++) {
        const idx = row * cols + (startCol + i);
        if (idx >= 0 && idx < grid.length) {
          grid[idx] = word[i];
          brightness[idx] = HOT_MIN + Math.random() * HOT_RANGE;
        }
      }
    };

    const tick = () => {
      for (let i = 0; i < grid.length; i++) {
        if (Math.random() < FLIP_PROBABILITY) {
          grid[i] = randChar();
          if (Math.random() < 0.15) {
            brightness[i] = HOT_MIN + Math.random() * HOT_RANGE;
          }
        }
        brightness[i] *= 0.985;
        if (brightness[i] < DECAY_FLOOR) {
          brightness[i] = DECAY_FLOOR + Math.random() * DECAY_FLOOR_RANGE;
        }
      }
      if (Math.random() < WORD_INJECT_PROBABILITY * cols) {
        injectWord();
      }
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace`;
      ctx.textBaseline = "top";
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const b = brightness[idx] * maxOpacity;
          ctx.fillStyle = `rgba(${color},${b.toFixed(3)})`;
          ctx.fillText(grid[idx], c * cellWidth, r * cellHeight);
        }
      }
    };

    const loop = (ts: number) => {
      if (ts - lastTick > 1000 / SCRAMBLE_FPS) {
        tick();
        draw();
        lastTick = ts;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    resize();
    rafRef.current = requestAnimationFrame(loop);

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [color, maxOpacity, cellWidth, cellHeight, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}