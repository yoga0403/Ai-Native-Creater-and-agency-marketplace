import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  Sparkles
} from 'lucide-react';
import type { CollaborationRequest, CollaborationMessage, UserRole } from '../../types';
import {
  getCollaborationMessages,
  sendCollaborationMessage,
  updateCollaborationStatus
} from '../../lib/api';

interface CollaborationChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaboration: CollaborationRequest | null;
  currentUserRole: UserRole;
  currentUserId: string;
  currentUserName: string;
  onStatusChange?: (updatedCollab: CollaborationRequest) => void;
}

const EMPTY_COLLABORATION: CollaborationRequest = {
  id: '',
  businessId: '',
  businessName: '',
  creatorId: '',
  creatorName: '',
  creatorHandle: '',
  creatorAvatar: '',
  campaignTitle: '',
  productService: '',
  requirements: '',
  budget: 0,
  deadline: '',
  message: '',
  status: 'Pending',
  createdAt: '',
  updatedAt: '',
};

export const CollaborationChatModal: React.FC<CollaborationChatModalProps> = ({
  isOpen,
  onClose,
  collaboration,
  currentUserRole,
  currentUserId,
  currentUserName,
  onStatusChange,
}) => {
  const [messages, setMessages] = useState<CollaborationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const collab = collaboration ?? EMPTY_COLLABORATION;

  const loadMessages = async (collabId: string) => {
    const list = await getCollaborationMessages(collabId);
    setMessages(list);
  };

  useEffect(() => {
    if (!collaboration) return;
    void loadMessages(collaboration.id);
  }, [collaboration]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !collaboration) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const role: 'brand' | 'creator' = currentUserRole === 'creator' ? 'creator' : 'brand';
    const newMsg = await sendCollaborationMessage(
      collab.id,
      currentUserId,
      currentUserName,
      role,
      inputText.trim()
    );
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const handleStatusUpdate = async (newStatus: CollaborationRequest['status']) => {
    setIsUpdatingStatus(true);
    const updated = await updateCollaborationStatus(collab.id, newStatus);
    if (updated && onStatusChange) {
      onStatusChange(updated);
    }
    if (updated) {
      // Auto-post system status message
      const role: 'brand' | 'creator' = currentUserRole === 'creator' ? 'creator' : 'brand';
      const sysMsg = await sendCollaborationMessage(
        collab.id,
        currentUserId,
        currentUserName,
        role,
        `Collaboration status updated to: "${newStatus}".`
      );
      setMessages(prev => [...prev, sysMsg]);
    }
    setIsUpdatingStatus(false);
  };

  const getStatusBadge = () => {
    switch (collab.status) {
      case 'Accepted':
        return (
          <span className="badge badge-emerald" style={{ gap: '0.3rem', fontSize: '0.75rem' }}>
            <CheckCircle2 style={{ width: '0.8rem', height: '0.8rem' }} /> Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="badge badge-rose" style={{ gap: '0.3rem', fontSize: '0.75rem' }}>
            <XCircle style={{ width: '0.8rem', height: '0.8rem' }} /> Declined
          </span>
        );
      case 'Completed':
        return (
          <span className="badge badge-cyan" style={{ gap: '0.3rem', fontSize: '0.75rem' }}>
            <Check style={{ width: '0.8rem', height: '0.8rem' }} /> Completed
          </span>
        );
      default:
        return (
          <span className="badge badge-amber" style={{ gap: '0.3rem', fontSize: '0.75rem' }}>
            <Clock style={{ width: '0.8rem', height: '0.8rem' }} /> Pending Creator Review
          </span>
        );
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
          maxWidth: '720px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#0B0F19',
          borderRadius: '1.25rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: '#0D121F',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {collab.campaignTitle}
              </h3>
              {getStatusBadge()}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
              Collaboration between <strong>{collab.businessName}</strong> and <strong>{collab.creatorName}</strong>
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

        {/* Campaign Info Strip */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            background: 'rgba(15, 23, 42, 0.6)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ color: '#CBD5E1' }}>
              <strong>Product:</strong> {collab.productService}
            </span>
            <span style={{ color: '#CBD5E1' }}>
              <strong>Budget:</strong> <span style={{ color: '#10B981', fontWeight: 700 }}>${collab.budget}</span>
            </span>
            <span style={{ color: '#CBD5E1' }}>
              <strong>Target Deadline:</strong> {collab.deadline}
            </span>
          </div>

          {/* Action buttons based on Role and Status */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {currentUserRole === 'creator' && collab.status === 'Pending' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('Accepted')}
                  disabled={isUpdatingStatus}
                  className="btn btn-emerald btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.65rem' }}
                >
                  <CheckCircle2 style={{ width: '0.75rem', height: '0.75rem' }} /> Accept Deal
                </button>
                <button
                  onClick={() => handleStatusUpdate('Rejected')}
                  disabled={isUpdatingStatus}
                  className="btn btn-rose btn-sm"
                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.65rem' }}
                >
                  <XCircle style={{ width: '0.75rem', height: '0.75rem' }} /> Decline
                </button>
              </>
            )}

            {collab.status === 'Accepted' && (
              <button
                onClick={() => handleStatusUpdate('Completed')}
                disabled={isUpdatingStatus}
                className="btn btn-cyan btn-sm"
                style={{ fontSize: '0.7rem', padding: '0.25rem 0.65rem' }}
              >
                <Check style={{ width: '0.75rem', height: '0.75rem' }} /> Mark as Completed
              </button>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: '#07090E',
          }}
        >
          {/* Initial Brief Message Box */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '0.85rem',
              background: '#0E1322',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8B5CF6', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              <Sparkles style={{ width: '0.85rem', height: '0.85rem' }} /> Initial Collaboration Brief
            </div>
            <p style={{ fontSize: '0.8rem', color: '#E2E8F0', margin: '0 0 0.5rem 0', lineHeight: 1.5 }}>
              "{collab.message}"
            </p>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              <strong>Deliverables requested:</strong> {collab.requirements}
            </div>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderRole === currentUserRole || msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                }}
              >
                <span style={{ fontSize: '0.68rem', color: '#64748B', marginBottom: '0.2rem' }}>
                  {msg.senderName} ({msg.senderRole})
                </span>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: isMe ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                    background: isMe
                      ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
                      : '#1E293B',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {msg.content}
                </div>
                <span style={{ fontSize: '0.62rem', color: '#475569', marginTop: '0.2rem' }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSendMessage}
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            background: '#0B0F19',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${currentUserRole === 'brand' ? collab.creatorName : collab.businessName}...`}
            className="input-field"
            style={{ flexGrow: 1 }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', gap: '0.35rem' }}
          >
            <Send style={{ width: '0.9rem', height: '0.9rem' }} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
