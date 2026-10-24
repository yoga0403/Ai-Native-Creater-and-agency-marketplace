import type {
  CreatorProfile,
  BrandBrief,
  CollaborationRequest,
  CollaborationMessage,
  BusinessProfile,
  MediaCategory,
  ContentFormat,
  UserAccount
} from "../types";
import {
  MOCK_CREATORS,
  MOCK_BRIEFS,
  INITIAL_COLLABORATIONS,
  INITIAL_BUSINESS_PROFILES
} from "../data/mockData";
import { supabaseRest, isSupabaseConfigured } from "./supabaseClient";
export { isSupabaseConfigured };

const API_BASE = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'))
  .replace(/\/+$/, '');

// Local storage keys for resilient persistence
const STORAGE_KEYS = {
  COLLABS: 'creatorconnect_collaborations',
  BRIEFS: 'creatorconnect_briefs',
  MESSAGES: 'creatorconnect_messages',
  BUSINESS_PROFILES: 'creatorconnect_business_profiles',
  CREATORS: 'creatorconnect_creators',
};

// Initialize LocalStorage with default seeds if empty
const getStored = <T>(key: string, defaultVal: T): T => {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setStored = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write failed:', err);
  }
};

export interface MatchCriteria {
  businessCategory: MediaCategory;
  platform?: string;
  contentType?: ContentFormat | string;
  budget?: number;
  language?: string;
  location?: string;
  keywords?: string;
}

export interface MatchResult {
  creator: CreatorProfile;
  matchScore: number; // 0-100%
  matchReasons: string[];
  isTopMatch: boolean;
}

/**
 * Smart Creator Matching Engine
 * Connects businesses with creators based on category, content format, platform, budget, language, and niche.
 */
