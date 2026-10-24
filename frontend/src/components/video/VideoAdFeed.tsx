import React, { useState, useRef } from 'react';
import {
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import type { MediaCategory, CreatorProfile } from '../../types';

export interface VideoAdItem {
  id: string;
  title: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  businessName?: string;
  category: MediaCategory;
  videoUrl: string;
  thumbnailUrl: string;
  format: string;
  duration?: string;
  promptDescription?: string;
  creatorId: string;
  creatorObj: CreatorProfile;
}

interface VideoAdFeedProps {
  creators: CreatorProfile[];
  selectedCategory: string;
  onCategorySelect: (cat: string) => void;
  onContactCreator: (creator: CreatorProfile) => void;
  onViewProfile: (creator: CreatorProfile) => void;
}

const getEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=1&modestbranding=1`;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1`;
  }
  return null;
};

/**
 * Category-based fallback video map.
 * Only used when a portfolio item has no videoUrl of its own.
 * Each local file was recorded/selected to match its category.
 */
const categoryFallbackVideoMap: Record<string, string> = {
  'jewellery & accessories': '/videos/jewelry-macro.mp4',
  'clothing & fashion': '/videos/fashion-runway.mp4',
  'colleges & education': '/videos/cinematic-reel.mp4',
  'restaurants & food': '/videos/culinary-wagyu.mp4',
  'beauty & skincare': '/videos/luxury-macro.mp4',
  'electronics & tech': '/videos/cinematic-reel.mp4',
  'travel & tourism': '/videos/travel-drone.mp4',
  'healthcare & fitness': '/videos/drinks-burst.mp4',
  'real estate & housing': '/videos/travel-drone.mp4',
  'local businesses & startups': '/videos/culinary-wagyu.mp4',
} as const;

/**
 * Resolve the video source for a feed card.
 *
 * Priority:
 *  1. Use the portfolio item's own videoUrl if it exists (this is the
 *     per-card video chosen by the creator and already matches the card
 *     title, category, and thumbnail).
 *  2. Fall back to a category-based local video so the content still
 *     matches the card's business sector.
 */
const resolveVideoSource = (
  category: string,
  _title: string,
  _prompt?: string,
  preferredVideoUrl?: string,
): string => {
  // 1. Prefer the item's own video — it was authored to match its metadata
  if (preferredVideoUrl && preferredVideoUrl.trim() !== '') {
    return preferredVideoUrl;
  }

  // 2. Category-based local fallback
  const catKey = (category || '').toLowerCase().trim();
  if (catKey in categoryFallbackVideoMap) {
    return categoryFallbackVideoMap[catKey];
  }

  // 3. Partial keyword match on category string
  for (const [key, url] of Object.entries(categoryFallbackVideoMap)) {
    if (catKey.includes(key.split(' ')[0]) || key.includes(catKey.split(' ')[0])) {
      return url;
    }
  }

  // 4. Ultimate fallback
  return '/videos/cinematic-reel.mp4';
};

