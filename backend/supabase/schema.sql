create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null check (role in ('brand', 'creator')),
  handle text not null,
  company_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.creator_profiles (
  id text primary key,
  owner_user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  handle text not null,
  avatar_url text,
  cover_url text,
  headline text,
  bio text,
  location text,
  category text,
  platforms jsonb not null default '[]'::jsonb,
  follower_count text,
  is_verified boolean not null default false,
  rating numeric(3, 2),
  reviews_count integer not null default 0,
  completed_briefs integer not null default 0,
  hourly_rate integer not null default 0,
  tools jsonb not null default '[]'::jsonb,
  styles jsonb not null default '[]'::jsonb,
  badges jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_items (
  id text primary key,
  creator_id text not null references public.creator_profiles(id) on delete cascade,
  title text not null,
  media_url text,
  video_url text,
  thumbnail_url text,
  duration text,
  media_type text not null default 'image',
  category text,
  prompt text,
  negative_prompt text,
  model text,
  seed text,
  sampler text,
  workflow text,
  tools jsonb not null default '[]'::jsonb,
  aspect_ratio text,
  created_at timestamptz not null default now()
);

create table if not exists public.brand_briefs (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  brand_name text not null,
  brand_logo text,
  brand_industry text,
  title text not null,
  description text not null,
  category text,
  budget_min integer not null default 0,
  budget_max integer not null default 0,
  currency text not null default 'USD',
  deadline text,
  required_tools jsonb not null default '[]'::jsonb,
  deliverables_count integer not null default 1,
  aspect_ratio text,
  resolution text,
  status text not null default 'open',
  proposals_count integer not null default 0,
  created_at timestamptz not null default now(),
  featured boolean not null default false
);

create table if not exists public.proposals (
  id text primary key,
  brief_id text not null references public.brand_briefs(id) on delete cascade,
  creator_user_id uuid not null references public.profiles(id) on delete cascade,
  proposed_amount integer not null,
  currency text not null default 'USD',
  estimated_days integer not null default 7,
  message text not null default '',
  portfolio_items jsonb not null default '[]'::jsonb,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  unique (brief_id, creator_user_id)
);

create index if not exists creator_profiles_category_idx on public.creator_profiles(category);
create index if not exists portfolio_items_creator_idx on public.portfolio_items(creator_id);
create index if not exists brand_briefs_created_idx on public.brand_briefs(created_at desc);
create index if not exists proposals_brief_idx on public.proposals(brief_id);

alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.brand_briefs enable row level security;
alter table public.proposals enable row level security;

grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update, delete on public.creator_profiles to service_role;
grant select, insert, update, delete on public.portfolio_items to service_role;
grant select, insert, update, delete on public.brand_briefs to service_role;
grant select, insert, update, delete on public.proposals to service_role;

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role, handle, company_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    lower(new.email),
    case when new.raw_user_meta_data ->> 'role' = 'creator' then 'creator' else 'brand' end,
    coalesce(new.raw_user_meta_data ->> 'handle', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'company_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    name = excluded.name,
    email = excluded.email,
    role = excluded.role,
    handle = excluded.handle,
    company_name = excluded.company_name,
    avatar_url = excluded.avatar_url;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update on auth.users
for each row execute procedure public.create_profile_for_auth_user();

create or replace function public.increment_brief_proposal_count()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  update public.brand_briefs
  set proposals_count = proposals_count + 1
  where id = new.brief_id;
  return new;
end;
$$;

drop trigger if exists on_proposal_created on public.proposals;
create trigger on_proposal_created
after insert on public.proposals
for each row execute procedure public.increment_brief_proposal_count();

insert into public.creator_profiles (
  id, name, handle, avatar_url, cover_url, headline, bio, location, category,
  platforms, follower_count, is_verified, rating, reviews_count, completed_briefs,
  hourly_rate, tools, styles, badges
) values
  (
    'creator-bridal-1', 'Aanya Kapoor', 'aanya_bridal_ai',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    'Royal Bridal Fashion & Heirloom Jewellery AI Video Director',
    'Pioneering Indian couture wedding promotional videos for luxury bridal brands.',
    'Mumbai & New Delhi', 'Bridal & Wedding', '["Instagram", "YouTube", "TikTok"]'::jsonb,
    '340K', true, 4.99, 68, 54, 95,
    '["Runway Gen-3", "ComfyUI Fabric LoRA", "Midjourney v6.1", "Topaz Video AI"]'::jsonb,
    '["Royal Heritage", "Cinematic Slow-Motion", "Festive Warmth"]'::jsonb,
    '["Bridal Fashion Lead", "100% Coherence Guarantee"]'::jsonb
  ),
  (
    'creator-fashion-1', 'Elena Rostova', 'elena_fashion_vfx',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    'AI Fashion Week Director • Virtual Mannequins & Seasonal Lookbooks',
    'Directing generative fashion films for Paris and Milan fashion houses.',
    'Paris & London', 'Clothing & Fashion', '["Instagram", "TikTok", "YouTube"]'::jsonb,
    '520K', true, 5.00, 82, 64, 120,
    '["Flux.1 Dev", "Runway Gen-3", "Kling AI", "Pika 2.1"]'::jsonb,
    '["Haute Couture", "Cyber Streetwear", "Avant-Garde"]'::jsonb,
    '["Fashion Innovation Award", "Vogue Featured"]'::jsonb
  )
on conflict (id) do nothing;

insert into public.portfolio_items (
  id, creator_id, title, media_url, video_url, thumbnail_url, duration,
  media_type, category, prompt, model, tools, aspect_ratio, created_at
) values
  (
    'p-bridal-1', 'creator-bridal-1', 'Royal Crimson Velvet Lehenga Cinematic Reveal',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    '/videos/bridal-couture.mp4',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    '0:30', 'video', 'Bridal & Wedding',
    'Cinematic 35mm bridal reveal in a palace courtyard.', 'Runway Gen-3 Alpha + Custom LoRA',
    '["Runway Gen-3", "ComfyUI", "Topaz Video AI"]'::jsonb, '9:16', now()
  ),
  (
    'p-fashion-1', 'creator-fashion-1', 'Metamorphosis: Iridescent Wing Silk Gown',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    '/videos/fashion-runway.mp4',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    '0:28', 'video', 'Clothing & Fashion',
    'High-fashion runway featuring an iridescent gown.', 'Flux.1 Dev + Runway Gen-3',
    '["Flux.1", "Runway Gen-3", "Premiere Pro"]'::jsonb, '9:16', now()
  )
on conflict (id) do nothing;

insert into public.brand_briefs (
  id, brand_name, brand_logo, brand_industry, title, description, category,
  budget_min, budget_max, currency, deadline, required_tools,
  deliverables_count, aspect_ratio, resolution, status, proposals_count, featured
) values
  (
    'brief-bridal-1', 'Kalyan Heritage Silks',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80',
    'Bridal & Wedding Fashion',
    '3x 30s Royal Heritage Bridal Lehenga Reels for Festive Launch',
    'Seeking a luxury AI video creator for 3 festive reels with palace textures and bridal motion.',
    'Bridal & Wedding', 1200, 2200, 'USD', 'Nov 15, 2026',
    '["Runway Gen-3", "ComfyUI Fabric LoRA"]'::jsonb,
    3, '9:16 Vertical', '4K (1080x1920) 60fps', 'open', 14, true
  ),
  (
    'brief-drinks-1', 'Velox Energy Drink',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80',
    'Food & Beverage',
    'Hyper-Dynamic Action Visuals with Liquid Splashes & Neon Light',
    'Looking for an AI video artist to generate punchy 15s product ads for a new energy launch.',
    'Drinks & Beverage', 900, 1600, 'USD', 'Nov 20, 2026',
    '["Runway Gen-3", "Midjourney v6.1"]'::jsonb,
    4, '9:16 & 16:9', '4K UHD 60fps', 'open', 9, true
  )
on conflict (id) do nothing;