export const calculateSmartMatches = (
  criteria: MatchCriteria,
  creators: CreatorProfile[] = MOCK_CREATORS
): MatchResult[] => {
  return creators.map((creator) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Category Compatibility
    const normalizedBizCat = criteria.businessCategory.toLowerCase();
    const normalizedCreatorCat = creator.category.toLowerCase();

    const isDirectCategoryMatch = normalizedBizCat === normalizedCreatorCat;
    const isCrossCompatible =
      (normalizedBizCat.includes('jewellery') && (normalizedCreatorCat.includes('fashion') || normalizedCreatorCat.includes('bridal'))) ||
      (normalizedBizCat.includes('clothing') && (normalizedCreatorCat.includes('bridal') || normalizedCreatorCat.includes('fashion'))) ||
      (normalizedBizCat.includes('food') && normalizedCreatorCat.includes('local')) ||
      (normalizedBizCat.includes('college') && normalizedCreatorCat.includes('education')) ||
      (normalizedBizCat.includes('real estate') && normalizedCreatorCat.includes('travel'));

    if (isDirectCategoryMatch) {
      score += 40;
      reasons.push(`Direct category match in ${creator.category}`);
    } else if (isCrossCompatible) {
      score += 30;
      reasons.push(`High affinity sector match between ${criteria.businessCategory} and ${creator.category}`);
    }

    // 2. Content Format Compatibility
    if (criteria.contentType) {
      const formatMatch = creator.preferredFormats.some(f => 
        f.toLowerCase().includes(criteria.contentType!.toLowerCase())
      );
      if (formatMatch) {
        score += 20;
        reasons.push(`Specializes in ${criteria.contentType} format with verified portfolio assets`);
      }
    } else {
      score += 10;
    }

    // 3. Platform Compatibility
    if (criteria.platform && criteria.platform !== 'All') {
      const hasPlatform = creator.platforms.some(p => 
        p.toLowerCase() === criteria.platform!.toLowerCase()
      );
      if (hasPlatform) {
        score += 15;
        reasons.push(`Active presence on ${criteria.platform}`);
      }
    } else {
      score += 10;
    }

    // 4. Budget & Rate Compatibility
    const rate = creator.pricing?.perReelRate || creator.hourlyRate || 0;
    if (criteria.budget && rate > 0) {
      if (rate <= criteria.budget) {
        score += 15;
        reasons.push(`Rate of \$${rate} fits comfortably within your budget of \$${criteria.budget}`);
      } else if (rate <= criteria.budget * 1.25) {
        score += 8;
        reasons.push(`Within standard negotiation threshold of your budget`);
      }
    } else if (!criteria.budget) {
      score += 10;
    }

    // 5. Language & Location Compatibility
    if (criteria.language && creator.languages) {
      const langMatch = creator.languages.some(l => 
        l.toLowerCase().includes(criteria.language!.toLowerCase())
      );
      if (langMatch) {
        score += 10;
        reasons.push(`Fluent in ${criteria.language}`);
      }
    }

    if (criteria.location && creator.location) {
      const locMatch = creator.location.toLowerCase().includes(criteria.location.toLowerCase());
      if (locMatch) {
        score += 10;
        reasons.push(`Based in or covers ${criteria.location}`);
      }
    }

    // Cap score at 99% max
    const finalScore = Math.min(Math.max(score, 20), 99);

    return {
      creator,
      matchScore: finalScore,
      matchReasons: reasons.length > 0 ? reasons : [`Compatible portfolio style in ${creator.category}`],
      isTopMatch: finalScore >= 75
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Collaboration Requests API
 */
export const getCollaborationRequests = async (): Promise<CollaborationRequest[]> => {
  // If Supabase is configured, read from Supabase
  if (isSupabaseConfigured()) {
    const { data } = await supabaseRest.select<CollaborationRequest>('collaboration_requests', {
      order: 'created_at.desc'
    });
    if (data && data.length > 0) return data;
  }

  // Fallback to LocalStorage + initial seeds
  return getStored<CollaborationRequest[]>(STORAGE_KEYS.COLLABS, INITIAL_COLLABORATIONS);
};

export const createCollaborationRequest = async (
  requestData: Omit<CollaborationRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<CollaborationRequest> => {
  const newRequest: CollaborationRequest = {
    ...requestData,
    id: `collab-${Date.now()}`,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabaseRest.insert('collaboration_requests', newRequest);
      if (data && data[0]) return data[0];
    } catch (err) {
      console.warn('Supabase insert failed, storing locally:', err);
    }
  }

  // Try Backend API
  try {
    await fetch(`${API_BASE}/collaborations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequest),
    });
  } catch {
    // Backend might be offline; fallback to localStorage
  }

  // Save to LocalStorage
  const existing = getStored<CollaborationRequest[]>(STORAGE_KEYS.COLLABS, INITIAL_COLLABORATIONS);
  const updated = [newRequest, ...existing];
  setStored(STORAGE_KEYS.COLLABS, updated);

  return newRequest;
};

export const updateCollaborationStatus = async (
  id: string,
  status: CollaborationRequest['status']
): Promise<CollaborationRequest | null> => {
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabaseRest.update<CollaborationRequest>('collaboration_requests', id, { status, updated_at: new Date().toISOString() } as any);
      if (data) return data;
    } catch (err) {
      console.warn('Supabase update failed:', err);
    }
  }

  // Local storage update
  const existing = getStored<CollaborationRequest[]>(STORAGE_KEYS.COLLABS, INITIAL_COLLABORATIONS);
  let updatedItem: CollaborationRequest | null = null;
  const updatedList = existing.map(item => {
    if (item.id === id) {
      updatedItem = { ...item, status, updatedAt: new Date().toISOString() };
      return updatedItem;
    }
    return item;
  });

  setStored(STORAGE_KEYS.COLLABS, updatedList);
  return updatedItem;
};

/**
 * In-Platform Messages API
 */
export const getCollaborationMessages = async (collaborationId: string): Promise<CollaborationMessage[]> => {
  const allMessages = getStored<Record<string, CollaborationMessage[]>>(STORAGE_KEYS.MESSAGES, {
    'collab-101': [
      {
        id: 'msg-1',
        collaborationId: 'collab-101',
        senderId: 'biz-kalyan',
        senderName: 'Kalyan Heritage Jewellers',
        senderRole: 'brand',
        content: 'Hi Priya & Dev! We loved your macro diamond refraction sample. Can you deliver 2 reels by Nov 15th?',
        createdAt: '2026-10-20T11:00:00Z'
      },
      {
        id: 'msg-2',
        collaborationId: 'collab-101',
        senderId: 'creator-jewel-1',
        senderName: 'Priya & Dev Sharma',
        senderRole: 'creator',
        content: 'Hello! Absolutely, we have custom lighting caustics setups ready for bridal Kundan jewellery. We will prepare the moodboard tomorrow.',
        createdAt: '2026-10-20T12:30:00Z'
      }
    ]
  });

  return allMessages[collaborationId] || [];
};

export const sendCollaborationMessage = async (
  collaborationId: string,
  senderId: string,
  senderName: string,
  senderRole: 'brand' | 'creator',
  content: string
): Promise<CollaborationMessage> => {
  const newMsg: CollaborationMessage = {
    id: `msg-${Date.now()}`,
    collaborationId,
    senderId,
    senderName,
    senderRole,
    content,
    createdAt: new Date().toISOString(),
  };

  const allMessages = getStored<Record<string, CollaborationMessage[]>>(STORAGE_KEYS.MESSAGES, {});
  if (!allMessages[collaborationId]) allMessages[collaborationId] = [];
  allMessages[collaborationId].push(newMsg);
  setStored(STORAGE_KEYS.MESSAGES, allMessages);

  return newMsg;
};

/**
 * Campaigns / Briefs API
 */
export const getCampaigns = async (): Promise<BrandBrief[]> => {
  if (isSupabaseConfigured()) {
    const { data } = await supabaseRest.select<BrandBrief>('campaigns', { order: 'created_at.desc' });
    if (data && data.length > 0) return data;
  }
  return getStored<BrandBrief[]>(STORAGE_KEYS.BRIEFS, MOCK_BRIEFS);
};

export const createCampaignBrief = async (briefData: Partial<BrandBrief>): Promise<BrandBrief> => {
  const newBrief: BrandBrief = {
    id: `brief-${Date.now()}`,
    brandName: briefData.brandName || 'Verified Brand',
    brandLogo: briefData.brandLogo || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80',
    brandIndustry: briefData.category || 'Clothing & Fashion',
    title: briefData.title || 'Product Advertisement Reel Campaign',
    description: briefData.description || 'Promotional video campaign for brand growth',
    category: briefData.category || 'Clothing & Fashion',
    productService: briefData.productService || 'New Collection',
    objective: briefData.objective || 'Brand Awareness',
    platform: briefData.platform || 'Instagram',
    contentType: briefData.contentType || 'Reel',
    targetAudience: briefData.targetAudience || 'Modern consumers aged 18-40',
    preferredLanguage: briefData.preferredLanguage || 'English',
    preferredLocation: briefData.preferredLocation || 'National',
    budgetMin: Number(briefData.budgetMin) || 800,
    budgetMax: Number(briefData.budgetMax) || 1500,
    currency: briefData.currency || 'USD',
    deadline: briefData.deadline || 'Nov 30, 2026',
    requiredTools: briefData.requiredTools || ['Runway Gen-3', 'Flux.1 Dev'],
    deliverablesCount: Number(briefData.deliverablesCount) || 2,
    deliverablesSummary: briefData.deliverablesSummary || '2x 30s 9:16 Vertical Reels',
    contactPreference: briefData.contactPreference || 'In-Platform Chat',
    aspectRatio: briefData.aspectRatio || '9:16 Vertical',
    resolution: '4K UHD 60fps',
    status: 'open',
    proposalsCount: 0,
    createdAt: 'Just now',
    featured: true,
  };

  const existing = getStored<BrandBrief[]>(STORAGE_KEYS.BRIEFS, MOCK_BRIEFS);
  const updated = [newBrief, ...existing];
  setStored(STORAGE_KEYS.BRIEFS, updated);

  return newBrief;
};

/**
 * AI-Assisted Campaign Brief Generator
 */
export const generateAICampaignBrief = async (
  inputNotes: string,
  category: MediaCategory
): Promise<Partial<BrandBrief>> => {
  // Label: If Gemini API configured on backend, try it; otherwise generate high quality structured brief in Demo Mode
  try {
    const res = await fetch(`${API_BASE}/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: inputNotes, category }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        return {
          title: data.data.title,
          description: data.data.description,
          requiredTools: data.data.requiredTools,
          deliverablesCount: data.data.deliverablesCount,
          budgetMin: data.data.budgetMin,
          budgetMax: data.data.budgetMax,
        };
      }
    }
  } catch {
    // Fallback to client-side structured generator
  }

  // Client-side structured intelligent brief synthesis
  const cleanCategory = category || 'Jewellery & Accessories';
  let sampleTitle = `High-Impact 30s Commercial Reel Campaign`;
  let sampleObjective = `Brand Awareness & Direct Customer Enquiries`;
  let sampleAudience = `Target audience looking for premium quality and authentic recommendations`;
  let sampleTools = ['Runway Gen-3', 'Flux.1 Dev', 'Premiere Pro'];
  let sampleDeliverables = `3x 30s 9:16 Vertical Master Reels with licensed audio & social subtitles`;

  if (cleanCategory.includes('Jewellery')) {
    sampleTitle = `Diwali Bridal Jewellery Shimmer & Solitaire Collection Reel`;
    sampleObjective = `Showroom Footfall & Festive Bridal Purchases`;
    sampleAudience = `Brides-to-be, families, luxury shoppers aged 22-48`;
    sampleTools = ['Flux.1 Dev', 'ControlNet Depth', 'Luma Dream Machine'];
    sampleDeliverables = `2x 30s Macro Gold/Diamond Reels + 1x 15s Story Cutdown`;
  } else if (cleanCategory.includes('Clothing')) {
    sampleTitle = `Festive Designer Collection & Saree Draping Viral Reel Series`;
    sampleObjective = `Online Store Orders & Social Media Engagement`;
    sampleAudience = `Fashion-forward shoppers, wedding attendees, age 20-38`;
    sampleTools = ['Runway Gen-3', 'ComfyUI Fabric LoRA', 'Topaz Video'];
    sampleDeliverables = `3x 30s Saree/Dress Styling Reels with dynamic transitions`;
  } else if (cleanCategory.includes('College') || cleanCategory.includes('Education')) {
    sampleTitle = `2027 Admissions Campus Tour & Student Innovation Showcase`;
    sampleObjective = `Admission Applications & Campus Visit Bookings`;
    sampleAudience = `Class 12th graduates and parents searching for leading institutions`;
    sampleTools = ['Runway Gen-3', 'Topaz 4K Video', 'Premiere Pro'];
    sampleDeliverables = `1x 60s Cinematic Campus Master Video + 2x 15s High-Energy Cutdowns`;
  } else if (cleanCategory.includes('Food') || cleanCategory.includes('Restaurant')) {
    sampleTitle = `Sensory Woodfired Sizzle & Signature Tasting Menu Reel`;
    sampleObjective = `Weekend Table Bookings & Footfall`;
    sampleAudience = `Foodies, couples, and weekend diners within 15km`;
    sampleTools = ['Pika 2.1', 'Runway Gen-3', 'ElevenLabs VO'];
    sampleDeliverables = `3x 20s Sizzle Reels with appetizing sound design`;
  }

  return {
    title: sampleTitle,
    description: `Structured Campaign Brief based on notes: "${inputNotes || 'Seasonal Brand Promotion'}". Emphasizes vibrant visual appeal, clear call-to-actions, and multi-platform social video distribution.`,
    objective: sampleObjective,
    targetAudience: sampleAudience,
    requiredTools: sampleTools,
    deliverablesSummary: sampleDeliverables,
    budgetMin: 900,
    budgetMax: 1800,
    deliverablesCount: 3,
    aspectRatio: '9:16 Vertical',
  };
};

/**
 * Business Profiles API
 */
export const getBusinessProfiles = async (): Promise<BusinessProfile[]> => {
  return getStored<BusinessProfile[]>(STORAGE_KEYS.BUSINESS_PROFILES, INITIAL_BUSINESS_PROFILES);
};

export const updateBusinessProfile = async (profile: BusinessProfile): Promise<BusinessProfile> => {
  const existing = getStored<BusinessProfile[]>(STORAGE_KEYS.BUSINESS_PROFILES, INITIAL_BUSINESS_PROFILES);
  const index = existing.findIndex(p => p.id === profile.id);
  if (index >= 0) {
    existing[index] = profile;
  } else {
    existing.push(profile);
  }
  setStored(STORAGE_KEYS.BUSINESS_PROFILES, existing);
  return profile;
};

/**
 * Authentication & Session Management
 */
export const AUTH_SESSION_KEY = 'creatorconnect_auth_session';
export const REGISTERED_USERS_KEY = 'creatorconnect_registered_users';

interface StoredAuthSession {
  user: UserAccount;
  token: string;
  rememberMe: boolean;
  timestamp: number;
}

const DEFAULT_DEMO_USERS: (UserAccount & { password: string })[] = [
  {
    id: 'user-brand-1',
    name: 'Sarah Jenkins',
    email: 'brand@acme.com',
    password: 'password123',
    role: 'brand',
    companyName: 'Kalyan Heritage Jewellers',
    category: 'Jewellery & Accessories',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    handle: 'sarah_kalyan'
  },
  {
    id: 'user-creator-1',
    name: 'Priya Sharma',
    email: 'creator@creatorconnect.ai',
    password: 'password123',
    role: 'creator',
    category: 'Jewellery & Accessories',
    specialization: 'Bridal Jewellery & Diamond Caustics',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    handle: 'priya_gem_studio'
  }
];

export const getCurrentUserSession = (): UserAccount | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const session: StoredAuthSession = JSON.parse(raw);
    return session.user || null;
  } catch {
    return null;
  }
};

