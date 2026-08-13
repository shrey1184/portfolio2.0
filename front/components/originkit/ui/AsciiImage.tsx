"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AsciiImageProps {
  src: string;
  cellWidth?: number;
  cellHeight?: number;
  fontSize?: number;
  color?: string;
  className?: string;
}

const CHARS = " .:-=+*#%@";

export default function AsciiImage({
  src,
  cellWidth = 6,
  cellHeight = 10,
  fontSize = 8,
  color = "rgba(255,255,255,0.85)",
  className = "",
}: AsciiImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ascii, setAscii] = useState("");

  const generate = useCallback(() => {
    const container = containerRef.current;
    if (!container || !src) return;

    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const cols = Math.max(1, Math.floor(width / cellWidth));
    const rows = Math.max(1, Math.floor(height / cellHeight));

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // object-cover style crop so the grid matches the card's aspect ratio
      const imgRatio = img.width / img.height;
      const gridRatio = cols / rows;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgRatio > gridRatio) {
        sw = img.height * gridRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / gridRatio;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);

      let out = "";
      try {
        const { data } = ctx.getImageData(0, 0, cols, rows);
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = (y * cols + x) * 4;
            const brightness =
              (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
            const idx = Math.min(CHARS.length - 1, Math.floor(brightness * CHARS.length));
            out += CHARS[idx];
          }
          out += "\n";
        }
        setAscii(out);
      } catch (err) {
        console.error("AsciiImage: canvas read failed (likely CORS)", err);
      }
    };
    img.onerror = (err) => {
      console.error("AsciiImage: failed to load image", src, err);
    };
    img.src = src;
  }, [src, cellWidth, cellHeight]);

  useEffect(() => {
    generate();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => generate());
    ro.observe(container);
    return () => ro.disconnect();
  }, [generate]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {ascii && (
        <pre
          className="whitespace-pre font-mono select-none m-0"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${cellHeight}px`,
            letterSpacing: `${Math.max(0, cellWidth - fontSize * 0.6)}px`,
            color,
          }}
        >
          {ascii}
        </pre>
      )}
    </div>
  );
}