import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Check,
  Upload,
  MapPin,
  Users
} from 'lucide-react';
import type {
  BusinessProfile,
  CollaborationRequest,
  CreatorProfile
} from '../../types';
import { calculateSmartMatches } from '../../lib/api';

interface BusinessDashboardViewProps {
  business: BusinessProfile;
  collaborations: CollaborationRequest[];
  creators: CreatorProfile[];
  onCreateCampaign: () => void;
  onOpenChat: (collab: CollaborationRequest) => void;
  onContactCreator: (creator: CreatorProfile) => void;
  onViewProfile: (creator: CreatorProfile) => void;
}

export const BusinessDashboardView: React.FC<BusinessDashboardViewProps> = ({
  business,
  collaborations,
  creators,
  onCreateCampaign,
  onOpenChat,
  onContactCreator,
  onViewProfile,
}) => {
  // Compute smart creator recommendations tailored for this business
  const smartMatches = React.useMemo(() => {
    return calculateSmartMatches({
      businessCategory: business.category,
      budget: 1500,
      language: 'English',
    }, creators).slice(0, 3);
  }, [business.category, creators]);

  const [uploadedItems, setUploadedItems] = useState(business.uploadedMedia || []);

  const handleSimulateUpload = () => {
    const title = prompt('Enter a title for your product video or image:');
    if (!title) return;
    const newItem = {
      id: `media-${Date.now()}`,
      title,
      mediaUrl: '/videos/jewelry-macro.mp4',
      type: 'video' as const,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUploadedItems(prev => [newItem, ...prev]);
  };

  const getStatusBadge = (status: CollaborationRequest['status']) => {
    switch (status) {
      case 'Accepted':
        return (
          <span className="badge badge-emerald" style={{ gap: '0.25rem', fontSize: '0.7rem' }}>
            <CheckCircle2 style={{ width: '0.75rem', height: '0.75rem' }} /> Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="badge badge-rose" style={{ gap: '0.25rem', fontSize: '0.7rem' }}>
            <XCircle style={{ width: '0.75rem', height: '0.75rem' }} /> Declined
          </span>
        );
      case 'Completed':
        return (
          <span className="badge badge-cyan" style={{ gap: '0.25rem', fontSize: '0.7rem' }}>
            <Check style={{ width: '0.75rem', height: '0.75rem' }} /> Completed
          </span>
        );
      default:
        return (
          <span className="badge badge-amber" style={{ gap: '0.25rem', fontSize: '0.7rem' }}>
            <Clock style={{ width: '0.75rem', height: '0.75rem' }} /> Pending Review
          </span>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
      {/* Business Header Card */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          borderRadius: '1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, rgba(13, 17, 26, 0.95), rgba(20, 27, 45, 0.85))',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={business.logoUrl || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80'}
            alt={business.name}
            style={{ width: '4.5rem', height: '4.5rem', borderRadius: '1rem', objectFit: 'cover', border: '2px solid #8B5CF6' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {business.name}
              </h2>
              <span className="badge badge-tool" style={{ fontSize: '0.75rem' }}>{business.category}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.35rem 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin style={{ width: '0.85rem', height: '0.85rem' }} /> {business.location || 'Location Not provided'}
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {business.productsServices.map((prod, idx) => (
                <span key={idx} style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.05)', color: '#CBD5E1', padding: '0.15rem 0.5rem', borderRadius: '0.35rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {prod}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={onCreateCampaign}
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', gap: '0.4rem' }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} /> Create Advertisement Campaign
          </button>
        </div>
      </div>

      {/* Grid: Sent Collaboration Requests & Product Showcase */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* Left: Collaboration Requests */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Send style={{ width: '1.1rem', height: '1.1rem', color: '#8B5CF6' }} /> Sent Collaboration Requests ({collaborations.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Real-time status updates</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {collaborations.length === 0 ? (
              <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
                <Users style={{ width: '2rem', height: '2rem', margin: '0 auto 0.75rem auto', color: '#64748B' }} />
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem' }}>No collaboration requests sent yet.</p>
                <a href="#creators" className="btn btn-secondary btn-sm">Discover Creators to Contact</a>
              </div>
            ) : (
              collaborations.map((collab) => (
                <div
                  key={collab.id}
                  className="glass-card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.25rem 0' }}>
                        {collab.campaignTitle}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>
                        Creator: <strong>{collab.creatorName}</strong> ({collab.creatorHandle ? `@${collab.creatorHandle}` : 'Creator'})
                      </p>
                    </div>
                    {getStatusBadge(collab.status)}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#CBD5E1', background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: '0.5rem' }}>
                    <strong>Product:</strong> {collab.productService} • <strong>Budget:</strong> ${collab.budget} • <strong>Deadline:</strong> {collab.deadline}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      Sent on {new Date(collab.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => onOpenChat(collab)}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.35rem', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', fontSize: '0.72rem' }}
                    >
                      <MessageSquare style={{ width: '0.8rem', height: '0.8rem' }} /> Open Messages & Deal Room
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Uploaded Product Media Assets */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Upload style={{ width: '1.1rem', height: '1.1rem', color: '#06B6D4' }} /> Product & Ad Assets ({uploadedItems.length})
            </h3>
            <button
              onClick={handleSimulateUpload}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', gap: '0.3rem' }}
            >
              <Plus style={{ width: '0.75rem', height: '0.75rem' }} /> Upload New
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {uploadedItems.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '0.75rem',
                }}
              >
                <div>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.15rem 0' }}>
                    {item.title}
                  </h5>
                  <span style={{ fontSize: '0.68rem', color: '#06B6D4', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                    ▶ {item.type} preview asset
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  {item.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Match Creator Recommendations */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <Sparkles style={{ width: '1rem', height: '1rem', color: '#8B5CF6' }} />
              <span style={{ fontSize: '0.75rem', color: '#8B5CF6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Smart Match Algorithm
              </span>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Recommended Creators for {business.category}
            </h3>
          </div>
          <a href="#creators" className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
            View Full Creator Directory
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {smartMatches.map(({ creator, matchScore, matchReasons }) => (
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
                border: '1px solid rgba(139, 92, 246, 0.25)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid #8B5CF6' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                        {creator.name}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.15rem 0 0 0' }}>
                        @{creator.handle} • {creator.location || 'Location Not provided'}
                      </p>
                    </div>
                  </div>

                  <span
                    className="badge badge-cyan"
                    style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
                  >
                    {matchScore}% Match
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
                  {creator.headline}
                </p>

                {/* Match Reasons Box */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.08)',
                    borderRadius: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '0.75rem',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#A78BFA', display: 'block', marginBottom: '0.25rem' }}>
                    Why this creator is recommended:
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.72rem', color: '#E2E8F0', lineHeight: 1.5 }}>
                    {matchReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>

                {/* Formats & Pricing info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94A3B8' }}>
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
                  onClick={() => onViewProfile(creator)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', justifyContent: 'center' }}
                >
                  View Profile
                </button>
                <button
                  onClick={() => onContactCreator(creator)}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.75rem', justifyContent: 'center', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                >
                  Contact Creator
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
