"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Chrome, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "@/graphql/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: () => {
      // Backend sets the HTTP-only cookie, so we can just redirect
      router.replace("/dashboard");
    },
    onError: (err) => {
      setError(err.message || "Invalid email or password");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    login({ variables: { email, password } });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4 page-transition">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 flex flex-col gap-8 shadow-indigo-500/5 shadow-2xl bg-zinc-900/40 backdrop-blur-2xl border-white/5"
      >
        <div className="text-center">
          <Link href="/" className="gradient-text text-2xl font-bold mb-2 inline-block italic tracking-tighter">
            SmartSplit.
          </Link>
          <h2 className="text-2xl font-bold mt-2">Welcome back</h2>
          <p className="text-zinc-500 text-sm mt-1">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <div className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-white placeholder:text-zinc-600"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-4">
          <div className="relative flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <button 
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-zinc-800 bg-zinc-800/20 hover:bg-zinc-800/50 text-white transition-all active:scale-[0.98]"
          >
            <Chrome className="w-5 h-5 text-indigo-400" />
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
