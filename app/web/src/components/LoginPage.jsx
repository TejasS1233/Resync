import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Breadcrumbs from "./Breadcrumbs";
import { Mail, Lock, ArrowRight, Github, Chrome, Eye, EyeOff } from "lucide-react";

// --- 1. IMMERSIVE VISUAL SIDE (Shared) ---
const VisualSide = () => {
  return (
    <div className="hidden lg:flex w-[500px] h-[500px] relative overflow-hidden items-center justify-center flex-shrink-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>

      <div className="relative w-[600px] h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
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

          <p className="text-xl font-medium text-white/70 tracking-wider">
            Track. Execute. Journal.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- 2. FORM COMPONENTS ---
const InputField = ({ label, type, placeholder, icon: Icon, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

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
          className="w-full bg-transparent border-none p-3.5 text-white placeholder-gray-600 focus:outline-none focus:ring-0 text-sm autofill:bg-transparent autofill:text-white"
          style={{
            WebkitBoxShadow: "0 0 0 1000px transparent inset",
            WebkitTextFillColor: "white",
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
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

// --- 3. LOGIN PAGE COMPONENT ---
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  useEffect(() => setMounted(true), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Ambient gradients */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px]"></div>

      {/* Breadcrumbs */}
      <div className="max-w-7xl w-full mx-auto px-6 pt-6 relative z-10">
        <Breadcrumbs />
      </div>

      {/* Content Container */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="flex items-center justify-center gap-16 w-full max-w-7xl">
          {/* CENTER: LOGIN FORM */}
          <div className="w-full max-w-md flex-shrink-0 relative z-10">
            {/* Logo Area */}
            <Link to="/" className="mb-12 flex items-center gap-3 w-fit">
              <img
                src="/image.png"
                alt="Resync Logo"
                className="w-10 h-10 object-contain hover:scale-105 transition-transform"
              />
              <span className="text-2xl font-bold tracking-tight text-white">Resync</span>
            </Link>

            {/* Animated Form Container */}
            <div
              className={`transition-all duration-700 ease-out ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  Welcome back.
                </h1>
                <p className="text-gray-400 text-lg">Enter your coordinates to resume.</p>
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
              <form className="space-y-5" onSubmit={handleLogin}>
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />

                <div>
                  <InputField
                    label="Password"
                    type="password"
                    placeholder="••••••••••••"
                    icon={Lock}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                  <div className="flex justify-end mt-2">
                    <a
                      href="#"
                      className="text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group relative py-4 rounded-xl bg-white text-black font-bold text-lg overflow-hidden transition-transform active:scale-[0.98] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-200 via-fuchsia-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? "Signing in..." : "Sign In"}
                    {!isLoading && (
                      <ArrowRight
                        size={20}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    )}
                  </span>
                </button>
              </form>

              {/* Signup Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-white font-bold hover:underline underline-offset-4 decoration-fuchsia-500"
                  >
                    Sign up for free
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: VISUAL */}
          <VisualSide />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
