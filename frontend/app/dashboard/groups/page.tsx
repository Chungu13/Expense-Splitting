"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GROUPS_QUERY } from "@/graphql/queries";
import { motion } from "framer-motion";
import { Users, Plus, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GroupsListPage() {
  const { data, loading, error } = useQuery(GROUPS_QUERY);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const groups = data?.allGroups || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto page-transition">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold italic tracking-tight">Your Groups</h1>
          <p className="text-zinc-500 text-sm">Manage all your shared expenses in one place.</p>
        </div>
        <Link href="/dashboard/groups/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group: any) => (
            <Link key={group.id} href={`/dashboard/groups/${group.id}`}>
              <motion.div 
                whileHover={{ y: -4 }}
                className="glass-card p-6 border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all flex flex-col justify-between h-[180px]"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-600 bg-white/5 py-1 px-3 rounded-full">
                      Member since {new Date(group.createdAt).getFullYear()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{group.name}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-1">{group.description || "No description set."}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <span className="text-[10px] font-medium text-zinc-500">Owed: $0.00</span>
                    <ArrowRight className="w-4 h-4 text-zinc-700" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center glass-card bg-zinc-900/20 border-dashed border-zinc-800">
          <Users className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-2">No groups yet</h2>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto mb-8">
            Create a group for your next trip, dinner party, or household expenses to keep track of who owes what.
          </p>
          <Link href="/dashboard/groups/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
