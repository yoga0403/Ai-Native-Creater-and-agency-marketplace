"use client";

import React, { useState } from "react";
import { Sparkles, X, Wand2, Check, ArrowRight, Bot, Cpu, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AIBriefCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBrief: (structuredBrief: {
    title: string;
    description: string;
    requiredTools: string[];
    deliverablesCount: number;
    budgetMin: number;
    budgetMax: number;
    aspectRatio: string;
    resolution: string;
  }) => void;
}

export const AIBriefCopilotDrawer: React.FC<AIBriefCopilotDrawerProps> = ({
  isOpen,
  onClose,
  onApplyBrief,
}) => {
  const [promptInput, setPromptInput] = useState(
    "We need 5 commercial visuals for a launch of our holographic smartwatch. Must show the watch on a runner at sunset, on a boardroom executive desk, and under clean water. The watch face design must stay consistent."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [structuredOutput, setStructuredOutput] = useState<{
    title: string;
    description: string;
    requiredTools: string[];
    deliverablesCount: number;
    budgetMin: number;
    budgetMax: number;
    aspectRatio: string;
    resolution: string;
    promptFormula: string;
    negativeFormula: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleRefine = () => {
    setIsGenerating(true);
    // Simulate smart AI prompt structuring
    setTimeout(() => {
      setStructuredOutput({
        title: "5x Multi-Environment Commercial Key Visuals with Watch Face Consistency",
        description:
          "High-fidelity commercial campaign staging a holographic smartwatch across three distinct narrative settings: golden hour trail runner, obsidian executive conference desk, and submerged underwater macro. Strict character/product consistency required via LoRA or ControlNet.",
        requiredTools: ["Flux.1 Dev", "ComfyUI", "ControlNet Canny / Depth", "Magnific AI"],
        deliverablesCount: 5,
        budgetMin: 950,
        budgetMax: 1800,
        aspectRatio: "16:9 & 4:5",
        resolution: "4K (3840x2160)",
        promptFormula:
          "Commercial luxury tech photography of a titanium bezel holographic smartwatch, floating UI display with sapphire glass reflections, natural ambient lighting, Hasselblad 100MP clarity --ar 16:9",
        negativeFormula:
          "distorted watch dial, broken hands, deformed fingers, low poly, noisy background, blurry logo",
      });
      setIsGenerating(false);
    }, 1200);
  };

  const handleApply = () => {
    if (structuredOutput) {
      onApplyBrief({
        title: structuredOutput.title,
        description: structuredOutput.description,
        requiredTools: structuredOutput.requiredTools,
        deliverablesCount: structuredOutput.deliverablesCount,
        budgetMin: structuredOutput.budgetMin,
        budgetMax: structuredOutput.budgetMax,
        aspectRatio: structuredOutput.aspectRatio,
        resolution: structuredOutput.resolution,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0D121D] border-l border-white/10 h-full overflow-y-auto p-6 flex flex-col justify-between gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  AI Brief Co-Pilot <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">Gemini Powered</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Turn rough concept notes into technical, production-grade briefs
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Input Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> What do you need generated? (Raw thoughts, moodboard keywords, goals)
            </label>
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              rows={4}
              className="w-full bg-[#080B12] border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 leading-relaxed font-sans"
              placeholder="e.g. We are launching a new fragrance. We need 3 photoreal images in a lush tropical garden with morning dew and soft light..."
            />
            <div className="flex justify-end">
              <Button
                variant="cyan"
                size="sm"
                icon={<Wand2 className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />}
                onClick={handleRefine}
                disabled={isGenerating || !promptInput.trim()}
              >
                {isGenerating ? "Analyzing with AI..." : "Structure Brief with AI"}
              </Button>
            </div>
          </div>

          {/* AI Structured Output */}
          {structuredOutput && (
            <div className="p-5 rounded-2xl bg-[#111724] border border-cyan-500/30 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold">
                <Check className="w-4 h-4 text-cyan-400" /> Brief Successfully Structured!
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Engineered Title</span>
                <p className="text-sm font-bold text-white mt-0.5">{structuredOutput.title}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Scope & Consistency Requirements</span>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{structuredOutput.description}</p>
              </div>

              {/* Parameters Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[#080B12] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase font-sans block">Fair Escrow Range</span>
                  <span className="text-emerald-400 font-bold">${structuredOutput.budgetMin} - ${structuredOutput.budgetMax}</span>
                </div>
                <div className="bg-[#080B12] p-2.5 rounded-lg border border-white/5">
                  <span className="text-slate-400 text-[10px] uppercase font-sans block">Deliverables & Specs</span>
                  <span className="text-slate-200">{structuredOutput.deliverablesCount} Assets ({structuredOutput.aspectRatio})</span>
                </div>
              </div>

              {/* Recommended Tool Stack */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1.5">Recommended AI Tool Pipeline</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {structuredOutput.requiredTools.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-700/40 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Prompt Guidance */}
              <div className="p-3 rounded-xl bg-[#080B12] border border-white/5 text-xs font-mono space-y-1">
                <span className="text-indigo-400 block font-sans text-[11px] font-semibold">Prompt Recipe Seed Guidance:</span>
                <p className="text-slate-300 text-[11px]">"{structuredOutput.promptFormula}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={handleApply}
            disabled={!structuredOutput}
          >
            Apply to Create Brief
          </Button>
        </div>
      </div>
    </div>
  );
};
