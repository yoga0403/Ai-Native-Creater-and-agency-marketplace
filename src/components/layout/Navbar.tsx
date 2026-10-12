"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Briefcase, Users, ShieldCheck, Search, Menu, X, ArrowRight } from "lucide-react";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenBriefModal?: () => void;
  onOpenCopilot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  onOpenBriefModal,
  onOpenCopilot,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-[#0A0D14] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              CreatorConnect <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">AI</span>
            </span>
            <span className="text-[11px] text-slate-400 -mt-1 hidden sm:block">Generative Creator Marketplace</span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5">
          <a
            href="#creators"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-indigo-400" />
            Find Creators
          </a>
          <a
            href="#briefs"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4 text-cyan-400" />
            Creative Briefs
          </a>
          <a
            href="#dealroom"
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Deal Room & Escrow
          </a>
        </nav>

        {/* Right Action Stack: Role Switcher & Dynamic CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Role Mode Toggle */}
          <div className="flex items-center bg-[#121722] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => onRoleChange("brand")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                currentRole === "brand"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🏢 Brand Mode
            </button>
            <button
              onClick={() => onRoleChange("creator")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                currentRole === "creator"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🎨 Creator Mode
            </button>
          </div>

          {/* AI Copilot Button */}
          {onOpenCopilot && (
            <Button
              variant="cyan"
              size="sm"
              icon={<Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />}
              onClick={onOpenCopilot}
            >
              AI Brief Co-Pilot
            </Button>
          )}

          {/* Main Action CTA */}
          {currentRole === "brand" ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenBriefModal}
              icon={<Briefcase className="w-4 h-4" />}
            >
              Post a Brief
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenBriefModal}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Portfolio
            </Button>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-[#0A0D14]/95 border-b border-white/10 backdrop-blur-2xl flex flex-col gap-4">
          <div className="flex bg-[#121722] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => {
                onRoleChange("brand");
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 rounded-lg font-medium text-center ${
                currentRole === "brand" ? "bg-indigo-600 text-white" : "text-slate-400"
              }`}
            >
              Brand Mode
            </button>
            <button
              onClick={() => {
                onRoleChange("creator");
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 rounded-lg font-medium text-center ${
                currentRole === "creator" ? "bg-violet-600 text-white" : "text-slate-400"
              }`}
            >
              Creator Mode
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="#creators"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg"
            >
              Find Creators
            </a>
            <a
              href="#briefs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg"
            >
              Creative Briefs
            </a>
            <a
              href="#dealroom"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg"
            >
              Deal Room & Escrow
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
