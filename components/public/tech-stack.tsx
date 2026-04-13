"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";

interface StackCategory {
  id: string;
  title: string;
  items: string[];
}

const STACK_DATA: StackCategory[] = [
  {
    id: "ai",
    title: "AI & Agents",
    items: ["OpenAI API", "LangChain", "LlamaIndex", "Hugging Face", "Gemini", "LangGraph"]
  },
  {
    id: "languages",
    title: "Languages",
    items: ["TypeScript", "Python", "Go", "Rust", "C++", "JavaScript"]
  },
  {
    id: "backend",
    title: "Backend Core",
    items: ["Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"]
  },
  {
    id: "frontend",
    title: "Frontend UI",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js"]
  }
];

export const TechStack = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(STACK_DATA[0].id);

  const activeCategory = STACK_DATA.find(c => c.id === activeCategoryId) || STACK_DATA[0];

  return (
    <div className="w-full">
      {/* Section Header - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-end">
        <div className="lg:col-span-8">
          <h2 className="font-[family-name:var(--font-display)] text-6xl md:text-9xl font-bold uppercase leading-[0.8] tracking-tight">
            Systems &<br />
            <span className="text-[var(--outline)] opacity-40 italic">Execution.</span>
          </h2>
        </div>
        <div className="lg:col-span-4 pb-4">
          <p className="font-[family-name:var(--font-body)] text-[10px] md:text-xs font-medium text-[var(--outline)] tracking-widest uppercase leading-relaxed max-w-sm opacity-60 border-l border-[var(--outline)] pl-6">
            Transforming complex technical requirements into physical logic. 
            Interactive agent graph—hover to track node flow.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 min-h-[500px]">
        {/* Left Side: Categories */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-12">
          {STACK_DATA.map((category, index) => (
            <motion.div
              key={category.id}
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveCategoryId(category.id)}
              onClick={() => setActiveCategoryId(category.id)}
            >
              <div className="flex items-start gap-4">
                <span className={`font-[family-name:var(--font-body)] text-[10px] font-bold tracking-widest transition-opacity mt-2 ${
                  activeCategoryId === category.id ? "opacity-100 text-[var(--primary)]" : "opacity-30 text-[var(--outline)]"
                }`}>
                  0{index + 1}
                </span>
                <div className="relative">
                  <h3 
                    className={`font-[family-name:var(--font-display)] text-5xl md:text-6xl font-bold uppercase transition-all duration-500 ease-out ${
                      activeCategoryId === category.id 
                        ? "text-[var(--primary)] translate-x-4" 
                        : "text-[var(--outline)] opacity-20 group-hover:opacity-100 group-hover:translate-x-2"
                    }`}
                  >
                    {category.title}
                  </h3>
                  {activeCategoryId === category.id && (
                    <motion.div 
                      layoutId="active-marker"
                      className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-[var(--primary)]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Side: Radar/Node Graph */}
        <div className="lg:col-span-8 relative flex items-center justify-center border border-[var(--outline-variant)] bg-black/2 overflow-hidden chrome-surface min-h-[550px]">
          {/* Diagnostic Grid Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
            style={{ 
              backgroundImage: `linear-gradient(var(--outline) 1px, transparent 1px), linear-gradient(90deg, var(--outline) 1px, transparent 1px)`,
              backgroundSize: '30px 30px' 
            }} 
          />
          
          {/* Scanning Line Effect */}
          <motion.div 
            className="absolute inset-0 w-full h-[1px] bg-[var(--primary)] opacity-5 z-10 pointer-events-none"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative w-full h-full max-w-[450px] max-h-[450px] aspect-square flex items-center justify-center scale-75 md:scale-100">
            {/* Rotating Rings */}
            <motion.div 
              className="absolute inset-0 border border-[var(--outline)] opacity-10 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{ borderRadius: '50% !important' }} // Override global !important reset for circles
            />
            <motion.div 
              className="absolute inset-[15%] border border-[var(--outline)] opacity-5 rounded-full border-dashed"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{ borderRadius: '50% !important' }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategoryId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Lines */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                  <defs>
                    <radialGradient id="lineGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {activeCategory.items.map((_, i) => {
                    const angle = (i * 360) / activeCategory.items.length - 90;
                    const radian = (angle * Math.PI) / 180;
                    const x2 = 50 + 40 * Math.cos(radian);
                    const y2 = 50 + 40 * Math.sin(radian);
                    
                    return (
                      <g key={i}>
                        <motion.line
                          x1="50%"
                          y1="50%"
                          x2={`${x2}%`}
                          y2={`${y2}%`}
                          stroke="var(--outline)"
                          strokeWidth="0.5"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.2 }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                        />
                        <motion.circle
                          cx={`${x2}%`}
                          cy={`${y2}%`}
                          r="2"
                          fill="var(--primary)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Central Node */}
                <div className="relative z-20 w-16 h-16 bg-black border border-[var(--outline)] flex items-center justify-center group/center">
                  <Cpu className="w-8 h-8 text-[var(--primary)] group-hover/center:scale-110 transition-transform" />
                  <div className="absolute inset-0 border border-[var(--primary)] opacity-20 animate-pulse" />
                  <div className="absolute -bottom-8 whitespace-nowrap text-[8px] font-bold tracking-[0.3em] uppercase text-[var(--outline)] opacity-70">
                    System Core
                  </div>
                  
                  {/* Glowing Orbitals */}
                  <div className="absolute inset-[-4px] border border-[var(--primary)] opacity-10 animate-ping" style={{ borderRadius: '0 !important' }} />
                </div>

                {/* Outer Nodes */}
                {activeCategory.items.map((item, i) => {
                  const angle = (i * 360) / activeCategory.items.length - 90;
                  const radian = (angle * Math.PI) / 180;
                  const x = 50 + 40 * Math.cos(radian);
                  const y = 50 + 40 * Math.sin(radian);

                  return (
                    <motion.div
                      key={item}
                      className="absolute group/node cursor-pointer"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)"
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <div className="relative flex items-center gap-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-[var(--outline-variant)] hover:border-[var(--primary)] transition-colors">
                        <div className="w-1.5 h-1.5 bg-[var(--primary)] group-hover/node:animate-pulse" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--primary)] whitespace-nowrap">
                          {item}
                        </span>
                        
                        {/* Hover Detail */}
                        <div className="absolute -top-4 left-0 text-[6px] tracking-tighter text-[var(--outline)] opacity-0 group-hover/node:opacity-100 transition-opacity">
                          NODE_{i.toString().padStart(2, '0')} // ADDR: 0x{i.toString(16).toUpperCase()}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Corner Decorations */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[var(--outline)] opacity-30" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[var(--outline)] opacity-30" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[var(--outline)] opacity-30" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[var(--outline)] opacity-30" />
          
          {/* Tech Data Readout */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-8">
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-[var(--outline)] uppercase tracking-widest">Active Modules</span>
              <span className="text-[10px] font-bold text-[var(--primary)]">{activeCategory.items.length}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[8px] text-[var(--outline)] uppercase tracking-widest">Signal Status</span>
              <span className="text-[10px] font-bold text-[var(--primary)]">Optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

