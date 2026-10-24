import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Film,
  Users,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import type { UserAccount } from '../../types';
import { loginUser } from '../../lib/api';

interface LoginPageProps {
  onSuccess: (user: UserAccount) => void;
  onNavigateToSignup: () => void;
  onOpenForgotPassword: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onNavigateToSignup,
  onOpenForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const { user } = await loginUser(email, password, rememberMe);
      setIsLoading(false);
      onSuccess(user);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMsg(null);
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
        padding: '1.5rem',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '1080px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85)',
          background: '#0B0F19',
        }}
      >
        {/* LEFT SIDE: BRANDING, HEADLINE & CREATIVE SHOWCASE */}
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
                  AI-Native Video Creator Marketplace
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.2,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
              }}
            >
              Connect Your Creativity.{' '}
              <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Grow Your Brand.
              </span>
            </h1>

            {/* Description */}
            <p style={{ fontSize: '0.92rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '2rem' }}>
              Discover talented creators, showcase your work, and turn ideas into powerful video advertisements.
              Whether you are a jewellery boutique, an educational institution, or a fashion label—connect with creators who match your category, budget, and vision.
            </p>

            {/* Visual Feature Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Film style={{ width: '1.25rem', height: '1.25rem', color: '#06B6D4', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', display: 'block' }}>
                    Category-Matched Video Campaigns
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Reels, Shorts, Campus Tours, Sizzle Videos & Reviews
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Users style={{ width: '1.25rem', height: '1.25rem', color: '#8B5CF6', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', display: 'block' }}>
                    Verified Creators & Transparent Rates
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Direct outreach, in-platform chat & proposal deal rooms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem', fontSize: '0.75rem', color: '#64748B' }}>
            <CheckCircle2 style={{ width: '0.9rem', height: '0.9rem', color: '#10B981' }} />
            <span>Secure Role-Guarded Access • Protected Creator Profiles</span>
          </div>
        </div>

        {/* RIGHT SIDE: CLEAN LOGIN CARD */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
              Welcome Back
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: 0 }}>
              Log in with any email & password (auto-creates account if new).
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
                marginBottom: '1.5rem',
              }}
            >
              <AlertCircle style={{ width: '1.1rem', height: '1.1rem', flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Credentials Pill */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '0.75rem',
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              marginBottom: '1.75rem',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: '#A78BFA', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
              ⚡ Quick Demo Credentials (Click to prefill):
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fillDemoAccount('brand@acme.com')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', gap: '0.3rem' }}
              >
                <Briefcase style={{ width: '0.7rem', height: '0.7rem', color: '#06B6D4' }} /> Brand: brand@acme.com
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('creator@creatorconnect.ai')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', gap: '0.3rem' }}
              >
                <Users style={{ width: '0.7rem', height: '0.7rem', color: '#8B5CF6' }} /> Creator: creator@creatorconnect.ai
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Address */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', width: '1.1rem', height: '1.1rem', color: '#64748B' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '2.6rem' }}
                />
              </div>
            </div>

            {/* Password with Show/Hide */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', width: '1.1rem', height: '1.1rem', color: '#64748B' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff style={{ width: '1.1rem', height: '1.1rem' }} /> : <Eye style={{ width: '1.1rem', height: '1.1rem' }} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#94A3B8', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#8B5CF6' }}
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={onOpenForgotPassword}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.8rem', color: '#06B6D4', padding: 0 }}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
                gap: '0.5rem',
                marginTop: '0.5rem',
              }}
            >
              {isLoading ? 'Signing in...' : 'Log In'}
              <ArrowRight style={{ width: '1rem', height: '1rem' }} />
            </button>

            {/* Sign Up Link */}
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#94A3B8' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToSignup}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#67E8F9',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

