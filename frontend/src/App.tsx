import { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Users,
  Briefcase,
  ShieldCheck,
  Terminal,
  Cpu,
  Star,
  ArrowRight,
  ArrowLeft,
  X,
  Copy,
  Check,
  Wand2,
  Bot,
  Send,
  Play,
  Film,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Layers,
  Video,
  Lock,
  Mail,
  User,
  LogIn,
  LogOut,
  TrendingUp,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import type {
  UserRole,
  PortfolioItem,
  BrandBrief,
  ProjectContract,
  CreatorProfile,
  BusinessCategoryInfo,
  MediaCategory,
  UserAccount
} from './types';
import {
  MOCK_CREATORS,
  MOCK_BRIEFS,
  MOCK_PROJECTS,
  BUSINESS_CATEGORIES
} from './data/mockData';
import { VideoPlayer } from './components/video/VideoPlayer';
import { VoiceSearchBar } from './components/search/VoiceSearchBar';
import './index.css';

const API_BASE = 'http://localhost:5000/api';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
const AUTH_TOKEN_KEY = 'creatorconnect_auth_token';

const getAuthToken = () =>
  localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);

// Curated Trending Showcase Items across all 8 sectors
const TRENDING_SHOWCASE: (PortfolioItem & { creatorName: string; creatorHandle: string; avatarUrl: string })[] = [
  {
    id: 'trend-1',
    title: 'Royal Crimson Velvet Lehenga Reel',
    mediaUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Jurun_Ceremony.webm',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    videoAttribution: {
      title: 'Jurun Ceremony',
      creator: 'Nayan j Nath',
      license: 'CC BY-SA 4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jurun_Ceremony.webm',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    duration: '1:03',
    mediaType: 'video',
    category: 'Bridal & Wedding',
    prompt: 'Cinematic slow motion tracking shot of an Indian bride twirling in hand-embroidered royal velvet lehenga inside candlelit palace, gold zardozi shimmering, anamorphic 8k.',
    model: 'Runway Gen-3 Alpha + LoRA',
    aspectRatio: '9:16',
    tools: ['Runway Gen-3', 'ComfyUI', 'Topaz Video AI'],
    createdAt: 'Today',
    creatorName: 'Aanya Kapoor',
    creatorHandle: 'aanya_bridal_ai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'trend-2',
    title: 'Sparkling Citrus Soda Burst Commercial',
    mediaUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Blueberry_Energy_Boost_Smoothie._A_Daphne_Oz_Smoothie_Recipe.webm',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    videoAttribution: {
      title: 'Blueberry Energy Boost Smoothie',
      creator: 'The Daily Vitamin',
      license: 'CC BY 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Blueberry_Energy_Boost_Smoothie._A_Daphne_Oz_Smoothie_Recipe.webm',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    },
    duration: '2:17',
    mediaType: 'video',
    category: 'Drinks & Beverage',
    prompt: 'High-speed macro strobe slow-motion camera tracking a chilled citrus sparkling can bursting through crystalline ice cubes and lime droplets, studio lighting.',
    model: 'Midjourney v6.1 + Runway Gen-3',
    aspectRatio: '9:16',
    tools: ['Runway Gen-3', 'After Effects', 'Topaz Video'],
    createdAt: 'Yesterday',
    creatorName: 'Liam Chen',
    creatorHandle: 'liam_cpg_visuals',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'trend-3',
    title: 'Cyberpunk Haute Couture Runway',
    mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Amsterdam_Fashion_Week_-_Aftermovie.webm',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    videoAttribution: {
      title: 'Amsterdam Fashion Week - Aftermovie',
      creator: 'SBS Broadcasting',
      license: 'CC BY-SA 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Amsterdam_Fashion_Week_-_Aftermovie.webm',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    },
    duration: '2:31',
    mediaType: 'video',
    category: 'Clothing & Fashion',
    prompt: 'Iridescent liquid organza trench coat flowing in slow motion along a neon-lit futuristic runway in rain, Tokyo reflections, high fashion editorial camera.',
    model: 'Flux.1 Dev + Kling AI',
    aspectRatio: '9:16',
    tools: ['Flux.1 Dev', 'Runway Gen-3', 'Topaz 4K'],
    createdAt: '2 days ago',
    creatorName: 'Elena Rostova',
    creatorHandle: 'elena_fashion_vfx',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'trend-4',
    title: '24K Emerald Cut Solitaire Macro',
    mediaUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/3D_CGI_Jewellery_Animation.webm',
    thumbnailUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    videoAttribution: {
      title: '3D CGI Jewellery Animation',
      creator: 'John Harwood',
      license: 'CC BY 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:3D_CGI_Jewellery_Animation.webm',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    },
    duration: '0:25',
    mediaType: 'video',
    category: 'Jewellery & Accessories',
    prompt: 'Extreme macro slow motion pan across an emerald cut solitaire ring with ray-traced light caustics and velvet cushion, studio luxury commercial.',
    model: 'Flux.1 Dev + ControlNet',
    aspectRatio: '1:1',
    tools: ['Flux.1 Dev', 'Magnific AI'],
    createdAt: '3 days ago',
    creatorName: 'Rohan Mehta',
    creatorHandle: 'rohan_luxury_jewels',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'trend-5',
    title: 'Santorini Cliffside 4K Drone Sunset',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Ocean_waves_at_L%C3%A6kjavik_beach%2C_Iceland.webm',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    videoAttribution: {
      title: 'Ocean waves at Lækjavik beach, Iceland',
      creator: 'Alexander Grebenkov',
      license: 'CC BY 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ocean_waves_at_L%C3%A6kjavik_beach,_Iceland.webm',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    },
    duration: '0:09',
    mediaType: 'video',
    category: 'Travel & Lifestyle',
    prompt: 'Cinematic FPV drone descent over cliffside infinity pool into Aegean Sea golden hour sunset, 4K HDR luxury resort promotional commercial.',
    model: 'Runway Gen-3 Alpha',
    aspectRatio: '16:9',
    tools: ['Runway Gen-3', 'Midjourney v6.1'],
    createdAt: '4 days ago',
    creatorName: 'Mateo Silva',
    creatorHandle: 'mateo_wander_ai',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'trend-6',
    title: 'Sizzling A5 Wagyu Charcoal Grill',
    mediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Amazing_Falafel_Shop_in_Tehran_-_IRAN_Street_Food_-_%D9%81%D9%84%D8%A7%D9%81%D9%84.webm',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    videoAttribution: {
      title: 'Amazing Falafel Shop in Tehran - Iran Street Food',
      creator: 'Street Food Tourists',
      license: 'CC BY 3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Amazing_Falafel_Shop_in_Tehran_-_IRAN_Street_Food_-_%D9%81%D9%84%D8%A7%D9%81%D9%84.webm',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
    },
    duration: '8:10',
    mediaType: 'video',
    category: 'Food & Restaurants',
    prompt: 'Sensory extreme macro slow-motion 120fps video of A5 Wagyu ribeye searing over glowing binchotan charcoal with rising smoke and fat render.',
    model: 'Pika 2.1 + Runway Gen-3',
    aspectRatio: '9:16',
    tools: ['Pika 2.1', 'Runway Gen-3'],
    createdAt: '5 days ago',
    creatorName: 'Chef Kenji Sato',
    creatorHandle: 'kenji_culinary_ai',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
];

