type HoverCursorProps = {
  x: number;
  y: number;
  visible: boolean;
};

export function HoverCursor({ x, y, visible }: HoverCursorProps) {
  return (
    <div
      className="fixed left-0 top-0 z-[9999] hidden h-44 w-44 rounded-full border border-black/80 bg-black/25 backdrop-blur-[1px] will-change-transform sm:block"
      style={{
        transform: `translate3d(${x - 88}px, ${y - 88}px, 0)`,
        transition: "transform 0.05s linear",
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
