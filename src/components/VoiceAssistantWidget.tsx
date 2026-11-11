import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Search,
  Compass,
  ShieldAlert,
  Send,
  HelpCircle
} from 'lucide-react';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakText,
  stopSpeech,
  parseVoiceCommand,
  VoiceCommandResult
} from '../utils/voiceAssistant';
import { useAccessibility } from '../context/AccessibilityContext';

interface VoiceAssistantWidgetProps {
  onNavigate: (view: 'home' | 'movies' | 'watchlist' | 'bookings' | 'canteen') => void;
  onSearch: (query: string) => void;
  onOpenAccessibility: () => void;
  currentMovie?: { title: string; synopsis: string; certificate?: string; rating?: number };
}

export const VoiceAssistantWidget: React.FC<VoiceAssistantWidgetProps> = ({
  onNavigate,
  onSearch,
  onOpenAccessibility,
  currentMovie
}) => {
  const { settings, updateSetting, announce } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Tap the microphone and speak a command');
  const [lastResponse, setLastResponse] = useState('');
  const [textCommandInput, setTextCommandInput] = useState('');
  const recognitionRef = useRef<any>(null);

  const hasRecognition = isSpeechRecognitionSupported();

  // Initialize SpeechRecognition if supported
  useEffect(() => {
    if (!hasRecognition) return;

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage('Listening... speak now');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);

        if (event.results[current].isFinal) {
          executeCommand(resultTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setStatusMessage('Microphone access blocked. Use the text command box below.');
        } else {
          setStatusMessage('Voice recognition paused. Try speaking again or type below.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Failed to initialize speech recognition:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      stopSpeech();
    };
  }, [hasRecognition]);

  // Execute and route command
  const executeCommand = (commandText: string) => {
    const result: VoiceCommandResult = parseVoiceCommand(commandText);
    setLastResponse(result.speechResponse);
    announce(result.speechResponse);

    // Speak response
    speakText(result.speechResponse);

    // Execute corresponding app action
    if (result.action === 'navigate' && result.view) {
      onNavigate(result.view);
    } else if (result.action === 'search' && result.query) {
      onSearch(result.query);
      onNavigate('movies');
    } else if (result.action === 'open_accessibility') {
      onOpenAccessibility();
    } else if (result.action === 'read_details' || result.action === 'read_synopsis') {
      if (currentMovie) {
        const textToRead = `${currentMovie.title}. Certified ${currentMovie.certificate || 'U'}. Audience rating ${currentMovie.rating || 9} out of 10. Synopsis: ${currentMovie.synopsis}`;
        speakText(textToRead);
      } else {
        speakText('You are currently viewing the cinema catalogue. Say "Search" followed by a movie name to find a film.');
      }
    } else if (result.action === 'blocked_payment') {
      setStatusMessage('Security Notice: Payments require manual confirmation.');
    }
  };

  const handleToggleListening = () => {
    if (!hasRecognition) {
      setStatusMessage('Speech recognition not supported in this browser. Please use the text command bar.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setStatusMessage('Listening paused.');
    } else {
      setTranscript('');
      setLastResponse('');
      stopSpeech();
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    }
  };

  const handleTextCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textCommandInput.trim()) return;
    const cmd = textCommandInput.trim();
    setTranscript(cmd);
    setTextCommandInput('');
    executeCommand(cmd);
  };

  if (!settings.voiceAssistanceEnabled) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm w-[calc(100vw-3rem)]">
      {/* Collapsed Voice FAB Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold shadow-xl shadow-amber-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
          aria-label="Open Voice Navigation Assistant"
          title="Open Voice Navigation Assistant"
        >
          <Mic className="w-5 h-5 text-zinc-950 animate-pulse" />
          <span className="text-xs">Voice Assistant</span>
        </button>
      )}

      {/* Expanded Voice Assistant Card */}
      {isOpen && (
        <div className="bg-zinc-950 border border-amber-500/50 rounded-2xl shadow-2xl p-4 overflow-hidden text-zinc-100 flex flex-col gap-3">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-white">Voice Navigation & Search</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={stopSpeech}
                className="p-1 text-zinc-400 hover:text-white rounded transition-colors"
                title="Stop Speech Output"
                aria-label="Stop speech output"
              >
                <VolumeX className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  stopSpeech();
                  setIsOpen(false);
                }}
                className="p-1 text-zinc-400 hover:text-white rounded transition-colors"
                aria-label="Close voice assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice Action & Transcript Area */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleListening}
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white ring-4 ring-rose-500/40 animate-pulse'
                  : 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start microphone listening'}
            >
              {isListening ? <Mic className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-amber-400 truncate">
                {isListening ? 'Listening...' : statusMessage}
              </p>
              <p className="text-xs text-zinc-300 line-clamp-2 mt-0.5 font-medium">
                {transcript ? `"${transcript}"` : 'Try: "Show movies", "Search Amaran", or "My Bookings"'}
              </p>
            </div>
          </div>

          {/* Last Spoken Feedback or Security Warning */}
          {lastResponse && (
            <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
              <div className="flex items-start gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{lastResponse}</span>
              </div>
            </div>
          )}

          {/* Text-Based Fallback Alternative */}
          <form onSubmit={handleTextCommandSubmit} className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              value={textCommandInput}
              onChange={(e) => setTextCommandInput(e.target.value)}
              placeholder="Type a command or question (e.g. show movies)..."
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              aria-label="Type a voice command alternative"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors cursor-pointer"
              aria-label="Send text command"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Voice Command Short-cuts for Motor/Cognitive Ease */}
          <div className="flex flex-wrap gap-1 text-[10px]">
            {[
              { label: '🎬 Movies', cmd: 'Show movies' },
              { label: '🎟️ Bookings', cmd: 'My bookings' },
              { label: '🍿 Canteen', cmd: 'Canteen' },
              { label: '❤️ Watchlist', cmd: 'My watchlist' },
              { label: '⚙️ Settings', cmd: 'Accessibility settings' }
            ].map((shortcut) => (
              <button
                key={shortcut.cmd}
                type="button"
                onClick={() => {
                  setTranscript(shortcut.cmd);
                  executeCommand(shortcut.cmd);
                }}
                className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                {shortcut.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