export function App() {
  // Navigation View State: 'marketplace' | 'login' | 'signup'
  const [currentView, setCurrentView] = useState<'marketplace' | 'login' | 'signup'>('marketplace');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('creatorconnect_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState<UserRole>('brand');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authHandle, setAuthHandle] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Forgot Password State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState<string | null>(null);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  // Application Filter & View State
  const [currentRole, setCurrentRole] = useState<UserRole>('brand');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToolFilter, setSelectedToolFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('All');
  const [selectedMediaTypeFilter, setSelectedMediaTypeFilter] = useState<'All' | 'video' | 'image'>('All');

  // Modals & Drawers
  const [inspectingItem, setInspectingItem] = useState<PortfolioItem | null>(null);
  const [selectedCreatorForProfile, setSelectedCreatorForProfile] = useState<CreatorProfile | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isCreateBriefOpen, setIsCreateBriefOpen] = useState(false);
  const [isSubmitProposalOpen, setIsSubmitProposalOpen] = useState(false);
  const [selectedBriefForPitch, setSelectedBriefForPitch] = useState<BrandBrief | null>(null);
  const [isDealRoomOpen, setIsDealRoomOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectContract>(MOCK_PROJECTS[0]);

  // Notifications & Marketplace collections
  const [briefs, setBriefs] = useState<BrandBrief[]>(MOCK_BRIEFS);
  const [creatorsList, setCreatorsList] = useState<CreatorProfile[]>(MOCK_CREATORS);
  const [categoriesList, setCategoriesList] = useState<BusinessCategoryInfo[]>(BUSINESS_CATEGORIES);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Sync with live backend if running
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setCategoriesList(res.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/briefs`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setBriefs(res.data);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE}/creators`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setCreatorsList(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Synchronize currentRole with currentUser
  useEffect(() => {
    if (currentUser) {
      setCurrentRole(currentUser.role);
    }
  }, [currentUser]);

  // AI Brief Co-Pilot State
  const [copilotInput, setCopilotInput] = useState(
    'We need a 30-second bridal lehenga commercial reel with royal velvet embroidery, macro jewellery caustics, and slow-motion fabric flow for Instagram.'
  );
  const [isCopilotGenerating, setIsCopilotGenerating] = useState(false);
  const [copilotOutput, setCopilotOutput] = useState<{
    title: string;
    description: string;
    category: MediaCategory;
    requiredTools: string[];
    deliverablesCount: number;
    budgetMin: number;
    budgetMax: number;
    aspectRatio: string;
    promptFormula: string;
  } | null>(null);

  // New Brief Form State
  const [newBriefTitle, setNewBriefTitle] = useState('');
  const [newBriefDesc, setNewBriefDesc] = useState('');
  const [newBriefCategory, setNewBriefCategory] = useState<MediaCategory>('Bridal & Wedding');
  const [newBriefBudgetMin, setNewBriefBudgetMin] = useState(800);
  const [newBriefBudgetMax, setNewBriefBudgetMax] = useState(1500);

  // Pitch Form State
  const [pitchAmount, setPitchAmount] = useState(1000);
  const [pitchDays, setPitchDays] = useState(4);
  const [pitchCover, setPitchCover] = useState(
    'I have custom-trained LoRAs and a specialized ComfyUI + Runway Gen-3 workflow that ensures 100% character and embroidery continuity across all requested deliverables.'
  );

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Protected Route Check
  const requireAuth = (actionName: string, callback: () => void) => {
    if (!currentUser) {
      setAuthError(`Please sign in to ${actionName}.`);
      setIsAuthModalOpen(true);
      return;
    }
    callback();
  };

  // Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authEmail || !authPassword) {
      setAuthError('Please enter both your email address and password.');
      return;
    }

    setIsAuthLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        completeSuccessfulAuth(data.user, 'Signed in successfully!', data.token);
      } else {
        setAuthError(data.message || 'Invalid email or password. Please verify your credentials.');
      }
    } catch {
      // Local fallback checking for offline testing
      if (authEmail === 'brand@acme.com' && authPassword === 'password123') {
        const localUser: UserAccount = {
          id: 'user-brand-1',
          name: 'Sarah Jenkins',
          email: 'brand@acme.com',
          role: 'brand',
          companyName: 'Acme Luxury Brands',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
          handle: 'sarah_acme',
        };
        completeSuccessfulAuth(localUser, 'Signed in successfully as Brand!');
      } else if (authEmail === 'creator@creatorconnect.ai' && authPassword === 'password123') {
        const localUser: UserAccount = {
          id: 'user-creator-1',
          name: 'Aanya Kapoor',
          email: 'creator@creatorconnect.ai',
          role: 'creator',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          handle: 'aanya_bridal_ai',
        };
        completeSuccessfulAuth(localUser, 'Signed in successfully as Creator!');
      } else {
        setAuthError('Invalid credentials. Check your email or use "Demo Brand" / "Demo Creator".');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Signup Submission
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authName || !authEmail || !authPassword || !authConfirmPassword) {
      setAuthError('All fields are required to create an account.');
      return;
    }

    if (authPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    setIsAuthLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          password: authPassword,
          role: authRole,
          handle: authHandle || authName.toLowerCase().replace(/\s+/g, '_'),
        }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.user && data.token) {
        completeSuccessfulAuth(data.user, `Account created! Welcome, ${data.user.name}!`, data.token);
      } else if (res.ok && data.requiresEmailConfirmation) {
        setAuthError(data.message || 'Confirm your email address, then sign in.');
      } else {
        setAuthError(data.message || 'Unable to register account. This email may already be in use.');
      }
    } catch {
      // Local fallback creation
      const localUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: authName,
        email: authEmail,
        role: authRole,
        handle: authHandle || authName.toLowerCase().replace(/\s+/g, '_'),
        avatarUrl: authRole === 'brand'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };
      completeSuccessfulAuth(localUser, `Account created! Welcome, ${localUser.name}!`);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const completeSuccessfulAuth = (user: UserAccount, welcomeMessage: string, token?: string) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    if (token) {
      (rememberMe ? localStorage : sessionStorage).setItem(AUTH_TOKEN_KEY, token);
    }
    if (rememberMe) {
      localStorage.setItem('creatorconnect_auth_user', JSON.stringify(user));
    }
    setIsAuthModalOpen(false);
    setCurrentView('marketplace');
    setAuthError(null);
    setAuthPassword('');
    setAuthConfirmPassword('');
    showToast(welcomeMessage);

    // Redirect to relevant section based on role
    if (user.role === 'creator') {
      setTimeout(() => {
        const el = document.getElementById('creators');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setAuthError(null);
    if (role === 'brand') {
      const demoUser: UserAccount = {
        id: 'user-brand-1',
        name: 'Sarah Jenkins',
        email: 'brand@acme.com',
        role: 'brand',
        companyName: 'Acme Luxury Brands',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        handle: 'sarah_acme',
      };
      completeSuccessfulAuth(demoUser, 'Signed in as Demo Brand (Sarah Jenkins). Redirected to Brand Campaign Hub.');
    } else {
      const demoUser: UserAccount = {
        id: 'user-creator-1',
        name: 'Aanya Kapoor',
        email: 'creator@creatorconnect.ai',
        role: 'creator',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        handle: 'aanya_bridal_ai',
      };
      completeSuccessfulAuth(demoUser, 'Signed in as Demo Creator (Aanya Kapoor). Redirected to Creator Studio.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('creatorconnect_auth_user');
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    showToast('Signed out successfully.');
  };

  // Forgot Password Handler
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordStatus(null);
    if (!forgotPasswordEmail) return;

    setForgotPasswordLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForgotPasswordStatus(data.message);
      } else {
        setForgotPasswordStatus(data.message || 'Unable to process password reset request.');
      }
    } catch {
      setForgotPasswordStatus(`Password reset link sent to ${forgotPasswordEmail}. For demo access, use password123.`);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Filtered Creators based on Category, Tool, Platform, Media Type & Search
  const filteredCreators = useMemo(() => {
    return creatorsList.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      
      // Normalized query stripping conversational prefixes & suffixes
      const cleanQ = q
        .replace(/^(find|show|search for|search|get me|looking for)\s+/i, '')
        .replace(/\s+(creators|influencers|artists|directors|videos|content|within my budget)$/i, '')
        .trim();

      // Telugu Category Keyword Matching
      let teluguCat = '';
      if (q.includes('బ్రైడల్') || q.includes('పెళ్లి')) teluguCat = 'bridal & wedding';
      else if (q.includes('ఫ్యాషన్') || q.includes('దుస్తులు')) teluguCat = 'clothing & fashion';
      else if (q.includes('డ్రింక్స్') || q.includes('పానీయాలు')) teluguCat = 'drinks & beverage';
      else if (q.includes('నగలు') || q.includes('ఆభరణాలు')) teluguCat = 'jewellery & accessories';
      else if (q.includes('బ్యూటీ') || q.includes('అందం')) teluguCat = 'beauty & skincare';
      else if (q.includes('ఫుడ్') || q.includes('ఆహారం') || q.includes('భోజనం')) teluguCat = 'food & restaurants';
      else if (q.includes('ట్రావెల్') || q.includes('ప్రయాణం')) teluguCat = 'travel & lifestyle';
      else if (q.includes('టెక్') || q.includes('ఎలక్ట్రానిక్స్')) teluguCat = 'electronics & tech';

      const matchField = (target: string) =>
        c.name.toLowerCase().includes(target) ||
        c.handle.toLowerCase().includes(target) ||
        c.headline.toLowerCase().includes(target) ||
        c.bio.toLowerCase().includes(target) ||
        c.category.toLowerCase().includes(target) ||
        c.location.toLowerCase().includes(target) ||
        c.tools.some((t) => t.toLowerCase().includes(target)) ||
        c.styles.some((s) => s.toLowerCase().includes(target)) ||
        c.portfolio.some((p) => p.title.toLowerCase().includes(target) || p.prompt.toLowerCase().includes(target));

      // Tokenized search for spoken phrases like "find bridal makeup creators"
      const tokens = q
        .split(/\s+/)
        .filter((w) => w.length > 2 && !['find', 'show', 'search', 'for', 'the', 'and', 'with', 'within', 'creators', 'influencers'].includes(w));

      const matchesSearch =
        !q ||
        matchField(q) ||
        (cleanQ && matchField(cleanQ)) ||
        (teluguCat && (c.category.toLowerCase().includes(teluguCat) || c.portfolio.some((p) => p.category.toLowerCase().includes(teluguCat)))) ||
        (tokens.length > 0 && tokens.some((token) => matchField(token)));

      const matchesTool =
        selectedToolFilter === 'All' ||
        c.tools.some((t) => t.toLowerCase().includes(selectedToolFilter.toLowerCase()));

      const matchesCategory =
        selectedCategoryFilter === 'All' ||
        c.category.toLowerCase() === selectedCategoryFilter.toLowerCase() ||
        c.portfolio.some((p) => p.category.toLowerCase() === selectedCategoryFilter.toLowerCase());

      const matchesPlatform =
        selectedPlatformFilter === 'All' ||
        c.platforms.some((p) => p.toLowerCase() === selectedPlatformFilter.toLowerCase());

      const matchesMediaType =
        selectedMediaTypeFilter === 'All' ||
        c.portfolio.some((p) => p.mediaType === selectedMediaTypeFilter);

      return matchesSearch && matchesTool && matchesCategory && matchesPlatform && matchesMediaType;
    });
  }, [creatorsList, searchQuery, selectedToolFilter, selectedCategoryFilter, selectedPlatformFilter, selectedMediaTypeFilter]);

  const handleRunCopilot = () => {
    setIsCopilotGenerating(true);
    setTimeout(() => {
      setCopilotOutput({
        title: '30s Royal Velvet Bridal Lehenga Instagram Commercial Reel',
        description:
          'High-fidelity royal Indian couture video campaign showcasing deep crimson velvet lehengas, 24K gold zardozi macro stitching, and heritage Jaipur courtyard lighting with guaranteed temporal coherence across scenes.',
        category: 'Bridal & Wedding',
        requiredTools: ['Runway Gen-3', 'ComfyUI Fabric LoRA', 'Flux.1 Dev', 'Topaz 4K'],
        deliverablesCount: 3,
        budgetMin: 950,
        budgetMax: 1800,
        aspectRatio: '9:16 Reel & 16:9 4K',
        promptFormula:
          'Cinematic slow motion tracking shot of an Indian bride twirling in hand-embroidered royal velvet lehenga inside candlelit palace, gold zardozi shimmering, anamorphic 8k --ar 9:16',
      });
      setIsCopilotGenerating(false);
    }, 1100);
  };

  const handleApplyCopilot = () => {
    if (copilotOutput) {
      setNewBriefTitle(copilotOutput.title);
      setNewBriefDesc(copilotOutput.description);
      setNewBriefCategory(copilotOutput.category);
      setNewBriefBudgetMin(copilotOutput.budgetMin);
      setNewBriefBudgetMax(copilotOutput.budgetMax);
      setIsCopilotOpen(false);
      requireAuth('publish a creative brief', () => setIsCreateBriefOpen(true));
      showToast('AI Structured Brief loaded into creation form!');
    }
  };

  const handleCreateBriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: BrandBrief = {
      id: `brief-${Date.now()}`,
      brandName: currentUser?.companyName || currentUser?.name || 'Vogue Creative Studio',
      brandLogo: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80',
      brandIndustry: 'Commercial Production',
      title: newBriefTitle || 'Untitled Brief',
      description: newBriefDesc || 'Custom generative creative brief.',
      category: newBriefCategory,
      budgetMin: Number(newBriefBudgetMin),
      budgetMax: Number(newBriefBudgetMax),
      currency: 'USD',
      deadline: 'Dec 15, 2026',
      requiredTools: ['Runway Gen-3', 'Flux.1 Dev', 'ComfyUI'],
      deliverablesCount: 3,
      aspectRatio: '9:16 & 16:9',
      resolution: '4K',
      status: 'open',
      proposalsCount: 0,
      createdAt: 'Just now',
      featured: true,
    };

    const token = getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${API_BASE}/briefs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(created),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          showToast(result.message || 'Unable to publish this brief.');
          return;
        }
        setBriefs((current) => [result.data, ...current]);
      } catch {
        showToast('Unable to reach the marketplace API. Please try again.');
        return;
      }
    } else {
      setBriefs([created, ...briefs]);
    }

    setIsCreateBriefOpen(false);
    showToast('Campaign brief successfully published to marketplace!');
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleApproveMilestone = (milestoneId: string) => {
    setActiveProject({
      ...activeProject,
      milestones: activeProject.milestones.map((m) =>
        m.id === milestoneId ? { ...m, status: 'approved' as const } : m
      ),
    });
    showToast('Milestone #2 approved! $800 released from escrow to Marcus Vance.');
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    const element = document.getElementById('creators');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Filtered by ${categoryName}`);
  };

  // Reusable Auth Card (rendered in Fullscreen View or in Modal)
  const renderAuthCard = (isModal: boolean = false) => {
    const isLogin = isModal ? authRole !== null && currentView !== 'signup' : currentView === 'login';

    return (
      <div
        className="auth-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          margin: isModal ? 'auto' : '0 auto',
          position: 'relative',
        }}
      >
        {isModal && (
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="btn btn-ghost btn-sm"
            style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.35rem' }}
          >
            <X style={{ width: '1.1rem', height: '1.1rem' }} />
          </button>
        )}

        {/* Logo and Brand Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '3.25rem',
              height: '3.25rem',
              borderRadius: '0.9rem',
              background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
            }}
          >
            <Sparkles style={{ width: '1.65rem', height: '1.65rem', color: '#FFFFFF' }} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.35rem 0' }}>
            {isLogin ? 'Sign In to CreatorConnect AI' : 'Create Your Account'}
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>
            {isLogin
              ? 'Connect with elite AI directors and manage escrow campaigns'
              : 'Join vetted creators and brands collaborating with prompt receipts'}
          </p>
        </div>

        {/* Account Type Selector Tabs */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
            SELECT ACCOUNT TYPE:
          </label>
          <div style={{ display: 'flex', background: '#070A10', padding: '3px', borderRadius: '0.75rem', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setAuthRole('brand')}
              className={`auth-tab ${authRole === 'brand' ? 'active' : ''}`}
            >
              🏢 Brand or Agency
            </button>
            <button
              type="button"
              onClick={() => setAuthRole('creator')}
              className={`auth-tab ${authRole === 'creator' ? 'active' : ''}`}
            >
              🎨 AI Content Creator
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {authError && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#F87171',
              padding: '0.7rem 0.9rem',
              borderRadius: '0.65rem',
              fontSize: '0.78rem',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        {/* FORM */}
        {isLogin ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="auth-input"
                  style={{ paddingLeft: '2.35rem' }}
                />
                <Mail style={{ width: '0.9rem', height: '0.9rem', color: '#64748B', position: 'absolute', left: '0.85rem', top: '0.9rem' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#CBD5E1' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordEmail(authEmail);
                    setIsForgotPasswordOpen(true);
                  }}
                  style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: '0.72rem', cursor: 'pointer', padding: 0 }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                  style={{ paddingLeft: '2.35rem', paddingRight: '2.35rem' }}
                />
                <Lock style={{ width: '0.9rem', height: '0.9rem', color: '#64748B', position: 'absolute', left: '0.85rem', top: '0.9rem' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '0.85rem', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff style={{ width: '0.9rem', height: '0.9rem' }} /> : <Eye style={{ width: '0.9rem', height: '0.9rem' }} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="auth-checkbox"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                padding: '0.75rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 8px 20px rgba(139, 92, 246, 0.35)',
              }}
            >
              {isAuthLoading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Toggle Link to Sign Up */}
            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94A3B8', margin: '0.5rem 0 0 0' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthError(null);
                  if (isModal) {
                    setIsAuthModalOpen(false);
                    setCurrentView('signup');
                  } else {
                    setCurrentView('signup');
                  }
                }}
                style={{ background: 'none', border: 'none', color: '#A78BFA', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Create Account
              </button>
            </p>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder={authRole === 'brand' ? 'e.g. Sarah Jenkins' : 'e.g. Aanya Kapoor'}
                  className="auth-input"
                  style={{ paddingLeft: '2.35rem' }}
                />
                <User style={{ width: '0.9rem', height: '0.9rem', color: '#64748B', position: 'absolute', left: '0.85rem', top: '0.9rem' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="auth-input"
                  style={{ paddingLeft: '2.35rem' }}
                />
                <Mail style={{ width: '0.9rem', height: '0.9rem', color: '#64748B', position: 'absolute', left: '0.85rem', top: '0.9rem' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                Username / Handle
              </label>
              <input
                type="text"
                value={authHandle}
                onChange={(e) => setAuthHandle(e.target.value)}
                placeholder={authRole === 'brand' ? 'acme_agency' : 'aanya_bridal'}
                className="auth-input"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                Password (min. 6 characters)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                  style={{ paddingLeft: '2.35rem', paddingRight: '2.35rem' }}
                />
                <Lock style={{ width: '0.9rem', height: '0.9rem', color: '#64748B', position: 'absolute', left: '0.85rem', top: '0.9rem' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '0.85rem', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff style={{ width: '0.9rem', height: '0.9rem' }} /> : <Eye style={{ width: '0.9rem', height: '0.9rem' }} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#CBD5E1', display: 'block', marginBottom: '0.35rem' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={authConfirmPassword}
                  onChange={(e) => setAuthConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                  style={{ paddingLeft: '2.35rem' }}
                />
                <KeyRound style={{ width: '0.9rem', height: '0.9rem', color: '#64748B', position: 'absolute', left: '0.85rem', top: '0.9rem' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                padding: '0.75rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginTop: '0.25rem',
              }}
            >
              {isAuthLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Toggle Link to Sign In */}
            <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94A3B8', margin: '0.5rem 0 0 0' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthError(null);
                  if (isModal) {
                    setIsAuthModalOpen(false);
                    setCurrentView('login');
                  } else {
                    setCurrentView('login');
                  }
                }}
                style={{ background: 'none', border: 'none', color: '#A78BFA', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* Quick Demo Credentials Banner */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block', textAlign: 'center', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Instant Testing with Demo Accounts:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('brand')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem' }}
            >
              🏢 Demo Brand
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('creator')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem' }}
            >
              🎨 Demo Creator
            </button>
          </div>
        </div>
      </div>
    );
  };

  // IF USER IS ON STANDALONE LOGIN OR SIGNUP PAGE:
  if (currentView === 'login' || currentView === 'signup') {
    return (
      <div className="auth-page-container">
        <div className="auth-page-bg" />
        
        {/* Top bar with back link */}
        <div
          style={{
            position: 'absolute',
            top: '1.5rem',
            left: '1.5rem',
            right: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => {
              setAuthError(null);
              setCurrentView('marketplace');
            }}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.35rem', background: 'rgba(10, 13, 20, 0.75)', backdropFilter: 'blur(8px)' }}
          >
            <ArrowLeft style={{ width: '0.85rem', height: '0.85rem' }} /> Back to Marketplace
          </button>

          <div
            onClick={() => setCurrentView('marketplace')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <div style={{ width: '1.85rem', height: '1.85rem', borderRadius: '0.5rem', background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: '1rem', height: '1rem', color: '#fff' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#FFFFFF' }}>
              CreatorConnect <span className="badge badge-tool">AI</span>
            </span>
          </div>
        </div>

        {/* Centered Auth Card */}
        {renderAuthCard(false)}

        {/* Forgot Password Modal */}
        {isForgotPasswordOpen && (
          <div className="modal-overlay" onClick={() => setIsForgotPasswordOpen(false)}>
            <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '24rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Reset Password</h3>
                <button onClick={() => setIsForgotPasswordOpen(false)} className="btn btn-ghost btn-sm" style={{ padding: '0.25rem' }}>
                  <X style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>

              {forgotPasswordStatus ? (
                <div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#6EE7B7', padding: '0.85rem', borderRadius: '0.65rem', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {forgotPasswordStatus}
                  </div>
                  <button onClick={() => setIsForgotPasswordOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
                    Enter your account email to receive reset instructions.
                  </p>
                  <input
                    type="email"
                    required
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="auth-input"
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setIsForgotPasswordOpen(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                    <button type="submit" disabled={forgotPasswordLoading} className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}>
                      {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // MAIN MARKETPLACE HOME VIEW:
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#07090E', color: '#F8FAFC' }}>
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '5rem',
            right: '1.5rem',
            zIndex: 100,
            background: 'rgba(24, 18, 48, 0.95)',
            border: '1px solid rgba(139, 92, 246, 0.5)',
            padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#fff',
            fontSize: '0.8125rem',
          }}
        >
          <CheckCircle2 style={{ width: '1rem', height: '1rem', color: '#10B981' }} />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 40, width: '100%', background: 'rgba(7, 9, 14, 0.88)' }}>
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '4.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div
            onClick={() => {
              setSelectedCategoryFilter('All');
              setSelectedToolFilter('All');
              setSelectedPlatformFilter('All');
              setSelectedMediaTypeFilter('All');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                padding: '1px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#07090E',
                  borderRadius: 'calc(0.75rem - 1px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: '#A78BFA' }} />
              </div>
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                CreatorConnect <span className="badge badge-tool" style={{ fontSize: '0.65rem', background: 'rgba(139, 92, 246, 0.15)', color: '#C4B5FD', borderColor: 'rgba(139, 92, 246, 0.4)' }}>AI</span>
              </span>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: 0 }}>Connecting Brands with Creators</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <a href="#categories" className="btn btn-ghost btn-sm" style={{ gap: '0.35rem' }}>
              <Layers style={{ width: '0.9rem', height: '0.9rem', color: '#8B5CF6' }} /> Categories
            </a>
            <a href="#trending" className="btn btn-ghost btn-sm" style={{ gap: '0.35rem' }}>
              <TrendingUp style={{ width: '0.9rem', height: '0.9rem', color: '#06B6D4' }} /> Trending
            </a>
            <a href="#creators" className="btn btn-ghost btn-sm" style={{ gap: '0.35rem' }}>
              <Users style={{ width: '0.9rem', height: '0.9rem', color: '#A78BFA' }} /> Creators
            </a>
            <a href="#briefs" className="btn btn-ghost btn-sm" style={{ gap: '0.35rem' }}>
              <Briefcase style={{ width: '0.9rem', height: '0.9rem', color: '#38BDF8' }} /> Campaigns
            </a>
            <button
              onClick={() => requireAuth('access the Escrow Deal Room', () => setIsDealRoomOpen(true))}
              className="btn btn-ghost btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <ShieldCheck style={{ width: '0.9rem', height: '0.9rem', color: '#10B981' }} /> Deal Room
            </button>
          </nav>

          {/* Role Switcher, Auth & Action Stack */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* AI Brief Co-Pilot CTA */}
            <button onClick={() => setIsCopilotOpen(true)} className="btn btn-cyan btn-sm" style={{ gap: '0.35rem' }}>
              <Sparkles style={{ width: '0.85rem', height: '0.85rem' }} /> AI Co-Pilot
            </button>

            {/* Authenticated User Status or Sign In / Sign Up Buttons */}
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#121724',
                    padding: '0.25rem 0.65rem 0.25rem 0.35rem',
                    borderRadius: '0.65rem',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <img
                    src={currentUser.avatarUrl || FALLBACK_IMAGE}
                    alt={currentUser.name}
                    style={{ width: '1.75rem', height: '1.75rem', borderRadius: '0.45rem', objectFit: 'cover' }}
                  />
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFFFFF', display: 'block', lineHeight: 1.2 }}>
                      {currentUser.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextRole: UserRole = currentRole === 'brand' ? 'creator' : 'brand';
                        setCurrentUser({ ...currentUser, role: nextRole });
                        setCurrentRole(nextRole);
                        showToast(`Switched mode to ${nextRole === 'brand' ? 'Brand' : 'Creator'}`);
                      }}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                      title="Click to toggle Brand/Creator mode"
                    >
                      <span style={{ fontSize: '0.65rem', color: '#A78BFA', textTransform: 'capitalize' }}>
                        {currentRole === 'brand' ? '🏢 Brand Mode ⟳' : '🎨 Creator Mode ⟳'}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem 0.55rem' }}
                  title="Sign Out"
                >
                  <LogOut style={{ width: '0.85rem', height: '0.85rem', color: '#94A3B8' }} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setAuthError(null);
                    setCurrentView('login');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.35rem' }}
                >
                  <LogIn style={{ width: '0.85rem', height: '0.85rem' }} /> Login
                </button>
                <button
                  onClick={() => {
                    setAuthError(null);
                    setCurrentView('signup');
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION: DARK CINEMATIC SPLIT HERO WITH CREATOR COLLAGE */}
      <section className="radial-cinematic-glow" style={{ padding: '4.5rem 1.5rem 3.5rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div className="hero-split-grid">
            {/* Left Column: Heading, Description, CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', zIndex: 2 }}>
              <div className="badge badge-tool" style={{ width: 'fit-content', background: 'rgba(139, 92, 246, 0.15)', color: '#C4B5FD', borderColor: 'rgba(139, 92, 246, 0.35)' }}>
                <Sparkles style={{ width: '0.85rem', height: '0.85rem', color: '#A78BFA' }} />
                CreatorConnect AI • The AI-Native Creative Marketplace
              </div>

              <h1 style={{ fontSize: '3.6rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#FFFFFF', margin: 0 }}>
                Discover Creators. <br />
                <span className="gradient-purple">Build Brands.</span> <br />
                <span className="gradient-cyan">Create Impact.</span>
              </h1>

              <p style={{ fontSize: '1.125rem', color: '#94A3B8', maxWidth: '580px', lineHeight: 1.6, margin: 0 }}>
                Connect with talented content creators, explore stunning portfolios, and collaborate on campaigns that bring your brand to life.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <a
                  href="#creators"
                  className="btn btn-primary btn-lg"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                    boxShadow: '0 8px 25px rgba(139, 92, 246, 0.35)',
                    gap: '0.5rem',
                  }}
                >
                  <Users style={{ width: '1.1rem', height: '1.1rem' }} /> Explore Creators
                </a>
                <button
                  onClick={() => {
                    requireAuth('start campaign collaborations', () => setIsCreateBriefOpen(true));
                  }}
                  className="btn btn-secondary btn-lg"
                  style={{ gap: '0.5rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                >
                  <Briefcase style={{ width: '1.1rem', height: '1.1rem', color: '#38BDF8' }} /> Start Collaborating
                </button>
              </div>

            </div>

            {/* Right Column: Visually Striking Staggered Creator Media Collage */}
            <div className="hero-collage-wrapper">
              {/* Column 1: Bridal & Fine Jewellery */}
              <div className="collage-column collage-col-offset-1">
                <div
                  className="collage-card"
                  onClick={() => {
                    setInspectingItem(TRENDING_SHOWCASE[0]);
                  }}
                  style={{ height: '240px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
                    alt="Bridal Couture"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                  <div className="collage-card-overlay">
                    <span className="badge badge-tool" style={{ fontSize: '0.62rem', alignSelf: 'flex-start', marginBottom: '0.25rem' }}>
                      Bridal • 9:16 Reel
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Royal Velvet Lehenga</span>
                  </div>
                  <div className="play-badge" style={{ width: '1.85rem', height: '1.85rem' }}>
                    <Play style={{ width: '0.75rem', height: '0.75rem', fill: '#fff', marginLeft: '1px' }} />
                  </div>
                </div>

                <div
                  className="collage-card"
                  onClick={() => {
                    setInspectingItem(TRENDING_SHOWCASE[3]);
                  }}
                  style={{ height: '220px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
                    alt="Jewellery"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                  <div className="collage-card-overlay">
                    <span className="badge badge-cyan" style={{ fontSize: '0.62rem', alignSelf: 'flex-start', marginBottom: '0.25rem' }}>
                      Jewellery • 1:1 Macro
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Emerald Cut Solitaire</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Drinks & Runway Fashion & Beauty */}
              <div className="collage-column collage-col-offset-2">
                <div
                  className="collage-card"
                  onClick={() => {
                    setInspectingItem(TRENDING_SHOWCASE[1]);
                  }}
                  style={{ height: '230px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
                    alt="Drinks"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                  <div className="collage-card-overlay">
                    <span className="badge badge-tool" style={{ fontSize: '0.62rem', alignSelf: 'flex-start', marginBottom: '0.25rem' }}>
                      Beverage • 9:16 Reel
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Citrus Soda Macro Splash</span>
                  </div>
                  <div className="play-badge" style={{ width: '1.85rem', height: '1.85rem' }}>
                    <Play style={{ width: '0.75rem', height: '0.75rem', fill: '#fff', marginLeft: '1px' }} />
                  </div>
                </div>

                <div
                  className="collage-card"
                  onClick={() => {
                    setInspectingItem(TRENDING_SHOWCASE[2]);
                  }}
                  style={{ height: '240px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
                    alt="Fashion"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                  <div className="collage-card-overlay">
                    <span className="badge badge-tool" style={{ fontSize: '0.62rem', alignSelf: 'flex-start', marginBottom: '0.25rem', background: 'rgba(236, 72, 153, 0.15)', color: '#F472B6' }}>
                      Haute Couture • 9:16
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Vogue Paris Runways</span>
                  </div>
                  <div className="play-badge" style={{ width: '1.85rem', height: '1.85rem' }}>
                    <Play style={{ width: '0.75rem', height: '0.75rem', fill: '#fff', marginLeft: '1px' }} />
                  </div>
                </div>

                <div
                  className="collage-card"
                  style={{ height: '190px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
                    alt="Beauty"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                  <div className="collage-card-overlay">
                    <span className="badge badge-cyan" style={{ fontSize: '0.62rem', alignSelf: 'flex-start', marginBottom: '0.25rem' }}>
                      Beauty & Skin
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Dewy Botanical Serum</span>
                  </div>
                </div>
              </div>

              {/* Column 3: Travel, Culinary & Tech */}
              <div className="collage-column collage-col-offset-3">
                <div
                  className="collage-card"
                  onClick={() => {
                    setInspectingItem(TRENDING_SHOWCASE[4]);
                  }}
                  style={{ height: '210px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                    alt="Travel"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                  <div className="collage-card-overlay">
                    <span className="badge badge-tool" style={{ fontSize: '0.62rem', alignSelf: 'flex-start', marginBottom: '0.25rem' }}>
                      Travel • 16:9 4K
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Santorini Sunset Teaser</span>
                  </div>
                  <div className="play-badge" style={{ width: '1.85rem', height: '1.85rem' }}>
                    <Play style={{ width: '0.75rem', height: '0.75rem', fill: '#fff', marginLeft: '1px' }} />
                  </div>
                </div>

                <div
                  className="collage-card"
                  onClick={() => {
                    setInspectingItem(TRENDING_SHOWCASE[5]);
                  }}
                  style={{ height: '220px' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                    alt="Food"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  />
                  <div className="collage-card-overlay">
                    <span className="badge badge-amber" style={{ fontSize: '0.62rem', alignSelf: 'flex-start', marginBottom: '0.25rem' }}>
                      Culinary Sizzle
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>A5 Wagyu Charcoal Grill</span>
                  </div>
                  <div className="play-badge" style={{ width: '1.85rem', height: '1.85rem' }}>
                    <Play style={{ width: '0.75rem', height: '0.75rem', fill: '#fff', marginLeft: '1px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODEL ECOSYSTEM MARQUEE */}
      <div style={{ background: '#06080E', padding: '0.85rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#64748B' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E2E8F0', fontWeight: 600 }}>
            <Cpu style={{ width: '0.9rem', height: '0.9rem', color: '#8B5CF6' }} /> Supported Creative Ecosystem:
          </span>
          <span>Runway Gen-3 Alpha</span>
          <span>•</span>
          <span>Flux.1 Dev & Schnell</span>
          <span>•</span>
          <span>Midjourney v6.1</span>
          <span>•</span>
          <span>ComfyUI Custom LoRAs</span>
          <span>•</span>
          <span>Pika 2.1 Video</span>
          <span>•</span>
          <span>Topaz 4K Upscale</span>
          <span>•</span>
          <span>ElevenLabs Audio</span>
        </div>
      </div>

      {/* SECTION 1: EXPLORE CATEGORIES */}
      <section id="categories" style={{ maxWidth: '1360px', margin: '0 auto', padding: '3.5rem 1.5rem 1.5rem 1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-cyan">Commercial Sectors</span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>High-Quality Photos & Video Preview Categories</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Explore Categories
            </h2>
          </div>
          {selectedCategoryFilter !== 'All' && (
            <button
              onClick={() => setSelectedCategoryFilter('All')}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <X style={{ width: '0.85rem', height: '0.85rem' }} /> Clear Category Filter ({selectedCategoryFilter})
            </button>
          )}
        </div>

        {/* 8 Business Categories Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1rem',
          }}
        >
          {categoriesList.map((cat) => {
            const isSelected = selectedCategoryFilter.toLowerCase() === cat.name.toLowerCase();
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.name)}
                className="category-card"
                style={{
                  border: isSelected ? '2px solid #8B5CF6' : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none',
                }}
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                />
                <div className="category-card-overlay" />
                <div className="category-card-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className="badge badge-tool" style={{ fontSize: '0.65rem' }}>
                      {cat.defaultAspectRatio} {cat.defaultAspectRatio === '9:16' ? 'Reel' : cat.defaultAspectRatio === '16:9' ? 'Cinema' : 'Square'}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#CBD5E1', fontFamily: 'var(--font-mono)' }}>
                      {cat.creatorCount} Creators
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.25rem 0' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: 0, lineHeight: 1.35 }}>
                    {cat.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: TRENDING PORTFOLIOS */}
      <section id="trending" style={{ maxWidth: '1360px', margin: '0 auto', padding: '3.5rem 1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-tool" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#C4B5FD', borderColor: 'rgba(139, 92, 246, 0.35)' }}>
                <TrendingUp style={{ width: '0.8rem', height: '0.8rem' }} /> Top Performing Visuals
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Verified Prompt Receipts & High-Framerate 4K Video</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Trending Portfolios
            </h2>
          </div>
          <a href="#creators" className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
            View All Creator Directories <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
          </a>
        </div>

        <div className="trending-grid">
          {TRENDING_SHOWCASE.map((item) => (
            <div
              key={item.id}
              className="trending-card"
              onClick={() => {
                setInspectingItem(item);
              }}
            >
              {/* Media Thumbnail Container with Aspect Ratio */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: item.aspectRatio === '9:16' ? '9/16' : item.aspectRatio === '1:1' ? '1/1' : '16/9',
                  maxHeight: '260px',
                  background: '#000',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={item.thumbnailUrl || item.mediaUrl}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <div className="play-badge">
                  <Play style={{ width: '0.85rem', height: '0.85rem', fill: '#FFFFFF', marginLeft: '1px' }} />
                </div>

                {item.duration && <div className="duration-pill">{item.duration}</div>}

                <div
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    left: '0.5rem',
                    background: 'rgba(10, 13, 20, 0.75)',
                    backdropFilter: 'blur(6px)',
                    color: '#67E8F9',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '0.35rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {item.category}
                </div>
              </div>

              {/* Card Footer Info */}
              <div style={{ padding: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
                  {item.title}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <img
                      src={item.avatarUrl}
                      alt={item.creatorName}
                      style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>@{item.creatorHandle}</span>
                  </div>
                  <span className="badge badge-tool" style={{ fontSize: '0.65rem' }}>
                    {item.model.split('+')[0].trim()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: FEATURED CREATORS & INFLUENCER DISCOVERY */}
      <section id="creators" style={{ maxWidth: '1360px', margin: '0 auto', padding: '3rem 1.5rem 4rem 1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-tool">Vetted AI Talent</span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Verified Prompt Recipes & HTML5 Video Previews</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Featured Creators ({filteredCreators.length})
            </h2>
          </div>

          {/* Smart Voice & Text Search Bar */}
          <VoiceSearchBar
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            onSearch={(val) => {
              setSearchQuery(val);
              const el = document.getElementById('creators');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onCategorySelect={(cat) => setSelectedCategoryFilter(cat)}
            onPlatformSelect={(plat) => setSelectedPlatformFilter(plat)}
            onMediaTypeSelect={(type) => setSelectedMediaTypeFilter(type)}
            placeholder="Search creators, models, or click 🎙️ to speak..."
            style={{ width: '420px', maxWidth: '100%' }}
          />
        </div>

        {/* Filter Controls Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', background: '#0D111A', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border-subtle)' }}>
          {/* Row 1: Business Categories */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, minWidth: '75px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Layers style={{ width: '0.8rem', height: '0.8rem', color: '#8B5CF6' }} /> Category:
            </span>
            <button
              onClick={() => setSelectedCategoryFilter('All')}
              className={`btn btn-sm ${selectedCategoryFilter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
            >
              All Categories
            </button>
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.name)}
                className={`btn btn-sm ${selectedCategoryFilter === cat.name ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Row 2: Media Type, Social Platforms & Tools */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            {/* Media Type Filter */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, minWidth: '75px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Film style={{ width: '0.8rem', height: '0.8rem', color: '#06B6D4' }} /> Media:
              </span>
              <button
                onClick={() => setSelectedMediaTypeFilter('All')}
                className={`btn btn-sm ${selectedMediaTypeFilter === 'All' ? 'btn-cyan' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
              >
                All Media
              </button>
              <button
                onClick={() => setSelectedMediaTypeFilter('video')}
                className={`btn btn-sm ${selectedMediaTypeFilter === 'video' ? 'btn-cyan' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', gap: '0.3rem' }}
              >
                <Play style={{ width: '0.7rem', height: '0.7rem' }} /> Videos (HTML5)
              </button>
              <button
                onClick={() => setSelectedMediaTypeFilter('image')}
                className={`btn btn-sm ${selectedMediaTypeFilter === 'image' ? 'btn-cyan' : 'btn-secondary'}`}
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', gap: '0.3rem' }}
              >
                <ImageIcon style={{ width: '0.7rem', height: '0.7rem' }} /> Photos & Stills
              </button>
            </div>

            {/* Social Platform Filter */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Users style={{ width: '0.8rem', height: '0.8rem', color: '#F472B6' }} /> Platforms:
              </span>
              {['All', 'Instagram', 'YouTube', 'TikTok', 'Facebook'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatformFilter(plat)}
                  className={`btn btn-sm ${selectedPlatformFilter === plat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
                >
                  {plat}
                </button>
              ))}
            </div>

            {/* AI Tools Filter */}
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Cpu style={{ width: '0.8rem', height: '0.8rem', color: '#10B981' }} /> Tools:
              </span>
              {['All', 'Flux.1', 'Runway Gen-3', 'Midjourney', 'ComfyUI'].map((tool) => (
                <button
                  key={tool}
                  onClick={() => setSelectedToolFilter(tool)}
                  className={`btn btn-sm ${selectedToolFilter === tool ? 'btn-secondary' : 'btn-secondary'}`}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.25rem 0.6rem',
                    fontFamily: 'var(--font-mono)',
                    borderColor: selectedToolFilter === tool ? '#8B5CF6' : undefined,
                    color: selectedToolFilter === tool ? '#8B5CF6' : undefined,
                  }}
                >
                  {tool}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty state if no creators match */}
        {filteredCreators.length === 0 && (
          <div
            style={{
              padding: '3.5rem',
              textAlign: 'center',
              background: '#0D111A',
              borderRadius: '1rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Users style={{ width: '2.5rem', height: '2.5rem', color: '#64748B', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
              No Creators Matched Your Criteria
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
              Try loosening your category, tool, or search term to see more talent.
            </p>
            <button
              onClick={() => {
                setSelectedCategoryFilter('All');
                setSelectedToolFilter('All');
                setSelectedPlatformFilter('All');
                setSelectedMediaTypeFilter('All');
                setSearchQuery('');
              }}
              className="btn btn-primary btn-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Creator Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', gap: '1.75rem' }}>
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div>
                {/* Header with Avatar, Verified Badge, Rating, and Category */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={creator.avatarUrl}
                        alt={creator.name}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                        style={{
                          width: '3.5rem',
                          height: '3.5rem',
                          borderRadius: '0.85rem',
                          objectFit: 'cover',
                          border: '2px solid rgba(139, 92, 246, 0.5)',
                        }}
                      />
                      {creator.isVerified && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: -4,
                            right: -4,
                            background: '#10B981',
                            borderRadius: '50%',
                            width: '1.1rem',
                            height: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #07090E',
                          }}
                          title="Verified AI Director"
                        >
                          <Check style={{ width: '0.65rem', height: '0.65rem', color: '#fff' }} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                          {creator.name}
                        </h3>
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                          {creator.category}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.15rem 0 0 0' }}>
                        @{creator.handle} • {creator.location}
                      </p>
                    </div>
                  </div>

                  <div className="badge badge-amber" style={{ gap: '0.25rem' }}>
                    <Star style={{ width: '0.75rem', height: '0.75rem', fill: '#F59E0B' }} />
                    {creator.rating} ({creator.completedBriefs} deals)
                  </div>
                </div>

                {/* Social Platforms Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {creator.platforms.map((platform) => {
                    let badgeClass = 'badge-tool';
                    if (platform === 'Instagram') badgeClass = 'badge-instagram';
                    else if (platform === 'YouTube') badgeClass = 'badge-youtube';
                    else if (platform === 'TikTok') badgeClass = 'badge-tiktok';
                    else if (platform === 'Facebook') badgeClass = 'badge-facebook';

                    return (
                      <span key={platform} className={`badge ${badgeClass}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                        {platform}
                      </span>
                    );
                  })}
                  <span style={{ fontSize: '0.7rem', color: '#A5B4FC', fontFamily: 'var(--font-mono)', marginLeft: '0.25rem' }}>
                    Reach: {creator.followerCount}
                  </span>
                </div>

                {/* Headline */}
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                  {creator.headline}
                </p>

                {/* Tool Badges */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {creator.tools.slice(0, 4).map((t, idx) => (
                    <span key={idx} className="badge badge-tool" style={{ fontSize: '0.68rem' }}>{t}</span>
                  ))}
                  {creator.tools.length > 4 && (
                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>
                      +{creator.tools.length - 4}
                    </span>
                  )}
                </div>

                {/* Portfolio Showcase Grid (Thumbnails with Play Buttons & Duration Badges) */}
                <div style={{ marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Film style={{ width: '0.75rem', height: '0.75rem', color: '#8B5CF6' }} />
                    Portfolio Highlights (Click to play & inspect receipts):
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                    {creator.portfolio.length} media assets
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {creator.portfolio.map((item) => {
                    const isVideo = item.mediaType === 'video' || !!item.videoUrl;
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectingItem(item);
                        }}
                        style={{
                          position: 'relative',
                          aspectRatio: item.aspectRatio === '9:16' ? '9/16' : item.aspectRatio === '1:1' ? '1/1' : '16/9',
                          maxHeight: '130px',
                          borderRadius: '0.65rem',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '1px solid var(--border-subtle)',
                          background: '#090C12',
                        }}
                        title={`Click to open: ${item.title}`}
                      >
                        <img
                          src={item.thumbnailUrl || item.mediaUrl}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                          }}
                        />

                        {/* Video Play Overlay Button */}
                        {isVideo && (
                          <div className="play-badge" title="Play Video Preview">
                            <Play style={{ width: '0.9rem', height: '0.9rem', fill: '#FFFFFF', marginLeft: '2px' }} />
                          </div>
                        )}

                        {/* Duration Pill */}
                        {isVideo && item.duration && (
                          <div className="duration-pill">
                            {item.duration}
                          </div>
                        )}

                        {/* Format Tag in top left */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '0.35rem',
                            left: '0.35rem',
                            background: 'rgba(10, 13, 20, 0.75)',
                            backdropFilter: 'blur(4px)',
                            color: isVideo ? '#67E8F9' : '#A5B4FC',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.58rem',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '0.3rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          {isVideo ? '▶ VIDEO' : 'PHOTO'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Card Actions: View Profile & Contact Influencer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Commercial Rate</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                    ${creator.hourlyRate}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>/hr</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setSelectedCreatorForProfile(creator)}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: '0.35rem' }}
                  >
                    <Eye style={{ width: '0.85rem', height: '0.85rem', color: '#06B6D4' }} /> View Profile
                  </button>
                  <button
                    onClick={() => {
                      requireAuth('collaborate with this creator', () => {
                        setNewBriefTitle(`Direct Campaign: @${creator.handle}`);
                        setNewBriefDesc(
                          `Campaign collaboration with @${creator.handle} for ${creator.category} video reels and visuals utilizing ${creator.tools.slice(0, 2).join(' & ')}.`
                        );
                        setNewBriefCategory(creator.category);
                        setIsCreateBriefOpen(true);
                      });
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ gap: '0.35rem', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                  >
                    Contact Influencer <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: LATEST CAMPAIGNS (CREATIVE BRIEFS) */}
      <section id="briefs" style={{ background: '#05070C', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-cyan">Open Commissions</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Milestone-Funded Escrow Briefs</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                Latest Campaigns Awaiting Proposals
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setIsCopilotOpen(true)} className="btn btn-cyan btn-sm">
                <Sparkles style={{ width: '0.85rem', height: '0.85rem' }} /> Structure with AI
              </button>
              <button
                onClick={() => requireAuth('publish a creative brief', () => setIsCreateBriefOpen(true))}
                className="btn btn-primary btn-sm"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
              >
                <Briefcase style={{ width: '0.85rem', height: '0.85rem' }} /> Post a Brief
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {briefs.map((brief) => (
              <div key={brief.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <img
                        src={brief.brandLogo}
                        alt={brief.brandName}
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                        style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{brief.brandName}</h4>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{brief.brandIndustry}</span>
                      </div>
                    </div>
                    <span className="badge badge-emerald">${brief.budgetMin} - ${brief.budgetMax}</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>{brief.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '1rem' }}>{brief.description}</p>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span className="badge badge-tool">{brief.category}</span>
                    <span className="badge badge-cyan">{brief.aspectRatio}</span>
                    <span className="badge badge-emerald">{brief.deliverablesCount} Deliverables</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Deadline: {brief.deadline}</span>
                  <button
                    onClick={() => {
                      requireAuth('submit a campaign pitch', () => {
                        setSelectedBriefForPitch(brief);
                        setIsSubmitProposalOpen(true);
                      });
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                  >
                    Submit Proposal <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: TRUST & PLATFORM ASSURANCE */}
      <section style={{ maxWidth: '1360px', margin: '0 auto', padding: '4rem 1.5rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-tool" style={{ marginBottom: '0.5rem', background: 'rgba(139, 92, 246, 0.15)', color: '#C4B5FD', borderColor: 'rgba(139, 92, 246, 0.35)' }}>
            Marketplace Integrity
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF' }}>Engineered for Generative Media Production</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Terminal style={{ width: '1.5rem', height: '1.5rem' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>Verifiable Prompt Receipts</h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.6 }}>
              Every asset includes its positive prompt, negative prompt, checkpoint model, seed, and sampler. Eliminates guesswork and guarantees reproducibility.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Video style={{ width: '1.5rem', height: '1.5rem' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>HTML5 Video Previews & Reels</h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.6 }}>
              Native video playback in vertical 9:16 reels, 16:9 cinema widescreen, and 1:1 luxury square formats with responsive controls and duration timestamps.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldCheck style={{ width: '1.5rem', height: '1.5rem' }} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>Milestone Escrow Deals</h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.6 }}>
              Funds remain secured in milestone escrow until video storyboard cutdowns, character sheets, and lighting tests receive brand approval.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', background: '#05070C', padding: '3.5rem 1.5rem', color: '#94A3B8', fontSize: '0.8rem' }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.4rem', background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles style={{ width: '0.9rem', height: '0.9rem', color: '#fff' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                CreatorConnect <span className="badge badge-tool">AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
              © 2026 CreatorConnect AI Inc. All rights reserved. Built for the Next Era of Generative Production.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.05em' }}>
              Discover. Collaborate. Create.
            </span>
            <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>
              Connecting Brands with Content Creators Worldwide
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#categories" style={{ color: '#94A3B8', textDecoration: 'none' }}>Categories</a>
            <a href="#trending" style={{ color: '#94A3B8', textDecoration: 'none' }}>Trending</a>
            <a href="#creators" style={{ color: '#94A3B8', textDecoration: 'none' }}>Creators</a>
            <a href="#briefs" style={{ color: '#94A3B8', textDecoration: 'none' }}>Campaigns</a>
            <span onClick={() => requireAuth('access the Escrow Deal Room', () => setIsDealRoomOpen(true))} style={{ color: '#A78BFA', cursor: 'pointer', fontWeight: 600 }}>Deal Room</span>
          </div>
        </div>
      </footer>

      {/* MODAL AUTH OVERLAY */}
      {isAuthModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
          {renderAuthCard(true)}
        </div>
      )}

      {/* MODAL 1: PROMPT INSPECTOR & HTML5 VIDEO PLAYER */}
      {inspectingItem && (
        <div className="modal-overlay" onClick={() => setInspectingItem(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              maxWidth: inspectingItem.mediaType === 'video' ? '58rem' : '52rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Left Preview: Video Player or Photo Preview */}
            <div
              style={{
                flex: '1 1 54%',
                background: '#04060A',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                minHeight: '380px',
                borderRight: '1px solid var(--border-subtle)',
              }}
            >
              {inspectingItem.mediaType === 'video' || inspectingItem.videoUrl ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <VideoPlayer
                    key={inspectingItem.videoUrl || inspectingItem.id}
                    src={inspectingItem.videoUrl || ''}
                    poster={inspectingItem.thumbnailUrl || inspectingItem.mediaUrl}
                    title={inspectingItem.title}
                    aspectRatio={inspectingItem.aspectRatio || '16:9'}
                  />

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span className="badge badge-tool">Aspect Ratio: {inspectingItem.aspectRatio || '16:9'}</span>
                    {inspectingItem.duration && (
                      <span className="badge badge-cyan">Duration: {inspectingItem.duration}</span>
                    )}
                    <span className="badge badge-tool" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      HTML5 Video (WebM)
                    </span>
                  </div>
                  {inspectingItem.videoAttribution && (
                    <p style={{ margin: '0.65rem 0 0', color: '#94A3B8', fontSize: '0.7rem', textAlign: 'center' }}>
                      Sample video:{' '}
                      <a href={inspectingItem.videoAttribution.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#C4B5FD' }}>
                        {inspectingItem.videoAttribution.title} by {inspectingItem.videoAttribution.creator}
                      </a>
                      {' · '}
                      <a href={inspectingItem.videoAttribution.licenseUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#C4B5FD' }}>
                        {inspectingItem.videoAttribution.license}
                      </a>
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={inspectingItem.mediaUrl}
                    alt={inspectingItem.title}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain', borderRadius: '0.75rem' }}
                  />
                </div>
              )}
            </div>

            {/* Right Panel: Prompt Receipt & Generation Parameters */}
            <div
              style={{
                flex: '1 1 46%',
                padding: '1.75rem',
                background: '#0E131E',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-tool">{inspectingItem.model}</span>
                    <span className="badge badge-cyan">{inspectingItem.category}</span>
                  </div>
                  <button onClick={() => setInspectingItem(null)} className="btn btn-ghost btn-sm" style={{ padding: '0.25rem' }}>
                    <X style={{ width: '1.1rem', height: '1.1rem' }} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                  {inspectingItem.title}
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginBottom: '1rem' }}>
                  Published {inspectingItem.createdAt} • Format: {inspectingItem.aspectRatio}
                </span>

                {/* Positive Prompt Receipt */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#A5B4FC', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Terminal style={{ width: '0.85rem', height: '0.85rem' }} /> Verified Prompt Receipt
                    </span>
                    <button
                      onClick={() => handleCopyPrompt(inspectingItem.prompt)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                    >
                      {copiedPrompt ? <Check style={{ width: '0.75rem', height: '0.75rem', color: '#10B981' }} /> : <Copy style={{ width: '0.75rem', height: '0.75rem' }} />}
                      {copiedPrompt ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div style={{ padding: '0.85rem', borderRadius: '0.75rem', background: '#080B12', border: '1px solid rgba(99, 102, 241, 0.25)', fontFamily: 'var(--font-mono)', fontSize: '0.73rem', color: '#E2E8F0', lineHeight: 1.5, maxHeight: '110px', overflowY: 'auto' }}>
                    "{inspectingItem.prompt}"
                  </div>
                </div>

                {/* Negative prompt if available */}
                {inspectingItem.negativePrompt && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#F87171', display: 'block', marginBottom: '0.25rem' }}>
                      Negative Prompt:
                    </span>
                    <div style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: '#080B12', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#94A3B8', lineHeight: 1.4 }}>
                      {inspectingItem.negativePrompt}
                    </div>
                  </div>
                )}

                {/* Pipeline Parameters Matrix */}
                <div style={{ padding: '0.85rem', borderRadius: '0.75rem', background: 'rgba(18, 23, 34, 0.7)', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#67E8F9', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    <Cpu style={{ width: '0.85rem', height: '0.85rem' }} /> Generation Pipeline Parameters
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                    <div style={{ background: '#080B12', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <span style={{ fontSize: '0.62rem', color: '#64748B', display: 'block' }}>SEED</span>
                      <span style={{ color: '#F1F5F9' }}>{inspectingItem.seed || '982310492'}</span>
                    </div>
                    <div style={{ background: '#080B12', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <span style={{ fontSize: '0.62rem', color: '#64748B', display: 'block' }}>SAMPLER / ENGINE</span>
                      <span style={{ color: '#F1F5F9' }}>{inspectingItem.sampler || 'Motion Flow v3'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    requireAuth('commission campaign visuals', () => {
                      setNewBriefTitle(`Commission Asset: ${inspectingItem.title}`);
                      setNewBriefDesc(`Commissioning style based on prompt recipe: "${inspectingItem.prompt}"`);
                      setNewBriefCategory(inspectingItem.category);
                      setInspectingItem(null);
                      setIsCreateBriefOpen(true);
                    });
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                >
                  Commission Similar Campaign
                </button>
                <button onClick={() => setInspectingItem(null)} className="btn btn-secondary">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATOR PROFILE DETAIL DRAWER */}
      {selectedCreatorForProfile && (
        <div className="modal-overlay" onClick={() => setSelectedCreatorForProfile(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '48rem', padding: 0, overflow: 'hidden' }}
          >
            {/* Cover Banner */}
            <div style={{ height: '140px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={selectedCreatorForProfile.coverUrl}
                alt="cover"
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,9,14,0.1) 0%, rgba(7,9,14,0.85) 100%)' }} />
              <button
                onClick={() => setSelectedCreatorForProfile(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '2rem',
                  height: '2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>

            {/* Profile Info */}
            <div style={{ padding: '0 1.75rem 1.75rem 1.75rem', marginTop: '-2.5rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <img
                    src={selectedCreatorForProfile.avatarUrl}
                    alt={selectedCreatorForProfile.name}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    style={{
                      width: '4.5rem',
                      height: '4.5rem',
                      borderRadius: '1rem',
                      objectFit: 'cover',
                      border: '3px solid #07090E',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      {selectedCreatorForProfile.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
                      @{selectedCreatorForProfile.handle} • {selectedCreatorForProfile.location}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      requireAuth('collaborate with this creator', () => {
                        setNewBriefTitle(`Direct Campaign: @${selectedCreatorForProfile.handle}`);
                        setNewBriefDesc(`Commissioning custom ${selectedCreatorForProfile.category} video campaign from @${selectedCreatorForProfile.handle}.`);
                        setNewBriefCategory(selectedCreatorForProfile.category);
                        setSelectedCreatorForProfile(null);
                        setIsCreateBriefOpen(true);
                      });
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                  >
                    Contact Influencer
                  </button>
                </div>
              </div>

              {/* Bio & Details */}
              <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {selectedCreatorForProfile.bio}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem', background: '#090C12', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', display: 'block' }}>RATING</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#F59E0B' }}>★ {selectedCreatorForProfile.rating}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', display: 'block' }}>HOURLY RATE</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>${selectedCreatorForProfile.hourlyRate}/hr</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', display: 'block' }}>SOCIAL REACH</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#10B981', fontFamily: 'var(--font-mono)' }}>{selectedCreatorForProfile.followerCount}</span>
                </div>
              </div>

              {/* Creator Portfolio Gallery */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                Full Portfolio Gallery ({selectedCreatorForProfile.portfolio.length} Items)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {selectedCreatorForProfile.portfolio.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setInspectingItem(item);
                      setSelectedCreatorForProfile(null);
                    }}
                    style={{
                      position: 'relative',
                      aspectRatio: item.aspectRatio === '9:16' ? '9/16' : item.aspectRatio === '1:1' ? '1/1' : '16/9',
                      maxHeight: '140px',
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={item.title}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {(item.mediaType === 'video' || item.videoUrl) && (
                      <div className="play-badge">
                        <Play style={{ width: '0.8rem', height: '0.8rem', fill: '#FFFFFF' }} />
                      </div>
                    )}
                    {item.duration && <div className="duration-pill">{item.duration}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: AI BRIEF CO-PILOT DRAWER */}
      {isCopilotOpen && (
        <div className="modal-overlay" onClick={() => setIsCopilotOpen(false)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.65rem', background: 'linear-gradient(135deg, #06B6D4, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot style={{ width: '1.25rem', height: '1.25rem', color: '#fff' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      AI Brief Co-Pilot <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>AI Powered</span>
                    </h3>
                    <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: 0 }}>Convert rough ideas into production-ready commercial briefs</p>
                  </div>
                </div>
                <button onClick={() => setIsCopilotOpen(false)} className="btn btn-ghost btn-sm" style={{ padding: '0.25rem' }}>
                  <X style={{ width: '1.1rem', height: '1.1rem' }} />
                </button>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                  <Sparkles style={{ width: '0.85rem', height: '0.85rem', color: '#06B6D4' }} /> Paste your rough campaign goals, moodboard, or product requirements:
                </label>
                <textarea
                  rows={4}
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  className="input-field"
                  style={{ lineHeight: 1.5, marginBottom: '0.75rem' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleRunCopilot}
                    disabled={isCopilotGenerating}
                    className="btn btn-cyan btn-sm"
                  >
                    <Wand2 style={{ width: '0.85rem', height: '0.85rem' }} />
                    {isCopilotGenerating ? 'Analyzing with AI...' : 'Structure Brief with AI'}
                  </button>
                </div>
              </div>

              {copilotOutput && (
                <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: '#111724', border: '1px solid var(--border-cyan)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#67E8F9', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    <CheckCircle2 style={{ width: '0.9rem', height: '0.9rem' }} /> Brief Structured Successfully!
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.35rem' }}>{copilotOutput.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '0.75rem' }}>{copilotOutput.description}</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ background: '#080B12', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748B', display: 'block' }}>ESTIMATED ESCROW</span>
                      <span style={{ color: '#10B981', fontWeight: 700 }}>${copilotOutput.budgetMin} - ${copilotOutput.budgetMax}</span>
                    </div>
                    <div style={{ background: '#080B12', padding: '0.5rem', borderRadius: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748B', display: 'block' }}>FORMAT & DELIVERABLES</span>
                      <span style={{ color: '#FFFFFF' }}>{copilotOutput.deliverablesCount} Deliverables ({copilotOutput.aspectRatio})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {copilotOutput.requiredTools.map((t, idx) => (
                      <span key={idx} className="badge badge-tool">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button onClick={() => setIsCopilotOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleApplyCopilot} disabled={!copilotOutput} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}>
                Apply to New Brief <ArrowRight style={{ width: '0.85rem', height: '0.85rem' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CREATE / POST A BRIEF MODAL */}
      {isCreateBriefOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateBriefOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Post a Creative Brief</h3>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Set campaign category, required deliverables, and milestone escrow budget</span>
              </div>
              <button onClick={() => setIsCreateBriefOpen(false)} className="btn btn-ghost btn-sm">
                <X style={{ width: '1.1rem', height: '1.1rem' }} />
              </button>
            </div>

            <form onSubmit={handleCreateBriefSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2E8F0', display: 'block', marginBottom: '0.35rem' }}>Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newBriefTitle}
                  onChange={(e) => setNewBriefTitle(e.target.value)}
                  placeholder="e.g. 30s Royal Velvet Bridal Lehenga Instagram Commercial Reel"
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2E8F0', display: 'block', marginBottom: '0.35rem' }}>Target Business Category</label>
                <select
                  value={newBriefCategory}
                  onChange={(e) => setNewBriefCategory(e.target.value as MediaCategory)}
                  className="input-field"
                  style={{ background: '#0D111A' }}
                >
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2E8F0', display: 'block', marginBottom: '0.35rem' }}>Campaign Description & Video Specifications</label>
                <textarea
                  rows={4}
                  required
                  value={newBriefDesc}
                  onChange={(e) => setNewBriefDesc(e.target.value)}
                  placeholder="Describe your scene goals, lighting, and consistency parameters..."
                  className="input-field"
                  style={{ lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2E8F0', display: 'block', marginBottom: '0.35rem' }}>Min Budget ($ USD)</label>
                  <input
                    type="number"
                    value={newBriefBudgetMin}
                    onChange={(e) => setNewBriefBudgetMin(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2E8F0', display: 'block', marginBottom: '0.35rem' }}>Max Budget ($ USD)</label>
                  <input
                    type="number"
                    value={newBriefBudgetMax}
                    onChange={(e) => setNewBriefBudgetMax(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsCreateBriefOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}>
                  Publish Brief to Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: SUBMIT PROPOSAL MODAL */}
      {isSubmitProposalOpen && selectedBriefForPitch && (
        <div className="modal-overlay" onClick={() => setIsSubmitProposalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '38rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>Submit Proposal</h3>
                <span style={{ fontSize: '0.75rem', color: '#818CF8' }}>Pitching to: {selectedBriefForPitch.brandName}</span>
              </div>
              <button onClick={() => setIsSubmitProposalOpen(false)} className="btn btn-ghost btn-sm">
                <X style={{ width: '1.1rem', height: '1.1rem' }} />
              </button>
            </div>

            <form
                    onSubmit={async (e) => {
                e.preventDefault();
                      const token = getAuthToken();
                      if (token) {
                        try {
                          const response = await fetch(`${API_BASE}/proposals`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              briefId: selectedBriefForPitch.id,
                              proposedAmount: pitchAmount,
                              estimatedDays: pitchDays,
                              message: pitchCover,
                              portfolioItems: [],
                            }),
                          });
                          const result = await response.json();
                          if (!response.ok || !result.success) {
                            showToast(result.message || 'Unable to submit this proposal.');
                            return;
                          }
                        } catch {
                          showToast('Unable to reach the marketplace API. Please try again.');
                          return;
                        }
                      }
                setIsSubmitProposalOpen(false);
                showToast(`Pitch submitted to ${selectedBriefForPitch.brandName} for $${pitchAmount}!`);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2E8F0', display: 'block', marginBottom: '0.35rem' }}>Proposed Escrow Bid ($)</label>
                  <input
                    type="number"
                    value={pitchAmount}
                    onChange={(e) => setPitchAmount(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2E8F0', display: 'block', marginBottom: '0.35rem' }}>Estimated Days</label>
                  <input
                    type="number"
                    value={pitchDays}
                    onChange={(e) => setPitchDays(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#E2E8F0', display: 'block', marginBottom: '0.35rem' }}>Technical Workflow & Consistency Strategy</label>
                <textarea
                  rows={4}
                  required
                  value={pitchCover}
                  onChange={(e) => setPitchCover(e.target.value)}
                  className="input-field"
                  style={{ lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsSubmitProposalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}>
                  <Send style={{ width: '0.85rem', height: '0.85rem' }} /> Submit Pitch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: DEAL ROOM & ESCROW MODAL */}
      {isDealRoomOpen && (
        <div className="modal-overlay" onClick={() => setIsDealRoomOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '1.75rem', maxWidth: '52rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>{activeProject.briefTitle}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Brand: <strong style={{ color: '#E2E8F0' }}>{activeProject.brandName}</strong> • Creator: <strong style={{ color: '#818CF8' }}>@{activeProject.creatorName}</strong>
                  </span>
                </div>
              </div>
              <button onClick={() => setIsDealRoomOpen(false)} className="btn btn-ghost btn-sm">
                <X style={{ width: '1.1rem', height: '1.1rem' }} />
              </button>
            </div>

            {/* Escrow banner */}
            <div style={{ padding: '1.25rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15))', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Funded Contract Escrow</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10B981', display: 'block', fontFamily: 'var(--font-mono)' }}>${activeProject.totalBudget} USD</span>
              </div>
              <span className="badge badge-emerald">Funds Verified in Escrow</span>
            </div>

            {/* Milestones list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F0', textTransform: 'uppercase' }}>Milestone Deliverable Track</h4>

              {activeProject.milestones.map((m, idx) => (
                <div key={m.id} style={{ padding: '1.25rem', borderRadius: '0.75rem', background: '#090C12', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: '#1E293B', color: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        {idx + 1}
                      </span>
                      <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{m.title}</h5>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>${m.amount} USD</span>
                      {m.status === 'approved' && <span className="badge badge-emerald">Approved & Paid</span>}
                      {m.status === 'submitted' && <span className="badge badge-amber">Review Required</span>}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '0 0 0.75rem 0' }}>{m.description}</p>

                  {m.deliverableUrl && (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#121722', padding: '0.75rem', borderRadius: '0.5rem' }}>
                      <div
                        onClick={() => {
                          setInspectingItem({
                            id: m.id,
                            title: m.title,
                            mediaUrl: m.deliverableUrl || '',
                            videoUrl: m.deliverableUrl,
                            thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
                            duration: '0:30',
                            mediaType: 'video',
                            category: 'Bridal & Wedding',
                            prompt: 'Royal Velvet Lehenga 4K Commercial Final Render & Color Grade',
                            model: 'Runway Gen-3 Alpha + Topaz 4K',
                            aspectRatio: '9:16',
                            tools: ['Runway Gen-3', 'Topaz Video AI'],
                            createdAt: 'Submitted Today',
                          });
                          setIsDealRoomOpen(false);
                        }}
                        style={{ position: 'relative', width: '100px', height: '65px', borderRadius: '0.4rem', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}
                        title="Click to play deliverable video in theater player"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
                          alt={m.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className="play-badge" style={{ width: '1.75rem', height: '1.75rem' }}>
                          <Play style={{ width: '0.75rem', height: '0.75rem', fill: '#FFFFFF' }} />
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', color: '#E2E8F0', fontWeight: 600, display: 'block' }}>Submitted Deliverable Video Asset (Click to Play)</span>
                        <p style={{ fontSize: '0.7rem', color: '#64748B', margin: 0 }}>
                          {m.clientFeedback ? `Feedback: "${m.clientFeedback}"` : 'Awaiting client approval & fund release'}
                        </p>
                        {m.status === 'submitted' && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button onClick={() => handleApproveMilestone(m.id)} className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}>
                              <CheckCircle2 style={{ width: '0.75rem', height: '0.75rem' }} /> Approve & Release ${m.amount}
                            </button>
                            <button
                              onClick={() => {
                                const rev = prompt('Enter prompt adjustments:');
                                if (rev) showToast('Revision requested. Creator notified.');
                              }}
                              className="btn btn-secondary btn-sm"
                            >
                              Request Variation
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsDealRoomOpen(false)} className="btn btn-secondary">Close Deal Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
