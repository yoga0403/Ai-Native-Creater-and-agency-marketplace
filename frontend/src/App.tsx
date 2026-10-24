import { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Users,
  Briefcase,
  Star,
  Play,
  Film,
  Eye,
  User,
  Send,
  Plus,
  LogOut,
} from 'lucide-react';
import type {
  UserRole,
  BrandBrief,
  CreatorProfile,
  BusinessCategoryInfo,
  MediaCategory,
  UserAccount,
  CollaborationRequest,
  BusinessProfile
} from './types';
import {
  MOCK_CREATORS,
  MOCK_BRIEFS,
  BUSINESS_CATEGORIES,
  INITIAL_COLLABORATIONS,
  INITIAL_BUSINESS_PROFILES
} from './data/mockData';
import { VideoAdFeed } from './components/video/VideoAdFeed';
import { CollaborationModal } from './components/collaborations/CollaborationModal';
import { CollaborationChatModal } from './components/collaborations/CollaborationChatModal';
import { CampaignCreationModal } from './components/campaigns/CampaignCreationModal';
import { BusinessDashboardView } from './components/dashboard/BusinessDashboardView';
import { CreatorDashboardView } from './components/dashboard/CreatorDashboardView';
import { CreatorProfileModal } from './components/creators/CreatorProfileModal';
import { VoiceSearchBar } from './components/search/VoiceSearchBar';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import {
  getCollaborationRequests,
  getCampaigns,
  calculateSmartMatches,
  getBusinessProfiles,
  getCurrentUserSession,
  clearUserSession
} from './lib/api';
import './index.css';

