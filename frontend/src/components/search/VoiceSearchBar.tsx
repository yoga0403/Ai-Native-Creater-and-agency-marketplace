import React, { useState, useRef, useCallback } from 'react';
import {
  Search,
  Mic,
  MicOff,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Radio,
  Sparkles,
} from 'lucide-react';

// Web Speech API Types
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onspeechend: (() => void) | null;
}

export interface VoiceSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  onCategorySelect?: (category: string) => void;
  onPlatformSelect?: (platform: string) => void;
  onMediaTypeSelect?: (mediaType: 'All' | 'video' | 'image') => void;
  className?: string;
  style?: React.CSSProperties;
}

export const VoiceSearchBar: React.FC<VoiceSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search by category, model, name, or style...',
  onCategorySelect,
  onPlatformSelect,
  onMediaTypeSelect,
  className = '',
  style = {},
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'en-US' | 'te-IN'>('en-US');
  const [showLanguageMenu, setShowLanguageMenu] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [isHoveredMic, setIsHoveredMic] = useState<boolean>(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const statusTimeoutRef = useRef<number | null>(null);
  const hasSpeechSupport = typeof window !== 'undefined' && Boolean(
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition
  );

  // Natural Language Intent Extractor (English & Telugu)
  const processIntent = useCallback((text: string) => {
    const lower = text.toLowerCase().trim();

    // 1. Category extraction
    if (onCategorySelect) {
      if (lower.includes('bridal') || lower.includes('wedding') || lower.includes('lehenga') || lower.includes('బ్రైడల్') || lower.includes('పెళ్లి')) {
        onCategorySelect('Bridal & Wedding');
      } else if (lower.includes('fashion') || lower.includes('clothing') || lower.includes('outfit') || lower.includes('runway') || lower.includes('ఫ్యాషన్') || lower.includes('దుస్తులు')) {
        onCategorySelect('Clothing & Fashion');
      } else if (lower.includes('drink') || lower.includes('beverage') || lower.includes('soda') || lower.includes('డ్రింక్స్') || lower.includes('పానీయాలు')) {
        onCategorySelect('Drinks & Beverage');
      } else if (lower.includes('jewel') || lower.includes('necklace') || lower.includes('diamond') || lower.includes('నగలు') || lower.includes('ఆభరణాలు')) {
        onCategorySelect('Jewellery & Accessories');
      } else if (lower.includes('beauty') || lower.includes('skincare') || lower.includes('makeup') || lower.includes('బ్యూటీ') || lower.includes('అందం')) {
        onCategorySelect('Beauty & Skincare');
      } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('wagyu') || lower.includes('కుకింగ్') || lower.includes('ఆహారం') || lower.includes('భోజనం')) {
        onCategorySelect('Food & Restaurants');
      } else if (lower.includes('travel') || lower.includes('tourism') || lower.includes('hotel') || lower.includes('flight') || lower.includes('ప్రయాణం') || lower.includes('ట్రావెల్')) {
        onCategorySelect('Travel & Lifestyle');
      } else if (lower.includes('tech') || lower.includes('electronic') || lower.includes('gadget') || lower.includes('ఎలక్ట్రానిక్స్') || lower.includes('టెక్')) {
        onCategorySelect('Electronics & Tech');
      }
    }

    // 2. Platform extraction
    if (onPlatformSelect) {
      if (lower.includes('instagram') || lower.includes('ఇన్‌స్టాగ్రామ్')) {
        onPlatformSelect('Instagram');
      } else if (lower.includes('youtube') || lower.includes('యూట్యూబ్')) {
        onPlatformSelect('YouTube');
      } else if (lower.includes('tiktok') || lower.includes('టిక్‌టాక్')) {
        onPlatformSelect('TikTok');
      }
    }

    // 3. Media Type extraction
    if (onMediaTypeSelect) {
      if (lower.includes('video') || lower.includes('reel') || lower.includes('వీడియో') || lower.includes('రీల్')) {
        onMediaTypeSelect('video');
      } else if (lower.includes('photo') || lower.includes('image') || lower.includes('ఫోటో')) {
        onMediaTypeSelect('image');
      }
    }
  }, [onCategorySelect, onPlatformSelect, onMediaTypeSelect]);

  // Clean conversational prefixes for cleaner query
  const cleanSearchQuery = (rawText: string) => {
    // English cleaning: "find bridal makeup creators" -> "bridal makeup"
    let cleaned = rawText
      .replace(/^(find|show|search for|search|get me|looking for)\s+/i, '')
      .replace(/\s+(creators|influencers|artists|directors|videos|content)$/i, '')
      .trim();

    // Telugu cleaning
    cleaned = cleaned
      .replace(/(క్రియేటర్స్|ఇన్‌ఫ్లుయెన్సర్స్|వీడియోలు|వెతకండి)$/i, '')
      .trim();

    return cleaned.length > 0 ? cleaned : rawText;
  };

  // Toggle speech recognition
  const toggleListening = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // If already listening, stop
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setIsProcessing(false);
      setStatusMessage(null);
      return;
    }

    // Check browser support
    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setErrorMessage(
        'Speech Recognition is not supported by your current browser. Supported browsers include Chrome, Edge, and Safari.'
      );
      if (statusTimeoutRef.current) window.clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = window.setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.continuous = false; // Do not record indefinitely
      recognition.interimResults = true; // Show real-time speech as spoken
      recognition.lang = selectedLanguage;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
        setErrorMessage(null);
        setInterimTranscript('');
        setStatusMessage(
          selectedLanguage === 'te-IN'
            ? '🎙️ వింటున్నాము... మాట్లాడండి (ఉదా: "బ్రైడల్ క్రియేటర్స్")'
            : '🎙️ Listening... Speak now (e.g. "Find bridal makeup creators")'
        );
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          const finalTrimmed = final.trim();
          setInterimTranscript('');
          setIsListening(false);
          setIsProcessing(false);

          // Populate the search bar with cleaned search keywords
          const cleanedText = cleanSearchQuery(finalTrimmed);
          onChange(cleanedText);

          // Trigger natural language filter routing
          processIntent(finalTrimmed);

          setStatusMessage(
            selectedLanguage === 'te-IN'
              ? '✅ వాయిస్ సెర్చ్ పూర్తయింది!'
              : '✅ Voice search complete!'
          );

          if (onSearch) {
            onSearch(finalTrimmed);
          }

          if (statusTimeoutRef.current) window.clearTimeout(statusTimeoutRef.current);
          statusTimeoutRef.current = window.setTimeout(() => {
            setStatusMessage(null);
          }, 3500);
        }
      };

      recognition.onspeechend = () => {
        setIsProcessing(true);
        setStatusMessage(
          selectedLanguage === 'te-IN' ? 'వాయిస్ ప్రాసెస్ అవుతోంది...' : 'Processing speech...'
        );
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        setIsProcessing(false);
        setInterimTranscript('');

        let errDesc = 'Speech recognition error. Please try again.';
        if (event.error === 'not-allowed') {
          errDesc = 'Microphone access was denied. Please allow microphone permissions in your browser address bar.';
        } else if (event.error === 'no-speech') {
          errDesc = 'No speech detected. Please try speaking closer to the microphone.';
        } else if (event.error === 'network') {
          errDesc = 'Network error during speech recognition. Please check your internet connection.';
        } else if (event.error === 'audio-capture') {
          errDesc = 'No microphone device was detected.';
        }

        setErrorMessage(errDesc);
        setStatusMessage(null);

        if (statusTimeoutRef.current) window.clearTimeout(statusTimeoutRef.current);
        statusTimeoutRef.current = window.setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err: unknown) {
      setIsListening(false);
      setIsProcessing(false);
      setErrorMessage('Could not initiate speech recognition: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Handle Search on Enter Key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearch) onSearch(value);
    }
  };

  // Quick spoken sample suggestions
  const quickSamples = [
    { label: 'Bridal Makeup', query: 'Find bridal makeup creators' },
    { label: 'Fashion Influencers', query: 'Show fashion influencers on Instagram' },
    { label: 'Food Videos', query: 'Find food video creators' },
    { label: 'Jewellery', query: 'Search jewellery promotional creators' },
    { label: 'Travel & Lifestyle', query: 'Find travel creators within my budget' },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '440px', ...style }} className={className}>
      {/* Search Input Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#0D111A',
          borderRadius: '0.75rem',
          border: isListening
            ? '1.5px solid #8B5CF6'
            : '1px solid var(--border-subtle)',
          boxShadow: isListening
            ? '0 0 20px rgba(139, 92, 246, 0.4), inset 0 0 10px rgba(139, 92, 246, 0.1)'
            : 'none',
          transition: 'border 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        {/* Left Search Icon */}
        <Search
          style={{
            width: '1rem',
            height: '1rem',
            color: '#64748B',
            marginLeft: '0.85rem',
            flexShrink: 0,
          }}
        />

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={interimTranscript ? interimTranscript : value}
          onChange={(e) => {
            onChange(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            isListening
              ? selectedLanguage === 'te-IN'
                ? 'వింటున్నాము... మాట్లాడండి...'
                : 'Listening... Speak now...'
              : placeholder
          }
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: interimTranscript ? '#A78BFA' : '#FFFFFF',
            fontSize: '0.85rem',
            fontStyle: interimTranscript ? 'italic' : 'normal',
            padding: '0.75rem 0.65rem',
            minWidth: 0,
          }}
          aria-label="Search creators and campaigns"
        />

        {/* Action Controls on the Right: Clear, Language Toggle, Mic, Search Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', paddingRight: '0.65rem' }}>
          {/* Clear Button */}
          {value && !isListening && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setInterimTranscript('');
                if (onSearch) onSearch('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.25rem',
              }}
              title="Clear search"
              aria-label="Clear search"
            >
              <X style={{ width: '0.85rem', height: '0.85rem' }} />
            </button>
          )}

          {/* Language Selector Dropdown (English vs Telugu) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowLanguageMenu(!showLanguageMenu);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '0.2rem 0.45rem',
                borderRadius: '0.35rem',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
              title={`Voice Language: ${selectedLanguage === 'en-US' ? 'English' : 'Telugu (తెలుగు)'}`}
              aria-label="Toggle Voice Language"
            >
              <Globe style={{ width: '0.75rem', height: '0.75rem', color: '#8B5CF6' }} />
              <span>{selectedLanguage === 'en-US' ? 'EN' : 'TE'}</span>
            </button>

            {showLanguageMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '125%',
                  right: 0,
                  background: '#0F131D',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '0.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  zIndex: 40,
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7)',
                  minWidth: '125px',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLanguage('en-US');
                    setShowLanguageMenu(false);
                  }}
                  style={{
                    background: selectedLanguage === 'en-US' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: selectedLanguage === 'en-US' ? '#A78BFA' : '#CBD5E1',
                    border: 'none',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '0.35rem',
                    fontSize: '0.74rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>🇺🇸 English</span>
                  {selectedLanguage === 'en-US' && <span style={{ fontSize: '0.65rem' }}>✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLanguage('te-IN');
                    setShowLanguageMenu(false);
                  }}
                  style={{
                    background: selectedLanguage === 'te-IN' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: selectedLanguage === 'te-IN' ? '#A78BFA' : '#CBD5E1',
                    border: 'none',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '0.35rem',
                    fontSize: '0.74rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>🇮🇳 తెలుగు (Telugu)</span>
                  {selectedLanguage === 'te-IN' && <span style={{ fontSize: '0.65rem' }}>✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* SMART MICROPHONE BUTTON */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={toggleListening}
              onMouseEnter={() => setIsHoveredMic(true)}
              onMouseLeave={() => setIsHoveredMic(false)}
              style={{
                background: isListening
                  ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                  : isProcessing
                  ? 'linear-gradient(135deg, #8B5CF6, #6366F1)'
                  : 'rgba(139, 92, 246, 0.15)',
                border: isListening
                  ? '1px solid #F87171'
                  : '1px solid rgba(139, 92, 246, 0.35)',
                color: isListening ? '#FFFFFF' : '#A78BFA',
                cursor: 'pointer',
                width: '2rem',
                height: '2rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isListening
                  ? '0 0 15px rgba(239, 68, 68, 0.7)'
                  : 'none',
              }}
              title={
                isListening
                  ? 'Click to stop listening'
                  : selectedLanguage === 'te-IN'
                  ? 'వాయిస్ సెర్చ్ (Search by voice)'
                  : 'Search by voice'
              }
              aria-label="Search by voice"
            >
              {isListening ? (
                <Radio style={{ width: '1rem', height: '1rem', animation: 'pulse 1s infinite' }} />
              ) : isProcessing ? (
                <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
              ) : hasSpeechSupport ? (
                <Mic style={{ width: '1rem', height: '1rem' }} />
              ) : (
                <MicOff style={{ width: '1rem', height: '1rem', color: '#64748B' }} />
              )}
            </button>

            {/* Custom Tooltip */}
            {isHoveredMic && !isListening && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '125%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#05070C',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#E2E8F0',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '0.35rem',
                  fontSize: '0.68rem',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 50,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}
              >
                Search by voice ({selectedLanguage === 'en-US' ? 'English' : 'తెలుగు'})
              </div>
            )}
          </div>

          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={() => onSearch && onSearch(value)}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
            title="Execute search"
          >
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME LISTENING / STATUS BANNER */}
      {(statusMessage || interimTranscript) && (
        <div
          style={{
            position: 'absolute',
            top: '105%',
            left: 0,
            right: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '0.65rem',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            zIndex: 35,
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
            {isListening ? (
              <div
                style={{
                  width: '0.65rem',
                  height: '0.65rem',
                  borderRadius: '50%',
                  background: '#EF4444',
                  boxShadow: '0 0 10px #EF4444',
                  animation: 'pulse 1s infinite',
                  flexShrink: 0,
                }}
              />
            ) : isProcessing ? (
              <Loader2 style={{ width: '0.85rem', height: '0.85rem', color: '#A78BFA', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            ) : (
              <CheckCircle2 style={{ width: '0.85rem', height: '0.85rem', color: '#10B981', flexShrink: 0 }} />
            )}

            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', color: '#FFFFFF', fontWeight: 600 }}>
                {interimTranscript ? (
                  <span>
                    "{interimTranscript}" <span style={{ opacity: 0.6 }}>...</span>
                  </span>
                ) : (
                  statusMessage
                )}
              </div>
              {isListening && (
                <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                  {selectedLanguage === 'te-IN' ? 'స్పష్టంగా మాట్లాడండి' : 'Speak naturally into your microphone'}
                </div>
              )}
            </div>
          </div>

          {isListening && (
            <button
              type="button"
              onClick={toggleListening}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#F87171',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.3rem',
                fontSize: '0.68rem',
                cursor: 'pointer',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              Stop
            </button>
          )}
        </div>
      )}

      {/* 3. ERROR MESSAGE BANNER */}
      {errorMessage && (
        <div
          style={{
            position: 'absolute',
            top: '105%',
            left: 0,
            right: 0,
            background: 'rgba(20, 10, 15, 0.96)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '0.65rem',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            zIndex: 35,
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle style={{ width: '0.9rem', height: '0.9rem', color: '#F87171', flexShrink: 0 }} />
            <span style={{ fontSize: '0.74rem', color: '#FECACA' }}>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#F87171',
              cursor: 'pointer',
              padding: '0.2rem',
            }}
          >
            <X style={{ width: '0.75rem', height: '0.75rem' }} />
          </button>
        </div>
      )}

      {/* 4. SPOKEN QUERY PROMPT PILLS */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <Sparkles style={{ width: '0.65rem', height: '0.65rem', color: '#8B5CF6' }} /> Try speaking:
        </span>
        {quickSamples.slice(0, 3).map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              onChange(item.query);
              processIntent(item.query);
              if (onSearch) onSearch(item.query);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '9999px',
              padding: '0.15rem 0.5rem',
              color: '#94A3B8',
              fontSize: '0.65rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#A78BFA';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
            }}
          >
            "{item.label}"
          </button>
        ))}
      </div>
    </div>
  );
};
