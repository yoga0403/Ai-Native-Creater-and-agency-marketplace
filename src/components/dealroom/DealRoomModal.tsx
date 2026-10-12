"use client";

import React, { useState } from "react";
import { X, ShieldCheck, CheckCircle2, DollarSign, Clock, MessageSquare, AlertCircle } from "lucide-react";
import { ProjectContract } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface DealRoomModalProps {
  project: ProjectContract | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DealRoomModal: React.FC<DealRoomModalProps> = ({ project, isOpen, onClose }) => {
  const [activeProject, setActiveProject] = useState<ProjectContract | null>(project);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [showRevisionBox, setShowRevisionBox] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen || !activeProject) return null;

  const handleApproveMilestone = (milestoneId: string) => {
    setActiveProject({
      ...activeProject,
      milestones: activeProject.milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: "approved" as const } : m
      ),
    });
    setSuccessToast("Milestone #2 approved! $800 released from escrow to Marcus Vance.");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleRequestRevision = (milestoneId: string) => {
    if (!revisionNotes.trim()) return;
    setActiveProject({
      ...activeProject,
      milestones: activeProject.milestones.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              status: "in_progress" as const,
              clientFeedback: revisionNotes,
            }
          : m
      ),
    });
    setShowRevisionBox(false);
    setRevisionNotes("");
    setSuccessToast("Revision requested. Creator notified with prompt adjustments.");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-[#0D121D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111724]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{activeProject.briefTitle}</h3>
                <Badge variant="emerald">Escrow Funded</Badge>
              </div>
              <p className="text-xs text-slate-400">
                Brand: <strong className="text-slate-200">{activeProject.brandName}</strong> • Creator:{" "}
                <strong className="text-indigo-300">@{activeProject.creatorName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successToast && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-6 py-2.5 text-xs text-emerald-200 flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Escrow Summary Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Contract Escrow</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                ${activeProject.totalBudget} USD
              </span>
            </div>
            <div className="text-xs text-slate-300 max-w-sm leading-relaxed">
              Funds are held securely by CreatorConnect AI escrow and released incrementally upon client sign-off of prompt & raw asset outputs.
            </div>
          </div>

          {/* Milestones List */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Milestone Deliverable Track</h4>

            {activeProject.milestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-5 rounded-xl bg-[#090C12] border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-mono font-bold">
                      {idx + 1}
                    </span>
                    <h5 className="font-semibold text-white text-sm">{m.title}</h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-200">${m.amount} USD</span>
                    {m.status === "approved" && <Badge variant="emerald">Approved & Paid</Badge>}
                    {m.status === "submitted" && <Badge variant="amber">Review Required</Badge>}
                    {m.status === "in_progress" && <Badge variant="cyan">In Progress</Badge>}
                  </div>
                </div>

                <p className="text-xs text-slate-400">{m.description}</p>

                {/* Deliverable preview if submitted or approved */}
                {m.deliverableUrl && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={m.deliverableUrl}
                      alt={m.title}
                      className="w-full sm:w-36 h-24 object-cover rounded-lg border border-white/10"
                    />
                    <div className="flex-1 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 font-semibold">Submitted Asset & Prompt Proof</span>
                        <span className="text-[11px] text-slate-400 font-mono">Status: {m.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {m.clientFeedback ? `Feedback: "${m.clientFeedback}"` : "Awaiting review and release."}
                      </p>

                      {/* Action buttons for client review */}
                      {m.status === "submitted" && (
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                            onClick={() => handleApproveMilestone(m.id)}
                          >
                            Approve & Release ${m.amount}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<MessageSquare className="w-3.5 h-3.5" />}
                            onClick={() => setShowRevisionBox(!showRevisionBox)}
                          >
                            Request Variation
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Revision box */}
                {showRevisionBox && m.status === "submitted" && (
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2 text-xs">
                    <label className="text-amber-300 font-semibold block">Specify Prompt / Composition Adjustments:</label>
                    <textarea
                      rows={2}
                      value={revisionNotes}
                      onChange={(e) => setRevisionNotes(e.target.value)}
                      placeholder="e.g. Please adjust the lighting to be warmer and reduce the lens flare in the background..."
                      className="w-full bg-[#080B12] border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowRevisionBox(false)}>
                        Cancel
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleRequestRevision(m.id)}>
                        Send Feedback
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#111724] flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Protected by CreatorConnect AI Smart Escrow Protocol
          </span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Deal Room
          </Button>
        </div>
      </div>
    </div>
  );
};
