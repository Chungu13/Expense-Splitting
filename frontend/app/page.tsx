"use client";
import React from "react";
import { motion } from "framer-motion";
import { Wallet, Users, Receipt, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-20">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-400 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Introducing SmartSplit AI
        </div>
        
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]">
          Smarter, Simpler <br />
          <span className="gradient-text">Splitting.</span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          The only expense tracker that understands your lifestyle. Automatic receipts, 
          instant AI categorization, and frictionless settling.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="btn-primary flex items-center gap-2 group w-full sm:w-auto justify-center">
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="https://github.com/Chungu13/Expense-Splitting" 
            target="_blank"
            className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Github className="w-4 h-4" />
            Star on GitHub
          </a>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full z-10 px-4">
        <FeatureCard 
          icon={<Receipt className="w-6 h-6 text-indigo-400" />}
          title="AI Receipt Scanning"
          description="Snap a photo and let AI handle the heavy lifting. Categorization happens in milliseconds."
        />
        <FeatureCard 
          icon={<Users className="w-6 h-6 text-blue-400" />}
          title="Group Management"
          description="Collaborate with friends on trips, dinners, and events with real-time sync."
        />
        <FeatureCard 
          icon={<Wallet className="w-6 h-6 text-purple-400" />}
          title="One-Tap Settling"
          description="Integrated debt tracking and simpler payment flows that actually make sense."
        />
      </div>

      <footer className="mt-40 text-zinc-600 text-sm z-10">
        © 2024 SmartSplit. Built for the modern spender.
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.2)" }}
      className="glass-card p-8 flex flex-col gap-4 transition-colors"
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
}
