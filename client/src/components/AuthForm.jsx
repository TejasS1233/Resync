import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Github, Chrome, Eye, EyeOff, Check, Sparkles } from "lucide-react";

// --- 1. IMMERSIVE VISUAL SIDE (RIGHT) ---
const VisualSide = () => {
  return (
    <div className="hidden lg:flex flex-1 relative bg-black overflow-hidden items-center justify-center">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-black"></div>

      {/* Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      {/* THE "RHYTHM CORE" ANIMATION */}
      <div className="relative w-[600px] h-[600px] flex items-center justify-center">
        {/* Outer Rings */}
        <div className="absolute inset-0 border border-violet-500/10 rounded-full animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute inset-20 border border-fuchsia-500/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
        <div className="absolute inset-40 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>

        {/* Glowing Orbs (Planets) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 bg-fuchsia-500 rounded-full blur-[2px] shadow-[0_0_20px_#d946ef] animate-[spin_6s_linear_infinite] origin-[50%_300px]"></div>

        {/* Central Pillar (The Monogram) */}
        <div className="relative z-10 flex gap-2 items-end h-64 w-64 justify-center pb-12">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-4 bg-gradient-to-t from-fuchsia-600 to-violet-600 rounded-full animate-pulse"
              style={{
                height: `${[40, 70, 100, 60, 90, 50, 30][i]}%`,
                animationDelay: `${i * 0.1}s`,
                boxShadow: "0 0 30px rgba(192,38,211,0.4)",
              }}
            />
          ))}
        </div>

        {/* Floating Quote */}
        <div className="absolute bottom-32 text-center w-full px-12">
          <p className="text-xl font-medium text-white/80 italic font-serif">
            "Consistency is not a sprint.
            <br />
            It's a rhythm."
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 2. FORM COMPONENTS ---
const InputField = ({ label, type, placeholder, icon: Icon, value, onChange, onFocus, onBlur }) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const handleFocus = () => {
    setFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setFocused(false);
    if (onBlur) onBlur();
  };

  return (
    <div className="space-y-1.5 group">
      <label
        className={`text-xs font-bold uppercase tracking-wider transition-colors ${
          focused ? "text-fuchsia-400" : "text-gray-500"
        }`}
      >
        {label}
      </label>
      <div
        className={`relative flex items-center bg-white/5 border rounded-xl transition-all duration-300 ${
          focused
            ? "border-fuchsia-500/50 bg-white/10 shadow-[0_0_20px_rgba(217,70,239,0.15)]"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        <div className="pl-4 text-gray-500 group-hover:text-gray-300 transition-colors">
          <Icon size={18} />
        </div>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border-none p-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-0 text-sm"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-gray-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

const SocialButton = ({ icon: Icon, label }) => (
  <button
    type="button"
    className="flex-1 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl py-3 transition-all group"
  >
    <Icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
    <span className="text-sm font-medium text-gray-300 group-hover:text-white">{label}</span>
  </button>
);

// --- 3. MAIN AUTH PAGE ---
const AuthForm = ({ onClose }) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form data states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await register(registerData.name, registerData.email, registerData.password);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Password validation indicators
  const passwordValidation = {
    length: registerData.password.length >= 8,
    number: /\d/.test(registerData.password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(registerData.password),
  };

  return (
    <div className="min-h-screen bg-black text-white flex font-sans selection:bg-fuchsia-500/30">
      {/* LEFT SIDE: CONTROL PANEL */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-20 xl:px-32 relative z-10 max-w-2xl mx-auto lg:mx-0 w-full">
        {/* Logo Area */}
        <div className="mb-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Resync</span>
        </div>

        {/* Animated Form Container */}
        <div
          className={`transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              {isLogin ? "Welcome back." : "Start your streak."}
            </h1>
            <p className="text-gray-400 text-lg">
              {isLogin ? "Enter your coordinates to resume." : "Join the obsessively consistent."}
            </p>
          </div>

          {/* Social Auth */}
          <div className="flex gap-4 mb-8">
            <SocialButton icon={Github} label="GitHub" />
            <SocialButton icon={Chrome} label="Google" />
          </div>

          <div className="relative flex items-center gap-4 mb-8">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Or continue with email
            </span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          {/* Form Fields */}
          <form className="space-y-5" onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                <InputField
                  label="Full Name"
                  type="text"
                  placeholder="Alex Developer"
                  icon={Sparkles}
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                />
              </div>
            )}

            <InputField
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={isLogin ? loginData.email : registerData.email}
              onChange={(e) =>
                isLogin
                  ? setLoginData({ ...loginData, email: e.target.value })
                  : setRegisterData({ ...registerData, email: e.target.value })
              }
            />

            <div>
              <InputField
                label="Password"
                type="password"
                placeholder="••••••••••••"
                icon={Lock}
                value={isLogin ? loginData.password : registerData.password}
                onChange={(e) =>
                  isLogin
                    ? setLoginData({ ...loginData, password: e.target.value })
                    : setRegisterData({ ...registerData, password: e.target.value })
                }
              />
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <a
                    href="#"
                    className="text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              )}
            </div>

            {/* Validation (Signup Only) */}
            {!isLogin && (
              <div className="flex gap-3 text-xs text-gray-500 animate-in fade-in">
                <div
                  className={`flex items-center gap-1 ${
                    passwordValidation.length ? "text-emerald-400" : ""
                  }`}
                >
                  <Check size={12} /> 8+ chars
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    passwordValidation.number ? "text-emerald-400" : ""
                  }`}
                >
                  <div className="w-1 h-1 rounded-full bg-gray-600" /> 1 number
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    passwordValidation.symbol ? "text-emerald-400" : ""
                  }`}
                >
                  <div className="w-1 h-1 rounded-full bg-gray-600" /> 1 symbol
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative py-4 rounded-xl bg-white text-black font-bold text-lg overflow-hidden transition-transform active:scale-[0.98] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-200 via-fuchsia-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                {!isLoading && (
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                )}
              </span>
            </button>
          </form>

          {/* Toggle Switch */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white font-bold hover:underline underline-offset-4 decoration-fuchsia-500"
              >
                {isLogin ? "Sign up for free" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: VISUAL */}
      <VisualSide />
    </div>
  );
};

export default AuthForm;
