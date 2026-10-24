import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  Video,
  ArrowRight,
  AlertCircle,
  Film,
  Users,
  CheckCircle2
} from 'lucide-react';
import type { UserAccount, MediaCategory } from '../../types';
import { registerUser } from '../../lib/api';

interface SignupPageProps {
  onSuccess: (user: UserAccount) => void;
  onNavigateToLogin: () => void;
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

const CREATOR_SPECIALIZATIONS: Record<string, string[]> = {
  'Jewellery & Accessories': [
    'Bridal Jewellery & Diamond Caustics',
    'Gold & Traditional Jewellery Reviews',
    'Handmade & Artisan Ornaments',
    'Luxury Watches & Accessories'
  ],
  'Clothing & Fashion': [
    'Sarees & Ethnic Couture',
    'Streetwear & Urban Style Lookbooks',
    'Sustainable & Thrift Fashion',
    'Boutique Collection Showcases'
  ],
  'Colleges & Education': [
    'Campus Tours & Student Vlogs',
    'Admission Guides & College Overviews',
    'Course Reviews & Career Guidance',
    'Academic Life & Hostel Experiences'
  ],
  'Restaurants & Food': [
    'Local Food Reviews & Street Stalls',
    'Fine Dining & Chef Highlights',
    'Menu Reel Showcases',
    'Café Aesthetics & Dessert Tastings'
  ],
  'Beauty & Skincare': [
    'Skincare Routines & Ingredient Reviews',
    'Bridal & Glam Makeup Tutorials',
    'Eco-friendly Cosmetics Unboxing',
    'Dermatology Advice & Before/After'
  ],
  'Electronics & Tech': [
    'Smartphone & Gadget Deep Dives',
    'AI Tools & Creator Gear Reviews',
    'Unboxing & Speed Benchmarks',
    'Smart Home Tech Setups'
  ],
  'Travel & Tourism': [
    'Resort & Hotel Stays',
    'Hidden Destinations & Itineraries',
    'Adventure & Trekking Vlogs',
    'City Guides & Culture Walkthroughs'
  ],
  'Healthcare & Fitness': [
    'Gym Workouts & Transformation Stories',
    'Nutrition Plans & Healthy Meal Prep',
    'Yoga & Mindfulness Sessions',
    'Supplements & Sports Science'
  ],
  'Real Estate & Housing': [
    'Luxury Villa & Apartment Walkthroughs',
    'Interior Design & Home Tours',
    'Commercial Property & Co-working Spaces',
    'Neighborhood Guides & Investment Tips'
  ],
  'Local Businesses & Startups': [
    'Founder Stories & Factory Tours',
    'Pop-up Shop & Launch Promos',
    'Craftsmanship & Behind the Scenes',
    'Service Demos & Customer Testimonials'
  ]
};

export const SignupPage: React.FC<SignupPageProps> = ({
  onSuccess,
  onNavigateToLogin,
}) => {
  const [role, setRole] = useState<'brand' | 'creator'>('brand');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState<MediaCategory>('Jewellery & Accessories');
  const [specialization, setSpecialization] = useState(CREATOR_SPECIALIZATIONS['Jewellery & Accessories'][0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // When category changes, default specialization to the first one in that category
  const handleCategoryChange = (newCat: MediaCategory) => {
    setCategory(newCat);
    const specs = CREATOR_SPECIALIZATIONS[newCat] || [];
    if (specs.length > 0) {
      setSpecialization(specs[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (role === 'brand' && !companyName.trim()) {
      setErrorMsg('Please enter your company or brand name.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms of Service & Privacy Policy to create an account.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const { user } = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        companyName: role === 'brand' ? companyName.trim() : undefined,
        category,
        specialization: role === 'creator' ? specialization : undefined,
      });

      setIsLoading(false);
      onSuccess(user);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(139, 92, 246, 0.22), #07090E)',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '1100px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85)',
          background: '#0B0F19',
        }}
      >
        {/* LEFT SIDE: VALUE PROPOSITION & BRANDING */}
        <div
          style={{
            padding: '3rem 2.5rem',
            background: 'linear-gradient(145deg, rgba(20, 16, 40, 0.95), rgba(10, 14, 25, 0.9))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRight: '1px solid var(--border-subtle)',
            position: 'relative',
          }}
        >
          <div>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2.5rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '0.85rem',
                  background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)',
                }}
              >
                <Sparkles style={{ width: '1.6rem', height: '1.6rem', color: '#FFFFFF' }} />
              </div>
              <div>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'block' }}>
                  CreatorConnect <span style={{ color: '#06B6D4' }}>AI</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  Smart Video Ad & Creator Connection Network
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.25,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
              }}
            >
              Start Your Video Journey{' '}
              <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                in Minutes.
              </span>
            </h1>

            <p style={{ fontSize: '0.92rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '2rem' }}>
              Whether you are an ambitious brand looking for viral promotional videos or a skilled creator ready to showcase your reels and reviews—join the industry's premier connection hub.
            </p>

            {/* Feature Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Film style={{ width: '1.3rem', height: '1.3rem', color: '#06B6D4', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', display: 'block' }}>
                    10 Dedicated Industry Categories
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Jewellery, Fashion, Colleges, Restaurants, Tech, Real Estate and more.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Users style={{ width: '1.3rem', height: '1.3rem', color: '#8B5CF6', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', display: 'block' }}>
                    Smart Algorithm Matching
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Compatibility scores based on category, portfolio samples, budget, and language.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem', fontSize: '0.75rem', color: '#64748B' }}>
            <CheckCircle2 style={{ width: '0.9rem', height: '0.9rem', color: '#10B981' }} />
            <span>Instant Role Redirection • Supabase Auth & Secure Session Storage</span>
          </div>
        </div>

        {/* RIGHT SIDE: SIGNUP FORM */}
        <div style={{ padding: '2.5rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
              Create an Account
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
              Choose your profile type to customize your onboarding experience.
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#F87171',
                padding: '0.85rem 1rem',
                borderRadius: '0.65rem',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle style={{ width: '1.1rem', height: '1.1rem', flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.5rem' }}>
              I want to join as:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('brand')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: role === 'brand' ? '2px solid #8B5CF6' : '1px solid var(--border-subtle)',
                  background: role === 'brand' ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                  color: role === 'brand' ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                }}
              >
                <Building2 style={{ width: '1.25rem', height: '1.25rem', color: role === 'brand' ? '#A78BFA' : '#64748B' }} />
                <div>
                  <div>Brand / Business</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 400, color: '#94A3B8' }}>Hire creators for ads</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('creator')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: role === 'creator' ? '2px solid #06B6D4' : '1px solid var(--border-subtle)',
                  background: role === 'creator' ? 'rgba(6, 182, 212, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                  color: role === 'creator' ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                }}
              >
                <Video style={{ width: '1.25rem', height: '1.25rem', color: role === 'creator' ? '#22D3EE' : '#64748B' }} />
                <div>
                  <div>Content Creator</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 400, color: '#94A3B8' }}>Publish reels & get hired</div>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1rem',
                    height: '1rem',
                    color: '#64748B',
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder={role === 'brand' ? 'e.g. Sarah Jenkins' : 'e.g. Priya Sharma'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem 0.7rem 2.4rem',
                    borderRadius: '0.65rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  style={{
                    position: 'absolute',
                    left: '0.9rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1rem',
                    height: '1rem',
                    color: '#64748B',
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder={role === 'brand' ? 'sarah@acme.com' : 'priya@creatorstudio.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem 0.7rem 2.4rem',
                    borderRadius: '0.65rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {role === 'brand' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                    Business / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kalyan Heritage Jewellers"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '0.65rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                    Business Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as MediaCategory)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '0.65rem',
                      background: '#151A29',
                      border: '1px solid var(--border-subtle)',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                    Primary Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as MediaCategory)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem',
                      borderRadius: '0.65rem',
                      background: '#151A29',
                      border: '1px solid var(--border-subtle)',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                    Specialization
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.9rem',
                        borderRadius: '0.65rem',
                        background: '#151A29',
                        border: '1px solid var(--border-subtle)',
                        color: '#FFFFFF',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    >
                      {(CREATOR_SPECIALIZATIONS[category] || ['General Content Creation']).map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    style={{
                      position: 'absolute',
                      left: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '1rem',
                      height: '1rem',
                      color: '#64748B',
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.9rem 0.7rem 2.4rem',
                      borderRadius: '0.65rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 2.4rem 0.7rem 0.9rem',
                      borderRadius: '0.65rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: '#FFFFFF',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', marginTop: '0.25rem' }}>
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{
                  marginTop: '0.2rem',
                  accentColor: '#8B5CF6',
                  cursor: 'pointer',
                }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.78rem', color: '#94A3B8', cursor: 'pointer', lineHeight: 1.4 }}>
                I agree to the <span style={{ color: '#06B6D4' }}>Terms of Service</span>, <span style={{ color: '#06B6D4' }}>Creator Guidelines</span>, and <span style={{ color: '#06B6D4' }}>Privacy Policy</span>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.2s',
                marginTop: '0.5rem',
              }}
            >
              {isLoading ? (
                <span>Creating your account...</span>
              ) : (
                <>
                  <span>Create {role === 'brand' ? 'Brand' : 'Creator'} Account</span>
                  <ArrowRight style={{ width: '1.1rem', height: '1.1rem' }} />
                </>
              )}
            </button>
          </form>

          {/* Navigation to Login */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94A3B8' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#06B6D4',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
