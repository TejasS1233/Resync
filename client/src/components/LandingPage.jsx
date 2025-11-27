import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  const finalText = "RESYNC";
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
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstallButton(false);
    }

    setDeferredPrompt(null);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-0.5 cursor-pointer group">
            <img
              src="/image.png"
              alt="Resync Logo"
              className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-white font-bold text-xl tracking-tight group-hover:text-fuchsia-100 transition-colors">
              Resync
            </span>
          </Link>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Install App
              </button>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  {user?.name || "Profile"}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
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
                <span>resync status</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-blue-500">➜</span>
                <span className="text-cyan-400">~</span>
                <span className="text-white">resync log "Deep Work" --time=60m</span>
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
            Resync is built for flow. Toggle dark mode, log a habit, or check your stats instantly
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

// --- COMMUNITY SECTION ---
const CommunitySection = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-[#050505] flex items-center justify-center">
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_80%)] pointer-events-none"></div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

      {/* --- MAIN CARD CONTAINER --- */}
      <div className="relative z-10 w-full max-w-5xl px-6">
        <div className="relative group rounded-3xl p-[1px] overflow-hidden">
          {/* Animated Border Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-fuchsia-500/50 transition-all duration-1000 rotate-[20deg] translate-x-[-100%] group-hover:translate-x-[100%] w-[200%] h-[200%]"></div>
          <div className="absolute inset-0 bg-white/5 rounded-3xl border border-white/10"></div>

          {/* Card Content */}
          <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-12 md:p-20 text-center overflow-hidden">
            {/* Decorative 'Terminal' Header */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <span className="text-[10px] font-mono text-gray-500 ml-2">community.jsx</span>
            </div>

            <div className="max-w-3xl mx-auto space-y-8 relative z-10 pt-6">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">
                Build the{" "}
                <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                  future of habit tracking.
                </span>
              </h2>

              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                ReSync is open source and community-driven. Join hundreds of developers optimizing
                their personal runtime. Contribute code, report bugs, or just say hello.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                {/* Primary Button */}
                <a
                  href="https://github.com/TejasS1233/Resync"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] overflow-hidden min-w-[200px]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Terminal size={20} /> Star on GitHub
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-200 to-fuchsia-200 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </a>

                {/* Secondary 'Terminal' Link */}
                <a
                  href="https://github.com/TejasS1233/Resync/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono text-sm border-b border-transparent hover:border-fuchsia-500 pb-0.5"
                >
                  <Terminal size={14} />
                  <span>Submit an Issue</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Background Code Decoration */}
            <div className="absolute -bottom-10 -right-10 text-[10rem] font-black text-white/5 pointer-events-none select-none rotate-[-10deg]">
              {`{ }`}
            </div>
            <div className="absolute top-20 -left-20 text-[8rem] font-black text-white/5 pointer-events-none select-none rotate-[10deg]">
              {`</>`}
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
          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">
            Find your{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              rhythm.
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Resync is the developer-friendly habit tracker. Visualize your progress with heatmaps,
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
                    <Lock size={8} /> resync.app/dashboard
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

      {/* 4. COMMUNITY SECTION */}
      <CommunitySection />

      {/* 5. FOOTER */}
      <footer className="border-t border-white/10 bg-black pt-20 pb-10 relative overflow-hidden">
        {/* Footer Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src="/image.png" alt="Resync Logo" className="w-8 h-8 object-contain" />
            <span className="text-white font-bold text-xl tracking-tight">Resync</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-fuchsia-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-fuchsia-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="text-center mt-10 text-gray-600 text-xs">
          Built by Tejas • © {new Date().getFullYear()} Resync
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
