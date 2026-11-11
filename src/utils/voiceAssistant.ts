/**
 * Voice Assistance Utility for CineBook
 * Supports voice search, spoken navigation guidance, and speech synthesis.
 * Enforces strict financial security: payment and ticket confirmation can NEVER be executed by voice alone.
 */

export interface VoiceCommandResult {
  action:
    | 'navigate'
    | 'search'
    | 'open_accessibility'
    | 'read_details'
    | 'read_synopsis'
    | 'stop_speech'
    | 'blocked_payment'
    | 'help'
    | 'unknown';
  view?: 'home' | 'movies' | 'watchlist' | 'bookings' | 'canteen';
  query?: string;
  speechResponse: string;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window;
}

/**
 * Speaks text using the browser's speech synthesis engine.
 */
export function speakText(text: string, onEnd?: () => void): void {
  if (!isSpeechSynthesisSupported()) return;
  try {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
  }
}

/**
 * Cancels any active speech readout.
 */
export function stopSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

/**
 * Parses a spoken voice command into a structured action.
 */
export function parseVoiceCommand(rawTranscript: string): VoiceCommandResult {
  const text = rawTranscript.trim().toLowerCase();

  // 1. STRICT SECURITY GATE: Block voice execution of financial checkout / payment
  if (
    text.includes('confirm booking') ||
    text.includes('pay now') ||
    text.includes('make payment') ||
    text.includes('proceed to payment') ||
    text.includes('buy ticket') ||
    text.includes('finalize booking') ||
    text.includes('checkout') ||
    text.includes('pay')
  ) {
    return {
      action: 'blocked_payment',
      speechResponse:
        'Voice recognition cannot be used to finalize payments. For your protection and security, payments and booking confirmations require direct manual verification on screen. Please click the Pay button to proceed.'
    };
  }

  // 2. Stop Speech Command
  if (text.includes('stop speaking') || text.includes('stop speech') || text.includes('quiet') || text.includes('shut up')) {
    stopSpeech();
    return {
      action: 'stop_speech',
      speechResponse: 'Speech stopped.'
    };
  }

  // 3. Search Commands: "search amaran", "find tamil movies", "search for spiderman"
  const searchMatch = text.match(/(?:search for|search|find|show me|look for)\s+(.+)/i);
  if (searchMatch && searchMatch[1]) {
    const query = searchMatch[1].trim();
    return {
      action: 'search',
      query,
      speechResponse: `Searching movies for "${query}".`
    };
  }

  // 4. Navigation Commands
  if (text.includes('go to movies') || text.includes('show movies') || text.includes('browse movies') || text.includes('all movies')) {
    return {
      action: 'navigate',
      view: 'movies',
      speechResponse: 'Navigating to movie catalogue.'
    };
  }

  if (text.includes('go home') || text.includes('homepage') || text.includes('home view') || text === 'home') {
    return {
      action: 'navigate',
      view: 'home',
      speechResponse: 'Navigating to home page.'
    };
  }

  if (text.includes('my bookings') || text.includes('my tickets') || text.includes('booked tickets') || text.includes('booking history')) {
    return {
      action: 'navigate',
      view: 'bookings',
      speechResponse: 'Opening your bookings dashboard.'
    };
  }

  if (text.includes('my watchlist') || text.includes('open watchlist') || text.includes('saved movies') || text.includes('watchlist')) {
    return {
      action: 'navigate',
      view: 'watchlist',
      speechResponse: 'Opening your saved watchlist.'
    };
  }

  if (text.includes('canteen') || text.includes('snacks') || text.includes('popcorn') || text.includes('order food') || text.includes('food menu')) {
    return {
      action: 'navigate',
      view: 'canteen',
      speechResponse: 'Opening express canteen snacks and combos.'
    };
  }

  if (text.includes('accessibility') || text.includes('settings') || text.includes('high contrast') || text.includes('accessibility settings')) {
    return {
      action: 'open_accessibility',
      speechResponse: 'Opening accessibility settings dialog.'
    };
  }

  if (text.includes('read synopsis') || text.includes('speak synopsis') || text.includes('read details') || text.includes('tell me about')) {
    return {
      action: 'read_synopsis',
      speechResponse: 'Reading movie synopsis and accessibility information.'
    };
  }

  if (text.includes('help') || text.includes('what can you do') || text.includes('commands')) {
    return {
      action: 'help',
      speechResponse: 'You can say: "browse movies", "search Interstellar", "open watchlist", "my bookings", "canteen", or "accessibility". Voice recognition cannot be used to finalize payments.'
    };
  }

  // Unknown Command
  return {
    action: 'unknown',
    speechResponse:
      'Voice command not recognized. Try saying "Show movies", "Search Amaran", "My Bookings", "Canteen", or "Accessibility settings".'
  };
}
