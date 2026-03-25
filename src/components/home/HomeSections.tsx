export function HeroSection() {
  return (
    <section id="home" className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none relative z-10 mt-16 flex w-full flex-col items-center justify-center text-center">
        <h1 className="text-[12vw] sm:text-[10vw] md:text-[80px] lg:text-[120px] font-serif font-light text-[#1C3352] drop-shadow-2xl leading-none tracking-tighter" />
        <h2 className="text-[25vw] sm:text-[20vw] md:text-[150px] lg:text-[250px] -mt-4 sm:-mt-10 lg:-mt-20 font-serif font-light tracking-widest text-[#E2C792] opacity-90 drop-shadow-xl">
          Shrey
        </h2>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="flex min-h-screen w-full flex-col items-center justify-center bg-black/40 px-8 py-24 backdrop-blur-sm">
      <h2 className="mb-12 text-4xl font-serif font-light tracking-tight text-[#E2C792] sm:text-7xl">About Me</h2>
      <p className="max-w-3xl text-center text-lg font-serif leading-relaxed text-gray-300 sm:text-2xl">
        I&apos;m a software engineer specialized in bringing creative ideas to life on the web. Welcome to my
        portfolio! Here you can find out more about my journey, the technologies I use, and what drives my
        passion for development.
      </p>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0d1622]/40 px-8 py-24 backdrop-blur-sm"
    >
      <h2 className="mb-12 text-4xl font-serif font-light tracking-tight text-[#E2C792] sm:text-7xl">My Projects</h2>
      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="group flex h-80 cursor-pointer flex-col justify-end rounded-sm border border-[#C19B61]/30 bg-black/40 p-8 transition-colors hover:border-[#1C3352] hover:bg-white/5"
          >
            <div className="mb-4 h-full w-full bg-[#1C3352]/20 opacity-50 transition-opacity group-hover:opacity-100" />
            <h3 className="mb-2 text-3xl font-serif font-light text-[#E2C792]">Project {item}</h3>
            <p className="text-sm font-sans text-gray-400">
              Brief description of the project goes here. Built with Next.js and Tailwind.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AchievementsSection() {
  return (
    <section
      id="achievements"
      className="flex min-h-screen w-full flex-col items-center justify-center bg-black/40 px-8 py-24 backdrop-blur-sm"
    >
      <h2 className="mb-12 text-4xl font-serif font-light tracking-tight text-[#E2C792] sm:text-7xl">Achievements</h2>
      <div className="relative z-10 flex w-full max-w-3xl flex-col gap-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-start gap-6 rounded-sm border-l-4 border-[#C19B61] bg-gradient-to-r from-[#1C3352]/30 to-transparent p-8"
          >
            <div className="text-3xl">🏆</div>
            <div>
              <h4 className="text-2xl font-serif font-light text-[#E2C792]">Award or Certification {item}</h4>
              <p className="mt-2 font-sans text-gray-400">
                Details about this achievement and the organization behind it.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-[#0d1622]/50 px-8 py-24 backdrop-blur-sm"
    >
      <h2 className="mb-8 text-4xl font-serif font-light tracking-tight text-[#E2C792] sm:text-7xl">Let&apos;s Connect</h2>
      <p className="mb-12 max-w-2xl text-center text-xl font-serif text-gray-300">
        I&apos;m currently looking for new opportunities. Whether you have a question or just want to say hi,
        I&apos;ll try my best to get back to you!
      </p>
      <a
        href="mailto:hello@example.com"
        className="relative z-10 cursor-pointer rounded-sm bg-[#E2C792] px-12 py-5 text-lg font-serif font-light tracking-widest text-[#1C3352] transition-colors hover:bg-white"
      >
        Say Hello
      </a>
    </section>
  );
}
