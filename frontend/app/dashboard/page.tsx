"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { ME_QUERY, GROUPS_QUERY } from "@/graphql/queries";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock, ArrowUpRight, Loader2, Plus, Users, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { data: userData, loading: userLoading } = useQuery(ME_QUERY);
  const { data: groupsData, loading: groupsLoading } = useQuery(GROUPS_QUERY);

  if (userLoading || groupsLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!userData?.me) {
    router.replace("/login");
    return null;
  }

  const user = userData.me;
  const groups = groupsData?.allGroups || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-zinc-500 text-sm">Here's a breakdown of your split expenses.</p>
        </div>
        <Link href="/dashboard/groups/new" className="btn-primary flex items-center gap-2 justify-center">
          <Plus className="w-4 h-4" />
          Create New Group
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Balance" 
          amount="$0.00" 
          trend="0%" 
          isPositive={true} 
          icon={<ArrowUpRight className="w-5 h-5 text-indigo-400" />}
        />
        <StatCard 
          title="You are owed" 
          amount="$0.00" 
          trend="0%" 
          isPositive={true}
          icon={<TrendingUp className="w-5 h-5 text-green-400" />}
        />
        <StatCard 
          title="You owe" 
          amount="$0.00" 
          trend="0%" 
          isPositive={false}
          icon={<TrendingDown className="w-5 h-5 text-red-400" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Groups Section */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Your Active Groups
            </h2>
            <Link href="/dashboard/groups" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">See all</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.length > 0 ? (
              groups.map((group: any) => (
                <Link key={group.id} href={`/dashboard/groups/${group.id}`}>
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="glass-card p-5 border-white/5 bg-zinc-900/40 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10">
                        {group.name.charAt(0)}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-zinc-600 bg-white/5 py-1 px-2 rounded-md">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-bold mb-1">{group.name}</h4>
                    <p className="text-xs text-zinc-500 line-clamp-1">{group.description || "No description provided."}</p>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center glass-card border-dashed">
                <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">You haven't joined any groups yet.</p>
                <Link href="/dashboard/groups/new" className="text-indigo-400 text-sm font-bold mt-2 inline-block">Create your first trip!</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Mini-Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Activity
          </h2>
          <div className="glass-card p-6 min-h-[400px]">
             {/* Activity items would go here */}
             <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <Receipt className="w-10 h-10 text-zinc-800 mb-4" />
                <p className="text-zinc-600 text-sm italic">No recent activity found.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, amount, trend, isPositive, icon }: any) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="glass-card p-6 border-white/5 bg-zinc-900/40"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{title}</span>
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 shadow-inner">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold tracking-tight">{amount}</span>
        <span className={`text-[10px] font-bold mb-2 py-0.5 px-2 rounded-full ${
          isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
        }`}>
          {trend}
        </span>
      </div>
    </motion.div>
  );
}