export const VideoAdFeed: React.FC<VideoAdFeedProps> = ({
  creators,
  selectedCategory,
  onCategorySelect,
  onContactCreator,
  onViewProfile,
}) => {
  // Flatten all portfolio videos across creators into a rich feed
  const allVideoAds = React.useMemo<VideoAdItem[]>(() => {
    const list: VideoAdItem[] = [];
    creators.forEach((creator) => {
      creator.portfolio.forEach((p) => {
        if (p.mediaType === 'video' || p.videoUrl) {
          const normalizedCategory = p.category || creator.category;
          const resolvedVideoUrl = resolveVideoSource(normalizedCategory, p.title, p.prompt, p.videoUrl || undefined);

          list.push({
            id: `feed-${creator.id}-${p.id}`,
            title: p.title,
            creatorName: creator.name,
            creatorHandle: creator.handle,
            creatorAvatar: creator.avatarUrl,
            businessName: normalizedCategory.includes('Jewellery')
              ? 'Kalyan Heritage Jewellers'
              : normalizedCategory.includes('Clothing')
              ? 'Virasat Silk Boutique'
              : normalizedCategory.includes('College')
              ? 'St. Xavier Tech Institute'
              : normalizedCategory.includes('Food')
              ? 'Smokehouse Bistro'
              : undefined,
            category: normalizedCategory,
            videoUrl: resolvedVideoUrl,
            thumbnailUrl: p.thumbnailUrl || p.mediaUrl,
            format: p.contentFormat || (p.aspectRatio === '9:16' ? '9:16 Vertical Reel' : '16:9 Cinema'),
            duration: p.duration || '0:30',
            promptDescription: p.prompt,
            creatorId: creator.id,
            creatorObj: creator,
          });
        }
      });
    });
    return list;
  }, [creators]);

  // Filter items by category
  const filteredAds = React.useMemo(() => {
    if (!selectedCategory || selectedCategory === 'All') return allVideoAds;
    return allVideoAds.filter(ad =>
      ad.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [allVideoAds, selectedCategory]);

  // Active playing video ID ensures ONLY one video plays at a time and cards never clash
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const [videoErrors, setVideoErrors] = useState<Record<string, string>>({});

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const handleTogglePlay = (adId: string) => {
    const videoEl = videoRefs.current[adId];
    if (!videoEl) return;

    if (playingId === adId) {
      videoEl.pause();
      setPlayingId(null);
      return;
    }

    if (playingId && videoRefs.current[playingId]) {
      videoRefs.current[playingId]?.pause();
    }

    videoEl.play().then(() => {
      setPlayingId(adId);
    }).catch(err => {
      console.warn('Playback error, falling back:', err);
      videoEl.muted = true;
      setMutedStates(prev => ({ ...prev, [adId]: true }));
      videoEl.play().catch(() => {
        setVideoErrors(prev => ({ ...prev, [adId]: 'Preview unavailable for this item.' }));
      });
      setPlayingId(adId);
    });
  };

  const toggleMute = (e: React.MouseEvent, adId: string) => {
    e.stopPropagation();
    const videoEl = videoRefs.current[adId];
    if (!videoEl) return;
    const newMuted = !videoEl.muted;
    videoEl.muted = newMuted;
    setMutedStates(prev => ({ ...prev, [adId]: newMuted }));
  };

  const handleVideoError = (adId: string, title: string) => {
    setVideoErrors(prev => ({ ...prev, [adId]: `Preview unavailable for "${title}".` }));
    setPlayingId(current => (current === adId ? null : current));
  };

  return (
    <div style={{ width: '100%', marginBottom: '3.5rem' }}>
      {/* Category Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }} className="no-scrollbar">
        {['All', 'Jewellery & Accessories', 'Clothing & Fashion', 'Colleges & Education', 'Restaurants & Food', 'Beauty & Skincare', 'Electronics & Tech', 'Travel & Tourism', 'Healthcare & Fitness', 'Real Estate & Housing', 'Local Businesses & Startups'].map((cat) => (
          <button
            key={cat}
            onClick={() => onCategorySelect(cat)}
            className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '0.75rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '2rem',
              background: selectedCategory === cat ? 'linear-gradient(135deg, #8B5CF6, #06B6D4)' : '#0F172A',
              borderColor: selectedCategory === cat ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredAds.map((ad) => {
          const isPlaying = playingId === ad.id;
          const isMuted = mutedStates[ad.id] ?? true;
          const errorMessage = videoErrors[ad.id];

          return (
            <div
              key={ad.id}
              className="glass-card"
              style={{
                borderRadius: '1rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: isPlaying ? '1px solid rgba(6, 182, 212, 0.6)' : '1px solid var(--border-subtle)',
                boxShadow: isPlaying ? '0 8px 30px rgba(6, 182, 212, 0.15)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {/* HTML5 Video Box or Embed */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: ad.format.includes('Vertical') || ad.format.includes('Reel') ? '9/16' : '16/9',
                  maxHeight: '400px',
                  background: '#000',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onClick={() => handleTogglePlay(ad.id)}
              >
                {getEmbedUrl(ad.videoUrl) && isPlaying ? (
                  <iframe
                    src={getEmbedUrl(ad.videoUrl)!}
                    title={ad.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : !errorMessage ? (
                  <video
                    key={ad.videoUrl}
                    ref={(el) => { videoRefs.current[ad.id] = el; }}
                    src={ad.videoUrl}
                    poster={ad.thumbnailUrl}
                    playsInline
                    muted={isMuted}
                    preload="metadata"
                    loop
                    onError={() => handleVideoError(ad.id, ad.title)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#090D16', color: '#94A3B8', padding: '1rem', textAlign: 'center' }}>
                    <AlertCircle style={{ width: '2rem', height: '2rem', color: '#F59E0B', marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.8rem' }}>{errorMessage}</span>
                  </div>
                )}

                {/* Play / Pause Overlay Indicator */}
                {!isPlaying && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '50%',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                      pointerEvents: 'none',
                    }}
                  >
                    <Play style={{ width: '1.4rem', height: '1.4rem', fill: '#FFFFFF', color: '#FFFFFF', marginLeft: '3px' }} />
                  </div>
                )}

                {/* Duration Badge */}
                {ad.duration && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.65rem',
                      right: '0.65rem',
                      background: 'rgba(0, 0, 0, 0.75)',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '0.3rem',
                    }}
                  >
                    {ad.duration}
                  </div>
                )}

                {/* Sound Mute Toggle */}
                {isPlaying && (
                  <button
                    onClick={(e) => toggleMute(e, ad.id)}
                    style={{
                      position: 'absolute',
                      bottom: '0.65rem',
                      left: '0.65rem',
                      background: 'rgba(0, 0, 0, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#FFF',
                    }}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX style={{ width: '1rem', height: '1rem' }} /> : <Volume2 style={{ width: '1rem', height: '1rem' }} />}
                  </button>
                )}

                {/* Category Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.65rem',
                    left: '0.65rem',
                    background: 'rgba(10, 13, 20, 0.8)',
                    backdropFilter: 'blur(6px)',
                    color: '#67E8F9',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.35rem',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                  }}
                >
                  {ad.category}
                </div>

                {/* Format Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.65rem',
                    right: '0.65rem',
                    background: 'rgba(10, 13, 20, 0.8)',
                    backdropFilter: 'blur(6px)',
                    color: '#F472B6',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '0.35rem',
                    border: '1px solid rgba(244, 114, 182, 0.3)',
                  }}
                >
                  {ad.format}
                </div>
              </div>

              {/* Card Meta & Actions */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.35rem 0', lineHeight: 1.4 }}>
                    {ad.title}
                  </h4>
                  {ad.businessName && (
                    <p style={{ fontSize: '0.75rem', color: '#67E8F9', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Sparkles style={{ width: '0.75rem', height: '0.75rem' }} /> Client: {ad.businessName}
                    </p>
                  )}
                  {ad.promptDescription && (
                    <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                      "{ad.promptDescription}"
                    </p>
                  )}
                </div>

                {/* Creator Attribution */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img
                      src={ad.creatorAvatar}
                      alt={ad.creatorName}
                      style={{ width: '2rem', height: '2rem', borderRadius: '50%', objectFit: 'cover', border: '1px solid #8B5CF6' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFFFFF', display: 'block' }}>
                        {ad.creatorName}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                        @{ad.creatorHandle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Profile & Contact Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button
                    onClick={() => onViewProfile(ad.creatorObj)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', justifyContent: 'center' }}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onContactCreator(ad.creatorObj)}
                    className="btn btn-primary btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                    }}
                  >
                    Contact Creator
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
