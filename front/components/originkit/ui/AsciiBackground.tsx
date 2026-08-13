"use client";

import { useEffect, useRef } from "react";

// --- Tunable config -----------------------------------------------------
const CHARS =
  "01234567890/\\.:*+=-_[]{}<>()|~^%$#@!?ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const FONT_SIZE = 10; // px
const CELL_W = 6; // horizontal cell pitch — smaller = denser
const CELL_H = 11; // vertical cell pitch — smaller = denser
const SCRAMBLE_FPS = 8; // ticks per second (was 10)
const FLIP_PROBABILITY = 0.02; // chance a cell re-randomizes, per full grid pass
const WORD_INJECT_PROBABILITY = 0.0012; // chance per tick (scaled by cols) to stamp a word

// The grid is split into SHARDS buckets by index. Each tick only visits
// one bucket (grid.length / SHARDS cells) instead of the whole grid, so a
// full pass over every cell happens once every SHARDS ticks rather than
// every tick. Flip odds and decay are scaled up per-visit so the on-screen
// flicker speed looks the same as before — this is the main fix for the
// jank, since it directly divides the number of drawImage calls per
// second by SHARDS.
const SHARDS = 4;

// Device pixel ratio is capped low on purpose: this is a decorative
// flicker texture, not something that needs retina-sharp glyph edges, and
// every extra DPR step multiplies the backing canvas' pixel count (and
// therefore composite cost) by up to 4x.
const MAX_DPR = 1;

// Minimum brightness delta worth actually repainting a cell for. Skips a
// repaint on ticks where the decay step is imperceptibly small.
const ALPHA_QUANT = 0.012;

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
const DECAY_RATE = 0.985;

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

