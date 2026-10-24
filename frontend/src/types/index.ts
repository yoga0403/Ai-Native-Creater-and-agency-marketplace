export type UserRole = "creator" | "brand" | "admin";

export type MediaCategory =
  | "Jewellery & Accessories"
  | "Clothing & Fashion"
  | "Colleges & Education"
  | "Beauty & Skincare"
  | "Restaurants & Food"
  | "Electronics & Tech"
  | "Travel & Tourism"
  | "Healthcare & Fitness"
  | "Real Estate & Housing"
  | "Local Businesses & Startups"
  | "Bridal & Wedding"
  | "Drinks & Beverage"
  | "Cinematic";

export type SocialPlatform = "Instagram" | "YouTube" | "TikTok" | "Facebook" | "LinkedIn";

export type ContentFormat =
  | "Reel"
  | "Short Video"
  | "Review"
  | "Unboxing"
  | "Campus Tour"
  | "Long Video"
  | "Photo / Still"
  | "3D Model / CAD";

export interface PortfolioItem {
  id: string;
  title: string;
  mediaUrl: string;
  videoUrl?: string; // Direct video streaming link for HTML5 playback
  thumbnailUrl?: string; // High-res poster frame before play
  duration?: string; // e.g. "0:30", "0:45"
  mediaType: "image" | "video" | "audio" | "3d";
  category: MediaCategory;
  contentFormat?: ContentFormat;
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

export interface CreatorPricing {
  startingRate?: number;
  hourlyRate?: number;
  perReelRate?: number;
  currency: string;
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  coverUrl: string;
  headline: string;
  bio: string;
  location?: string | null;
  languages?: string[];
  category: MediaCategory;
  specializations: string[];
  platforms: SocialPlatform[];
  followerCount?: string | null; // e.g. "320K" or null ("Not provided")
  isVerified?: boolean;
  rating?: number | null;
  reviewsCount?: number;
  completedBriefs?: number;
  hourlyRate?: number | null;
  pricing?: CreatorPricing;
  preferredFormats: ContentFormat[];
  availability?: string | null;
  tools: string[];
  styles: string[];
  portfolio: PortfolioItem[];
  badges: string[];
}

export interface BusinessProfile {
  id: string;
  userId: string;
  name: string;
  category: MediaCategory;
  logoUrl?: string;
  location?: string;
  productsServices: string[];
  websiteUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  uploadedMedia: {
    id: string;
    title: string;
    mediaUrl: string;
    type: "video" | "image";
    createdAt: string;
  }[];
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
  businessId?: string;
  brandName: string;
  brandLogo: string;
  brandIndustry: string;
  title: string;
  description: string;
  category: MediaCategory;
  productService?: string;
  objective?: string;
  platform?: string;
  contentType?: ContentFormat;
  targetAudience?: string;
  preferredLanguage?: string;
  preferredLocation?: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  deadline: string;
  requiredTools: string[];
  deliverablesCount: number;
  deliverablesSummary?: string;
  contactPreference?: "In-Platform Chat" | "Email" | "Phone";
  aspectRatio: string;
  resolution: string;
  status: "open" | "in_review" | "assigned" | "completed";
  proposalsCount: number;
  createdAt: string;
  featured?: boolean;
}

export type CollaborationStatus = "Pending" | "Accepted" | "Rejected" | "Completed";

export interface CollaborationRequest {
  id: string;
  businessId: string;
  businessName: string;
  businessLogo?: string;
  creatorId: string;
  creatorName: string;
  creatorHandle?: string;
  creatorAvatar?: string;
  campaignTitle: string;
  productService: string;
  requirements: string;
  budget: number;
  deadline: string;
  message: string;
  contactPreference?: string;
  status: CollaborationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationMessage {
  id: string;
  collaborationId: string;
  senderId: string;
  senderName: string;
  senderRole: "brand" | "creator";
  content: string;
  createdAt: string;
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
  category?: MediaCategory;
  specialization?: string;
  bio?: string;
  location?: string;
}
