import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AccessibilitySettings, TextSize, SpacingMode, ColorBlindMode } from '../types';

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  accessibilityModeEnabled: false,
  textSize: 'normal',
  highContrast: false,
  colorBlindMode: 'none',
  reducedMotion: false,
  readableFont: false,
  spacingMode: 'standard',
  voiceAssistanceEnabled: false,
  screenReaderOptimized: false
};

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  toggleAccessibilityMode: (enabled?: boolean) => void;
  toggleFullAccessibilityMode: (enabled?: boolean) => void;
  resetToDefaults: () => void;
  isAccessibilityModalOpen: boolean;
  openAccessibilityModal: () => void;
  closeAccessibilityModal: () => void;
  announce: (message: string) => void;
  currentAnnouncement: string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'cinebook_accessibility_settings';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_ACCESSIBILITY_SETTINGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse accessibility settings from localStorage', e);
    }
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  });

  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState('');

  // Apply DOM classes whenever settings change
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.classList.toggle('a11y-mode-active', settings.accessibilityModeEnabled);
    root.classList.toggle('a11y-high-contrast', settings.highContrast);
    root.classList.toggle('a11y-text-large', settings.textSize === 'large');
    root.classList.toggle('a11y-text-xl', settings.textSize === 'extra-large');
    root.classList.toggle('a11y-reduced-motion', settings.reducedMotion);
    root.classList.toggle('a11y-readable-font', settings.readableFont);
    root.classList.toggle('a11y-spacing-spacious', settings.spacingMode === 'spacious');

    // Color-blind filter classes
    root.classList.toggle('a11y-cb-protanopia', settings.colorBlindMode === 'protanopia-deuteranopia');
    root.classList.toggle('a11y-cb-tritanopia', settings.colorBlindMode === 'tritanopia');
    root.classList.toggle('a11y-cb-distinction', settings.colorBlindMode === 'high-distinction');

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to persist accessibility settings', e);
    }
  }, [settings]);

  const announce = useCallback((message: string) => {
    setCurrentAnnouncement(message);
    // Auto-clear announcement after 4 seconds
    setTimeout(() => {
      setCurrentAnnouncement((prev) => (prev === message ? '' : prev));
    }, 4000);
  }, []);

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        // If user manually turns on high contrast, larger text, etc., keep accessibilityModeEnabled synced
        return next;
      });
    },
    []
  );

  const toggleAccessibilityMode = useCallback((forcedState?: boolean) => {
    setSettings((prev) => {
      const targetState = typeof forcedState === 'boolean' ? forcedState : !prev.accessibilityModeEnabled;
      if (targetState) {
        // Sensible bundle of accessibility improvements
        return {
          ...prev,
          accessibilityModeEnabled: true,
          textSize: prev.textSize === 'normal' ? 'large' : prev.textSize,
          highContrast: true,
          reducedMotion: true,
          readableFont: true,
          spacingMode: 'spacious',
          screenReaderOptimized: true
        };
      } else {
        // Disable master mode, revert to standard baseline unless user customized individual items
        return {
          ...prev,
          accessibilityModeEnabled: false,
          textSize: 'normal',
          highContrast: false,
          reducedMotion: false,
          readableFont: false,
          spacingMode: 'standard',
          screenReaderOptimized: false
        };
      }
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    announce('Accessibility settings reset to default.');
  }, [announce]);

  const openAccessibilityModal = useCallback(() => {
    setIsAccessibilityModalOpen(true);
  }, []);

  const closeAccessibilityModal = useCallback(() => {
    setIsAccessibilityModalOpen(false);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        toggleAccessibilityMode,
        toggleFullAccessibilityMode: toggleAccessibilityMode,
        resetToDefaults,
        isAccessibilityModalOpen,
        openAccessibilityModal,
        closeAccessibilityModal,
        announce,
        currentAnnouncement
      }}
    >
      {/* Hidden ARIA Live region for screen readers */}
      <div
        id="a11y-live-region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {currentAnnouncement}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
