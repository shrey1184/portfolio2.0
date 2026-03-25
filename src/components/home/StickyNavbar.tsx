import Link from "next/link";

export function StickyNavbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 text-sm text-[#E2C792] pointer-events-none sm:px-12 sm:text-base">
      <div className="pointer-events-auto cursor-pointer text-xl font-light tracking-widest transition-opacity hover:opacity-80">
        <Link href="#home">Portfolio</Link>
      </div>
      <div className="pointer-events-auto flex gap-4 text-sm font-light tracking-widest font-serif sm:gap-8">
        <Link href="#about" className="cursor-pointer transition-colors hover:text-white">
          About
        </Link>
        <Link href="#projects" className="cursor-pointer transition-colors hover:text-white">
          Projects
        </Link>
        <Link
          href="#achievements"
          className="hidden cursor-pointer transition-colors hover:text-white sm:block"
        >
          Achievements
        </Link>
        <Link href="#contact" className="cursor-pointer transition-colors hover:text-white">
          Contact
        </Link>
      </div>
    </nav>
  );
}
