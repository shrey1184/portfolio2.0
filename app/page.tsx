"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <div className="relative font-sans text-white overflow-x-hidden selection:bg-white selection:text-black cursor-default">
      
      {/* Custom Difference Cursor */}
      <div 
        className="fixed left-0 top-0 w-32 h-32 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white hidden sm:block will-change-transform"
        style={{
          transform: `translate3d(${mousePosition.x - 64}px, ${mousePosition.y - 64}px, 0)`,
          transition: "transform 0.05s linear",
        }}
      ></div>

      {/* Fixed Background underneath it all (for other sections) */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        {/* Soft overlay to ensure readability without hiding the image */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Sticky Navbar - Modified to blend with difference cursor well */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 text-sm sm:text-base py-5 text-[#E2C792] mix-blend-difference pointer-events-none">
        <div className="text-xl font-bold tracking-widest uppercase pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity">
          <Link href="#home">Portfolio</Link>
        </div>
        <div className="flex gap-4 sm:gap-8 font-medium pointer-events-auto uppercase text-sm tracking-widest font-serif">
          <Link href="#about" className="hover:text-white transition-colors cursor-pointer">About</Link>
          <Link href="#projects" className="hover:text-white transition-colors cursor-pointer">Projects</Link>
          <Link href="#achievements" className="hover:text-white transition-colors hidden sm:block cursor-pointer">Achievements</Link>
          <Link href="#contact" className="hover:text-white transition-colors cursor-pointer">Contact</Link>
        </div>
      </nav>

      <main className="relative z-10 w-full flex flex-col items-center flex-1">
        
        {/* Home/Hero Section - "The Fall of Icarus" Poster Style */}
        <section id="home" className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
          {/* 3 Column Poster Background Layout overlaying the background image */}
          <div className="absolute inset-0 z-0 grid grid-cols-3 w-full h-[100vh]">
            <div className="bg-[#C19B61]/40 h-full w-full relative mix-blend-overlay"></div>
            <div className="bg-[#1C3352]/50 h-full w-full relative mix-blend-overlay"></div>
            <div className="bg-[#C19B61]/40 h-full w-full relative mix-blend-overlay"></div>
          </div>
          
          {/* Big Typography Content */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center text-center pointer-events-none mt-16">
            <h1 className="text-[12vw] sm:text-[10vw] md:text-[80px] lg:text-[120px] font-serif font-black uppercase text-[#1C3352] drop-shadow-2xl leading-none tracking-tighter mix-blend-difference">
              THE PORTFOLIO OF
            </h1>
            <h2 className="text-[25vw] sm:text-[20vw] md:text-[150px] lg:text-[250px] font-serif font-black uppercase text-[#E2C792] drop-shadow-xl -mt-4 sm:-mt-10 lg:-mt-20 tracking-widest mix-blend-difference opacity-90">
              SHREY
            </h2>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="flex min-h-screen w-full flex-col items-center justify-center bg-black/40 backdrop-blur-sm px-8 py-24">
          <h2 className="text-4xl sm:text-7xl font-serif font-bold mb-12 tracking-tight text-[#E2C792]">About Me</h2>
          <p className="max-w-3xl text-center text-lg sm:text-2xl text-gray-300 leading-relaxed font-serif">
            I&apos;m a software engineer specialized in bringing creative ideas to life on the web. Welcome to my portfolio! Here you can find out more about my journey, the technologies I use, and what drives my passion for development.
          </p>
        </section>

        {/* Projects Section */}
        <section id="projects" className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0d1622]/40 backdrop-blur-sm px-8 py-24">
          <h2 className="text-4xl sm:text-7xl font-serif font-bold mb-12 tracking-tight text-[#E2C792]">My Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl z-10 relative">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-80 rounded-sm border border-[#C19B61]/30 bg-black/40 p-8 flex flex-col justify-end hover:bg-white/5 hover:border-[#1C3352] transition-colors cursor-pointer group">
                <div className="w-full h-full mb-4 opacity-50 group-hover:opacity-100 transition-opacity bg-[#1C3352]/20"></div>
                <h3 className="text-3xl font-serif font-semibold mb-2 text-[#E2C792]">Project {item}</h3>
                <p className="text-gray-400 font-sans text-sm">Brief description of the project goes here. Built with Next.js and Tailwind.</p>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="flex min-h-screen w-full flex-col items-center justify-center bg-black/40 backdrop-blur-sm px-8 py-24">
          <h2 className="text-4xl sm:text-7xl font-serif font-bold mb-12 tracking-tight text-[#E2C792]">Achievements</h2>
          <div className="max-w-3xl w-full flex flex-col gap-6 z-10 relative">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start gap-6 p-8 rounded-sm bg-gradient-to-r from-[#1C3352]/30 to-transparent border-l-4 border-[#C19B61]">
                <div className="text-3xl">🏆</div>
                <div>
                  <h4 className="text-2xl font-serif font-semibold text-[#E2C792]">Award or Certification {item}</h4>
                  <p className="text-gray-400 mt-2 font-sans">Details about this achievement and the organization behind it.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-[#0d1622]/50 backdrop-blur-sm px-8 py-24">
          <h2 className="text-4xl sm:text-7xl font-serif font-bold mb-8 tracking-tight text-[#E2C792]">Let&apos;s Connect</h2>
          <p className="max-w-2xl text-center text-xl text-gray-300 mb-12 font-serif">
            I&apos;m currently looking for new opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
          </p>
          <a href="mailto:hello@example.com" className="px-12 py-5 rounded-sm bg-[#E2C792] text-[#1C3352] font-serif font-bold tracking-widest uppercase text-lg hover:bg-white transition-colors relative z-10 cursor-pointer">
            Say Hello
          </a>
        </section>

      </main>
    </div>
  );
}
