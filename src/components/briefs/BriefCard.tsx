"use client";

import React from "react";
import { Calendar, DollarSign, Layers, Send, Sparkles, ShieldCheck } from "lucide-react";
import { BrandBrief } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface BriefCardProps {
  brief: BrandBrief;
  onSubmitProposal: (brief: BrandBrief) => void;
}

export const BriefCard: React.FC<BriefCardProps> = ({ brief, onSubmitProposal }) => {
  return (
    <div className="glass-surface glass-surface-hover rounded-2xl p-6 flex flex-col justify-between gap-5 border border-white/5 relative group">
      {/* Top Bar: Brand info & Category */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <img
              src={brief.brandLogo}
              alt={brief.brandName}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
            />
            <div>
              <span className="font-semibold text-white text-sm block">{brief.brandName}</span>
              <span className="text-[11px] text-slate-400">{brief.brandIndustry}</span>
            </div>
          </div>
          <Badge variant="cyan">{brief.category}</Badge>
        </div>

        {/* Brief Title */}
        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
          {brief.title}
        </h3>

        {/* Brief Description */}
        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
          {brief.description}
        </p>

        {/* Deliverable Specifications Pill Bar */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Deliverables</span>
            <span className="text-slate-200 font-mono font-medium">{brief.deliverablesCount} Assets</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Aspect Ratio</span>
            <span className="text-slate-200 font-mono font-medium">{brief.aspectRatio}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[10px] uppercase">Resolution</span>
            <span className="text-slate-200 font-mono font-medium">{brief.resolution}</span>
          </div>
        </div>

        {/* Required Tools */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400">Required:</span>
          {brief.requiredTools.map((tool, idx) => (
            <Badge key={idx} variant="tool" size="sm">
              {tool}
            </Badge>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Budget, Deadline & CTA */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <span className="text-xs text-slate-400 block">Escrow Budget</span>
          <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono text-base">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>${brief.budgetMin} - ${brief.budgetMax}</span>
          </div>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3" /> Due {brief.deadline}
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Send className="w-3.5 h-3.5" />}
          onClick={() => onSubmitProposal(brief)}
        >
          Submit Pitch
        </Button>
      </div>
    </div>
  );
};
