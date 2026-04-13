"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface BlobTracerProps {
  count: number;
  thickness: number;
  size: number;
  color: string;
  speed: number;
}

export const BlobTracer = ({ count, thickness, size, color, speed }: BlobTracerProps) => {
  const [blobs, setBlobs] = useState<any[]>([]);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);

  useEffect(() => {
    // Attempt to find the hero video element
    const video = document.querySelector("video");
    
    // Setup for motion analysis
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    // Low resolution for performance (40x40 is enough to detect movement)
    const width = 45;
    const height = 45;
    canvas.width = width;
    canvas.height = height;

    let rafId: number;
    let lastProcessingTime = 0;

    const process = (time: number) => {
      // Regulate processing speed based on the speed prop (1-10)
      const delay = Math.max(20, 400 / (speed || 5));
      if (time - lastProcessingTime > delay) {
        lastProcessingTime = time;

        try {
          if (video && video.readyState >= 2) {
            ctx?.drawImage(video, 0, 0, width, height);
            const imageData = ctx?.getImageData(0, 0, width, height);
            
            if (imageData && prevFrameRef.current) {
              const current = imageData.data;
              const prev = prevFrameRef.current;
              const motionPoints: { x: number; y: number; diff: number }[] = [];

              // Compare frames for grayscale difference
              for (let i = 0; i < current.length; i += 4) {
                const diff = Math.abs(current[i] - prev[i]);
                if (diff > 45) { // Sensitivity threshold
                  const idx = i / 4;
                  motionPoints.push({
                    x: (idx % width) / width * 100,
                    y: Math.floor(idx / width) / height * 100,
                    diff
                  });
                }
              }

              if (motionPoints.length > 0) {
                // Shuffle and pick a selection of motion points
                const selected = motionPoints
                  .sort(() => 0.5 - Math.random())
                  .slice(0, count);

                setBlobs(selected.map((p) => ({
                  id: Math.random().toString(36).substring(2, 9),
                  x: p.x + (Math.random() - 0.5) * 4, // Jitter
                  y: p.y + (Math.random() - 0.5) * 4,
                  label: Math.floor(11111111 + Math.random() * 88888888).toString(),
                  scale: 0.8 + Math.random() * 0.4,
                  visible: true
                })));
              } else {
                // Decay visibility if no motion
                setBlobs(prev => prev.map(b => ({ ...b, visible: false })));
              }
              
              prevFrameRef.current = new Uint8ClampedArray(current);
            } else if (imageData) {
              prevFrameRef.current = new Uint8ClampedArray(imageData.data);
            }
          } else {
            // FALLBACK: If no video is present or accessible, use center-weighted random "tracing"
            if (Math.random() > 0.7) {
              setBlobs(Array.from({ length: Math.floor(count / 2) }).map(() => ({
                id: Math.random().toString(36).substring(2, 9),
                x: 35 + Math.random() * 30, // Clustered near center
                y: 20 + Math.random() * 60,
                label: Math.floor(11111111 + Math.random() * 88888888).toString(),
                scale: 0.7 + Math.random() * 0.5,
                visible: true
              })));
            }
          }
        } catch (e) {
          // Security/CORS error fallback
          if (Math.random() > 0.8) {
            setBlobs(Array.from({ length: 2 }).map(() => ({
              id: Math.random().toString(36).substring(2, 9),
              x: 20 + Math.random() * 60,
              y: 20 + Math.random() * 60,
              label: Math.floor(11111111 + Math.random() * 88888888).toString(),
              scale: 0.5 + Math.random() * 0.5,
              visible: true
            })));
          }
        }
      }
      rafId = requestAnimationFrame(process);
    };

    rafId = requestAnimationFrame(process);
    return () => cancelAnimationFrame(rafId);
  }, [count, speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
      <AnimatePresence>
        {blobs.filter(b => b.visible).map((blob) => (
          <motion.div
            key={blob.id}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="absolute flex flex-col items-start"
            style={{
              left: `${blob.x}%`,
              top: `${blob.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Machine Vision Label */}
            <div 
              className="text-[7px] font-mono px-1 py-0.5 mb-1 bg-black/70 text-white border border-white/20 leading-none whitespace-nowrap"
              style={{ fontFamily: "monospace", letterSpacing: "1px" }}
            >
              {blob.label}
            </div>
            
            {/* Tracing Crosshair Marker */}
            <div
              className="relative border"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                borderColor: color,
                borderWidth: `${thickness}px`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[30%] h-[1px] bg-white/40 absolute" />
                <div className="h-[30%] w-[1px] bg-white/40 absolute" />
              </div>
              
              <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white" />
              <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