export const saveUserSession = (user: UserAccount, token: string, rememberMe = true): void => {
  if (typeof window === 'undefined') return;
  const session: StoredAuthSession = {
    user,
    token,
    rememberMe,
    timestamp: Date.now()
  };
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const clearUserSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_SESSION_KEY);
};

export const loginUser = async (
  email: string,
  pass: string,
  rememberMe = true
): Promise<{ user: UserAccount; token: string }> => {
  const cleanEmail = email.toLowerCase().trim();

  // 1. Try Backend API first
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password: pass }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        saveUserSession(data.user, data.token || `token-${Date.now()}`, rememberMe);
        return { user: data.user, token: data.token };
      }
    }
  } catch {
    // Backend offline / fallback
  }

  // 2. Local Fallback - Allow ANY email and password to log in
  const localUsers = getStored<(UserAccount & { password: string })[]>(REGISTERED_USERS_KEY, DEFAULT_DEMO_USERS);
  let found = localUsers.find(u => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    // Auto-create user on the fly for any new email
    const rawUsername = cleanEmail.split('@')[0].replace(/[._-]+/g, ' ');
    const formattedName = rawUsername
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') || 'User';

    const isCreator = cleanEmail.includes('creator') || cleanEmail.includes('video') || cleanEmail.includes('studio');
    const role: 'brand' | 'creator' = isCreator ? 'creator' : 'brand';

    found = {
      id: `user-${Date.now()}`,
      name: formattedName,
      email: cleanEmail,
      password: pass,
      role: role,
      companyName: role === 'brand' ? `${formattedName}'s Brand` : undefined,
      category: 'Jewellery & Accessories',
      specialization: role === 'creator' ? 'Fashion & Jewellery Content' : undefined,
      avatarUrl: role === 'brand'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      handle: cleanEmail.split('@')[0]
    };

    localUsers.push(found);
    setStored(REGISTERED_USERS_KEY, localUsers);
  } else {
    // Allow any password entered by updating stored record
    found.password = pass;
    setStored(REGISTERED_USERS_KEY, localUsers);
  }

  const { password: _, ...safeUser } = found;
  const token = `token-${found.id}`;
  saveUserSession(safeUser, token, rememberMe);
  return { user: safeUser, token };
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: 'brand' | 'creator';
  companyName?: string;
  category?: MediaCategory;
  specialization?: string;
}): Promise<{ user: UserAccount; token: string }> => {
  const cleanEmail = data.email.toLowerCase().trim();

  // Try backend registration
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const respData = await res.json();
      if (respData.success && respData.user) {
        saveUserSession(respData.user, respData.token, true);
        return { user: respData.user, token: respData.token };
      }
    } else {
      const errorJson = await res.json().catch(() => null);
      if (errorJson && errorJson.message) {
        throw new Error(errorJson.message);
      }
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('fetch')) {
      throw err;
    }
  }

  // Fallback Local Registration
  const localUsers = getStored<(UserAccount & { password: string })[]>(REGISTERED_USERS_KEY, DEFAULT_DEMO_USERS);
  if (localUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email address already exists. Please log in.');
  }

  const newUser: UserAccount & { password: string } = {
    id: `user-${Date.now()}`,
    name: data.name.trim(),
    email: cleanEmail,
    password: data.password,
    role: data.role,
    companyName: data.role === 'brand' ? (data.companyName || `${data.name}'s Brand`) : undefined,
    category: data.category || 'Jewellery & Accessories',
    specialization: data.role === 'creator' ? (data.specialization || 'Content Creation') : undefined,
    avatarUrl: data.role === 'brand'
      ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    handle: data.name.toLowerCase().replace(/\s+/g, '_')
  };

  localUsers.push(newUser);
  setStored(REGISTERED_USERS_KEY, localUsers);

  const { password: _, ...safeUser } = newUser;
  const token = `demo-token-${newUser.id}`;
  saveUserSession(safeUser, token, true);

  return { user: safeUser, token };
};

export const resetPassword = async (email: string): Promise<string> => {
  const cleanEmail = email.toLowerCase().trim();
  try {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.message || `Password reset instructions sent to ${cleanEmail}.`;
    }
  } catch {
    // Fallback
  }
  return `Password reset instructions dispatched to ${cleanEmail}. (Demo password is: password123)`;
};
