import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "tool" | "verified" | "cyan" | "emerald" | "amber";
  className?: string;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
  size = "sm",
}) => {
  const sizeClasses = size === "sm" ? "text-xs px-2.5 py-0.5" : "text-sm px-3 py-1";

  const variantClasses = {
    default: "bg-slate-800 text-slate-300 border border-slate-700/60",
    tool: "bg-indigo-950/60 text-indigo-300 border border-indigo-700/40 hover:border-indigo-500/60 transition-colors",
    verified: "bg-emerald-950/60 text-emerald-300 border border-emerald-600/40",
    cyan: "bg-cyan-950/60 text-cyan-300 border border-cyan-500/40",
    emerald: "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40",
    amber: "bg-amber-950/60 text-amber-300 border border-amber-500/40",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
