import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ onGetStarted, onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-white font-semibold text-xl tracking-tight">Cadence</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {["Features", "Manifesto", "Pricing", "Blog"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onLogin}
              className="text-gray-300 hover:text-white font-medium text-sm transition-colors"
            >
              Login
            </button>
            <button
              onClick={onGetStarted}
              className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {["Features", "Manifesto", "Pricing", "Blog"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {item}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={onLogin}
                className="text-gray-300 hover:text-white font-medium text-sm"
              >
                Login
              </button>
              <button
                onClick={onGetStarted}
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
