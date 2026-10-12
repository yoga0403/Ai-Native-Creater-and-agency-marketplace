import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  aspectRatio?: '9:16' | '16:9' | '1:1' | '4:5';
  autoPlay?: boolean;
  loop?: boolean;
  fallbackSrc?: string;
  onEnded?: () => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  aspectRatio = '16:9',
  autoPlay = false,
  loop = false,
  fallbackSrc = '/videos/cinematic-reel.mp4',
  onEnded,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video State
  const [activeSrc, setActiveSrc] = useState<string>(src);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bufferedPercent, setBufferedPercent] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [hasStarted, setHasStarted] = useState<boolean>(autoPlay);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const hideControlsTimer = useRef<number | null>(null);

  // Sync src prop changes
  useEffect(() => {
    setActiveSrc(src);
    setErrorMessage(null);
    setIsUsingFallback(false);
    setHasStarted(autoPlay);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [src, autoPlay]);

  // Social Media & Embed URL Detection
  const parseSocialUrl = (url: string) => {
    if (!url) return null;

    // YouTube Match
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
      };
    }

    // Vimeo Match
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch) {
      return {
        type: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      };
    }

    // Instagram Reel / Post
    if (url.includes('instagram.com/')) {
      return {
        type: 'instagram',
        url,
      };
    }

    // TikTok Video
    if (url.includes('tiktok.com/')) {
      return {
        type: 'tiktok',
        url,
      };
    }

    return null;
  };

  const socialInfo = parseSocialUrl(activeSrc);

  // Autohide controls on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = window.setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
    };
  }, []);

  // Time & Buffer Tracking
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // Calculate buffered range
    if (videoRef.current.buffered.length > 0 && videoRef.current.duration > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBufferedPercent((bufferedEnd / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
    setIsLoading(false);
    setErrorMessage(null);
  };

  // Play / Pause Toggle
  const togglePlay = useCallback(async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (!hasStarted) {
      setHasStarted(true);
    }

    if (videoRef.current.paused || videoRef.current.ended) {
      try {
        setIsLoading(true);
        await videoRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (err: unknown) {
        setIsLoading(false);
        // Autoplay policy or media abort
        if (err instanceof Error && err.name === 'NotAllowedError') {
          // Fall back to muted playback if blocked
          videoRef.current.muted = true;
          setIsMuted(true);
          try {
            await videoRef.current.play();
            setIsPlaying(true);
          } catch {
            setIsPlaying(false);
          }
        } else {
          setIsPlaying(false);
        }
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [hasStarted]);

  // Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  // Seek / Timeline Scrubber
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleSkip = (seconds: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const target = Math.min(Math.max(0, videoRef.current.currentTime + seconds), duration);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  // Fullscreen Toggle
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Speed Cycle
  const cyclePlaybackRate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rates = [1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    videoRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  // Error Handling & Verified Fallback
  const handleVideoError = () => {
    setIsLoading(false);
    setIsPlaying(false);
    const mediaError = videoRef.current?.error;
    let detail = 'The video stream could not be loaded or format is unsupported.';
    if (mediaError) {
      switch (mediaError.code) {
        case 1:
          detail = 'Playback was aborted.';
          break;
        case 2:
          detail = 'Network error caused video download to fail.';
          break;
        case 3:
          detail = 'Video decoding failed or format is corrupted.';
          break;
        case 4:
          detail = 'Video source not supported or HTTP 403 Forbidden.';
          break;
      }
    }
    setErrorMessage(detail);
  };

  const switchToFallback = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUsingFallback(true);
    setErrorMessage(null);
    setActiveSrc(fallbackSrc);
    setHasStarted(true);
    setIsLoading(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        }).catch(() => {
          setIsLoading(false);
        });
      }
    }, 150);
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setErrorMessage(null);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Aspect ratio wrapper styling
  const aspectStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : aspectRatio === '4:5' ? '4/5' : '16/9',
    maxHeight: aspectRatio === '9:16' ? '70vh' : '55vh',
    borderRadius: '1rem',
    overflow: 'hidden',
    backgroundColor: '#05070C',
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.25)',
  };

  // Render Social Media Embeds
  if (socialInfo) {
    if (socialInfo.type === 'youtube' || socialInfo.type === 'vimeo') {
      return (
        <div ref={containerRef} style={aspectStyle} className={`video-player-container ${className}`}>
          <iframe
            src={socialInfo.embedUrl}
            title={title || 'Social Video Embed'}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (socialInfo.type === 'instagram' || socialInfo.type === 'tiktok') {
      return (
        <div ref={containerRef} style={aspectStyle} className={`video-player-container ${className}`}>
          {poster && (
            <img
              src={poster}
              alt={title || 'Preview'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center',
              background: 'radial-gradient(circle, rgba(15, 23, 42, 0.85) 0%, rgba(5, 7, 12, 0.95) 100%)',
            }}
          >
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)',
              }}
            >
              <ExternalLink style={{ width: '1.75rem', height: '1.75rem', color: '#FFFFFF' }} />
            </div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
              {socialInfo.type === 'instagram' ? 'Instagram Reel Asset' : 'TikTok Short-Form Video'}
            </h4>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', maxWidth: '360px', margin: '0 0 1.25rem 0' }}>
              This creator provided an external social media link which cannot be parsed as a direct raw stream.
            </p>
            <a
              href={socialInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
            >
              <span>Watch on {socialInfo.type === 'instagram' ? 'Instagram' : 'TikTok'}</span>
              <ExternalLink style={{ width: '0.9rem', height: '0.9rem' }} />
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <div
      ref={containerRef}
      style={aspectStyle}
      className={`video-player-container ${className}`}
      onMouseMove={handleMouseMove}
      onClick={(e) => e.stopPropagation()}
    >
      {/* HTML5 Native Video Element */}
      <video
        ref={videoRef}
        src={activeSrc}
        poster={poster}
        playsInline
        preload="metadata"
        loop={loop}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        onError={handleVideoError}
        onClick={togglePlay}
        style={{
          width: '100%',
          height: '100%',
          objectFit: aspectRatio === '9:16' ? 'contain' : 'cover',
          cursor: 'pointer',
          backgroundColor: '#000000',
        }}
      />

      {/* 1. INITIAL POSTER THUMBNAIL & PLAY BUTTON OVERLAY */}
      {!hasStarted && !errorMessage && (
        <div
          onClick={togglePlay}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(5,7,12,0.7) 100%)',
            transition: 'background 0.2s ease',
          }}
        >
          {poster && (
            <img
              src={poster}
              alt={title || 'Video poster thumbnail'}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
              }}
            />
          )}

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.65)',
              transform: 'scale(1)',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 0 45px rgba(139, 92, 246, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.65)';
            }}
          >
            <Play style={{ width: '2rem', height: '2rem', fill: '#FFFFFF', color: '#FFFFFF', marginLeft: '4px' }} />
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: '1.25rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            Click to Play Video with Audio
          </div>
        </div>
      )}

      {/* 2. LOADING / BUFFERING SPINNER */}
      {isLoading && !errorMessage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: '0.75rem',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#A78BFA',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <Loader2 style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} />
            <span>Buffering video stream...</span>
          </div>
        </div>
      )}

      {/* 3. ERROR BANNER & RESILIENT FALLBACK */}
      {errorMessage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10, 14, 24, 0.96)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: '#F87171',
            }}
          >
            <AlertCircle style={{ width: '1.75rem', height: '1.75rem' }} />
          </div>

          <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.4rem 0' }}>
            Video Playback Stream Error
          </h4>
          <p style={{ color: '#94A3B8', fontSize: '0.8rem', maxWidth: '380px', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
            {errorMessage}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={switchToFallback}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RefreshCw style={{ width: '0.85rem', height: '0.85rem' }} />
              <span>Play Verified Local MP4</span>
            </button>
            <button
              onClick={handleRetry}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RotateCcw style={{ width: '0.85rem', height: '0.85rem' }} />
              <span>Retry Stream</span>
            </button>
          </div>
        </div>
      )}

      {/* Verified Fallback Notification Pill */}
      {isUsingFallback && !errorMessage && (
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34D399',
            fontSize: '0.72rem',
            fontWeight: 600,
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backdropFilter: 'blur(6px)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          Playing Verified Local H.264 Stream
        </div>
      )}

      {/* 4. MODERN GLASSMORPHIC CONTROLS BAR */}
      {hasStarted && !errorMessage && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1.25rem 1rem 0.85rem 1rem',
            background: 'linear-gradient(to top, rgba(4, 6, 10, 0.95) 0%, rgba(4, 6, 10, 0.6) 70%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            opacity: showControls ? 1 : 0,
            pointerEvents: showControls ? 'auto' : 'none',
            transition: 'opacity 0.25s ease',
            zIndex: 15,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Interactive Timeline Scrubber */}
          <div style={{ position: 'relative', width: '100%', height: '14px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            {/* Background Track */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '4px',
                borderRadius: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            />

            {/* Buffered Bar */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: `${bufferedPercent}%`,
                height: '4px',
                borderRadius: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.35)',
                transition: 'width 0.2s ease',
              }}
            />

            {/* Played Progress Bar */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                height: '4px',
                borderRadius: '2px',
                background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
              }}
            />

            {/* Range Input for Scrubbing */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
                margin: 0,
              }}
              title="Seek Video Position"
            />
          </div>

          {/* Bottom Controls Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            {/* Left Controls: Play, Skip, Time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={togglePlay}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: '0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause style={{ width: '1.25rem', height: '1.25rem', fill: '#FFFFFF' }} />
                ) : (
                  <Play style={{ width: '1.25rem', height: '1.25rem', fill: '#FFFFFF' }} />
                )}
              </button>

              <button
                type="button"
                onClick={(e) => handleSkip(-10, e)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
                title="Rewind 10s"
              >
                -10s
              </button>

              <button
                type="button"
                onClick={(e) => handleSkip(10, e)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
                title="Forward 10s"
              >
                +10s
              </button>

              {/* Timestamp Display */}
              <div
                style={{
                  fontSize: '0.74rem',
                  color: '#E2E8F0',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{formatTime(currentTime)}</span>
                <span style={{ color: '#64748B' }}>/</span>
                <span style={{ color: '#94A3B8' }}>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Volume, Speed, Fullscreen */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* Volume & Mute */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={toggleMute}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#CBD5E1',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX style={{ width: '1.1rem', height: '1.1rem', color: '#F87171' }} />
                  ) : volume < 0.5 ? (
                    <Volume1 style={{ width: '1.1rem', height: '1.1rem' }} />
                  ) : (
                    <Volume2 style={{ width: '1.1rem', height: '1.1rem' }} />
                  )}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{
                    width: '60px',
                    height: '4px',
                    accentColor: '#8B5CF6',
                    cursor: 'pointer',
                  }}
                  title="Volume Slider"
                />
              </div>

              {/* Playback Rate / Speed Button */}
              <button
                type="button"
                onClick={cyclePlaybackRate}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '0.35rem',
                  color: '#CBD5E1',
                  cursor: 'pointer',
                  padding: '0.2rem 0.45rem',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
                title="Playback Speed"
              >
                {playbackRate}x
              </button>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={toggleFullscreen}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#CBD5E1',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize style={{ width: '1.1rem', height: '1.1rem' }} />
                ) : (
                  <Maximize style={{ width: '1.1rem', height: '1.1rem' }} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
