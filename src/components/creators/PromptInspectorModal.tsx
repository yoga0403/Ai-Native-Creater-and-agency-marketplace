"use client";

import React, { useState } from "react";
import { X, Copy, Check, Sparkles, Terminal, Cpu, Sliders, ExternalLink, ShieldCheck } from "lucide-react";
import { PortfolioItem } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface PromptInspectorModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onCommissionSimilar?: (item: PortfolioItem) => void;
}

export const PromptInspectorModal: React.FC<PromptInspectorModalProps> = ({
  item,
  onClose,
  onCommissionSimilar,
}) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(
      `Positive Prompt:\n${item.prompt}\n\nNegative Prompt:\n${item.negativePrompt || "None"}\n\nModel: ${item.model}\nSeed: ${item.seed || "N/A"}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#0E131E] border border-white/10 rounded-2xl shadow-2xl flex flex-col lg:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-white/10 transition-colors"
          title="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Canvas: High-Resolution Preview */}
        <div className="lg:w-7/12 bg-black flex flex-col items-center justify-center relative min-h-[350px] lg:min-h-[550px] overflow-hidden">
          {/* Background image preview */}
          <img
            src={item.mediaUrl}
            alt={item.title}
            className="w-full h-full object-contain max-h-[600px]"
          />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-slate-300 border border-white/10 font-mono">
              {item.aspectRatio}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Output
            </span>
          </div>
        </div>

        {/* Right Sidebar: The AI Prompt Receipt */}
        <div className="lg:w-5/12 p-6 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0E131E]">
          <div className="space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="tool">{item.model}</Badge>
                <Badge variant="cyan">{item.category}</Badge>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Generated {item.createdAt}</p>
            </div>

            {/* Positive Prompt Receipt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Positive Prompt Receipt
                </label>
                <button
                  onClick={handleCopyPrompt}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-white/5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <div className="p-3.5 rounded-xl bg-[#090C12] border border-indigo-900/40 text-xs font-mono text-slate-200 leading-relaxed max-h-36 overflow-y-auto selection:bg-indigo-600/40">
                "{item.prompt}"
              </div>
            </div>

            {/* Negative Prompt (if available) */}
            {item.negativePrompt && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" /> Negative Prompt
                </label>
                <div className="p-2.5 rounded-lg bg-[#090C12] border border-white/5 text-[11px] font-mono text-slate-400 leading-relaxed max-h-20 overflow-y-auto">
                  {item.negativePrompt}
                </div>
              </div>
            )}

            {/* Technical Generation Metadata Matrix */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Pipeline Parameters
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {item.seed && (
                  <div className="bg-[#090C12] p-2 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Seed</span>
                    <span className="text-slate-200">{item.seed}</span>
                  </div>
                )}
                {item.sampler && (
                  <div className="bg-[#090C12] p-2 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Sampler</span>
                    <span className="text-slate-200 truncate block">{item.sampler}</span>
                  </div>
                )}
                {item.cfgScale && (
                  <div className="bg-[#090C12] p-2 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">CFG Scale</span>
                    <span className="text-slate-200">{item.cfgScale}</span>
                  </div>
                )}
                {item.workflow && (
                  <div className="bg-[#090C12] p-2 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase font-sans">Workflow</span>
                    <span className="text-indigo-300 truncate block">{item.workflow}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tools Tagged */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400">Tools:</span>
              {item.tools.map((t, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-800/30 font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-3">
            <Button
              variant="primary"
              className="flex-1"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                if (onCommissionSimilar) onCommissionSimilar(item);
                onClose();
              }}
            >
              Commission Similar Asset
            </Button>
            <Button variant="secondary" size="md" onClick={onClose}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
