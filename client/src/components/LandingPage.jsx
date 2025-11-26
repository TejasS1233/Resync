import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Activity,
  Lock,
  Zap,
  Calendar,
  BarChart3,
  PenTool,
  CheckCircle2,
  ArrowRight,
  Shield,
  Brain,
  Terminal,
  Command,
  Hash,
  Fingerprint,
  ChevronRight,
  Check,
} from "lucide-react";

// --- THE CINEMATIC INTRO COMPONENT ---
const IntroOverlay = ({ onComplete }) => {
  const [text, setText] = useState("");
  const finalText = "CADENCE";
  const [phase, setPhase] = useState(0); // 0: Start, 1: Typing, 2: Line Expand, 3: Split

  useEffect(() => {
    // PHASE 1: Text Decode Effect
    let iterations = 0;
    const interval = setInterval(() => {
      setText(() =>
        finalText
          .split("")
          .map((letter, index) => {
            if (index < iterations) return finalText[index];
            return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)];
          })
          .join("")
      );

      if (iterations >= finalText.length) {
        clearInterval(interval);
        setTimeout(() => setPhase(2), 200);
      }

      iterations += 1 / 2;
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 2) {
      // PHASE 2: Line expands
      setTimeout(() => setPhase(3), 600);
    }

    if (phase === 3) {
      // PHASE 3: Split animation finishes
      setTimeout(onComplete, 800);
    }
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden pointer-events-none">
      {/* --- TOP SHUTTER --- */}
      <div
        className={`relative z-20 flex-1 bg-black w-full flex items-end justify-center border-b border-white/10 transition-transform duration-[800ms] cubic-bezier(0.87, 0, 0.13, 1) ${
          phase === 3 ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="absolute bottom-0 mb-8 z-30 overflow-hidden h-10 md:h-16 flex items-end">
          <h1 className="text-4xl md:text-6xl font-black tracking-[0.2em] text-white font-mono translate-y-1/2">
            {text}
          </h1>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
      </div>

      {/* --- THE GLOWING CUT LINE --- */}
      <div
        className={`absolute top-1/2 left-0 w-full h-0 z-50 flex items-center justify-center -translate-y-1/2 transition-opacity duration-300 ${phase === 3 ? "opacity-0" : "opacity-100"}`}
      >
        {/* Outer Glow (Pink) */}
        <div
          className={`w-full h-[1px] bg-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,1)] transition-all duration-500 ease-out ${
            phase >= 2 ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </div>

      {/* --- BOTTOM SHUTTER --- */}
      <div
        className={`relative z-20 flex-1 bg-black w-full flex items-start justify-center border-t border-white/10 transition-transform duration-[800ms] cubic-bezier(0.87, 0, 0.13, 1) ${
          phase === 3 ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="absolute top-0 mt-8 z-30 overflow-hidden h-10 md:h-16 flex items-start">
          <h1 className="text-4xl md:text-6xl font-black tracking-[0.2em] text-white/10 font-mono -translate-y-1/2 blur-[1px] transform scale-y-[-1]">
            {text}
          </h1>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
      </div>
    </div>
  );
};

// --- NAVBAR COMPONENT ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
            <img
              src="/image.png"
              alt="Cadence Logo"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-white font-bold text-xl tracking-tight group-hover:text-fuchsia-100 transition-colors">
              Cadence
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/dashboard"
              className="group relative px-6 py-2.5 bg-white text-black rounded-full font-semibold text-sm overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-fuchsia-200 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2">Get Started</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- INTERACTIVE FEATURES COMPONENT (SCROLL-BASED) ---
const InteractiveFeatures = () => {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress through the section
      const scrollProgress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);

      // Map scroll progress to tabs (0-33% = tab 0, 33-66% = tab 1, 66-100% = tab 2)
      if (scrollProgress < 0.33) {
        setActiveTab(0);
      } else if (scrollProgress < 0.66) {
        setActiveTab(1);
      } else {
        setActiveTab(2);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tabs = [
    {
      id: 0,
      title: "Track Goals Your Way",
      desc: "Create daily goals, set custom frequencies, and mark them complete. Simple habit tracking that adapts to your workflow - whether it's coding, fitness, or learning.",
      color: "from-violet-600 to-fuchsia-500",
      visual: (
        // 1. GOAL TRACKING VISUAL - Shows daily goals list
        <div className="w-full max-w-4xl space-y-6 p-8">
          {/* Today's Goals Section */}
          <div className="bg-black/40 rounded-2xl border border-white/10 p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="text-violet-400" size={24} />
                <h3 className="text-2xl font-bold text-white">Today's Goals</h3>
              </div>
              <div className="px-4 py-2 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-medium">
                4 goals
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: "Morning Workout", category: "Fitness", done: true, color: "emerald" },
                { name: "LeetCode Daily", category: "Coding", done: true, color: "blue" },
                { name: "Read 30 minutes", category: "Learning", done: false, color: "orange" },
                { name: "Meditation", category: "Wellness", done: false, color: "purple" },
              ].map((goal, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-xl border transition-all duration-300 ${goal.done ? "bg-white/5 border-white/10" : "bg-white/[0.02] border-white/5 hover:border-white/20"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          goal.done
                            ? `bg-${goal.color}-500/20 border-${goal.color}-500`
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        {goal.done && (
                          <CheckCircle2 className={`text-${goal.color}-400`} size={16} />
                        )}
                      </div>
                      <div>
                        <div
                          className={`font-semibold ${goal.done ? "text-gray-400 line-through" : "text-white"}`}
                        >
                          {goal.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{goal.category}</div>
                      </div>
                    </div>
                    {!goal.done && (
                      <button className="px-4 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-300 text-sm font-medium transition-all">
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "CLI & API First",
      desc: "Log habits without leaving your terminal. Built for developers who live in the command line. REST API for complete automation and integrations.",
      color: "from-blue-600 to-cyan-500",
      visual: (
        // 2. CLI VISUAL - Terminal interface
        <div className="w-full max-w-4xl p-8">
          <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl font-mono text-sm overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              </div>
              <div className="text-xs text-slate-500 font-sans">zsh — 80x24</div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 text-slate-300 space-y-4 font-mono relative z-10">
              <div className="flex gap-2 items-center opacity-50">
                <span className="text-blue-500">➜</span>
                <span className="text-cyan-400">~</span>
                <span>cadence status</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-blue-500">➜</span>
                <span className="text-cyan-400">~</span>
                <span className="text-white">cadence log "Deep Work" --time=60m</span>
              </div>
              <div className="space-y-1 pl-4 border-l-2 border-blue-500/20 my-2">
                <div className="text-emerald-400">✓ Session logged</div>
                <div className="text-slate-400">
                  Streak: <span className="text-white font-bold">14 days</span> 🔥
                </div>
                <div className="text-slate-400">
                  XP: <span className="text-blue-400">+120</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-blue-500">➜</span>
                <span className="text-cyan-400">~</span>
                <span className="w-2 h-4 bg-blue-500 animate-pulse"></span>
              </div>
            </div>

            {/* Coming Soon Badge */}
            <div className="px-6 pb-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 flex items-center gap-3">
                <Terminal className="text-blue-400" size={20} />
                <div>
                  <div className="text-blue-300 font-semibold text-sm">CLI Coming Soon</div>
                  <div className="text-slate-400 text-xs">
                    Log habits directly from your terminal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Mood Insights & Reflection",
      desc: "Connect your daily mood to productivity patterns. Add reflections to understand what drives your best work and spot burnout before it happens.",
      color: "from-emerald-400 to-cyan-500",
      visual: (
        // 3. MOOD TRACKING & REFLECTION VISUAL
        <div className="w-full max-w-4xl space-y-6 p-8">
          <div className="bg-black/40 rounded-2xl border border-white/10 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-8">
              <PenTool className="text-cyan-400" size={24} />
              <h3 className="text-2xl font-bold text-white">Daily Reflection</h3>
            </div>

            {/* Mood Selector */}
            <div className="mb-8">
              <label className="text-sm text-gray-400 mb-3 block">How are you feeling today?</label>
              <div className="flex gap-3">
                {[
                  { emoji: "😫", label: "Exhausted", active: false },
                  { emoji: "😐", label: "Meh", active: false },
                  { emoji: "😊", label: "Good", active: false },
                  { emoji: "🚀", label: "Energized", active: true },
                  { emoji: "⚡", label: "Unstoppable", active: false },
                ].map((mood, i) => (
                  <div
                    key={i}
                    className={`flex-1 p-4 rounded-xl border transition-all cursor-pointer ${
                      mood.active
                        ? "bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="text-3xl mb-2 text-center">{mood.emoji}</div>
                    <div
                      className={`text-xs text-center font-medium ${mood.active ? "text-cyan-300" : "text-gray-500"}`}
                    >
                      {mood.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reflection Text Area */}
            <div className="mb-8">
              <label className="text-sm text-gray-400 mb-3 block">What made today great?</label>
              <div className="bg-black/60 rounded-xl border border-white/10 p-5 min-h-[120px]">
                <p className="text-gray-300 leading-relaxed">
                  Crushed my workout this morning and got into deep work mode around 10am. The new
                  Pomodoro technique is really working - managed 6 solid sessions today. Feeling
                  great about the progress on the new feature! 🎯
                </p>
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="text-emerald-400" size={18} />
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Productivity
                  </div>
                </div>
                <div className="text-xl font-bold text-white">High</div>
                <div className="text-xs text-gray-400 mt-1">Above your average</div>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="text-cyan-400" size={18} />
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    Energy Level
                  </div>
                </div>
                <div className="text-xl font-bold text-white">9/10</div>
                <div className="text-xs text-gray-400 mt-1">Peak performance</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div ref={sectionRef} className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT SIDE - FEATURE CARDS (Smaller) */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-3">
              Built for consistency.
            </h2>
            <p className="text-gray-400 text-base">Everything you need to build lasting habits.</p>
          </div>

          <div className="flex flex-col gap-3">
            {tabs.map((tab, index) => (
              <div
                key={index}
                onClick={() => setActiveTab(index)}
                className={`group relative p-5 rounded-xl transition-all duration-300 cursor-pointer border ${
                  activeTab === index
                    ? "bg-white/10 border-white/20 shadow-lg"
                    : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className={`text-lg font-bold transition-colors ${activeTab === index ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}
                  >
                    {tab.title}
                  </h3>
                  {activeTab !== index && (
                    <ChevronRight
                      className="text-gray-600 group-hover:text-gray-400 flex-shrink-0 mt-1"
                      size={18}
                    />
                  )}
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${activeTab === index ? "max-h-32 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                >
                  <p className="text-gray-400 text-sm leading-relaxed">{tab.desc}</p>
                </div>

                {/* Active indicator bar */}
                {activeTab === index && (
                  <div
                    className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${tab.color} rounded-l-xl`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - VISUAL DISPLAY (Much Bigger) */}
        <div className="lg:col-span-8 relative min-h-[600px] lg:min-h-[700px] w-full rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center group shadow-2xl">
          {/* Dynamic Background Glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${tabs[activeTab].color} opacity-5 transition-all duration-1000`}
          ></div>
          <div
            className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b ${tabs[activeTab].color} blur-[120px] opacity-10 transition-all duration-1000 rounded-full pointer-events-none`}
          ></div>

          {/* VISUALS WITH SLIDE ANIMATION */}
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center p-8 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                activeTab === index
                  ? "opacity-100 translate-x-0 scale-100"
                  : activeTab < index
                    ? "opacity-0 translate-x-full scale-95 pointer-events-none" // Slide in from right
                    : "opacity-0 -translate-x-full scale-95 pointer-events-none" // Slide out to left
              }`}
            >
              {tab.visual}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- KEYBOARD MASTERY SECTION ---
const KeyboardMastery = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-6 uppercase tracking-wider">
            <Command size={12} /> Speed Matters
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Don't touch that mouse.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            Cadence is built for flow. Toggle dark mode, log a habit, or check your stats instantly
            with our global command menu.
          </p>

          <div className="space-y-4">
            {[
              { cmd: "⌘ K", desc: "Open Command Menu" },
              { cmd: "⌘ N", desc: "New Habit Entry" },
              { cmd: "⌘ J", desc: "Jump to Journal" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className="flex gap-1">
                  <kbd className="h-8 min-w-[32px] px-2 flex items-center justify-center rounded bg-white/10 border border-white/10 text-gray-300 font-sans text-xs font-bold shadow-[0_2px_0_0_rgba(255,255,255,0.1)] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                    {item.cmd.split(" ")[0]}
                  </kbd>
                  <kbd className="h-8 min-w-[32px] px-2 flex items-center justify-center rounded bg-white/10 border border-white/10 text-gray-300 font-sans text-xs font-bold shadow-[0_2px_0_0_rgba(255,255,255,0.1)] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                    {item.cmd.split(" ")[1]}
                  </kbd>
                </div>
                <span className="text-gray-500 text-sm font-medium">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/20 to-violet-500/20 blur-2xl transform rotate-6 scale-90 rounded-3xl"></div>
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden">
            {/* Fake Command Menu UI */}
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
              <Command className="text-gray-500" size={20} />
              <span className="text-xl text-gray-500">Search commands...</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 text-white cursor-pointer">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-yellow-400" />
                  <span>Log "Deep Work"</span>
                </div>
                <span className="text-xs text-gray-500">Run</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Check size={16} />
                  <span>Complete "Morning Run"</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Terminal size={16} />
                  <span>Switch to CLI View</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- PRICING SECTION ---
const Pricing = () => {
  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing.</h2>
          <p className="text-gray-400">Start for free, upgrade when you get serious.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors relative group">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <h3 className="text-xl font-bold text-white mb-2">Hobby</h3>
            <div className="text-4xl font-bold text-white mb-6">
              $0 <span className="text-lg font-normal text-gray-500">/mo</span>
            </div>

            <Link
              to="/dashboard"
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors mb-8 flex items-center justify-center"
            >
              Get Started
            </Link>

            <ul className="space-y-4">
              {["Unlimited Habits", "7-Day History", "Basic Charts", "Local Storage"].map(
                (feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                    <Check size={16} className="text-gray-500" /> {feat}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-3xl bg-black border border-white/10 relative overflow-hidden group">
            {/* Glowing Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/20 via-violet-600/20 to-transparent opacity-100 pointer-events-none"></div>
            <div className="absolute inset-0 border-2 border-transparent rounded-3xl [background:linear-gradient(#000,#000)padding-box,linear-gradient(45deg,#ec4899,#8b5cf6)border-box] mask-composite:exclude pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
                  Popular
                </span>
              </div>
              <div className="text-4xl font-bold text-white mb-6">
                $5 <span className="text-lg font-normal text-gray-500">/mo</span>
              </div>

              <Link
                to="/dashboard"
                className="w-full py-3 rounded-xl bg-white text-black font-bold hover:scale-[1.02] transition-transform mb-8 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center"
              >
                Start Free Trial
              </Link>

              <ul className="space-y-4">
                {[
                  "Everything in Hobby",
                  "Unlimited History",
                  "Heatmap Visuals",
                  "Mood Correlation",
                  "Cloud Sync",
                  "API Access",
                ].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                    <Check size={16} className="text-fuchsia-500" /> {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- LANDING PAGE COMPONENT ---
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 overflow-hidden">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-fuchsia-600/15 rounded-[100%] blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer group hover:border-fuchsia-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
              V2.0 Now with Mood Tracking
            </span>
            <ArrowRight
              size={14}
              className="text-gray-500 group-hover:text-fuchsia-400 transition-colors -ml-1 group-hover:translate-x-0.5"
            />
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">
            Find your{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              rhythm.
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Cadence is the developer-friendly habit tracker. Visualize your progress with heatmaps,
            track daily moods, and build streaks that stick.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link
              to="/dashboard"
              className="group relative px-8 py-4 bg-white text-black rounded-full text-lg font-bold transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">Start Tracking Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            <button className="px-8 py-4 rounded-full text-lg font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2 border border-transparent hover:border-white/10">
              View Live Demo
            </button>
          </div>

          {/* APP MOCKUP: THE DASHBOARD */}
          <div className="mt-24 relative max-w-6xl mx-auto" style={{ perspective: "2000px" }}>
            {/* The Horizon Glow Effect */}
            <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[100%] h-[400px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />

            {/* The Window Container - Tilted 3D Effect */}
            <div
              className="relative rounded-xl bg-[#09090b] border border-white/10 shadow-2xl overflow-hidden aspect-video group transition-all duration-700 hover:scale-[0.98]"
              style={{
                transformStyle: "preserve-3d",
                transform: "rotateX(0deg)",
                transition: "transform 0.7s ease-out",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "rotateX(8deg) translateZ(-50px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "rotateX(0deg) translateZ(0px)")
              }
            >
              {/* Fake Browser Toolbar */}
              <div className="h-10 bg-[#09090b] border-b border-white/10 flex items-center px-4 gap-2 backdrop-blur-md sticky top-0 z-20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30"></div>
                </div>
                <div className="ml-4 flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-white/5 rounded-full text-[10px] text-gray-500 font-mono border border-white/5 flex items-center gap-2">
                    <Lock size={8} /> cadence.app/dashboard
                  </div>
                </div>
              </div>

              {/* DASHBOARD CONTENT SIMULATION */}
              <div className="p-6 h-full flex gap-6 bg-[#09090b] text-left relative overflow-hidden">
                {/* Background Grid inside App */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]"></div>

                {/* Left Sidebar (Goals) */}
                <div className="w-60 hidden md:flex flex-col gap-6 border-r border-white/5 pr-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-4 px-2">
                      <Calendar size={14} />{" "}
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Today's Focus
                      </span>
                    </div>
                    <div className="space-y-2">
                      {/* Goal Items */}
                      {[
                        { name: "LeetCode Daily", cat: "Code", color: "bg-blue-500" },
                        { name: "System Design", cat: "Study", color: "bg-purple-500" },
                        { name: "Morning Run", cat: "Fitness", color: "bg-green-500" },
                        { name: "Read 30 mins", cat: "Mind", color: "bg-orange-500" },
                      ].map((goal, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors group/item cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${goal.color} shadow-[0_0_8px_currentColor]`}
                            ></div>
                            <span className="text-sm text-gray-300 group-hover/item:text-white">
                              {goal.name}
                            </span>
                          </div>
                          <div className="w-5 h-5 rounded-md border border-white/20 group-hover/item:border-fuchsia-500/50 flex items-center justify-center"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-4 px-2">
                      <PenTool size={14} />{" "}
                      <span className="text-xs font-bold uppercase tracking-wider">Reflection</span>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/5 p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                      <div className="w-full h-2 bg-white/10 rounded mb-3"></div>
                      <div className="w-3/4 h-2 bg-white/10 rounded mb-3"></div>
                      <div className="w-1/2 h-2 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Main Content (Heatmap Visual) */}
                <div className="flex-1 relative z-10">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-1">Activity</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">You're on a</span>
                        <span className="text-fuchsia-400 font-bold">12 day streak!</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1.5 shadow-[0_0_15px_-5px_rgba(74,222,128,0.5)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        On Track
                      </div>
                    </div>
                  </div>

                  {/* The Heatmap Grid Simulation */}
                  <div className="p-6 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-sm">
                    <div className="grid grid-cols-12 gap-2">
                      {Array.from({ length: 84 }).map((_, i) => {
                        // Randomly generating "activity" levels for the visual
                        const level =
                          Math.random() > 0.7
                            ? 3
                            : Math.random() > 0.4
                              ? 2
                              : Math.random() > 0.2
                                ? 1
                                : 0;
                        const colors = [
                          "bg-white/5 border border-transparent",
                          "bg-violet-900/40 border border-violet-500/20",
                          "bg-violet-600/60 border border-violet-500/40 shadow-[0_0_10px_rgba(124,58,237,0.2)]",
                          "bg-fuchsia-500 border border-fuchsia-400/50 shadow-[0_0_15px_rgba(217,70,239,0.4)]",
                        ];
                        return (
                          <div
                            key={i}
                            className={`aspect-square rounded-md ${colors[level]} transition-all duration-300 hover:scale-125 hover:z-10 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
                        Completion Rate
                      </div>
                      <div className="text-2xl font-mono font-bold text-white">87%</div>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
                        Total Goals
                      </div>
                      <div className="text-2xl font-mono font-bold text-white">1,240</div>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
                        Current Mood
                      </div>
                      <div className="text-2xl font-mono font-bold text-white flex items-center gap-2">
                        ⚡️ Focused
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE FEATURES SECTION */}
      <section className="py-32 bg-black relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] opacity-20 mask-image:radial-gradient(ellipse_at_center,black,transparent)"></div>
        <InteractiveFeatures />
      </section>

      {/* 3. KEYBOARD MASTERY SECTION */}
      <KeyboardMastery />

      {/* 4. PRICING SECTION */}
      <Pricing />

      {/* 5. FOOTER */}
      <footer className="border-t border-white/10 bg-black pt-20 pb-10 relative overflow-hidden">
        {/* Footer Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/image.png" alt="Cadence Logo" className="w-8 h-8 object-contain" />
            <span className="text-white font-bold text-xl tracking-tight">Cadence</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-fuchsia-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-fuchsia-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-fuchsia-400 transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-fuchsia-400 transition-colors">
              GitHub
            </a>
          </div>
        </div>
        <div className="text-center mt-10 text-gray-600 text-xs">
          © {new Date().getFullYear()} Cadence. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// --- MAIN LANDING PAGE WITH INTRO ---
const LandingPageWithIntro = () => {
  const [showIntro, setShowIntro] = useState(() => {
    // Check if user has seen intro before
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    return !hasSeenIntro;
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroOverlay onComplete={handleIntroComplete} />}
      <LandingPage />
    </>
  );
};

export default LandingPageWithIntro;