export default function App() {
  // Navigation tabs: 'feed' | 'matcher' | 'creators' | 'campaigns' | 'business_dashboard' | 'creator_dashboard'
  const [activeTab, setActiveTab] = useState<'feed' | 'matcher' | 'creators' | 'campaigns' | 'business_dashboard' | 'creator_dashboard'>(() => {
    try {
      const cachedUser = getCurrentUserSession();
      return cachedUser?.role === 'creator' ? 'creator_dashboard' : 'business_dashboard';
    } catch {
      return 'feed';
    }
  });

  // Role State: 'brand' (Business) or 'creator'
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      return getCurrentUserSession()?.role ?? 'brand';
    } catch {
      return 'brand';
    }
  });

  // User Authentication & Session State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      return getCurrentUserSession();
    } catch {
      return null;
    }
  });
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState<boolean>(false);

  // Business Profiles State
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>(INITIAL_BUSINESS_PROFILES);
  const activeBusiness = useMemo(() => {
    return businessProfiles[0];
  }, [businessProfiles]);

  // Collaborations & Campaigns State
  const [collaborations, setCollaborations] = useState<CollaborationRequest[]>(INITIAL_COLLABORATIONS);
  const [campaigns, setCampaigns] = useState<BrandBrief[]>(MOCK_BRIEFS);
  const [creatorsList] = useState<CreatorProfile[]>(MOCK_CREATORS);
  const [categoriesList] = useState<BusinessCategoryInfo[]>(BUSINESS_CATEGORIES);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('All');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('All');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('All');
  const [maxBudgetFilter] = useState<number>(3000);

  const campaignVideoMap: Record<string, string> = {
    jewellery: 'https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4',
    jewelry: 'https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4',
    bridal: 'https://videos.pexels.com/video-files/4534280/4534280-hd_1920_1080_25fps.mp4',
    wedding: 'https://videos.pexels.com/video-files/4534280/4534280-hd_1920_1080_25fps.mp4',
    fashion: 'https://videos.pexels.com/video-files/2759477/2759477-hd_1920_1080_25fps.mp4',
    clothing: 'https://videos.pexels.com/video-files/2759477/2759477-hd_1920_1080_25fps.mp4',
    food: 'https://videos.pexels.com/video-files/2876511/2876511-hd_1920_1080_25fps.mp4',
    restaurant: 'https://videos.pexels.com/video-files/2876511/2876511-hd_1920_1080_25fps.mp4',
    beauty: 'https://videos.pexels.com/video-files/3185457/3185457-hd_1920_1080_25fps.mp4',
    skincare: 'https://videos.pexels.com/video-files/3185457/3185457-hd_1920_1080_25fps.mp4',
    electronics: 'https://videos.pexels.com/video-files/4467748/4467748-hd_1920_1080_25fps.mp4',
    tech: 'https://videos.pexels.com/video-files/4467748/4467748-hd_1920_1080_25fps.mp4',
    travel: 'https://videos.pexels.com/video-files/1618123/1618123-hd_1920_1080_25fps.mp4',
    tourism: 'https://videos.pexels.com/video-files/1618123/1618123-hd_1920_1080_25fps.mp4',
    education: 'https://videos.pexels.com/video-files/5212747/5212747-hd_1920_1080_25fps.mp4',
    learning: 'https://videos.pexels.com/video-files/5212747/5212747-hd_1920_1080_25fps.mp4',
    fitness: 'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4',
    wellness: 'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4',
    default: 'https://videos.pexels.com/video-files/853889/853889-hd_1920_1080_25fps.mp4',
  };

  const normalizeCampaignKey = (value: string) => {
    return (value || 'default')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const getCampaignVideoUrl = (category: string, prompt: string = '') => {
    const fullText = `${category} ${prompt}`.toLowerCase();
    const normalizedText = fullText.replace(/[^a-z0-9\s]/g, ' ');

    const campaignOrder = [
      ['jewellery', ['jewellery', 'jewelry', 'diamond', 'ring', 'necklace', 'bracelet', 'gold', 'luxury', 'accessory']],
      ['bridal', ['bridal', 'wedding', 'lehenga', 'saree', 'engagement', 'bride', 'groom', 'couture']],
      ['fashion', ['fashion', 'clothing', 'apparel', 'designer', 'runway', 'style', 'wardrobe', 'outfit']],
      ['food', ['food', 'restaurant', 'cafe', 'coffee', 'bakery', 'dining', 'burger', 'pizza', 'menu']],
      ['beauty', ['beauty', 'skincare', 'cosmetic', 'serum', 'makeup', 'glow', 'fragrance', 'skin']],
      ['electronics', ['electronics', 'tech', 'gadget', 'headphone', 'smartphone', 'device', 'camera', 'audio', 'laptop']],
      ['travel', ['travel', 'tourism', 'holiday', 'hotel', 'resort', 'vacation', 'destination', 'beach', 'villa']],
      ['education', ['education', 'college', 'campus', 'student', 'teacher', 'classroom', 'school', 'course']],
      ['fitness', ['fitness', 'gym', 'workout', 'wellness', 'athletic', 'health', 'exercise', 'nutrition']],
    ] as const;

    const explicitMatch = campaignOrder.find(([, keywords]) =>
      keywords.some((keyword) => normalizedText.includes(keyword))
    );

    if (explicitMatch) {
      return campaignVideoMap[explicitMatch[0]] || campaignVideoMap.default;
    }

    const categoryKey = normalizeCampaignKey(category);
    if (categoryKey in campaignVideoMap) {
      return campaignVideoMap[categoryKey];
    }

    return campaignVideoMap.default;
  };

  const activeCampaignVideoMatch = useMemo(() => {
    const prompt = `${searchQuery} ${selectedCategoryFilter}`.trim();
    const fallback = getCampaignVideoUrl(selectedCategoryFilter, prompt);
    const categoryEntries = Object.entries(campaignVideoMap).filter(([key]) => key !== 'default');

    const selectedKey = categoryEntries.find(([, value]) => value === fallback)?.[0] ?? 'default';
    return {
      url: fallback,
      categoryKey: selectedKey,
      label: selectedKey === 'default' ? 'Default fallback' : selectedKey,
    };
  }, [searchQuery, selectedCategoryFilter]);

  const matchedBackgroundVideo = activeCampaignVideoMatch.url;

  // Smart Matcher Interactive State
  const [matchCategory, setMatchCategory] = useState<MediaCategory>('Jewellery & Accessories');
  const [matchPlatform, setMatchPlatform] = useState<string>('Instagram');
  const [matchFormat, setMatchFormat] = useState<string>('Reel');
  const [matchBudget, setMatchBudget] = useState<number>(1200);

  // Modals State
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [selectedCreatorForCollab, setSelectedCreatorForCollab] = useState<CreatorProfile | null>(null);

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedCollabForChat, setSelectedCollabForChat] = useState<CollaborationRequest | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCreatorForProfile, setSelectedCreatorForProfile] = useState<CreatorProfile | null>(null);

  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Check persistent session & load platform data
  useEffect(() => {
    getCollaborationRequests().then(setCollaborations);
    getCampaigns().then(setCampaigns);
    getBusinessProfiles().then(setBusinessProfiles);
  }, []);

  // Compute filtered creators
  const filteredCreators = useMemo(() => {
    return creatorsList.filter((creator) => {
      // 1. Category Filter
      if (selectedCategoryFilter !== 'All') {
        const catMatch = creator.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
        if (!catMatch) return false;
      }

      // 2. Platform Filter
      if (selectedPlatformFilter !== 'All') {
        const platMatch = creator.platforms.some(p => p.toLowerCase() === selectedPlatformFilter.toLowerCase());
        if (!platMatch) return false;
      }

      // 3. Format Filter
      if (selectedFormatFilter !== 'All') {
        const formatMatch = creator.preferredFormats.some(f => f.toLowerCase().includes(selectedFormatFilter.toLowerCase()));
        if (!formatMatch) return false;
      }

      // 4. Language Filter
      if (selectedLanguageFilter !== 'All') {
        const langMatch = creator.languages?.some(l => l.toLowerCase().includes(selectedLanguageFilter.toLowerCase()));
        if (!langMatch) return false;
      }

      // 5. Budget Filter
      const rate = creator.pricing?.perReelRate || creator.hourlyRate || 0;
      if (rate > maxBudgetFilter) return false;

      // 6. Natural Language Search Query
      if (searchQuery.trim()) {
        const terms = searchQuery.toLowerCase().split(/\s+/).filter(t =>
          !['and', 'for', 'a', 'the', 'in', 'near', 'me', 'with', 'video', 'creators', 'influencers', 'makers'].includes(t)
        );
        const corpus = [
          creator.name,
          creator.handle,
          creator.headline,
          creator.bio,
          creator.category,
          creator.location || '',
          ...(creator.languages || []),
          ...(creator.specializations || []),
          ...(creator.platforms || []),
          ...(creator.preferredFormats || []),
          ...(creator.tools || []),
          ...creator.portfolio.map(p => `${p.title} ${p.prompt}`)
        ].join(' ').toLowerCase();

        if (terms.length > 0) {
          const hasMatch = terms.some(t => corpus.includes(t));
          if (!hasMatch) return false;
        } else {
          if (!corpus.includes(searchQuery.toLowerCase())) return false;
        }
      }

      return true;
    });
  }, [creatorsList, selectedCategoryFilter, selectedPlatformFilter, selectedFormatFilter, selectedLanguageFilter, maxBudgetFilter, searchQuery]);

  // Compute live smart matches for Matcher Tab
  const smartMatches = useMemo(() => {
    return calculateSmartMatches({
      businessCategory: matchCategory,
      platform: matchPlatform,
      contentType: matchFormat,
      budget: matchBudget,
    }, creatorsList);
  }, [matchCategory, matchPlatform, matchFormat, matchBudget, creatorsList]);

  // Open Contact Creator Modal
  const handleContactCreator = (creator: CreatorProfile) => {
    setSelectedCreatorForCollab(creator);
    setIsCollabModalOpen(true);
  };

  // Open View Profile Modal
  const handleViewProfile = (creator: CreatorProfile) => {
    setSelectedCreatorForProfile(creator);
    setIsProfileModalOpen(true);
  };

  // Handle successful collaboration submission
  const handleCollabSuccess = (newCollab: CollaborationRequest) => {
    setCollaborations(prev => [newCollab, ...prev]);
    showToast(`Collaboration request sent to ${newCollab.creatorName}!`);
  };

  // Handle status update from chat or dashboard
  const handleStatusUpdate = (collabId: string, status: CollaborationRequest['status']) => {
    setCollaborations(prev => prev.map(c => c.id === collabId ? { ...c, status, updatedAt: new Date().toISOString() } : c));
    showToast(`Collaboration status updated to "${status}"`);
  };

  // Handle successful login or registration
  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'brand') {
      setActiveTab('business_dashboard');
      showToast(`Welcome back, ${user.name}! Connected to Business Portal.`);
    } else {
      setActiveTab('creator_dashboard');
      showToast(`Welcome back, ${user.name}! Connected to Creator Portal.`);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    clearUserSession();
    setCurrentUser(null);
    setAuthView('login');
    showToast('You have been logged out.');
  };

  // Route Guard: Logged-out users only see Login or Signup
  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', background: '#07090E', fontFamily: 'var(--font-sans)' }}>
        {authView === 'login' ? (
          <LoginPage
            onSuccess={handleAuthSuccess}
            onNavigateToSignup={() => setAuthView('signup')}
            onOpenForgotPassword={() => setIsForgotPasswordOpen(true)}
          />
        ) : (
          <SignupPage
            onSuccess={handleAuthSuccess}
            onNavigateToLogin={() => setAuthView('login')}
          />
        )}

        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen}
          onClose={() => setIsForgotPasswordOpen(false)}
          onBackToLogin={() => setIsForgotPasswordOpen(false)}
        />

        {/* Global Toast */}
        {toastMsg && (
          <div
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              right: '1.5rem',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              padding: '0.85rem 1.25rem',
              borderRadius: '0.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              color: '#FFFFFF',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              zIndex: 9999,
            }}
          >
            <CheckCircle2 style={{ width: '1.1rem', height: '1.1rem', color: '#10B981' }} />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#07090E', color: '#F1F5F9' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 10000,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#FFFFFF',
            padding: '0.85rem 1.25rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          <CheckCircle2 style={{ width: '1.1rem', height: '1.1rem' }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* NAVBAR */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(7, 9, 14, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0.75rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo & Headline */}
          <div
            onClick={() => setActiveTab('feed')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '2.4rem',
                height: '2.4rem',
                borderRadius: '0.65rem',
                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
              }}
            >
              <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: '#FFFFFF' }} />
            </div>
            <div>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF', display: 'block' }}>
                CreatorConnect <span style={{ color: '#06B6D4' }}>AI</span>
              </span>
              <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'block', marginTop: '-2px' }}>
                Video Ad & Creator Marketplace
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="nav-links">
            <button
              onClick={() => setActiveTab('feed')}
              className={`btn btn-sm ${activeTab === 'feed' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <Film style={{ width: '0.85rem', height: '0.85rem' }} /> Video Feed
            </button>

            <button
              onClick={() => setActiveTab('matcher')}
              className={`btn btn-sm ${activeTab === 'matcher' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <Sparkles style={{ width: '0.85rem', height: '0.85rem', color: '#8B5CF6' }} /> Smart Match
            </button>

            <button
              onClick={() => setActiveTab('creators')}
              className={`btn btn-sm ${activeTab === 'creators' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <Users style={{ width: '0.85rem', height: '0.85rem' }} /> Discover Creators
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`btn btn-sm ${activeTab === 'campaigns' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <Briefcase style={{ width: '0.85rem', height: '0.85rem' }} /> Campaigns ({campaigns.length})
            </button>

            {/* Role Dashboards */}
            <button
              onClick={() => {
                setCurrentRole('brand');
                setActiveTab('business_dashboard');
              }}
              className={`btn btn-sm ${activeTab === 'business_dashboard' ? 'btn-cyan' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <Briefcase style={{ width: '0.85rem', height: '0.85rem' }} /> Business Portal
            </button>

            <button
              onClick={() => {
                setCurrentRole('creator');
                setActiveTab('creator_dashboard');
              }}
              className={`btn btn-sm ${activeTab === 'creator_dashboard' ? 'btn-emerald' : 'btn-ghost'}`}
              style={{ fontSize: '0.8rem', gap: '0.35rem' }}
            >
              <User style={{ width: '0.85rem', height: '0.85rem' }} /> Creator Portal
            </button>
          </div>

          {/* Quick Actions & Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                fontSize: '0.78rem',
                gap: '0.35rem',
              }}
            >
              <Plus style={{ width: '0.85rem', height: '0.85rem' }} /> Post Campaign
            </button>

            {/* User Profile Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.35rem 0.75rem',
                borderRadius: '0.65rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: '1.6rem',
                  height: '1.6rem',
                  borderRadius: '50%',
                  background: currentUser.role === 'brand' ? 'linear-gradient(135deg, #8B5CF6, #6366F1)' : 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                }}
              >
                {currentUser.name.charAt(0)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1 }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: '0.65rem', color: currentUser.role === 'brand' ? '#A78BFA' : '#22D3EE' }}>
                  {currentUser.role === 'brand' ? 'Business Account' : 'Creator Account'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm"
              title="Log out of your account"
              style={{
                fontSize: '0.78rem',
                gap: '0.35rem',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.08)',
              }}
            >
              <LogOut style={{ width: '0.85rem', height: '0.85rem' }} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN VIEW CONTROLLER */}
      {activeTab === 'business_dashboard' ? (
        <BusinessDashboardView
          business={activeBusiness}
          collaborations={collaborations}
          creators={creatorsList}
          onCreateCampaign={() => setIsCampaignModalOpen(true)}
          onOpenChat={(collab) => {
            setSelectedCollabForChat(collab);
            setIsChatModalOpen(true);
          }}
          onContactCreator={handleContactCreator}
          onViewProfile={handleViewProfile}
        />
      ) : activeTab === 'creator_dashboard' ? (
        <CreatorDashboardView
          creator={creatorsList[0]}
          collaborations={collaborations}
          onOpenChat={(collab) => {
            setSelectedCollabForChat(collab);
            setIsChatModalOpen(true);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      ) : (
        <main style={{ flexGrow: 1 }}>
          {/* HERO VALUE PROPOSITION */}
          <section
            style={{
              padding: '4rem 1.5rem 2.5rem 1.5rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.25), transparent)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                opacity: 0.32,
                pointerEvents: 'none',
              }}
            >
              <video
                key={matchedBackgroundVideo}
                src={matchedBackgroundVideo}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(1px) saturate(1.15) brightness(0.6)',
                }}
              />
            </div>

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(7, 9, 14, 0.2) 0%, rgba(7, 9, 14, 0.75) 100%)',
                zIndex: 1,
              }}
            />

            <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '2rem',
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#C4B5FD',
                  fontSize: '0.8rem',
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles style={{ width: '0.85rem', height: '0.85rem' }} />
                <span>Smart Video Advertisement & Creator Connection Marketplace</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  color: '#FFFFFF',
                  margin: '0 0 1.25rem 0',
                }}
              >
                Connect Your Business with{' '}
                <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Category-Matched Video Creators
                </span>
              </h1>

              <p
                style={{
                  fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
                  color: '#94A3B8',
                  lineHeight: 1.6,
                  maxWidth: '780px',
                  margin: '0 auto 2rem auto',
                }}
              >
                <strong>Jewellery shops</strong> discover fine gold & macro diamond reviewers.{' '}
                <strong>Clothing brands</strong> find fashion influencers & saree stylists.{' '}
                <strong>Colleges</strong> partner with campus tour & student-life vloggers.{' '}
                Every business connected with creators who match its category, audience, and budget.
              </p>

              {/* Natural Language Voice & Text Search Bar */}
              <div style={{ maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
                <VoiceSearchBar
                  value={searchQuery}
                  onChange={(val) => setSearchQuery(val)}
                  onSearch={(val) => {
                    setSearchQuery(val);
                    setActiveTab('creators');
                  }}
                  onCategorySelect={(cat) => {
                    setSelectedCategoryFilter(cat);
                    setActiveTab('creators');
                  }}
                  placeholder="Try 'Jewellery video creators', 'Saree influencers', or 'College campus tours'..."
                  style={{ width: '100%' }}
                />
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '999px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  color: '#E2E8F0',
                  fontSize: '0.72rem',
                  marginBottom: '1.25rem',
                }}
              >
                <span style={{ color: '#8B5CF6', fontWeight: 700 }}>Active media match:</span>
                <span>{activeCampaignVideoMatch.label}</span>
              </div>

              {/* 10 Sample Business Categories Carousel / Chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {categoriesList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategoryFilter(cat.name);
                      setMatchCategory(cat.name);
                      setActiveTab('creators');
                    }}
                    style={{
                      background: selectedCategoryFilter === cat.name ? 'linear-gradient(135deg, #8B5CF6, #06B6D4)' : '#0F172A',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: selectedCategoryFilter === cat.name ? '#FFFFFF' : '#CBD5E1',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '2rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{cat.name}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.75, fontFamily: 'var(--font-mono)' }}>({cat.creatorCount})</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* TAB 1: VIDEO ADVERTISEMENT FEED */}
          {activeTab === 'feed' && (
            <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-tool">Live Video Feed</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Individual HTML5 Video Cards • Muted by Default</span>
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Promotional Video Advertisements & Creator Reels
                  </h2>
                </div>

                <button
                  onClick={() => setActiveTab('matcher')}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem', fontSize: '0.75rem' }}
                >
                  <Sparkles style={{ width: '0.8rem', height: '0.8rem', color: '#8B5CF6' }} /> Match for My Category
                </button>
              </div>

              {/* Dedicated Video Advertisement Feed */}
              <VideoAdFeed
                creators={creatorsList}
                selectedCategory={selectedCategoryFilter}
                onCategorySelect={(cat) => setSelectedCategoryFilter(cat)}
                onContactCreator={handleContactCreator}
                onViewProfile={handleViewProfile}
              />
            </section>
          )}

          {/* TAB 2: SMART CREATOR MATCHER */}
          {activeTab === 'matcher' && (
            <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
              <div
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: '1.25rem',
                  marginBottom: '2.5rem',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  background: 'linear-gradient(135deg, rgba(13, 17, 26, 0.95), rgba(20, 25, 45, 0.85))',
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <Sparkles style={{ width: '1.2rem', height: '1.2rem', color: '#8B5CF6' }} />
                    <span style={{ fontSize: '0.8rem', color: '#A78BFA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Automated Creator Recommendation System
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Smart Category-Based Creator Matcher
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.35rem 0 0 0' }}>
                    Select your business industry, target platform, video format, and budget to compute verified creator affinity scores.
                  </p>
                </div>

                {/* Matcher Criteria Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', background: '#07090E', padding: '1.25rem', borderRadius: '0.85rem', border: '1px solid var(--border-subtle)' }}>
                  {/* Category */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                      Your Business Category
                    </label>
                    <select
                      value={matchCategory}
                      onChange={(e) => setMatchCategory(e.target.value as MediaCategory)}
                      className="input-field"
                      style={{ width: '100%', fontSize: '0.8rem' }}
                    >
                      {categoriesList.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Platform */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                      Target Social Platform
                    </label>
                    <select
                      value={matchPlatform}
                      onChange={(e) => setMatchPlatform(e.target.value)}
                      className="input-field"
                      style={{ width: '100%', fontSize: '0.8rem' }}
                    >
                      <option value="All">All Platforms</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                  </div>

                  {/* Format */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                      Preferred Content Format
                    </label>
                    <select
                      value={matchFormat}
                      onChange={(e) => setMatchFormat(e.target.value)}
                      className="input-field"
                      style={{ width: '100%', fontSize: '0.8rem' }}
                    >
                      <option value="Reel">Reels (9:16)</option>
                      <option value="Campus Tour">Campus Tour</option>
                      <option value="Review">Product Review</option>
                      <option value="Unboxing">Unboxing Video</option>
                      <option value="Short Video">Short Video (15s-30s)</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                      Max Budget: ${matchBudget}
                    </label>
                    <input
                      type="range"
                      min={200}
                      max={3000}
                      step={100}
                      value={matchBudget}
                      onChange={(e) => setMatchBudget(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#8B5CF6', marginTop: '0.4rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Matched Results Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
                {smartMatches.map(({ creator, matchScore, matchReasons, isTopMatch }) => (
                  <div
                    key={creator.id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      borderRadius: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      border: isTopMatch ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid var(--border-subtle)',
                      boxShadow: isTopMatch ? '0 10px 30px rgba(6, 182, 212, 0.1)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={creator.avatarUrl}
                            alt={creator.name}
                            style={{ width: '3.25rem', height: '3.25rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid #8B5CF6' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                                {creator.name}
                              </h4>
                              {creator.isVerified && (
                                <CheckCircle2 style={{ width: '0.85rem', height: '0.85rem', color: '#10B981' }} />
                              )}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                              @{creator.handle} • {creator.location || 'Location Not provided'}
                            </span>
                          </div>
                        </div>

                        <span
                          className="badge badge-cyan"
                          style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
                        >
                          {matchScore}% Match
                        </span>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
                        {creator.headline}
                      </p>

                      {/* Dynamic Recommendation Reasons */}
                      <div
                        style={{
                          background: 'rgba(139, 92, 246, 0.08)',
                          borderRadius: '0.65rem',
                          padding: '0.75rem 0.95rem',
                          marginBottom: '0.85rem',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                        }}
                      >
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A78BFA', display: 'block', marginBottom: '0.25rem' }}>
                          Why this creator is recommended:
                        </span>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.72rem', color: '#E2E8F0', lineHeight: 1.5 }}>
                          {matchReasons.map((reason, idx) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Verified stats without fake numbers */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8' }}>
                        <span>
                          Est. Rate: <strong style={{ color: '#FFF' }}>{creator.pricing?.perReelRate ? `$${creator.pricing.perReelRate}/reel` : 'Not provided'}</strong>
                        </span>
                        <span>
                          Reach: <strong style={{ color: '#FFF' }}>{creator.followerCount || 'Not provided'}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        onClick={() => handleViewProfile(creator)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', justifyContent: 'center' }}
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleContactCreator(creator)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem', justifyContent: 'center', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                      >
                        Contact Creator
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 3: DISCOVER CREATORS DIRECTORY */}
          {activeTab === 'creators' && (
            <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Discover Video Creators ({filteredCreators.length})
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                    Find specialized video directors, campus tour creators, fashion stylists & food reviewers
                  </p>
                </div>

                <div style={{ width: '380px', maxWidth: '100%' }}>
                  <VoiceSearchBar
                    value={searchQuery}
                    onChange={(val) => setSearchQuery(val)}
                    placeholder="Search name, tools, or niche..."
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Faceted Filter Toolbar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#0D111A', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
                {/* Row 1: Category Filter */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, minWidth: '75px' }}>Category:</span>
                  <button
                    onClick={() => setSelectedCategoryFilter('All')}
                    className={`btn btn-sm ${selectedCategoryFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                  >
                    All Categories
                  </button>
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(cat.name)}
                      className={`btn btn-sm ${selectedCategoryFilter === cat.name ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Row 2: Platform, Format & Budget */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  {/* Platforms */}
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Platform:</span>
                    {['All', 'Instagram', 'YouTube', 'TikTok', 'Facebook'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedPlatformFilter(p)}
                        className={`btn btn-sm ${selectedPlatformFilter === p ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Formats */}
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Format:</span>
                    {['All', 'Reel', 'Campus Tour', 'Review', 'Unboxing'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFormatFilter(f)}
                        className={`btn btn-sm ${selectedFormatFilter === f ? 'btn-cyan' : 'btn-secondary'}`}
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {/* Languages */}
                  <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Language:</span>
                    {['All', 'English', 'Hindi'].map((l) => (
                      <button
                        key={l}
                        onClick={() => setSelectedLanguageFilter(l)}
                        className={`btn btn-sm ${selectedLanguageFilter === l ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Empty state */}
              {filteredCreators.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem', background: '#0D111A', borderRadius: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <Users style={{ width: '2.5rem', height: '2.5rem', color: '#64748B', margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                    No Creators Found
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
                    Try loosening your category, language, or search terms to discover more talent.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('All');
                      setSelectedPlatformFilter('All');
                      setSelectedFormatFilter('All');
                      setSelectedLanguageFilter('All');
                      setSearchQuery('');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.75rem' }}>
                  {filteredCreators.map((creator) => (
                    <div
                      key={creator.id}
                      className="glass-card"
                      style={{
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1.25rem',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        {/* Header with Photo, Category, Rating */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                            <img
                              src={creator.avatarUrl}
                              alt={creator.name}
                              style={{ width: '3.75rem', height: '3.75rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid #8B5CF6' }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                                  {creator.name}
                                </h3>
                                <span className="badge badge-tool" style={{ fontSize: '0.65rem' }}>{creator.category}</span>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                                @{creator.handle} • {creator.location || 'Location Not provided'}
                              </p>
                            </div>
                          </div>

                          <div className="badge badge-amber" style={{ gap: '0.25rem', fontSize: '0.72rem' }}>
                            <Star style={{ width: '0.75rem', height: '0.75rem', fill: '#F59E0B' }} />
                            {creator.rating ? `${creator.rating} (${creator.completedBriefs} deals)` : 'Not provided'}
                          </div>
                        </div>

                        {/* Social Platforms Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                          {creator.platforms.map((plat) => (
                            <span key={plat} className="badge badge-tool" style={{ fontSize: '0.68rem' }}>
                              {plat}
                            </span>
                          ))}
                          <span style={{ fontSize: '0.7rem', color: '#A5B4FC', fontFamily: 'var(--font-mono)', marginLeft: '0.25rem' }}>
                            Reach: {creator.followerCount || 'Not provided'}
                          </span>
                        </div>

                        {/* Headline */}
                        <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
                          {creator.headline}
                        </p>

                        {/* Languages & Formats */}
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '1rem', flexWrap: 'wrap' }}>
                          <span><strong>Languages:</strong> {creator.languages ? creator.languages.join(', ') : 'Not provided'}</span>
                          <span><strong>Formats:</strong> {creator.preferredFormats.join(', ')}</span>
                        </div>

                        {/* Portfolio Video Thumbnails */}
                        <div style={{ marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                            <Film style={{ width: '0.75rem', height: '0.75rem', color: '#06B6D4' }} /> Portfolio Videos (Click to inspect):
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                            {creator.portfolio.slice(0, 3).map((item) => (
                              <div
                                key={item.id}
                                onClick={() => handleViewProfile(creator)}
                                style={{
                                  position: 'relative',
                                  height: '90px',
                                  borderRadius: '0.5rem',
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  border: '1px solid var(--border-subtle)',
                                }}
                              >
                                <img
                                  src={item.thumbnailUrl || item.mediaUrl}
                                  alt={item.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div className="play-badge" style={{ width: '1.6rem', height: '1.6rem' }}>
                                  <Play style={{ width: '0.7rem', height: '0.7rem', fill: '#FFF' }} />
                                </div>
                                {item.duration && (
                                  <div className="duration-pill">{item.duration}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom: Rate, View Profile & Contact Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block' }}>Commercial Rate</span>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                            {creator.pricing?.perReelRate ? `$${creator.pricing.perReelRate}/reel` : creator.hourlyRate ? `$${creator.hourlyRate}/hr` : 'Not provided'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleViewProfile(creator)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', gap: '0.35rem' }}
                          >
                            <Eye style={{ width: '0.8rem', height: '0.8rem' }} /> View Profile
                          </button>
                          <button
                            onClick={() => handleContactCreator(creator)}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.75rem', gap: '0.35rem', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                          >
                            <Send style={{ width: '0.8rem', height: '0.8rem' }} /> Contact Creator
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 4: ADVERTISEMENT CAMPAIGNS (BRIEFS) */}
          {activeTab === 'campaigns' && (
            <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Active Advertisement Campaigns ({campaigns.length})
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                    Open commercial video briefs seeking category-aligned creators
                  </p>
                </div>

                <button
                  onClick={() => setIsCampaignModalOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', gap: '0.35rem' }}
                >
                  <Plus style={{ width: '0.85rem', height: '0.85rem' }} /> Post Campaign Brief
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
                {campaigns.map((brief) => (
                  <div
                    key={brief.id}
                    className="glass-card"
                    style={{
                      padding: '1.5rem',
                      borderRadius: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <span className="badge badge-tool" style={{ fontSize: '0.68rem', marginBottom: '0.35rem' }}>
                            {brief.category}
                          </span>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.25rem 0' }}>
                            {brief.title}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: '#67E8F9' }}>
                            Brand: {brief.brandName}
                          </span>
                        </div>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Open</span>
                      </div>

                      <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5, margin: '0.5rem 0 0.85rem 0' }}>
                        {brief.description}
                      </p>

                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <div><strong>Target Audience:</strong> {brief.targetAudience || 'General Consumers'}</div>
                        <div><strong>Deliverables:</strong> {brief.deliverablesSummary || `${brief.deliverablesCount} Master Videos`}</div>
                        <div><strong>Preferred Platform:</strong> {brief.platform || 'Instagram'} • <strong>Format:</strong> {brief.contentType || 'Reel'}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: '#94A3B8', display: 'block' }}>Budget Range</span>
                        <strong style={{ fontSize: '1rem', color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                          ${brief.budgetMin} - ${brief.budgetMax}
                        </strong>
                      </div>

                      <button
                        onClick={() => {
                          showToast(`Interested in "${brief.title}"! Please connect directly with ${brief.brandName}.`);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        Submit Proposal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}

      {/* FOOTER */}
      <footer style={{ background: '#05070C', borderTop: '1px solid var(--border-subtle)', padding: '2.5rem 1.5rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
              CreatorConnect <span style={{ color: '#06B6D4' }}>AI</span>
            </span>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
              Smart Video Advertisement & Creator Connection Marketplace.
            </p>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
            Built for Businesses & Creators • All Rights Reserved 2026
          </div>
        </div>
      </footer>

      {/* ALL MODALS */}
      {/* 1. Collaboration Request Modal */}
      <CollaborationModal
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        creator={selectedCreatorForCollab}
        businessName={currentUser?.companyName || 'My Business'}
        onSuccess={handleCollabSuccess}
      />

      {/* 2. Collaboration In-Platform Messaging Modal */}
      <CollaborationChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        collaboration={selectedCollabForChat}
        currentUserRole={currentRole}
        currentUserId={currentUser?.id || 'user-1'}
        currentUserName={currentUser?.name || 'User'}
        onStatusChange={(updated) => {
          handleStatusUpdate(updated.id, updated.status);
        }}
      />

      {/* 3. Creator Profile Modal */}
      <CreatorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        creator={selectedCreatorForProfile}
        onContactCreator={handleContactCreator}
      />

      {/* 4. Campaign Creation Modal */}
      <CampaignCreationModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onSuccess={(newBrief) => {
          setCampaigns(prev => [newBrief, ...prev]);
          showToast(`Campaign "${newBrief.title}" published!`);
        }}
      />


    </div>
  );
}
