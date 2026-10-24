import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Wand2,
  CheckCircle2,
  AlertCircle,
  Upload
} from 'lucide-react';
import type { MediaCategory, ContentFormat, BrandBrief } from '../../types';
import { createCampaignBrief, generateAICampaignBrief } from '../../lib/api';

interface CampaignCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newBrief: BrandBrief) => void;
  defaultCategory?: MediaCategory;
}

const CATEGORIES: MediaCategory[] = [
  'Jewellery & Accessories',
  'Clothing & Fashion',
  'Colleges & Education',
  'Restaurants & Food',
  'Beauty & Skincare',
  'Electronics & Tech',
  'Travel & Tourism',
  'Healthcare & Fitness',
  'Real Estate & Housing',
  'Local Businesses & Startups'
];

export const CampaignCreationModal: React.FC<CampaignCreationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultCategory = 'Jewellery & Accessories',
}) => {
  const [businessName, setBusinessName] = useState('Acme Brand Co.');
  const [category, setCategory] = useState<MediaCategory>(defaultCategory);
  const [productService, setProductService] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('Brand Awareness & Social Engagement');
  const [platform, setPlatform] = useState('Instagram');
  const [contentType, setContentType] = useState<ContentFormat>('Reel');
  const [targetAudience, setTargetAudience] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English & Hindi');
  const [preferredLocation, setPreferredLocation] = useState('National');
  const [budgetMin, setBudgetMin] = useState('800');
  const [budgetMax, setBudgetMax] = useState('1600');
  const [deadline, setDeadline] = useState(() => {
    return new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  });
  const [deliverablesSummary, setDeliverablesSummary] = useState('2x 30s Vertical Reels');
  const [contactPreference, setContactPreference] = useState<'In-Platform Chat' | 'Email' | 'Phone'>('In-Platform Chat');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // AI Brief Co-Pilot state
  const [aiNotes, setAiNotes] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateWithAI = async () => {
    if (!aiNotes.trim() && !productService.trim()) {
      setErrorMsg('Please enter a quick note about your product or promotional goal first.');
      return;
    }
    setErrorMsg(null);
    setIsAiGenerating(true);

    try {
      const generated = await generateAICampaignBrief(aiNotes || productService, category);
      if (generated.title) setTitle(generated.title);
      if (generated.description) setDescription(generated.description);
      if (generated.objective) setObjective(generated.objective);
      if (generated.targetAudience) setTargetAudience(generated.targetAudience);
      if (generated.deliverablesSummary) setDeliverablesSummary(generated.deliverablesSummary);
      if (generated.budgetMin) setBudgetMin(String(generated.budgetMin));
      if (generated.budgetMax) setBudgetMax(String(generated.budgetMax));
      setAiGeneratedSuccess(true);
      setTimeout(() => setAiGeneratedSuccess(false), 3000);
    } catch {
      setErrorMsg('AI brief generation encountered an error.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Please enter a campaign title.');
      return;
    }
    if (!productService.trim()) {
      setErrorMsg('Please enter the product or service to promote.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a campaign description.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newBrief = await createCampaignBrief({
        brandName: businessName.trim(),
        category,
        productService: productService.trim(),
        title: title.trim(),
        description: description.trim(),
        objective,
        platform,
        contentType,
        targetAudience: targetAudience.trim() || 'General Consumers',
        preferredLanguage,
        preferredLocation,
        budgetMin: Number(budgetMin) || 800,
        budgetMax: Number(budgetMax) || 1600,
        deadline,
        deliverablesSummary,
        contactPreference,
        requiredTools: ['Runway Gen-3', 'Flux.1 Dev', 'Premiere Pro'],
      });

      setIsSubmitting(false);
      if (onSuccess) onSuccess(newBrief);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Failed to create advertisement campaign.');
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
          maxWidth: '740px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#0B0F19',
          borderRadius: '1.25rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85)',
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
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Create Advertisement Campaign
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0.2rem 0 0 0' }}>
              Publish an advertisement brief to find & match verified video creators
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
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
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* AI Brief Co-Pilot Box */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: '0.85rem',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.05))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#8B5CF6', fontWeight: 700, fontSize: '0.85rem' }}>
                <Sparkles style={{ width: '1rem', height: '1rem' }} />
                AI-Assisted Campaign Brief Generator
                <span className="badge badge-tool" style={{ fontSize: '0.62rem', marginLeft: '0.35rem' }}>
                  Demo Mode • Active
                </span>
              </div>
              {aiGeneratedSuccess && (
                <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 style={{ width: '0.85rem', height: '0.85rem' }} /> Brief Formulated!
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
              Type a quick raw thought (e.g. "Diwali gold necklace launch for brides under $1500" or "Campus tour for engineering admissions"), and our AI Co-Pilot will structure it into an agency-grade brief.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={aiNotes}
                onChange={(e) => setAiNotes(e.target.value)}
                placeholder="Type quick rough notes or product ideas..."
                className="input-field"
                style={{ flexGrow: 1, fontSize: '0.82rem' }}
              />
              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isAiGenerating}
                className="btn btn-primary btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                  whiteSpace: 'nowrap',
                  gap: '0.35rem',
                }}
              >
                <Wand2 style={{ width: '0.85rem', height: '0.85rem' }} />
                {isAiGenerating ? 'Generating...' : 'Auto-Generate Brief'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Business Category & Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Business Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MediaCategory)}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Business / Brand Name *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Kalyan Heritage Jewellers"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Product/Service & Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Product or Service to Promote *
                </label>
                <input
                  type="text"
                  value={productService}
                  onChange={(e) => setProductService(e.target.value)}
                  placeholder="e.g. 22K Gold Temple Necklace, CS Degree Admissions"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Diwali Festive Saree Draping Viral Reels"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Campaign Description */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                Campaign Description & Background *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe your promotional goals, brand identity, storyline, or special elements..."
                className="input-field"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            {/* Objective, Platform & Content Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Advertisement Objective
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="Brand Awareness & Social Reach">Brand Awareness</option>
                  <option value="Direct Sales & Online Orders">Direct Sales</option>
                  <option value="Store / Showroom Visits">Showroom Visits</option>
                  <option value="Campus Admissions & Lead Gen">Admissions & Enquiries</option>
                  <option value="Product Launch / Unboxing Buzz">Product Launch</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Preferred Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Multi-Platform">Multi-Platform</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Content Format
                </label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as ContentFormat)}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="Reel">Reel (9:16)</option>
                  <option value="Short Video">Short Video (15s - 30s)</option>
                  <option value="Campus Tour">Campus Tour</option>
                  <option value="Review">Product Review</option>
                  <option value="Unboxing">Unboxing Video</option>
                  <option value="Long Video">Long Video (YouTube)</option>
                </select>
              </div>
            </div>

            {/* Target Audience, Language, Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Brides-to-be, 20-35"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Preferred Language
                </label>
                <input
                  type="text"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  placeholder="e.g. English, Hindi"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Mumbai, Bengaluru"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Budget, Deadline & Deliverables */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Budget Min - Max ($)
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="input-field"
                    style={{ width: '50%' }}
                  />
                  <span style={{ color: '#64748B' }}>-</span>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="input-field"
                    style={{ width: '50%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                  Deliverables Summary
                </label>
                <input
                  type="text"
                  value={deliverablesSummary}
                  onChange={(e) => setDeliverablesSummary(e.target.value)}
                  placeholder="e.g. 2x 30s Reels + 1x Cutdown"
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Upload Existing Media / Reference Video */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                Upload Product Video or Reference Advertisement (Optional)
              </label>
              <div
                style={{
                  border: '1px dashed rgba(139, 92, 246, 0.4)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.4)',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'video/*,image/*';
                  input.onchange = (ev: any) => {
                    const file = ev.target?.files?.[0];
                    if (file) setUploadedFileName(file.name);
                  };
                  input.click();
                }}
              >
                <Upload style={{ width: '1.5rem', height: '1.5rem', color: '#8B5CF6', margin: '0 auto 0.5rem auto' }} />
                <span style={{ fontSize: '0.8rem', color: '#CBD5E1', display: 'block' }}>
                  {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Click to select sample product video or images (MP4, MOV, PNG, JPG)'}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  Supports direct upload to Supabase Storage
                </span>
              </div>
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
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
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
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
              >
                {isSubmitting ? 'Publishing Campaign...' : 'Publish Campaign Brief'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
