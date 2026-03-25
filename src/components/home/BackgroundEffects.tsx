import Image from "next/image";

type BackgroundEffectsProps = {
  hasHovered: boolean;
  mouseX: number;
  mouseY: number;
};

export function BackgroundEffects({ hasHovered, mouseX, mouseY }: BackgroundEffectsProps) {
  return (
    <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
      <Image
        src="/new-bg.jpg"
        alt="Background"
        fill
        className="object-cover object-center"
        priority
        quality={100}
      />

      <div className="absolute inset-0 bg-black/10" />

      <div
        className="absolute inset-0 hidden sm:block"
        style={{
          opacity: hasHovered ? 1 : 0,
          clipPath: `circle(88px at ${mouseX}px ${mouseY}px)`,
          WebkitClipPath: `circle(88px at ${mouseX}px ${mouseY}px)`,
        }}
      >
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 flex items-center justify-center -translate-y-4 sm:-translate-y-30">
          <div className="relative aspect-square w-[380px] sm:w-[460px] md:w-[530px] lg:w-[580px]">
            <Image
              src="/assassinscreed-logo.svg"
              alt="Assassin's Creed logo aura"
              fill
              className="h-auto w-full object-contain opacity-80 logo-yellow-aura"
              quality={100}
            />
            <Image
              src="/assassinscreed-logo.svg"
              alt="Assassin's Creed logo"
              fill
              className="h-auto w-full object-contain opacity-95 logo-yellow-glow"
              quality={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
