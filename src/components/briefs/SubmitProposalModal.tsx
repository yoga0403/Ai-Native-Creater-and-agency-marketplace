"use client";

import React, { useState } from "react";
import { X, Send, DollarSign, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { BrandBrief } from "@/types";
import { Button } from "@/components/ui/Button";

interface SubmitProposalModalProps {
  brief: BrandBrief | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (pitchData: { proposedAmount: number; estimatedDays: number; coverPitch: string }) => void;
}

export const SubmitProposalModal: React.FC<SubmitProposalModalProps> = ({
  brief,
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [proposedAmount, setProposedAmount] = useState(brief?.budgetMin || 1000);
  const [estimatedDays, setEstimatedDays] = useState(4);
  const [coverPitch, setCoverPitch] = useState(
    "I have custom-trained LoRAs and a specialized ComfyUI upscale workflow that ensures 100% product fidelity and lighting continuity across all 5 requested assets. Raw seeds and workflow JSON will be included in the milestone delivery."
  );
  const [guaranteeWorkflow, setGuaranteeWorkflow] = useState(true);

  if (!isOpen || !brief) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSuccess({
      proposedAmount: Number(proposedAmount),
      estimatedDays: Number(estimatedDays),
      coverPitch,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#0D121D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111724]">
          <div>
            <h3 className="font-bold text-white text-lg">Submit Pitch to Brief</h3>
            <p className="text-xs text-indigo-300 mt-0.5 truncate max-w-sm">{brief.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Client Budget</span>
              <span className="text-emerald-400 font-mono font-bold">${brief.budgetMin} - ${brief.budgetMax} USD</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Required Tools</span>
              <span className="text-slate-200 font-mono">{brief.requiredTools.join(", ")}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Your Proposed Escrow Bid ($)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={100}
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(Number(e.target.value))}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl p-2.5 pl-7 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
                <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Estimated Turnaround (Days)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(Number(e.target.value))}
                  className="w-full bg-[#080B12] border border-white/10 rounded-xl p-2.5 pl-7 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Your Technical Approach & Workflow Strategy</label>
            <textarea
              required
              rows={4}
              value={coverPitch}
              onChange={(e) => setCoverPitch(e.target.value)}
              className="w-full bg-[#080B12] border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              placeholder="Explain how you will guarantee visual consistency, what models you will deploy, and your revision policy..."
            />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/30">
            <input
              type="checkbox"
              checked={guaranteeWorkflow}
              onChange={(e) => setGuaranteeWorkflow(e.target.checked)}
              className="mt-0.5 rounded border-indigo-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-[11px] text-indigo-200 leading-tight">
              <strong className="text-white block mb-0.5">Prompt & Seed Guarantee</strong>
              I agree to provide generation parameters, positive/negative prompts, and raw seeds for all approved deliverables.
            </span>
          </label>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" icon={<Send className="w-4 h-4" />}>
              Submit Proposal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
