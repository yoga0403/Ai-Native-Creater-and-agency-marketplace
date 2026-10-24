-- ==============================================================================
-- CreatorConnect AI — Supabase SQL Database Schema & RLS Policies
-- PostgreSQL 15+ / Supabase Native
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('brand', 'creator', 'admin')),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BUSINESS / BRAND PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  logo_url TEXT,
  location TEXT,
  website_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  products_services TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATOR PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  avatar_url TEXT NOT NULL,
  cover_url TEXT,
  headline TEXT NOT NULL,
  bio TEXT,
  location TEXT,
  languages TEXT[] DEFAULT '{"English"}',
  category TEXT NOT NULL,
  specializations TEXT[] DEFAULT '{}',
  platforms TEXT[] DEFAULT '{"Instagram"}',
  follower_count TEXT, -- Null if "Not provided"
  is_verified BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3,2), -- Null if "Not provided"
  reviews_count INT DEFAULT 0,
  completed_briefs INT DEFAULT 0,
  starting_rate NUMERIC(10,2),
  hourly_rate NUMERIC(10,2),
  preferred_formats TEXT[] DEFAULT '{"Reel"}',
  availability TEXT DEFAULT 'Available for collaborations',
  tools TEXT[] DEFAULT '{}',
  styles TEXT[] DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PORTFOLIO ITEMS & MEDIA ASSETS
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  media_url TEXT NOT NULL,
  video_url TEXT, -- HTML5 video streaming path / Supabase Storage URL
  thumbnail_url TEXT,
  duration TEXT DEFAULT '0:30',
  media_type VARCHAR(20) DEFAULT 'video' CHECK (media_type IN ('video', 'image', 'audio', '3d')),
  category TEXT NOT NULL,
  content_format TEXT DEFAULT 'Reel',
  prompt TEXT,
  model TEXT,
  tools TEXT[] DEFAULT '{}',
  aspect_ratio VARCHAR(10) DEFAULT '9:16',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADVERTISEMENT CAMPAIGNS (BRIEFS)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.business_profiles(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  business_logo TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  product_service TEXT,
  objective TEXT,
  platform TEXT DEFAULT 'Instagram',
  content_type TEXT DEFAULT 'Reel',
  target_audience TEXT,
  preferred_language TEXT,
  preferred_location TEXT,
  budget_min NUMERIC(10,2) NOT NULL,
  budget_max NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  deadline DATE,
  deliverables_summary TEXT,
  contact_preference VARCHAR(30) DEFAULT 'In-Platform Chat',
  aspect_ratio TEXT DEFAULT '9:16 Vertical',
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'assigned', 'completed')),
  proposals_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COLLABORATION REQUESTS (DIRECT BUSINESS TO CREATOR OUTREACH)
CREATE TABLE IF NOT EXISTS public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.business_profiles(id) ON DELETE SET NULL,
  business_name TEXT NOT NULL,
  business_logo TEXT,
  creator_id UUID NOT NULL REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL,
  campaign_title TEXT NOT NULL,
  product_service TEXT NOT NULL,
  requirements TEXT NOT NULL,
  budget NUMERIC(10,2) NOT NULL,
  deadline DATE NOT NULL,
  message TEXT NOT NULL,
  contact_preference VARCHAR(50) DEFAULT 'In-Platform Chat',
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. IN-PLATFORM COLLABORATION MESSAGES
CREATE TABLE IF NOT EXISTS public.collaboration_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collaboration_id UUID NOT NULL REFERENCES public.collaboration_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('brand', 'creator')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read, authenticated user can update own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Creator Profiles & Portfolios: Public discovery
CREATE POLICY "Creator profiles are publicly viewable" ON public.creator_profiles
  FOR SELECT USING (true);
CREATE POLICY "Creators can manage their own profile" ON public.creator_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Portfolio items are publicly viewable" ON public.portfolio_items
  FOR SELECT USING (true);

-- Campaigns: Publicly viewable, businesses manage own
CREATE POLICY "Campaigns are viewable by all users" ON public.campaigns
  FOR SELECT USING (true);

-- Collaboration Requests: Visible only to participating business and creator
CREATE POLICY "Businesses and creators can view their collaboration requests"
  ON public.collaboration_requests
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.business_profiles WHERE id = collaboration_requests.business_id
    ) OR
    auth.uid() IN (
      SELECT user_id FROM public.creator_profiles WHERE id = collaboration_requests.creator_id
    )
  );

CREATE POLICY "Businesses can insert collaboration requests"
  ON public.collaboration_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Participants can update collaboration requests"
  ON public.collaboration_requests
  FOR UPDATE
  USING (true);

-- Messages: Visible only to collaboration participants
CREATE POLICY "Participants can view collaboration messages"
  ON public.collaboration_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Participants can send collaboration messages"
  ON public.collaboration_messages
  FOR INSERT
  WITH CHECK (true);

-- ==============================================================================
-- 10. SUPABASE STORAGE BUCKETS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('campaign-media', 'campaign-media', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('creator-portfolio', 'creator-portfolio', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for Campaign Media" ON storage.objects
  FOR SELECT USING (bucket_id = 'campaign-media');

CREATE POLICY "Public Access for Creator Portfolio" ON storage.objects
  FOR SELECT USING (bucket_id = 'creator-portfolio');

