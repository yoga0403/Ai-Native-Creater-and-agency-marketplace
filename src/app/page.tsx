"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Terminal,
  CheckCircle2,
  Briefcase,
  Users,
} from "lucide-react";
import { UserRole, CreatorProfile, PortfolioItem, BrandBrief, ProjectContract } from "@/types";
import { MOCK_CREATORS, MOCK_BRIEFS, MOCK_PROJECTS } from "@/data/mockData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { BriefCard } from "@/components/briefs/BriefCard";
import { PromptInspectorModal } from "@/components/creators/PromptInspectorModal";
import { AIBriefCopilotDrawer } from "@/components/briefs/AIBriefCopilotDrawer";
import { CreateBriefModal } from "@/components/briefs/CreateBriefModal";
import { SubmitProposalModal } from "@/components/briefs/SubmitProposalModal";
import { DealRoomModal } from "@/components/dealroom/DealRoomModal";

export default function Home() {
  // State management
  const [currentRole, setCurrentRole] = useState<UserRole>("brand");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToolFilter, setSelectedToolFilter] = useState<string>("All");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  // Modals & Drawers state
  const [inspectingItem, setInspectingItem] = useState<PortfolioItem | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCreateBriefOpen, setIsCreateBriefOpen] = useState(false);
  const [isSubmitProposalOpen, setIsSubmitProposalOpen] = useState(false);
  const [selectedBriefForPitch, setSelectedBriefForPitch] = useState<BrandBrief | null>(null);
  const [isDealRoomOpen, setIsDealRoomOpen] = useState(false);
  const [briefs, setBriefs] = useState<BrandBrief[]>(MOCK_BRIEFS);
  const [notification, setNotification] = useState<string | null>(null);

  // Pre-filled data from AI Copilot
  const [copilotGeneratedBrief, setCopilotGeneratedBrief] = useState<Partial<BrandBrief> | null>(null);

  // Filtered Creators
  const filteredCreators = useMemo(() => {
    return MOCK_CREATORS.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTool =
        selectedToolFilter === "All" ||
        c.tools.some((t) => t.toLowerCase().includes(selectedToolFilter.toLowerCase()));

      const matchesCategory =
        selectedCategoryFilter === "All" ||
        c.portfolio.some((p) => p.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase()));

      return matchesSearch && matchesTool && matchesCategory;
    });
  }, [searchQuery, selectedToolFilter, selectedCategoryFilter]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleApplyCopilotBrief = (data: any) => {
    setCopilotGeneratedBrief(data);
    setIsCreateBriefOpen(true);
  };

  const handleSaveBrief = (newBrief: Partial<BrandBrief>) => {
    const fullBrief: BrandBrief = {
      id: `brief-${Date.now()}`,
      brandName: newBrief.brandName || "Acme Brand Studio",
      brandLogo: newBrief.brandLogo || "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80",
      brandIndustry: newBrief.brandIndustry || "Creative Agency",
      title: newBrief.title || "Untitled Brief",
      description: newBrief.description || "",
      category: newBrief.category || "Advertising & Commercial",
      budgetMin: newBrief.budgetMin || 500,
      budgetMax: newBrief.budgetMax || 1000,
      currency: "USD",
      deadline: newBrief.deadline || "Nov 20, 2026",
      requiredTools: newBrief.requiredTools || ["Flux.1", "ComfyUI"],
      deliverablesCount: newBrief.deliverablesCount || 3,
      aspectRatio: newBrief.aspectRatio || "16:9",
      resolution: newBrief.resolution || "4K",
      status: "open",
      proposalsCount: 0,
      createdAt: "Just now",
      featured: true,
    };
    setBriefs([fullBrief, ...briefs]);
    showNotification("Brief published! Creators can now submit prompt proposals.");
  };

  const handleHireCreator = (creator: CreatorProfile) => {
    setCopilotGeneratedBrief({
      title: `Dedicated Commission for @${creator.handle}`,
      description: `Commissioning custom AI assets utilizing ${creator.tools.slice(0, 2).join(" & ")}.`,
      requiredTools: creator.tools.slice(0, 3),
      budgetMin: creator.hourlyRate * 10,
      budgetMax: creator.hourlyRate * 20,
    });
    setIsCreateBriefOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] flex flex-col selection:bg-indigo-600/30">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-indigo-950/90 text-white border border-indigo-500/50 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          showNotification(`Switched to ${role === "brand" ? "Brand" : "Creator"} mode`);
        }}
        onOpenBriefModal={() => setIsCreateBriefOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-white/5 radial-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-7">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-700/40 text-indigo-300 text-xs font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI-Native Creative Economy • Built for Flux, Midjourney & ComfyUI</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Where Brands Hire <br className="hidden sm:inline" />
            <span className="gradient-text-indigo">Elite AI Creators</span> With{" "}
            <span className="gradient-text-cyan">Prompt Receipts</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Eliminate prompt amateurism. Connect with vetted generative directors, LoRA fine-tuners, and ComfyUI workflow engineers. Guaranteed style consistency and milestone escrow.
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={<Users className="w-4 h-4" />}
              onClick={() => {
                const el = document.getElementById("creators");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore AI Creators
            </Button>
            <Button
              variant="cyan"
              size="lg"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => setIsCopilotOpen(true)}
            >
              Try AI Brief Co-Pilot
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
              onClick={() => setIsDealRoomOpen(true)}
            >
              Inspect Active Deal Room
            </Button>
          </div>

          {/* Trust Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-white/5">
            <div className="p-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">$480K+</span>
              <span className="text-xs text-slate-400">Escrow Paid Out</span>
            </div>
            <div className="p-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-indigo-400 block">1,200+</span>
              <span className="text-xs text-slate-400">Commercial Briefs</span>
            </div>
            <div className="p-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 block">100%</span>
              <span className="text-xs text-slate-400">Verified Prompt Receipts</span>
            </div>
            <div className="p-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">4.97 ★</span>
              <span className="text-xs text-slate-400">Average Client Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Model & Tool Ecosystem Marquee */}
      <section className="py-6 bg-[#080B12] border-b border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6 text-xs text-slate-400 font-mono flex-wrap">
          <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-indigo-400" /> Supported Model Ecosystem:
          </span>
          <div className="flex items-center gap-6 flex-wrap">
            <span className="hover:text-white transition-colors">Flux.1 Dev & Schnell</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-white transition-colors">Midjourney v6.1</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-white transition-colors">ComfyUI Pipelines</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-white transition-colors">Runway Gen-3 Alpha</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-white transition-colors">ControlNet Depth/Canny</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-white transition-colors">ElevenLabs Audio</span>
          </div>
        </div>
      </section>

      {/* Main Marketplace Section: Creator Directory */}
      <section id="creators" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 flex-1">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="tool">Vetted AI Talent</Badge>
              <span className="text-xs text-slate-400">Character, Lighting & Workflow Consistency</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Generative Directors & AI Creators
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, style, or name..."
              className="w-full bg-[#121722] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Filter Badges Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs scrollbar-none">
          <span className="text-slate-400 shrink-0 font-medium">Filter Tools:</span>
          {["All", "Flux.1", "Midjourney", "ComfyUI", "Runway Gen-3", "ControlNet"].map((tool) => (
            <button
              key={tool}
              onClick={() => setSelectedToolFilter(tool)}
              className={`px-3 py-1.5 rounded-lg font-mono transition-all cursor-pointer shrink-0 ${
                selectedToolFilter === tool
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {tool}
            </button>
          ))}

          <span className="text-slate-400 shrink-0 font-medium ml-4">Discipline:</span>
          {["All", "Cinematic", "Commercial Product", "Motion / Video", "Anime & Stylized"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                selectedCategoryFilter === cat
                  ? "bg-cyan-600 text-white font-semibold shadow-sm"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Creator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onSelectPortfolioItem={(item) => setInspectingItem(item)}
              onHireCreator={handleHireCreator}
            />
          ))}
        </div>
      </section>

      {/* Creative Briefs Board Section */}
      <section id="briefs" className="py-16 bg-[#080B12] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="cyan">Open Commissions</Badge>
                <span className="text-xs text-slate-400">Milestone-Funded Client Briefs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Active Creative Briefs Awaiting Proposals
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="cyan"
                size="sm"
                icon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => setIsCopilotOpen(true)}
              >
                Structure Brief with AI
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Briefcase className="w-3.5 h-3.5" />}
                onClick={() => setIsCreateBriefOpen(true)}
              >
                Post New Brief
              </Button>
            </div>
          </div>

          {/* Briefs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {briefs.map((brief) => (
              <BriefCard
                key={brief.id}
                brief={brief}
                onSubmitProposal={(b) => {
                  setSelectedBriefForPitch(b);
                  setIsSubmitProposalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillar: How It Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="tool">The AI-Native Advantage</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Built From Scratch for Generative AI Production
          </h2>
          <p className="text-sm text-slate-300">
            Why leading creative agencies choose CreatorConnect AI over generic freelance sites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0D121D] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Prompt & Seed Receipts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every deliverable includes generation metadata: seeds, samplers, model checkpoints, and ComfyUI workflow graphs for full asset reproducibility.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D121D] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">AI Brief Co-Pilot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Brands don't need to be prompt engineers. Our Gemini-powered Co-Pilot translates creative vision into technical model and aspect ratio constraints.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D121D] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Milestone Escrow Deals</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Funds stay locked in escrow until preliminary character sheets and lighting proof-of-concepts pass brand approval.
            </p>
          </div>
        </div>
      </section>

      {/* Global Interactive Modals */}
      <PromptInspectorModal
        item={inspectingItem}
        onClose={() => setInspectingItem(null)}
        onCommissionSimilar={(item) => {
          setCopilotGeneratedBrief({
            title: `Commission: Style of "${item.title}"`,
            description: `Commissioning production asset modeled after: "${item.prompt.slice(0, 100)}..."`,
            requiredTools: item.tools,
            aspectRatio: item.aspectRatio,
          });
          setIsCreateBriefOpen(true);
        }}
      />

      <AIBriefCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onApplyBrief={handleApplyCopilotBrief}
      />

      <CreateBriefModal
        isOpen={isCreateBriefOpen}
        onClose={() => setIsCreateBriefOpen(false)}
        onSaveBrief={handleSaveBrief}
        initialData={copilotGeneratedBrief}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      <SubmitProposalModal
        brief={selectedBriefForPitch}
        isOpen={isSubmitProposalOpen}
        onClose={() => setIsSubmitProposalOpen(false)}
        onSubmitSuccess={(data) => {
          showNotification(`Pitch submitted to ${selectedBriefForPitch?.brandName}! Proposal budget: $${data.proposedAmount}`);
        }}
      />

      <DealRoomModal
        project={MOCK_PROJECTS[0]}
        isOpen={isDealRoomOpen}
        onClose={() => setIsDealRoomOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
