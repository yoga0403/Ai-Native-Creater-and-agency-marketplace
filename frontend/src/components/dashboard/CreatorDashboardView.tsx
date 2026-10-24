import React, { useState } from 'react';
import {
  Film,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Check
} from 'lucide-react';
import type { CreatorProfile, CollaborationRequest, PortfolioItem } from '../../types';

interface CreatorDashboardViewProps {
  creator: CreatorProfile;
  collaborations: CollaborationRequest[];
  onOpenChat: (collab: CollaborationRequest) => void;
  onStatusUpdate: (collabId: string, status: CollaborationRequest['status']) => void;
}

export const CreatorDashboardView: React.FC<CreatorDashboardViewProps> = ({
  creator,
  collaborations,
  onOpenChat,
  onStatusUpdate,
}) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(creator.portfolio || []);

  const handleSimulateAddPortfolio = () => {
    const title = prompt('Enter a title for your portfolio video:');
    if (!title) return;
    const newItem: PortfolioItem = {
      id: `p-${Date.now()}`,
      title,
      mediaUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
      videoUrl: '/videos/jewelry-macro.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      duration: '0:30',
      mediaType: 'video',
      category: creator.category,
      prompt: 'Commercial promotional video production',
      model: 'Runway Gen-3 / Flux.1',
      tools: ['Runway Gen-3', 'Flux.1'],
      aspectRatio: '9:16',
      createdAt: 'Just now'
    };
    setPortfolioItems(prev => [newItem, ...prev]);
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
            <Clock style={{ width: '0.75rem', height: '0.75rem' }} /> Pending Your Review
          </span>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
      {/* Creator Profile Header */}
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
          background: 'linear-gradient(135deg, rgba(13, 17, 26, 0.95), rgba(25, 20, 45, 0.85))',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <img
            src={creator.avatarUrl}
            alt={creator.name}
            style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid #8B5CF6' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {creator.name}
              </h2>
              <span className="badge badge-tool" style={{ fontSize: '0.75rem' }}>{creator.category}</span>
              {creator.isVerified && (
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Verified Creator</span>
              )}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#CBD5E1', margin: '0.25rem 0 0.4rem 0' }}>
              @{creator.handle} • {creator.location || 'Location Not provided'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#94A3B8', flexWrap: 'wrap' }}>
              <span>
                <strong>Languages:</strong> {creator.languages ? creator.languages.join(', ') : 'Not provided'}
              </span>
              <span>
                <strong>Availability:</strong> <span style={{ color: '#10B981' }}>{creator.availability || 'Available'}</span>
              </span>
              <span>
                <strong>Est. Rate:</strong> <span style={{ color: '#FFFFFF' }}>{creator.pricing?.perReelRate ? `$${creator.pricing.perReelRate}/reel` : 'Not provided'}</span>
              </span>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={handleSimulateAddPortfolio}
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', gap: '0.4rem' }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} /> Add Video to Portfolio
          </button>
        </div>
      </div>

      {/* Grid: Incoming Collaboration Requests & Portfolio Videos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* Left: Incoming Collaboration Requests */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <MessageSquare style={{ width: '1.1rem', height: '1.1rem', color: '#8B5CF6' }} /> Incoming Business Requests ({collaborations.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Respond to brands</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {collaborations.length === 0 ? (
              <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
                <Clock style={{ width: '2rem', height: '2rem', margin: '0 auto 0.75rem auto', color: '#64748B' }} />
                <p style={{ margin: 0, fontSize: '0.85rem' }}>No incoming collaboration requests right now.</p>
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
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.25rem 0' }}>
                        {collab.campaignTitle}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>
                        From Brand: <strong>{collab.businessName}</strong>
                      </p>
                    </div>
                    {getStatusBadge(collab.status)}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#CBD5E1', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '0.5rem', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 0.4rem 0' }}>"{collab.message}"</p>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span><strong>Product:</strong> {collab.productService}</span>
                      <span><strong>Budget:</strong> <strong style={{ color: '#10B981' }}>${collab.budget}</strong></span>
                      <span><strong>Deadline:</strong> {collab.deadline}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {collab.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => onStatusUpdate(collab.id, 'Accepted')}
                            className="btn btn-emerald btn-sm"
                            style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                          >
                            <CheckCircle2 style={{ width: '0.75rem', height: '0.75rem' }} /> Accept Deal
                          </button>
                          <button
                            onClick={() => onStatusUpdate(collab.id, 'Rejected')}
                            className="btn btn-rose btn-sm"
                            style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                          >
                            <XCircle style={{ width: '0.75rem', height: '0.75rem' }} /> Decline
                          </button>
                        </>
                      )}
                      {collab.status === 'Accepted' && (
                        <button
                          onClick={() => onStatusUpdate(collab.id, 'Completed')}
                          className="btn btn-cyan btn-sm"
                          style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem' }}
                        >
                          <Check style={{ width: '0.75rem', height: '0.75rem' }} /> Mark as Completed
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenChat(collab)}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.35rem', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', fontSize: '0.72rem' }}
                    >
                      <MessageSquare style={{ width: '0.8rem', height: '0.8rem' }} /> Message Brand
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Portfolio Videos Showcase */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Film style={{ width: '1.1rem', height: '1.1rem', color: '#06B6D4' }} /> Portfolio Videos ({portfolioItems.length})
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  display: 'flex',
                  gap: '0.85rem',
                  padding: '0.75rem',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: '#000',
                  }}
                >
                  <img
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.2rem 0' }}>
                    {item.title}
                  </h5>
                  <span style={{ fontSize: '0.68rem', color: '#67E8F9', display: 'block', marginBottom: '0.2rem' }}>
                    {item.category} • {item.duration || '0:30'}
                  </span>
                  <span className="badge badge-tool" style={{ fontSize: '0.62rem' }}>
                    {item.model}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
