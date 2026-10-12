"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Plus, DollarSign, Calendar, CheckCircle2 } from "lucide-react";
import { BrandBrief } from "@/types";
import { Button } from "@/components/ui/Button";

interface CreateBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBrief: (newBrief: Partial<BrandBrief>) => void;
  initialData?: Partial<BrandBrief> | null;
  onOpenCopilot?: () => void;
}

export const CreateBriefModal: React.FC<CreateBriefModalProps> = ({
  isOpen,
  onClose,
  onSaveBrief,
  initialData,
  onOpenCopilot,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<BrandBrief["category"]>("Advertising & Commercial");
  const [budgetMin, setBudgetMin] = useState(800);
  const [budgetMax, setBudgetMax] = useState(1500);
  const [deadline, setDeadline] = useState("Nov 15, 2026");
  const [deliverablesCount, setDeliverablesCount] = useState(5);
  const [aspectRatio, setAspectRatio] = useState("16:9 & 9:16");
  const [resolution, setResolution] = useState("4K (3840x2160)");
  const [requiredTools, setRequiredTools] = useState<string[]>(["Flux.1 Dev", "ComfyUI"]);
  const [newTool, setNewTool] = useState("");

  useEffect(() => {
    if (initialData) {
      if (initialData.title) setTitle(initialData.title);
      if (initialData.description) setDescription(initialData.description);
      if (initialData.budgetMin) setBudgetMin(initialData.budgetMin);
      if (initialData.budgetMax) setBudgetMax(initialData.budgetMax);
      if (initialData.deliverablesCount) setDeliverablesCount(initialData.deliverablesCount);
      if (initialData.aspectRatio) setAspectRatio(initialData.aspectRatio);
      if (initialData.resolution) setResolution(initialData.resolution);
      if (initialData.requiredTools) setRequiredTools(initialData.requiredTools);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleAddTool = () => {
    if (newTool.trim() && !requiredTools.includes(newTool.trim())) {
      setRequiredTools([...requiredTools, newTool.trim()]);
      setNewTool("");
    }
  };

  const handleRemoveTool = (toolToRemove: string) => {
    setRequiredTools(requiredTools.filter((t) => t !== toolToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBrief({
      title,
      description,
      category,
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      deadline,
      deliverablesCount: Number(deliverablesCount),
      aspectRatio,
      resolution,
      requiredTools,
      brandName: "Acme Creative Studio",
      brandLogo: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80",
      brandIndustry: "Creative Advertising",
      status: "open",
      proposalsCount: 0,
      createdAt: "Just now",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0D121D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111724]">
          <div className="flex items-center gap-2.5">
            <h3 className="font-bold text-white text-lg">Post a New Creative Brief</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
              Brand Studio
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onOpenCopilot && (
              <Button
                type="button"
                variant="cyan"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onOpenCopilot();
                }}
              >
                Use AI Co-Pilot
              </Button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Brief Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5x Futuristic Key Visuals for ANC Headphone Global Launch"
              className="w-full bg-[#080B12] border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#080B12] border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Advertising & Commercial">Advertising & Commercial</option>
                <option value="Film & Cinema">Film & Cinema</option>
                <option value="Product Staging">Product Staging</option>
                <option value="Gaming & Worldbuilding">Gaming & Worldbuilding</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
              </select>
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Deadline Date</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-[#080B12] border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Detailed Requirements & Continuity Criteria</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail your scene ideas, lighting requirements, and character/product consistency guidelines..."
              className="w-full bg-[#080B12] border border-white/10 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Deliverables & Technical Specs */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Deliverables</label>
              <input
                type="number"
                min={1}
                value={deliverablesCount}
                onChange={(e) => setDeliverablesCount(Number(e.target.value))}
                className="w-full bg-[#080B12] border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Aspect Ratio</label>
              <input
                type="text"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-[#080B12] border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Resolution</label>
              <input
                type="text"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-[#080B12] border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Budget Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Min Budget (USD)</label>
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full bg-[#080B12] border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Max Budget (USD)</label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
                className="w-full bg-[#080B12] border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Required AI Tools Tags */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Required AI Tool Stack</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                placeholder="e.g. Flux.1, ComfyUI, Runway Gen-3"
                className="flex-1 bg-[#080B12] border border-white/10 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddTool}>
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {requiredTools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-700/40 font-mono text-xs flex items-center gap-1"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => handleRemoveTool(tool)}
                    className="hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" icon={<CheckCircle2 className="w-4 h-4" />}>
              Publish Creative Brief
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
