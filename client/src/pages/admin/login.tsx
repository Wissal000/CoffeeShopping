import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Coffee, Lock, Mail } from "lucide-react";

const API = "http://localhost:8000";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/admin/login`, form);

      // store token
      localStorage.setItem("token", res.data.token);

      toast.success("Welcome back");

      navigate("/admin");
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0705] text-white relative overflow-hidden">
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,200,0,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,120,0,0.08),transparent_40%)]" />

      {/* FLOATING GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-3xl top-[-150px] left-[-150px]" />
        <div className="absolute w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-3xl bottom-[-150px] right-[-150px]" />
      </div>

      {/* CARD */}
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md p-8 rounded-[28px]
      bg-gradient-to-b from-white/[0.08] to-white/[0.02]
      border border-white/10 backdrop-blur-2xl
      shadow-[0_20px_60px_rgba(0,0,0,0.6)]
      space-y-6"
      >
        {/* TOP LIGHT EFFECT */}
        <div className="absolute inset-0 rounded-[28px] pointer-events-none border border-white/5" />

        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="relative p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/20">
              <Coffee className="text-yellow-400" size={22} />
              <div className="absolute inset-0 rounded-2xl bg-yellow-400/10 blur-xl" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome Back
          </h1>

          <p className="text-gray-400 text-sm">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* EMAIL */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Email</label>

          <div
            className="flex items-center gap-2 px-3 py-3 rounded-xl
        bg-white/[0.03] border border-white/10
        focus-within:border-yellow-400 focus-within:bg-white/[0.05]
        transition-all"
          >
            <Mail size={16} className="text-gray-400" />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@mail.com"
              className="w-full bg-transparent outline-none text-sm placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Password</label>

          <div
            className="flex items-center gap-2 px-3 py-3 rounded-xl
        bg-white/[0.03] border border-white/10
        focus-within:border-yellow-400 focus-within:bg-white/[0.05]
        transition-all"
          >
            <Lock size={16} className="text-gray-400" />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none text-sm placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-3 rounded-xl overflow-hidden
  bg-white/[0.08] backdrop-blur-xl
  border border-white/20
  text-white font-medium
  shadow-[0_8px_30px_rgba(0,0,0,0.5)]
  hover:bg-white/[0.12] hover:border-white/30
  active:scale-95
  transition-all duration-200"
        >
          {/* LIGHT REFLECTION */}
          <span className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-40 pointer-events-none" />

          {/* HOVER GLOW */}
          <span className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 bg-white/10 blur-xl" />

          {/* TEXT */}
          <span className="relative z-10">
            {loading ? "Signing in..." : "Sign In"}
          </span>
        </button>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-500">
          🔒 Secure admin access only
        </p>
      </motion.form>
    </div>
  );
}
