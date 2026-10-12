"use client";

import React from "react";
import { Star, ShieldCheck, ArrowRight, Eye, Sparkles } from "lucide-react";
import { CreatorProfile, PortfolioItem } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface CreatorCardProps {
  creator: CreatorProfile;
  onSelectPortfolioItem: (item: PortfolioItem) => void;
  onHireCreator: (creator: CreatorProfile) => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  onSelectPortfolioItem,
  onHireCreator,
}) => {
  return (
    <div className="glass-surface glass-surface-hover rounded-2xl p-5 flex flex-col justify-between gap-5 border border-white/5 relative group overflow-hidden">
      {/* Top Bar: Creator Info & Rating */}
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-13 h-13 rounded-xl object-cover ring-2 ring-indigo-500/30"
              />
              {creator.isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#0A0D14] text-emerald-400"
                  title="Verified AI Creator"
                >
                  <ShieldCheck className="w-4 h-4 fill-emerald-500/20 text-emerald-400" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-white text-base tracking-tight group-hover:text-indigo-300 transition-colors">
                  {creator.name}
                </h3>
              </div>
              <p className="text-xs text-slate-400">@{creator.handle} • {creator.location}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{creator.rating}</span>
            <span className="text-slate-400 text-[10px]">({creator.completedBriefs})</span>
          </div>
        </div>

        {/* Headline */}
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {creator.headline}
        </p>

        {/* AI Tools Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {creator.tools.slice(0, 3).map((tool, idx) => (
            <Badge key={idx} variant="tool" size="sm">
              {tool}
            </Badge>
          ))}
          {creator.tools.length > 3 && (
            <span className="text-[11px] text-slate-400 font-mono">
              +{creator.tools.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Portfolio Thumbnails Row with Quick-Inspect Overlay */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Click to inspect prompt receipt:
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {creator.portfolio.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPortfolioItem(item)}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group/thumb border border-white/5 bg-slate-900"
              title={`Inspect: ${item.title}`}
            >
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 text-center">
                <Eye className="w-4 h-4 text-white mb-0.5" />
                <span className="text-[9px] text-indigo-200 font-mono line-clamp-1">{item.model}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Pricing & CTA */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-400 block">Rate</span>
          <span className="text-sm font-bold text-white font-mono">${creator.hourlyRate}</span>
          <span className="text-xs text-slate-400 font-mono">/hr</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onHireCreator(creator)}
          icon={<ArrowRight className="w-3.5 h-3.5 text-indigo-400" />}
        >
          Hire Creator
        </Button>
      </div>
    </div>
  );
};
