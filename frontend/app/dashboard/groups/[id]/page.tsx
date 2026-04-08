"use client";
import React, { useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { GROUP_DETAIL_QUERY } from "@/graphql/queries";
import { ADD_MEMBER_MUTATION, REMOVE_MEMBER_MUTATION } from "@/graphql/groups";
import { CREATE_EXPENSE_MUTATION } from "@/graphql/expenses";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Receipt, 
  UserPlus, 
  Plus, 
  Loader2, 
  ArrowLeft, 
  X, 
  Trash2,
  Calendar,
  DollarSign
} from "lucide-react";
import Link from "next/link";

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = parseInt(params.id as string);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const { data, loading, error, refetch } = useQuery(GROUP_DETAIL_QUERY, {
    variables: { id: groupId }
  });

  const [addMember, { loading: addLoading }] = useMutation(ADD_MEMBER_MUTATION, {
    onCompleted: () => {
      setNewMemberEmail("");
      setIsAddMemberOpen(false);
      refetch();
    }
  });

  const [createExpense, { loading: expLoading }] = useMutation(CREATE_EXPENSE_MUTATION, {
    onCompleted: () => {
      setExpenseDesc("");
      setExpenseAmount("");
      setIsAddExpenseOpen(false);
      refetch();
    }
  });

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (error) return <div className="p-8 text-red-500">Error loading group: {error.message}</div>;

  const group = data?.groupById;

  return (
    <div className="max-w-6xl mx-auto space-y-8 page-transition pb-20">
      <Link href="/dashboard/groups" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" />
        All Groups
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 italic">{group.name}</h1>
          <p className="text-zinc-500 max-w-xl">{group.description || "Track your shared adventures here."}</p>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={() => setIsAddMemberOpen(true)}
              className="btn-secondary flex items-center gap-2 py-2.5 px-4 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Invite
            </button>
            <button 
              onClick={() => setIsAddExpenseOpen(true)}
              className="btn-primary flex items-center gap-2 py-2.5 px-6 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expense List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            Expenses
          </h2>
          
          <div className="space-y-3">
            {group.expenses.length > 0 ? (
              group.expenses.map((exp: any) => (
                <div key={exp.id} className="glass-card p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-white/5 bg-zinc-900/40">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-tight">{exp.description}</h4>
                      <p className="text-[10px] text-zinc-500">Paid by {exp.payer.username} • {new Date(exp.dateIncurred).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white">${parseFloat(exp.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center glass-card border-dashed">
                <Receipt className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm italic">No expenses recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Members */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Members
          </h2>
          <div className="glass-card p-6 bg-zinc-900/60 divide-y divide-white/5">
            {group.members.map((member: any) => (
              <div key={member.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                    {member.user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">{member.user.username}</p>
                    <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{member.role}</span>
                  </div>
                </div>
                {member.role !== "ADMIN" && (
                   <button className="p-1.5 text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 className="w-4 h-4" />
                   </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isAddMemberOpen && (
          <Modal title="Invite Member" onClose={() => setIsAddMemberOpen(false)}>
            <div className="space-y-4">
               <p className="text-sm text-zinc-500">Enter the email address of the friend you want to invite to {group.name}.</p>
               <input 
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 px-4 focus:ring-1 focus:ring-indigo-500 text-sm outline-none"
               />
               <button 
                 onClick={() => addMember({ variables: { groupId, email: newMemberEmail } })}
                 disabled={!newMemberEmail || addLoading}
                 className="btn-primary w-full flex items-center justify-center gap-2"
               >
                 {addLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                 Send Invite
               </button>
            </div>
          </Modal>
        )}

        {isAddExpenseOpen && (
          <Modal title="New Expense" onClose={() => setIsAddExpenseOpen(false)}>
            <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">What is this for?</label>
                 <input 
                    type="text"
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                    placeholder="e.g. Dinner, Uber, Tickets"
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 px-4 focus:ring-1 focus:ring-indigo-500 text-sm outline-none"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Total Amount</label>
                 <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                        type="number"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-indigo-500 text-sm outline-none"
                    />
                 </div>
               </div>
               <button 
                 onClick={() => createExpense({ 
                   variables: { 
                     description: expenseDesc, 
                     amount: expenseAmount,
                     groupId: groupId,
                     splitType: "EQUAL" // Defaulting to Equal for simplicity in this step
                   } 
                 })}
                 disabled={!expenseDesc || !expenseAmount || expLoading}
                 className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
               >
                 {expLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                 Add to Group
               </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, children, onClose }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="glass-card w-full max-w-md p-8 bg-zinc-900 border-white/5 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-6 italic tracking-tight">{title}</h2>
        {children}
      </motion.div>
    </motion.div>
  );
}
