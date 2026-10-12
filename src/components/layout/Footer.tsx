import React from "react";
import { Sparkles, ShieldCheck, Cpu, Code2, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-[#080B11] text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand & Value statement */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#0A0D14] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="font-bold text-white text-base tracking-tight">
              CreatorConnect <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">AI</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            The AI-native marketplace connecting elite generative artists, prompt directors, and ComfyUI pipeline engineers with global brands and creative agencies.
          </p>
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Escrow Protected
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Verified Prompt Receipts
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Commercial IP Safe
            </span>
          </div>
        </div>

        {/* AI Disciplines */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">AI Disciplines</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#creators" className="hover:text-indigo-400 transition-colors">Cinematic Film & VFX</a></li>
            <li><a href="#creators" className="hover:text-indigo-400 transition-colors">Commercial Product Staging</a></li>
            <li><a href="#creators" className="hover:text-indigo-400 transition-colors">Character LoRA Consistency</a></li>
            <li><a href="#creators" className="hover:text-indigo-400 transition-colors">Generative Video Sequences</a></li>
            <li><a href="#creators" className="hover:text-indigo-400 transition-colors">Architectural Visualization</a></li>
          </ul>
        </div>

        {/* Model Ecosystem */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Supported Ecosystem</h4>
          <ul className="space-y-2.5 text-sm">
            <li><span className="text-slate-300">Flux.1 Dev & Schnell</span></li>
            <li><span className="text-slate-300">ComfyUI Pipelines</span></li>
            <li><span className="text-slate-300">Runway Gen-3 Alpha</span></li>
            <li><span className="text-slate-300">Midjourney v6.1</span></li>
            <li><span className="text-slate-300">ElevenLabs Audio</span></li>
          </ul>
        </div>

        {/* Platform & Trust */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Trust & Safety</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#dealroom" className="hover:text-indigo-400 transition-colors">Milestone Escrow</a></li>
            <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Commercial IP Licensing</span></li>
            <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Prompt Privacy Policy</span></li>
            <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">C2PA Verification</span></li>
            <li><span className="hover:text-indigo-400 transition-colors cursor-pointer">Dispute Resolution</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 CreatorConnect AI Inc. All rights reserved.</p>
        <p className="flex items-center gap-1 font-mono">
          <Code2 className="w-3.5 h-3.5 text-slate-400" /> Built for the Next Era of Generative Production
        </p>
      </div>
    </footer>
  );
};
