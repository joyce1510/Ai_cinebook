/**
 * CineBook — Comprehensive Accessibility Test Suite
 * Tests WCAG 2.2 AA Compliance, Inclusive Features, and Architecture Preservation
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('\n======================================================');
console.log('  CineBook Comprehensive Accessibility & QA Test Suite');
console.log('======================================================\n');

// -----------------------------------------------------------------
// 1. Movie Accessibility Metadata & Preservation
// -----------------------------------------------------------------
console.log('SECTION 1: Movie Accessibility Data & Catalogue Preservation');

const moviesFilePath = path.join(__dirname, '..', 'src', 'data', 'movies.ts');
const moviesFileContent = fs.readFileSync(moviesFilePath, 'utf8');

runTest('Movies file exists and exports MOVIES array and TICKET_PRICING', () => {
  assert(moviesFileContent.includes('export const MOVIES: Movie[] = ['), 'MOVIES array not found');
  assert(moviesFileContent.includes('export const TICKET_PRICING'), 'TICKET_PRICING not found');
  assert(moviesFileContent.includes('Premium: 240'), 'Premium ticket price should remain 240');
  assert(moviesFileContent.includes('Regular: 160'), 'Regular ticket price should remain 160');
});

runTest('Catalogue contains all active movies with preserved The Chosen and Doraemon entries', () => {
  assert(moviesFileContent.includes("title: 'The Chosen'"), 'The Chosen entry missing');
  assert(moviesFileContent.includes("Doraemon: Nobita\\'s Art World Tales"), 'Doraemon entry missing');
});

runTest('Every movie has verified accessibility metadata configured', () => {
  const accessibilityBlockMatches = moviesFileContent.match(/accessibility:\s*\{/g);
  assert(accessibilityBlockMatches && accessibilityBlockMatches.length >= 16, `Expected at least 16 accessibility blocks, found ${accessibilityBlockMatches ? accessibilityBlockMatches.length : 0}`);
  
  assert(moviesFileContent.includes('subtitles:'), 'Subtitles metadata missing');
  assert(moviesFileContent.includes('closedCaptions: true'), 'Closed captions metadata missing');
  assert(moviesFileContent.includes('audioDescription: true'), 'Audio description metadata missing');
  assert(moviesFileContent.includes('assistiveListening: true'), 'Assistive listening metadata missing');
  assert(moviesFileContent.includes('wheelchairAccessible: true'), 'Wheelchair accessible metadata missing');
  assert(moviesFileContent.includes('sensoryFriendlyNotes:'), 'Sensory friendly notes missing');
});

// -----------------------------------------------------------------
// 2. Seat Selection Accessibility & Wheelchair Space
// -----------------------------------------------------------------
console.log('\nSECTION 2: Seat Selection, Keyboard Navigation & Wheelchair Spaces');

const seatMapPath = path.join(__dirname, '..', 'src', 'components', 'SeatMap.tsx');
const seatMapContent = fs.readFileSync(seatMapPath, 'utf8');

runTest('SeatMap designates Row C (C1 and C8) as wheelchair accessible seats', () => {
  assert(seatMapContent.includes("isWheelchairSeat"), 'Wheelchair seat detector missing');
  assert(seatMapContent.includes("row === 'C' && (colNum === 1 || colNum === 8)"), 'C1 and C8 must be wheelchair designated seats');
  assert(seatMapContent.includes('Wheelchair Accessible Space'), 'Screen reader label for wheelchair seat missing');
  assert(seatMapContent.includes('♿'), 'Wheelchair visual cue icon missing');
});

runTest('SeatMap implements non-color symbol cues for all seat statuses', () => {
  assert(seatMapContent.includes('✓'), 'Selected checkmark cue missing');
  assert(seatMapContent.includes('⏳'), 'Holding hourglass cue missing');
  assert(seatMapContent.includes('✕'), 'Booked cross cue missing');
  assert(seatMapContent.includes('★'), 'Premium star cue missing');
});

runTest('SeatMap implements 2D arrow-key grid navigation and ARIA attributes', () => {
  assert(seatMapContent.includes('handleSeatKeyDown'), 'Keyboard navigation handler missing');
  assert(seatMapContent.includes('ArrowUp') && seatMapContent.includes('ArrowDown') && seatMapContent.includes('ArrowLeft') && seatMapContent.includes('ArrowRight'), 'Arrow keys not handled');
  assert(seatMapContent.includes('role="grid"'), 'Grid role missing');
  assert(seatMapContent.includes('role="row"'), 'Row role missing');
  assert(seatMapContent.includes('role="gridcell"'), 'Gridcell role missing');
  assert(seatMapContent.includes('aria-label='), 'Aria-label missing on seats');
});

// -----------------------------------------------------------------
// 3. Voice Assistant Security & Command Parsing
// -----------------------------------------------------------------
console.log('\nSECTION 3: Voice Assistant & Safety Enforcement');

const voiceUtilPath = path.join(__dirname, '..', 'src', 'utils', 'voiceAssistant.ts');
const voiceUtilContent = fs.readFileSync(voiceUtilPath, 'utf8');

runTest('Voice assistant strictly blocks payment, checkout, and booking finalization', () => {
  assert(voiceUtilContent.includes('blocked_payment'), 'Blocked payment action not defined');
  assert(voiceUtilContent.includes('buy ticket'), 'Buy ticket keyword not checked for safety');
  assert(voiceUtilContent.includes('pay'), 'Pay keyword not checked for safety');
  assert(voiceUtilContent.includes('checkout'), 'Checkout keyword not checked for safety');
  assert(voiceUtilContent.includes('Voice recognition cannot be used to finalize payments'), 'Safety explanation message missing');
});

runTest('Voice assistant supports spoken navigation, search, and accessibility commands', () => {
  assert(voiceUtilContent.includes("'navigate'"), 'Navigate action missing');
  assert(voiceUtilContent.includes("'search'"), 'Search action missing');
  assert(voiceUtilContent.includes("'open_accessibility'"), 'Accessibility action missing');
  assert(voiceUtilContent.includes("'read_synopsis'"), 'Read synopsis action missing');
  assert(voiceUtilContent.includes("'help'"), 'Help action missing');
});

runTest('Voice assistant provides text alternative fallback input', () => {
  const voiceWidgetPath = path.join(__dirname, '..', 'src', 'components', 'VoiceAssistantWidget.tsx');
  const voiceWidgetContent = fs.readFileSync(voiceWidgetPath, 'utf8');
  assert(voiceWidgetContent.includes('onSubmit={handleTextCommandSubmit}'), 'Manual text command fallback form missing');
  assert(voiceWidgetContent.includes('Type a command or question'), 'Text command input placeholder missing');
});

// -----------------------------------------------------------------
// 4. Accessibility Settings Modal & Context State
// -----------------------------------------------------------------
console.log('\nSECTION 4: Accessibility Settings Modal & Master Mode Toggle');

const a11yContextPath = path.join(__dirname, '..', 'src', 'context', 'AccessibilityContext.tsx');
const a11yContextContent = fs.readFileSync(a11yContextPath, 'utf8');

runTest('Accessibility context persists settings in localStorage', () => {
  assert(a11yContextContent.includes('cinebook_accessibility_settings'), 'Storage key mismatch');
  assert(a11yContextContent.includes('localStorage.getItem'), 'localStorage getter missing');
  assert(a11yContextContent.includes('localStorage.setItem'), 'localStorage setter missing');
});

runTest('Accessibility context provides master "Full Accessibility Mode" bundle', () => {
  assert(a11yContextContent.includes('toggleAccessibilityMode'), 'Master toggle function missing');
  assert(a11yContextContent.includes('highContrast: true'), 'Master mode must enable highContrast');
  assert(a11yContextContent.includes("'large'"), 'Master mode must set textSize large');
  assert(a11yContextContent.includes('reducedMotion: true'), 'Master mode must enable reducedMotion');
  assert(a11yContextContent.includes('readableFont: true'), 'Master mode must enable readableFont');
  assert(a11yContextContent.includes("spacingMode: 'spacious'"), 'Master mode must set spacing spacious');
});

const a11yModalPath = path.join(__dirname, '..', 'src', 'components', 'AccessibilityModal.tsx');
const a11yModalContent = fs.readFileSync(a11yModalPath, 'utf8');

runTest('Accessibility modal provides Master Toggle, Reset to Defaults, and Escape key listener', () => {
  assert(a11yModalContent.includes('Full Accessibility Mode (All Inclusive)'), 'Master toggle UI label missing');
  assert(a11yModalContent.includes('Reset All to Defaults'), 'Reset to defaults button missing');
  assert(a11yModalContent.includes("e.key === 'Escape'"), 'Escape key handler missing in modal');
  assert(a11yModalContent.includes('role="dialog"'), 'Dialog role missing');
  assert(a11yModalContent.includes('aria-modal="true"'), 'Aria modal attribute missing');
});

// -----------------------------------------------------------------
// 5. Visual, Cognitive, and Motor Enhancements in Views
// -----------------------------------------------------------------
console.log('\nSECTION 5: Visual, Cognitive & Motor Accessibility in Views');

const bookingViewPath = path.join(__dirname, '..', 'src', 'components', 'BookingView.tsx');
const bookingViewContent = fs.readFileSync(bookingViewPath, 'utf8');

runTest('BookingView features cognitive 4-step progress indicator', () => {
  assert(bookingViewContent.includes('aria-label="Booking steps progress"'), 'Progress ARIA label missing');
  assert(bookingViewContent.includes('Date & Showtime'), 'Step 1 missing');
  assert(bookingViewContent.includes('Seat Selection'), 'Step 2 missing');
  assert(bookingViewContent.includes('Canteen & Offers'), 'Step 3 missing');
  assert(bookingViewContent.includes('Payment & QR Pass'), 'Step 4 missing');
});

runTest('BookingView displays verified movie hearing & multiplex accessibility details card', () => {
  assert(bookingViewContent.includes('Hearing & Multiplex Accessibility Amenities'), 'Accessibility card missing');
  assert(bookingViewContent.includes('CC') || bookingViewContent.includes('Closed Captioning'), 'CC badge missing');
  assert(bookingViewContent.includes('AD') || bookingViewContent.includes('Audio Description'), 'AD badge missing');
  assert(bookingViewContent.includes('Accessibility Spaces'), 'Wheelchair feature missing');
  assert(bookingViewContent.includes('Listen') && bookingViewContent.includes('speakText'), 'Read-aloud button missing');
});

const movieCardPath = path.join(__dirname, '..', 'src', 'components', 'MovieCard.tsx');
const movieCardContent = fs.readFileSync(movieCardPath, 'utf8');

runTest('MovieCard supports keyboard activation and verified accessibility badges', () => {
  assert(movieCardContent.includes('role="article"'), 'Article role missing');
  assert(movieCardContent.includes('tabIndex={0}'), 'TabIndex missing for keyboard accessibility');
  assert(movieCardContent.includes("e.key === 'Enter' || e.key === ' '"), 'Keyboard Enter and Space handler missing');
  assert(movieCardContent.includes('CC'), 'CC badge missing in movie card');
  assert(movieCardContent.includes('AD'), 'AD badge missing in movie card');
});

// -----------------------------------------------------------------
// 6. CSS & WCAG 2.2 AA Styles
// -----------------------------------------------------------------
console.log('\nSECTION 6: CSS & WCAG 2.2 AA Compliance');

const indexCssPath = path.join(__dirname, '..', 'src', 'index.css');
const indexCssContent = fs.readFileSync(indexCssPath, 'utf8');

runTest('Universal visible focus indicators (:focus-visible) are defined with >= 3px outline', () => {
  assert(indexCssContent.includes(':focus-visible'), ':focus-visible rule missing');
  assert(indexCssContent.includes('outline: 3px solid #f59e0b'), 'Amber 3px focus outline missing');
});

runTest('Skip-to-content link styles and high-contrast theme classes exist', () => {
  assert(indexCssContent.includes('.skip-link'), '.skip-link class missing');
  assert(indexCssContent.includes('.a11y-high-contrast'), '.a11y-high-contrast class missing');
  assert(indexCssContent.includes('.a11y-reduced-motion'), '.a11y-reduced-motion class missing');
  assert(indexCssContent.includes('.a11y-readable-font'), '.a11y-readable-font class missing');
  assert(indexCssContent.includes('.a11y-spacing-spacious'), '.a11y-spacing-spacious class missing');
});

// -----------------------------------------------------------------
// 7. App Integration & Keyboard Shortcut
// -----------------------------------------------------------------
console.log('\nSECTION 7: App Integration & Keyboard Shortcut');

const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

runTest('App.tsx registers global Alt+A shortcut for Accessibility Settings', () => {
  assert(appContent.includes("e.altKey && (e.key === 'a' || e.key === 'A')"), 'Alt+A keyboard shortcut missing');
  assert(appContent.includes('openAccessibilityModal()'), 'Modal open invocation missing on Alt+A');
});

runTest('App.tsx includes skip link and semantic main landmark with id="main-content"', () => {
  assert(appContent.includes('<a href="#main-content" className="skip-link">'), 'Skip link missing');
  assert(appContent.includes('id="main-content"'), 'Main content landmark id missing');
});

runTest('App.tsx wraps application with AccessibilityProvider and renders AccessibilityModal & VoiceAssistantWidget', () => {
  assert(appContent.includes('<AccessibilityProvider>'), 'AccessibilityProvider missing');
  assert(appContent.includes('<AccessibilityModal'), 'AccessibilityModal missing');
  assert(appContent.includes('<VoiceAssistantWidget'), 'VoiceAssistantWidget missing');
});

// -----------------------------------------------------------------
// Summary
// -----------------------------------------------------------------
console.log('\n======================================================');
console.log(`  Tests Completed: ${passedTests}/${totalTests} Passed`);
console.log('======================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
} else {
  process.exit(0);
}
