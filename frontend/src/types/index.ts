export type UserRole = "creator" | "brand" | "admin";

export type MediaCategory =
  | "Bridal & Wedding"
  | "Clothing & Fashion"
  | "Drinks & Beverage"
  | "Jewellery & Accessories"
  | "Beauty & Skincare"
  | "Food & Restaurants"
  | "Travel & Lifestyle"
  | "Electronics & Tech"
  | "Cinematic"
  | "Commercial Product";

export type SocialPlatform = "Instagram" | "YouTube" | "TikTok" | "Facebook";

export interface PortfolioItem {
  id: string;
  title: string;
  mediaUrl: string;
  videoUrl?: string; // Direct video streaming link for HTML5 playback
  thumbnailUrl?: string; // High-res poster frame before play
<<<<<<< HEAD
  videoAttribution?: {
    title: string;
    creator: string;
    license: string;
    sourceUrl: string;
    licenseUrl: string;
  };
=======
>>>>>>> 29237b25e9a45eed65d183c29fe34dc9e5084877
  duration?: string; // e.g. "0:30", "0:45"
  mediaType: "image" | "video" | "audio" | "3d";
  category: MediaCategory;
  prompt: string;
  negativePrompt?: string;
  model: string;
  seed?: string | number;
  sampler?: string;
  steps?: number;
  cfgScale?: number;
  workflow?: string;
  tools: string[];
  aspectRatio: "9:16" | "16:9" | "1:1" | "4:5";
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
  category: MediaCategory;
  platforms: SocialPlatform[];
  followerCount: string; // e.g. "320K", "1.2M"
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

export interface BusinessCategoryInfo {
  id: string;
  name: MediaCategory;
  tagline: string;
  description: string;
  imageUrl: string;
  videoPreviewUrl?: string;
  defaultAspectRatio: "9:16" | "16:9" | "1:1" | "4:5";
  sampleConcepts: string[];
  popularTools: string[];
  creatorCount: number;
}

export interface BrandBrief {
  id: string;
  brandName: string;
  brandLogo: string;
  brandIndustry: string;
  title: string;
  description: string;
  category: MediaCategory;
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

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  handle?: string;
  avatarUrl?: string;
  companyName?: string;
  bio?: string;
}
<<<<<<< HEAD
=======

>>>>>>> 29237b25e9a45eed65d183c29fe34dc9e5084877
