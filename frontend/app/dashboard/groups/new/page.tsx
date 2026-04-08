"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { CREATE_GROUP_MUTATION } from "@/graphql/groups";
import { GROUPS_QUERY } from "@/graphql/queries";
import { useRouter } from "next/navigation";

export default function NewGroupPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [createGroup, { loading, error }] = useMutation(CREATE_GROUP_MUTATION, {
    refetchQueries: [{ query: GROUPS_QUERY }],
    onCompleted: () => {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/groups"), 2000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    createGroup({ variables: { name, description } });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 page-transition">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="glass-card p-10 bg-zinc-900/40 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full" />

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Users className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold italic tracking-tight">Create a new group</h1>
            <p className="text-sm text-zinc-500">Organize expenses for trips, housemates, or events.</p>
          </div>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 flex flex-col items-center text-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">Group Created Successfully!</h3>
            <p className="text-zinc-500 text-sm">Redirecting you to your groups...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error.message}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Group Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Summer Vacation, Road Trip"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Description (Optional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this group for?"
                rows={4}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white placeholder:text-zinc-700 resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={loading || !name}
              className="btn-primary w-full py-4 text-base font-bold tracking-wide flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Creating Group..." : "Start This Group"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
