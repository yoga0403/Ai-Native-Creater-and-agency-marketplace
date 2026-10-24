import React, { useState } from 'react';
import {
  X,
  Play,
  Check,
  Star,
  Send
} from 'lucide-react';
import type { CreatorProfile, PortfolioItem } from '../../types';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorProfile | null;
  onContactCreator: (creator: CreatorProfile) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  isOpen,
  onClose,
  creator,
  onContactCreator,
}) => {
  const [activeVideo, setActiveVideo] = useState<PortfolioItem | null>(null);

  if (!isOpen || !creator) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#0B0F19',
          borderRadius: '1.25rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Photo */}
        <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
          <img
            src={creator.coverUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80'}
            alt={creator.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ position: 'absolute', top: '1rem', right: '1rem', borderRadius: '50%', padding: '0.4rem', background: 'rgba(0,0,0,0.6)' }}
          >
            <X style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>

        {/* Profile Info Header */}
        <div style={{ padding: '0 2rem', position: 'relative', top: '-40px', marginBottom: '-20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem' }}>
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                style={{
                  width: '5.5rem',
                  height: '5.5rem',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #8B5CF6',
                  background: '#0B0F19',
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    {creator.name}
                  </h2>
                  <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>{creator.category}</span>
                  {creator.isVerified && (
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', gap: '0.2rem' }}>
                      <Check style={{ width: '0.7rem', height: '0.7rem' }} /> Verified
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                  @{creator.handle} • {creator.location || 'Location Not provided'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onContactCreator(creator);
              }}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                gap: '0.4rem',
                fontSize: '0.85rem',
              }}
            >
              <Send style={{ width: '0.9rem', height: '0.9rem' }} /> Contact Creator
            </button>
          </div>
        </div>

        {/* Profile Content Body */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Headline & Bio */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
              {creator.headline}
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
              {creator.bio}
            </p>
          </div>

          {/* Key Metrics Strip (Honoring "Not provided") */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '1rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Commercial Rate</span>
              <strong style={{ fontSize: '1rem', color: '#FFFFFF' }}>
                {creator.pricing?.perReelRate ? `$${creator.pricing.perReelRate}/reel` : creator.hourlyRate ? `$${creator.hourlyRate}/hr` : 'Not provided'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Audience Reach</span>
              <strong style={{ fontSize: '1rem', color: '#FFFFFF' }}>
                {creator.followerCount || 'Not provided'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Rating & Reviews</span>
              <strong style={{ fontSize: '1rem', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Star style={{ width: '0.85rem', height: '0.85rem', fill: '#F59E0B' }} />
                {creator.rating ? `${creator.rating} (${creator.reviewsCount || 0})` : 'Not provided'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block' }}>Languages</span>
              <strong style={{ fontSize: '0.85rem', color: '#FFFFFF' }}>
                {creator.languages ? creator.languages.join(', ') : 'Not provided'}
              </strong>
            </div>
          </div>

          {/* Specializations & Platforms */}
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '0.45rem' }}>
              Specializations & Niche:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {creator.specializations.map((spec, idx) => (
                <span key={idx} className="badge badge-tool" style={{ fontSize: '0.72rem' }}>
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '0.45rem' }}>
              Supported Social Platforms:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {creator.platforms.map((plat) => (
                <span key={plat} className="badge badge-tool" style={{ fontSize: '0.72rem' }}>
                  {plat}
                </span>
              ))}
            </div>
          </div>

          {/* Active Video Player Inspector (if an item is clicked) */}
          {activeVideo && (
            <div
              style={{
                borderRadius: '0.85rem',
                overflow: 'hidden',
                background: '#000',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  ▶ {activeVideo.title}
                </h5>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                >
                  Close Video
                </button>
              </div>
              <video
                src={activeVideo.videoUrl}
                poster={activeVideo.thumbnailUrl}
                controls
                autoPlay
                style={{ width: '100%', maxHeight: '360px', borderRadius: '0.5rem' }}
              />
            </div>
          )}

          {/* Portfolio Video Grid */}
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '0.75rem' }}>
              Portfolio Videos & Showcase ({creator.portfolio.length})
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {creator.portfolio.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveVideo(item)}
                  style={{
                    borderRadius: '0.65rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: '#090D16',
                    border: '1px solid var(--border-subtle)',
                    position: 'relative',
                  }}
                >
                  <div style={{ height: '140px', position: 'relative' }}>
                    <img
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="play-badge">
                      <Play style={{ width: '0.85rem', height: '0.85rem', fill: '#FFF' }} />
                    </div>
                    {item.duration && (
                      <div className="duration-pill">{item.duration}</div>
                    )}
                  </div>
                  <div style={{ padding: '0.75rem' }}>
                    <h6 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </h6>
                    <span style={{ fontSize: '0.68rem', color: '#67E8F9' }}>{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
