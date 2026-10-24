import React, { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../../lib/api';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const msg = await resetPassword(email.trim());
      setIsLoading(false);
      setSuccessMessage(msg);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Failed to process password reset.');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
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
          maxWidth: '460px',
          background: '#0B0F19',
          borderRadius: '1.25rem',
          padding: '2rem',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Reset Your Password
          </h3>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem', borderRadius: '50%' }}
          >
            <X style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>

        {successMessage ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              <CheckCircle2 style={{ width: '2rem', height: '2rem' }} />
            </div>
            <p style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {successMessage}
            </p>
            <button
              onClick={() => {
                setSuccessMessage(null);
                onBackToLogin();
              }}
              className="btn btn-primary"
              style={{ width: '100%', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>
              Enter the email address associated with your CreatorConnect AI account and we will dispatch password recovery instructions.
            </p>

            {errorMessage && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#F87171',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E1', display: 'block', marginBottom: '0.4rem' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#64748B' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onBackToLogin}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem', gap: '0.35rem', color: '#94A3B8' }}
              >
                <ArrowLeft style={{ width: '0.85rem', height: '0.85rem' }} /> Back to Login
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', fontSize: '0.85rem' }}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

