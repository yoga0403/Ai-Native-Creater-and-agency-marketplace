import { supabaseAdmin, supabaseAuth } from './supabase.js';

function throwIfError(error) {
  if (error) throw error;
}

function toUser(profile, email = profile.email) {
  return {
    id: profile.id,
    name: profile.name,
    email,
    role: profile.role,
    handle: profile.handle,
    company_name: profile.company_name,
    companyName: profile.company_name,
    avatar_url: profile.avatar_url,
    avatarUrl: profile.avatar_url,
  };
}

function toPortfolioItem(item) {
  return {
    id: item.id,
    title: item.title,
    mediaUrl: item.media_url,
    videoUrl: item.video_url,
    thumbnailUrl: item.thumbnail_url,
    duration: item.duration,
    mediaType: item.media_type,
    category: item.category,
    prompt: item.prompt,
    negativePrompt: item.negative_prompt,
    model: item.model,
    seed: item.seed,
    sampler: item.sampler,
    workflow: item.workflow,
    tools: item.tools || [],
    aspectRatio: item.aspect_ratio,
    createdAt: item.created_at,
  };
}

function toCreator(creator) {
  return {
    id: creator.id,
    name: creator.name,
    handle: creator.handle,
    avatarUrl: creator.avatar_url,
    coverUrl: creator.cover_url,
    headline: creator.headline,
    bio: creator.bio,
    location: creator.location,
    category: creator.category,
    platforms: creator.platforms || [],
    followerCount: creator.follower_count,
    isVerified: creator.is_verified,
    rating: Number(creator.rating || 0),
    reviewsCount: creator.reviews_count,
    completedBriefs: creator.completed_briefs,
    hourlyRate: creator.hourly_rate,
    tools: creator.tools || [],
    styles: creator.styles || [],
    badges: creator.badges || [],
    portfolio: (creator.portfolio_items || []).map(toPortfolioItem),
  };
}

function toBrief(brief) {
  return {
    id: brief.id,
    userId: brief.user_id,
    brandName: brief.brand_name,
    brandLogo: brief.brand_logo,
    brandIndustry: brief.brand_industry,
    title: brief.title,
    description: brief.description,
    category: brief.category,
    budgetMin: brief.budget_min,
    budgetMax: brief.budget_max,
    currency: brief.currency,
    deadline: brief.deadline,
    requiredTools: brief.required_tools || [],
    deliverablesCount: brief.deliverables_count,
    aspectRatio: brief.aspect_ratio,
    resolution: brief.resolution,
    status: brief.status,
    proposalsCount: brief.proposals_count,
    createdAt: brief.created_at,
    featured: brief.featured,
  };
}

async function getProfile(authUser) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();
  throwIfError(error);

  if (data) return toUser(data, authUser.email);

  const metadata = authUser.user_metadata || {};
  const fallbackProfile = {
    id: authUser.id,
    name: metadata.name || authUser.email?.split('@')[0] || 'CreatorConnect User',
    email: authUser.email,
    role: metadata.role === 'creator' ? 'creator' : 'brand',
    handle: metadata.handle || authUser.email?.split('@')[0] || '',
    company_name: metadata.company_name || null,
    avatar_url: metadata.avatar_url || null,
  };
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('profiles')
    .upsert(fallbackProfile, { onConflict: 'id' })
    .select('*')
    .single();
  throwIfError(insertError);
  return toUser(inserted, authUser.email);
}

export async function authenticateSupabaseToken(token) {
  const { data, error } = await supabaseAuth.auth.getUser(token);
  if (error || !data.user) return null;
  return getProfile(data.user);
}

export async function loginSupabaseUser(email, password) {
  const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password });
  throwIfError(error);
  return {
    token: data.session.access_token,
    user: await getProfile(data.user),
  };
}

export async function registerSupabaseUser({ name, email, password, role, handle, companyName }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedName = String(name).trim();
  const normalizedRole = role === 'creator' ? 'creator' : 'brand';
  const normalizedHandle = handle || normalizedName.toLowerCase().replace(/\s+/g, '_');
  const avatarUrl = normalizedRole === 'brand'
    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const { data, error } = await supabaseAuth.auth.signUp({
    email: normalizedEmail,
    password: String(password),
    options: {
      data: {
        name: normalizedName,
        role: normalizedRole,
        handle: normalizedHandle,
        company_name: companyName || (normalizedRole === 'brand' ? 'Creative Studio' : null),
        avatar_url: avatarUrl,
      },
    },
  });
  throwIfError(error);

  const user = await getProfile(data.user);
  return {
    user,
    token: data.session?.access_token || null,
    requiresEmailConfirmation: !data.session,
  };
}

export async function sendSupabasePasswordReset(email) {
  const { error } = await supabaseAuth.auth.resetPasswordForEmail(String(email).trim().toLowerCase());
  throwIfError(error);
}

export async function getSupabaseCreators() {
  const { data, error } = await supabaseAdmin
    .from('creator_profiles')
    .select('*, portfolio_items(*)')
    .order('created_at', { ascending: false });
  throwIfError(error);
  return (data || []).map(toCreator);
}

export async function insertSupabasePortfolioItem(input) {
  const { data, error } = await supabaseAdmin
    .from('portfolio_items')
    .insert(input)
    .select('id')
    .single();
  throwIfError(error);
  return data;
}

export async function getSupabaseBriefs() {
  const { data, error } = await supabaseAdmin
    .from('brand_briefs')
    .select('*')
    .order('created_at', { ascending: false });
  throwIfError(error);
  return (data || []).map(toBrief);
}

export async function insertSupabaseBrief(input) {
  const { data, error } = await supabaseAdmin
    .from('brand_briefs')
    .insert(input)
    .select('*')
    .single();
  throwIfError(error);
  return toBrief(data);
}

export async function insertSupabaseProposal(input) {
  const { data, error } = await supabaseAdmin
    .from('proposals')
    .insert(input)
    .select('id, brief_id, proposed_amount, estimated_days, message, status')
    .single();
  throwIfError(error);
  return data;
}