// Builds one small offscreen canvas per character, pre-rendered once in
// the target color at full strength. The main loop then just
// `drawImage`s these bitmaps and varies `globalAlpha`, instead of
// calling `fillText` (which re-shapes/rasterizes the glyph) on every
// one of the ~tens of thousands of cells, on every tick.
function buildGlyphAtlas(color: string, fontSize: number) {
  const pad = 2;
  const size = Math.ceil(fontSize * 1.4) + pad * 2;
  return CHARS.map((ch) => {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const g = c.getContext("2d")!;
    g.font = `${fontSize}px "SFMono-Regular", ui-monospace, Menlo, Consolas, monospace`;
    g.textBaseline = "top";
    g.fillStyle = `rgb(${color})`;
    g.fillText(ch, pad, pad);
    return c;
  });
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
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cols = 0;
    let rows = 0;
    // Grid stores glyph *indices* into `glyphs`/CHARS, not strings —
    // cheaper to allocate and lets draw() go straight to drawImage.
    let grid: Int16Array = new Int16Array(0);
    let brightness: Float32Array = new Float32Array(0);
    // Last brightness value actually painted for each cell — used to skip
    // repainting cells whose visible alpha hasn't meaningfully changed.
    let paintedAlpha: Float32Array = new Float32Array(0);
    let lastTick = 0;
    let lastWidth = 0;
    let lastHeight = 0;
    let shard = 0;

    const glyphs = buildGlyphAtlas(color, fontSize);
    const glyphPad = 2;

    const randCharIdx = () => (Math.random() * CHARS.length) | 0;

    // Repaints exactly one cell: clear its small rect, draw its glyph at
    // its current brightness. This is the unit of work everything below
    // tries to minimize the count of, since each call is a real canvas op.
    const paintCell = (idx: number, r: number, c: number) => {
      const x = c * cellWidth - glyphPad;
      const y = r * cellHeight - glyphPad;
      const w = cellWidth + glyphPad * 2;
      const h = cellHeight + glyphPad * 2;
      ctx.clearRect(x, y, w, h);
      ctx.globalAlpha = brightness[idx] * maxOpacity;
      ctx.drawImage(glyphs[grid[idx]], x, y);
      paintedAlpha[idx] = brightness[idx];
    };

    // Rebuilds the grid to match the canvas's *actual current* box.
    // Driven by ResizeObserver below (not just window resize), so this
    // stays correct even when the section's height changes for reasons
    // that don't fire a window resize — e.g. real achievement data
    // replacing a placeholder, fonts finishing loading, etc.
    const resize = (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / cellWidth) + 1;
      rows = Math.ceil(height / cellHeight) + 1;

      grid = new Int16Array(cols * rows);
      brightness = new Float32Array(cols * rows);
      paintedAlpha = new Float32Array(cols * rows);
      for (let i = 0; i < grid.length; i++) {
        grid[i] = randCharIdx();
        brightness[i] =
          Math.random() < HOT_CELL_CHANCE
            ? HOT_MIN + Math.random() * HOT_RANGE
            : BASE_MIN + Math.random() * BASE_RANGE;
      }

      // One full paint pass happens here, on resize — this is the only
      // place the whole grid gets drawn in a single go. After this,
      // per-tick work only repaints cells that actually changed.
      ctx.clearRect(0, 0, width, height);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          paintCell(idx, r, c);
        }
      }
      ctx.globalAlpha = 1;
    };

    const injectWordAtRow = (row: number) => {
      const word = WORDS[(Math.random() * WORDS.length) | 0];
      const startCol = (Math.random() * Math.max(1, cols - word.length)) | 0;
      for (let i = 0; i < word.length; i++) {
        const idx = row * cols + (startCol + i);
        if (idx >= 0 && idx < grid.length) {
          const charIdx = CHARS.indexOf(word[i]);
          grid[idx] = charIdx === -1 ? randCharIdx() : charIdx;
          brightness[idx] = HOT_MIN + Math.random() * HOT_RANGE;
          paintCell(idx, (idx / cols) | 0, idx % cols);
        }
      }
    };

    // Scaled so the *overall* flip/decay rate across the whole grid looks
    // the same as before, even though each cell is now only visited once
    // every SHARDS ticks instead of every tick.
    const shardFlipProbability = Math.min(1, FLIP_PROBABILITY * SHARDS);
    const shardDecayRate = Math.pow(DECAY_RATE, SHARDS);

    // For a section much taller than the viewport (achievements, project
    // grid), the canvas itself can be thousands of px tall while only a
    // ~900px band is ever visible at once. Without this, every tick still
    // walks the *entire* section's cells even though most of them are
    // scrolled off above or below the screen. This computes which rows
    // are actually on screen right now (plus a small buffer) so ticks
    // only ever touch a viewport-sized slice, no matter how tall the
    // section is — cost stops scaling with section height.
    const VIEWPORT_BUFFER_PX = 300;
    const visibleRowRange = (): [number, number] => {
      const rect = canvas.getBoundingClientRect();
      const viewportH = window.innerHeight || 0;
      const localTop = -rect.top - VIEWPORT_BUFFER_PX;
      const localBottom = viewportH - rect.top + VIEWPORT_BUFFER_PX;
      const rowStart = Math.max(0, Math.floor(localTop / cellHeight));
      const rowEnd = Math.min(rows, Math.ceil(localBottom / cellHeight));
      return [rowStart, rowEnd];
    };

    const tick = () => {
      if (!grid.length) return;

      const [rowStart, rowEnd] = visibleRowRange();

      for (let r = rowStart; r < rowEnd; r++) {
        const rowBase = r * cols;
        for (let c = shard; c < cols; c += SHARDS) {
          const i = rowBase + c;
          let changed = false;

          if (Math.random() < shardFlipProbability) {
            grid[i] = randCharIdx();
            changed = true;
            if (Math.random() < 0.15) {
              brightness[i] = HOT_MIN + Math.random() * HOT_RANGE;
            }
          }

          brightness[i] *= shardDecayRate;
          if (brightness[i] < DECAY_FLOOR) {
            brightness[i] = DECAY_FLOOR + Math.random() * DECAY_FLOOR_RANGE;
            changed = true;
          }

          if (changed || Math.abs(brightness[i] - paintedAlpha[i]) > ALPHA_QUANT) {
            paintCell(i, r, c);
          }
        }
      }
      shard = (shard + 1) % SHARDS;

      if (Math.random() < WORD_INJECT_PROBABILITY * cols) {
        const row = rowStart + ((Math.random() * Math.max(1, rowEnd - rowStart)) | 0);
        injectWordAtRow(row);
      }
    };

    const loop = (ts: number) => {
      rafRef.current = requestAnimationFrame(loop);
      // Skip all work while off-screen, tab hidden, or the user has asked
      // for reduced motion — this layer typically spans an entire tall
      // section, so it's very often not fully in view.
      if (!visibleRef.current || document.hidden || reduceMotion || isScrolling) return;
      if (ts - lastTick > 1000 / SCRAMBLE_FPS) {
        tick();
        lastTick = ts;
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) return;
      resize(box.width, box.height);
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "200px", threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    // Pause all canvas work while the page is actively scrolling. Canvas
    // repaints and scroll compositing fight for the same main-thread
    // frame budget; freezing the texture for the ~150ms a scroll gesture
    // is in motion (then resuming once it settles) removes that
    // contention entirely, which is what actually shows up as jank
    // specifically while scrolling through a section, as opposed to
    // sitting on it. capture:true + document so this also catches scroll
    // on any nested scroll container, not just window.
    let isScrolling = false;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      isScrolling = true;
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
      if (scrollTimer) clearTimeout(scrollTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [color, maxOpacity, cellWidth, cellHeight, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ willChange: "transform", transform: "translateZ(0)", contain: "paint" }}
    />
  );
}