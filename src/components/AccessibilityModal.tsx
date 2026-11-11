import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Sliders,
  Eye,
  Type,
  Maximize2,
  Sparkles,
  RotateCcw,
  X,
  Volume2,
  Palette,
  Check,
  Zap,
  Ear,
  Accessibility
} from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    updateSetting,
    toggleAccessibilityMode,
    resetToDefaults,
    announce
  } = useAccessibility();

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation & Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Focus the modal or close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
      aria-describedby="a11y-modal-description"
      ref={modalRef}
    >
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Accessibility className="w-5 h-5" />
            </div>
            <div>
              <h2 id="a11y-modal-title" className="text-xl font-bold text-white tracking-tight">
                Accessibility Settings
              </h2>
              <p id="a11y-modal-description" className="text-xs text-zinc-400 mt-0.5">
                Customize your cinema experience for vision, hearing, motor, and cognitive comfort.
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close accessibility settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Master Accessibility Mode Toggle */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm text-white">Full Accessibility Mode (All Inclusive)</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Recommended Bundle
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1 max-w-md">
                One-click setup enabling High Contrast, Large Readable Text, Reduced Motion, and Spacious touch controls simultaneously.
              </p>
            </div>
            <button
              onClick={() => {
                toggleAccessibilityMode();
                announce(
                  settings.accessibilityModeEnabled
                    ? 'Accessibility Mode disabled.'
                    : 'Accessibility Mode enabled with high contrast, large text, and reduced motion.'
                );
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                settings.accessibilityModeEnabled
                  ? 'bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-lg shadow-amber-400/20'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
              }`}
              aria-pressed={settings.accessibilityModeEnabled}
            >
              {settings.accessibilityModeEnabled ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Mode Enabled</span>
                </>
              ) : (
                <span>Enable Mode</span>
              )}
            </button>
          </div>

          {/* Section: Visual Adjustments */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Visual & Contrast Settings</span>
            </h3>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <span className="text-sm font-semibold text-white">High Contrast Mode</span>
                <p className="text-xs text-zinc-400">Deep blacks, ultra-bright text, and reinforced element borders for maximum visibility.</p>
              </div>
              <button
                onClick={() => {
                  updateSetting('highContrast', !settings.highContrast);
                  announce(`High contrast ${!settings.highContrast ? 'enabled' : 'disabled'}.`);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.highContrast ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
                role="switch"
                aria-checked={settings.highContrast}
                aria-label="Toggle high contrast mode"
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.highContrast ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Text Size Controls */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white">Display Text Size</span>
                  <p className="text-xs text-zinc-400">Increase font sizes across all movies, showtimes, and booking steps.</p>
                </div>
                <Type className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Normal (100%)' },
                  { id: 'large', label: 'Large (115%)' },
                  { id: 'extra-large', label: 'Extra Large (125%)' }
                ].map((size) => (
                  <button
                    key={size.id}
                    onClick={() => {
                      updateSetting('textSize', size.id as any);
                      announce(`Text size set to ${size.label}.`);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      settings.textSize === size.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                    }`}
                    aria-pressed={settings.textSize === size.id}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color-Blind Friendly Modes */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-white">Color-Blind Friendly Markers</span>
                  <p className="text-xs text-zinc-400">Replaces color-only indicators with high-distinction symbols and border patterns.</p>
                </div>
                <Palette className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'Standard Color Cues' },
                  { id: 'high-distinction', label: 'High Distinction Patterns' },
                  { id: 'protanopia-deuteranopia', label: 'Red-Green Safe (Protan/Deutan)' },
                  { id: 'tritanopia', label: 'Blue-Yellow Safe (Tritanopia)' }
                ].map((cb) => (
                  <button
                    key={cb.id}
                    onClick={() => {
                      updateSetting('colorBlindMode', cb.id as any);
                      announce(`Color-blind mode set to ${cb.label}.`);
                    }}
                    className={`p-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                      settings.colorBlindMode === cb.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                    }`}
                    aria-pressed={settings.colorBlindMode === cb.id}
                  >
                    {cb.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Motor & Motion Adjustments */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              <span>Motor & Interaction Comfort</span>
            </h3>

            {/* Reduced Motion Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <span className="text-sm font-semibold text-white">Reduced Motion</span>
                <p className="text-xs text-zinc-400">Halts non-essential animations, banner slides, and pulsing graphics for vestibular comfort.</p>
              </div>
              <button
                onClick={() => {
                  updateSetting('reducedMotion', !settings.reducedMotion);
                  announce(`Reduced motion ${!settings.reducedMotion ? 'enabled' : 'disabled'}.`);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.reducedMotion ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
                role="switch"
                aria-checked={settings.reducedMotion}
                aria-label="Toggle reduced motion"
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.reducedMotion ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Spacious Touch / Click Target Spacing */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <span className="text-sm font-semibold text-white">Spacious Interface Spacing</span>
                <p className="text-xs text-zinc-400">Expands buttons, seat targets, and form fields to a minimum 48px target size for easy clicking.</p>
              </div>
              <button
                onClick={() => {
                  const next = settings.spacingMode === 'spacious' ? 'standard' : 'spacious';
                  updateSetting('spacingMode', next);
                  announce(`Interface spacing set to ${next}.`);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.spacingMode === 'spacious' ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
                role="switch"
                aria-checked={settings.spacingMode === 'spacious'}
                aria-label="Toggle spacious interface spacing"
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.spacingMode === 'spacious' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Clear Typography Font */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <span className="text-sm font-semibold text-white">Clear & Readable Typography</span>
                <p className="text-xs text-zinc-400">Applies hyper-legible font metrics with generous letter-spacing to improve readability for dyslexia.</p>
              </div>
              <button
                onClick={() => {
                  updateSetting('readableFont', !settings.readableFont);
                  announce(`Clear typography ${!settings.readableFont ? 'enabled' : 'disabled'}.`);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.readableFont ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
                role="switch"
                aria-checked={settings.readableFont}
                aria-label="Toggle clear typography"
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.readableFont ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section: Audio & Voice Assistance */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Voice & Auditory Assistance</span>
            </h3>

            {/* Voice Assistance Widget Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div>
                <span className="text-sm font-semibold text-white">Voice Navigation & Search</span>
                <p className="text-xs text-zinc-400">Enables hands-free spoken search, navigation commands, and page readouts. (Payments require manual click).</p>
              </div>
              <button
                onClick={() => {
                  updateSetting('voiceAssistanceEnabled', !settings.voiceAssistanceEnabled);
                  announce(`Voice assistance ${!settings.voiceAssistanceEnabled ? 'enabled' : 'disabled'}.`);
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.voiceAssistanceEnabled ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
                role="switch"
                aria-checked={settings.voiceAssistanceEnabled}
                aria-label="Toggle voice navigation assistance"
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.voiceAssistanceEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Hearing & Multiplex Accessibility Reminder */}
            <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-start gap-3">
              <Ear className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 leading-relaxed">
                <span className="font-bold text-white block mb-0.5">Hearing & Multiplex Amenities</span>
                Look for the <span className="font-semibold text-amber-300">CC</span> (Closed Captioning) and <span className="font-semibold text-amber-300">AD</span> (Audio Description) badges on movie cards. All partner multiplexes feature induction loops and complimentary headsets.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
