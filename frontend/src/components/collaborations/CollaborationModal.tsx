import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import type { CreatorProfile, CollaborationRequest } from '../../types';
import { createCollaborationRequest } from '../../lib/api';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: CreatorProfile | null;
  businessName?: string;
  onSuccess?: (collab: CollaborationRequest) => void;
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  creator,
  businessName = 'My Business',
  onSuccess,
}) => {
  const [campaignTitle, setCampaignTitle] = useState(
    creator ? `Promotional Campaign with @${creator.handle}` : 'Promotional Campaign'
  );
  const [productService, setProductService] = useState('');
  const [requirements, setRequirements] = useState(
    `1x 30-second vertical Reel highlighting product features and brand aesthetics, formatted for Instagram & TikTok.`
  );
  const [budget, setBudget] = useState(
    creator?.pricing?.perReelRate ? String(creator.pricing.perReelRate) : '800'
  );
  const [deadline, setDeadline] = useState(() => {
    return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  });
  const [message, setMessage] = useState(
    creator
      ? `Hi ${creator.name}! We really admire your recent video work in ${creator.category}. We would love to collaborate on a promotional advertisement for our brand.`
      : 'Hi there! We would love to collaborate on a promotional advertisement for our brand.'
  );
  const [contactPreference, setContactPreference] = useState<'In-Platform Chat' | 'Email' | 'Phone'>('In-Platform Chat');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successCollab, setSuccessCollab] = useState<CollaborationRequest | null>(null);

  if (!isOpen || !creator) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!campaignTitle.trim()) {
      setErrorMsg('Please enter a campaign title.');
      return;
    }
    if (!productService.trim()) {
      setErrorMsg('Please specify the product or service you want to promote.');
      return;
    }
    if (!requirements.trim()) {
      setErrorMsg('Please specify advertisement requirements and deliverables.');
      return;
    }
    const numBudget = Number(budget);
    if (isNaN(numBudget) || numBudget <= 0) {
      setErrorMsg('Please enter a valid campaign budget.');
      return;
    }
    if (!deadline) {
      setErrorMsg('Please select a target deadline.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please write a message to the creator.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newCollab = await createCollaborationRequest({
        businessId: 'biz-current',
        businessName,
        creatorId: creator.id,
        creatorName: creator.name,
        creatorHandle: creator.handle,
        creatorAvatar: creator.avatarUrl,
        campaignTitle: campaignTitle.trim(),
        productService: productService.trim(),
        requirements: requirements.trim(),
        budget: numBudget,
        deadline,
        message: message.trim(),
        contactPreference,
      });

      setIsSubmitting(false);
      setSuccessCollab(newCollab);
      if (onSuccess) onSuccess(newCollab);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Failed to send collaboration request. Please try again.');
    }
  };

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
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0B0F19',
          borderRadius: '1.25rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            background: '#0B0F19',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src={creator.avatarUrl}
              alt={creator.name}
              style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover', border: '2px solid #8B5CF6' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Contact {creator.name}
                </h3>
                <span className="badge badge-tool" style={{ fontSize: '0.65rem' }}>{creator.category}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
                @{creator.handle} • {creator.location || 'Location Not provided'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {successCollab ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <CheckCircle2 style={{ width: '2.5rem', height: '2.5rem' }} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Collaboration Request Sent!
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                Your request has been delivered to <strong>{creator.name}</strong>. You can track this request and message them directly in your <strong>Business Dashboard</strong>.
              </p>
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.08)',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#94A3B8' }}>Status:</span>
                  <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Pending Creator Acceptance</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#94A3B8' }}>Budget:</span>
                  <span style={{ color: '#FFFFFF', fontWeight: 700 }}>${successCollab.budget}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8' }}>Target Deadline:</span>
                  <span style={{ color: '#FFFFFF' }}>{successCollab.deadline}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {errorMsg && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#F87171',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Campaign Title */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g. Diwali Bridal Collection Video Reel"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Product / Service Details */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Product / Service to Promote *
                </label>
                <input
                  type="text"
                  value={productService}
                  onChange={(e) => setProductService(e.target.value)}
                  placeholder="e.g. 22K Gold Temple Necklace, Banarasi Silk Saree, Campus Admissions"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              {/* Advertisement Requirements */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Advertisement Requirements & Deliverables *
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={3}
                  placeholder="Describe content format (Reel, Campus Tour, Review), key features, visual style, and deliverable counts..."
                  className="input-field"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              {/* Budget & Deadline Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                    Budget (USD $) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>$</span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 1000"
                      className="input-field"
                      style={{ width: '100%', paddingLeft: '1.75rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                    Target Deadline *
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Message to Creator */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Personal Message to Creator *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Introduce your brand, why you chose them, and your expectations..."
                  className="input-field"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              {/* Contact Preference */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Contact Preference
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['In-Platform Chat', 'Email', 'Phone'] as const).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setContactPreference(pref)}
                      className={`btn btn-sm ${contactPreference === pref ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.75rem', flex: 1 }}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block', marginTop: '0.35rem' }}>
                  🔒 Private phone/email are kept confidential inside CreatorConnect AI until you choose to disclose them.
                </span>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ gap: '0.4rem', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                >
                  <Send style={{ width: '0.9rem', height: '0.9rem' }} />
                  {isSubmitting ? 'Sending Request...' : 'Send Collaboration Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
