export type UserRole = "creator" | "brand" | "admin";

export interface PortfolioItem {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "audio" | "3d";
  category: "Cinematic" | "Commercial Product" | "Character Design" | "Motion / Video" | "Anime & Stylized" | "Architecture";
  prompt: string;
  negativePrompt?: string;
  model: string; // e.g. "Flux.1 Dev", "Midjourney v6.1", "Runway Gen-3", "SDXL"
  seed?: string | number;
  sampler?: string; // e.g. "Euler A", "DPM++ 2M Karras"
  steps?: number;
  cfgScale?: number;
  workflow?: string; // e.g. "ComfyUI v0.2.4 LoRA Pipeline"
  tools: string[]; // ["Flux.1", "ComfyUI", "Magnific AI"]
  aspectRatio: string; // "16:9", "1:1", "9:16"
  createdAt: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  coverUrl: string;
  headline: string;
  bio: string;
  location: string;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  completedBriefs: number;
  hourlyRate: number;
  tools: string[];
  styles: string[];
  portfolio: PortfolioItem[];
  badges: string[];
}

export interface BrandBrief {
  id: string;
  brandName: string;
  brandLogo: string;
  brandIndustry: string;
  title: string;
  description: string;
  category: "Advertising & Commercial" | "Film & Cinema" | "Product Staging" | "Gaming & Worldbuilding" | "Fashion & Apparel";
  budgetMin: number;
  budgetMax: number;
  currency: string;
  deadline: string;
  requiredTools: string[];
  deliverablesCount: number;
  aspectRatio: string;
  resolution: string;
  status: "open" | "in_review" | "assigned" | "completed";
  proposalsCount: number;
  createdAt: string;
  featured?: boolean;
}

export interface Proposal {
  id: string;
  briefId: string;
  creatorId: string;
  creator: CreatorProfile;
  coverPitch: string;
  proposedAmount: number;
  estimatedDays: number;
  status: "submitted" | "shortlisted" | "accepted" | "rejected";
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "funded" | "in_progress" | "submitted" | "approved";
  deliverableUrl?: string;
  promptMetadata?: Partial<PortfolioItem>;
  clientFeedback?: string;
}

export interface ProjectContract {
  id: string;
  briefTitle: string;
  brandName: string;
  brandLogo: string;
  creatorName: string;
  creatorAvatar: string;
  totalBudget: number;
  status: "active" | "in_review" | "completed" | "disputed";
  milestones: Milestone[];
  startedAt: string;
}
