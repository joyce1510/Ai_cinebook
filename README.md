# CineBook – Your Ultimate Cinema Experience

[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini_API-2.5_Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

> A modern, full-stack, AI-powered cinema ticket booking platform built with React 19, TypeScript, Express, and Google Gemini API. CineBook delivers real-time seat reservation, server-authoritative 5-minute seat holds, cryptographic QR ticket verification, express canteen ordering, an interactive CineBot assistant, and an inclusive accessibility architecture.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Accessibility Features](#-accessibility-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Application Views & Screenshots](#-application-views--screenshots)
- [Project Structure](#-project-structure)
- [Installation and Setup](#-installation-and-setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Available Scripts](#-available-scripts)
- [Security & Data Protection](#-security--data-protection)
- [Automated Testing Suite](#-automated-testing-suite)
- [Maintenance & Operations](#-maintenance--operations)
- [Developer Information](#-developer-information)

---

## 📽️ Project Overview

CineBook bridges the gap between traditional cinema ticketing platforms and modern intelligent web applications. Designed as an end-to-end theatrical booking engine, CineBook combines frictionless user experience with robust server-side concurrency guarantees and multimodal accessibility.

### Core Objectives
1. **Intelligent Discovery**: Assist moviegoers with AI-grounded cinema recommendations, mood-based movie matching, and real-time natural language query answering.
2. **Reliable Seat Reservation**: Eliminate race conditions and double-booking using server-authoritative 5-minute (300-second) cryptographic reservation holds with automatic expiration.
3. **Turnstile-Ready Digital Tickets**: Issue tamper-proof digital ticket passes embedded with genuine HMAC-SHA256 scannable QR codes that validate in real time against the backend database.
4. **Inclusive Theatrical Experience**: Provide people with visual, hearing, motor, and cognitive disabilities an independent, dignified booking journey through tailored contrast, speech synthesis, keyboard grid navigation, and verified theatre amenities.

---

## ✨ Key Features

| Category | Feature | Description |
| :--- | :--- | :--- |
| **Movie Discovery** | **Multi-Facet Filtering** | Filter 16 active cinema releases across Tamil, Telugu, and English by genre, language, release era, and certification (U, U/A, A). |
| **Movie Discovery** | **Mood-Based Recommender** | 7 cinema moods (Adrenaline Rush, Feel-Good Laughs, Heartfelt Romance, Mind-Bending Sci-Fi, Family Magic, Chills & Thrills, Epic Blockbusters). |
| **Movie Discovery** | **Personalized Recommendations** | Dynamic affinity scoring based on watchlist history, past bookings, and critics' choice ratings. |
| **AI Cinema Assistant** | **CineBot AI Guide** | Real-time assistant powered by Google Gemini API (`gemini-2.5-flash`) with structured offline fallback knowledge. |
| **AI Cinema Assistant** | **Interactive Guided Tour** | 11-step interactive spotlight tour guiding first-time visitors through key website capabilities. |
| **Seating & Booking** | **Two-Tier Pricing** | Clear pricing structure: Premium Recliners (Rows A & B) at **₹240** and Regular Executive (Rows C to H) at **₹160**. |
| **Seating & Booking** | **Smart Seat Finder** | One-click algorithmic seat selector that finds optimal contiguous centre-aisle seats for solo, couple, or family groups. |
| **Seating & Booking** | **5-Minute Server Hold** | Server-enforced 300-second hold timer preventing concurrent double-booking while guests complete checkout. |
| **Digital Tickets & Pass** | **Genuine QR Gate Pass** | Scannable high-contrast QR code generated client-side from signed server URLs for physical/digital gate validation. |
| **Digital Tickets & Pass** | **Live Turnstile Validation** | Turnstile validation route (`#verify?id=...&token=...`) with HMAC-SHA256 signature verification. |
| **Digital Tickets & Pass** | **Tax Invoice Generation** | Printable and downloadable invoice with GST (18%), booking fees, and full ticket breakdown. |
| **Canteen & Combos** | **Express Food Ordering** | In-theatre snack ordering with categorized menu (Popcorn, Beverages, Hot Bites, Combos). |
| **Canteen & Combos** | **Smart Food Combos** | Discounted bundles (Cinema Duo, Blockbuster Pair, Family Snack Feast) with automatic savings calculation. |
| **Rewards & Reviews** | **Promo Coupons & Offers** | Promotional discount codes (`CINE20` for 20% off, `DINNERFREE`, `PARTNER50`) and milestone rewards. |
| **Rewards & Reviews** | **Watched & Rating System** | Post-movie review flow allowing 1-to-5 star ratings, feedback reviews, and watchlist synchronization. |
| **User Space** | **My Bookings Dashboard** | Unified dashboard organizing upcoming reservations, past show history, and canteen orders. |
| **User Space** | **My Watchlist** | Client-isolated watchlist stored locally without impacting server booking records. |

---

## ♿ Accessibility Features

CineBook implements an accessibility architecture designed in alignment with **WCAG 2.2 AA guidelines**.

> **Note**: Accessibility implementations have been verified through automated unit suites, keyboard navigation tests, and DOM inspection. Official compliance certification requires a formal third-party audit.

### 1. Dedicated Accessibility Modal & Master Bundle
- **Full Accessibility Mode (All Inclusive)**: One-click bundle activating high contrast, large text, reduced motion, dyslexia-friendly font, and spacious touch targets simultaneously.
- **Global Keyboard Shortcut**: Press `Alt + A` from any view to immediately launch the Accessibility Settings modal.
- **Persistent Preferences**: Settings are automatically saved to `localStorage` (`cinebook_accessibility_settings`) and restored across sessions.

### 2. Visual Accessibility
- **Visible Focus Rings**: Universally applied `:focus-visible` styles with a 3px amber/white outline ensuring keyboard focus is always discernible.
- **High Contrast Theme**: Pure black background (`#000000`), elevated border contrasts (`#52525b`), and high-luminance text for low-vision users.
- **Color-Blind Distinction Modes**: Tailored CSS filters and symbol cues for:
  - Protanopia & Deuteranopia (Red-Green distinction)
  - Tritanopia (Blue-Yellow distinction)
  - High Distinction Monochrome
- **Non-Color-Only Indicators**: Information is never conveyed via colour alone:
  - `✓` Selected Seat
  - `⏳` Held Seat (In Checkout)
  - `✕` Sold Out Seat
  - `★` Premium Recliner Seat
  - `♿` Wheelchair Accessible Space
- **Typography Sizing**: Scalable interfaces supporting Normal, Large (+15%), and Extra Large (+30%) typography without layout overflow.

### 3. Hearing & Multiplex Accessibility
- **Verified Theatrical Badges**: Clear visual badges on movie cards and booking views indicating:
  - `CC`: Closed Captions
  - `AD`: Audio Description
  - `Sub`: Open Subtitles (Tamil, Telugu, English)
  - `Assistive Listening`: FM / Infrared induction loops available at partner multiplexes
- **Sensory-Friendly Notes**: Information on ambient audio decibel levels, strobe effects, and flashing light sequences.

### 4. Motor Accessibility
- **Full Keyboard Navigation**: Complete logical Tab navigation across navigation bars, movie cards, canteen items, and modals.
- **2D Arrow-Key Seat Map**: Navigate cinema seats in two dimensions using `ArrowUp`, `ArrowDown`, `ArrowLeft`, and `ArrowRight`. Toggle selection with `Enter` or `Space`.
- **Skip to Main Content Link**: Accessible skip link (`#main-content`) at the top of the DOM for screen readers and keyboard users.
- **Spacious Click Targets**: Touch and pointer targets expand to $\ge 48\text{px} \times 48\text{px}$ in spacious spacing mode.
- **Wheelchair Dedicated Spaces**: Seats **C1** and **C8** in Row C are specifically designated level-aisle wheelchair spaces at regular tier pricing (₹160).
- **Escape Key Listeners**: All modal dialogs (Payment, CineBot, Ratings, Accessibility) close safely on `Escape`.

### 5. Cognitive Accessibility
- **4-Step Linear Booking Progress**: Visual progress indicator (1: Date & Showtime $\rightarrow$ 2: Seat Selection $\rightarrow$ 3: Canteen & Offers $\rightarrow$ 4: Payment & QR Pass).
- **Plain-Language Feedback**: Clear validation messages for coupon codes, seat limits, and hold timeouts.

### 6. Voice Navigation Assistant
- **Hands-Free Navigation**: Spoken commands for navigating views (`"Show movies"`, `"My bookings"`, `"Open watchlist"`, `"Canteen"`, `"Accessibility settings"`).
- **Voice Movie Search**: Search the catalogue by voice (`"Search Amaran"`, `"Find animated movies"`).
- **Speech Synthesis Readout**: Click "Listen" or say `"Read synopsis"` to hear film synopses, cast details, and accessibility specifications read aloud via the Web Speech API.
- **Text Command Alternative**: Built-in text command fallback input for environments where microphone access is unavailable.
- **Strict Financial Protection**: Voice commands can **never** trigger payments or confirm bookings. Any voice payment attempt triggers a security alert directing the user to confirm manually on screen.

---

## 🛠️ Technology Stack

### Frontend
- **React 19** (`v19.0.1`): Declarative component architecture using modern functional hooks.
- **TypeScript** (`v7.0.2`): Strict static typing and interface contracts across models and services.
- **Vite** (`v8.3.0`): Next-generation frontend build tool and dev server.
- **Tailwind CSS** (`v4.3.3`): Utility-first modern CSS engine with zero runtime overhead.
- **Lucide React** (`v0.546.0`): Clean, accessible SVG iconography.
- **Motion** (`v12.23.24`): Smooth animations with respect for user `prefers-reduced-motion` settings.
- **QRCode & jsQR**: Client-side QR generation and in-browser camera/image turnstile validation.

### Backend & Server
- **Node.js** (`v22.x`): Server-side JavaScript runtime.
- **Express.js** (`v4.21.2`): REST API layer mounted with Vite dev middlewares.
- **TSX** (`v4.21.0`): TypeScript execute engine running `server.ts` seamlessly in development and production.
- **Crypto Module**: Built-in Node.js crypto module generating SHA-256 tokens and HMAC signatures for secure ticket verification.

### Artificial Intelligence
- **Google Gemini API** (`@google/genai v3.1.0`): Server-side integration using model `gemini-2.5-flash` for intelligent natural-language cinema discovery, conversational queries, and showtime recommendations.
- **Offline Fallback Engine**: Rule-based cinema knowledge base providing instant answers even if the external AI service is unreachable.

---

## 🏗️ System Architecture

```
                      ┌─────────────────────────────────────────┐
                      │          Browser Client (SPA)           │
                      │  React 19 · Vite · Tailwind CSS · A11y  │
                      └────────────────────┬────────────────────┘
                                           │
                        HTTP / JSON APIs   │  Vite Middlewares
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │           Express.js Server             │
                      │               (server.ts)               │
                      └───────┬────────────┬────────────┬───────┘
                              │            │            │
            ┌─────────────────┘            │            └──────────────────┐
            ▼                              ▼                               ▼
┌───────────────────────┐      ┌───────────────────────┐      ┌─────────────────────────┐
│   Google Gemini API   │      │   Seat Hold Engine    │      │    Local Database       │
│  (gemini-2.5-flash)   │      │  (300s TTL Concurrency│      │  (data/cinebook-db.json)│
│  Server-Side Only     │      │   Double-Booking Lock)│      │  Confirmed Bookings &   │
└───────────────────────┘      └───────────────────────┘      │  Auditorium Seat Maps   │
                                                              └─────────────────────────┘
```

### Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning server uptime and environment status. |
| `GET` | `/api/ai/status` | Reports Gemini API readiness and server environment configuration. |
| `POST` | `/api/ai/chat` | Proxies user queries securely to Google Gemini API (`gemini-2.5-flash`). |
| `GET` | `/api/seats/status` | Returns currently booked and temporarily held seats for a specific showtime. |
| `POST` | `/api/bookings/reserve` | Acquires a server-authoritative 5-minute (300-second) hold on selected seats. |
| `POST` | `/api/bookings/release` | Safely releases held seats if the user cancels checkout. |
| `POST` | `/api/bookings/confirm` | Validates hold token, consumes reservation, and creates confirmed booking. |
| `GET` | `/api/bookings/verify/:id` | Validates authentic ticket QR code using cryptographic token verification. |
| `GET` | `/api/bookings` | Retrieves confirmed bookings (for administrative and dashboard review). |

---

## 📷 Application Views & Screenshots

CineBook consists of dedicated, responsive application views designed for both desktop and mobile viewports.

### Key Visual Interfaces

1. **Cinematic Welcome Page (`#welcome`)**
   - Hero spotlight featuring high-definition movie artwork, quick category filters, and direct entry into CineBot's interactive guided tour.

2. **Movie Discovery & Multi-Facet Filters (`#movies`)**
   - Real-time search by title, multi-tag filtering by genre, language, and era, alongside the "What's Your Mood?" cinema recommendation carousel.

3. **Showtimes & Auditorium Seating Map (`#movie/:id`)**
   - Theatrical date selector, multiplex showtimes, cinema curved screen visualization, 2D arrow-navigable seat matrix, and dedicated wheelchair accessible spaces.

4. **Secure Checkout & 5-Minute Reservation Hold**
   - Real-time countdown timer tracking the server seat hold, itemized ticket subtotal, GST (18%), promotional coupon input, partner card discounts, and simulated payment gateways.

5. **Ticket Confirmation & Scannable QR Gate Pass**
   - High-contrast digital ticket pass with embedded HMAC-SHA256 QR code, downloadable PDF tax invoice, and add-to-calendar actions.

6. **Live Turnstile Ticket Verification (`#verify?id=...&token=...`)**
   - Real-time turnstile verification display verifying ticket authenticity, seat allocations, and gate entry status.

7. **CineBot AI Assistant & Guided Tour**
   - Conversational popup providing natural-language cinema advice, showtime queries, and element-highlighting guided tours.

8. **Accessibility Settings Modal (`Alt + A`)**
   - Central control hub for High Contrast, Text Resizing, Color-Blind filters, Reduced Motion, Dyslexia-Friendly font, and Voice Assistant.

> **Adding Screenshots**: To showcase screenshots on GitHub, capture the interfaces above, save them into `docs/screenshots/` (e.g. `docs/screenshots/home.png`), and reference them in this section.

---

## 📁 Project Structure

```
Ai_cinebook/
├── .env.example                  # Environment variable template
├── .gitignore                    # Git exclusions (isolates node_modules, .env, .env.local)
├── index.html                    # Application HTML entry point
├── metadata.json                 # AI Studio capability metadata
├── package.json                  # Dependencies, scripts, and package versions
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite configuration with Tailwind CSS & React plugins
├── server.ts                     # Express server & Gemini API proxy with Vite middlewares
│
├── data/
│   └── cinebook-db.json          # Persistent JSON database (bookings, holds, seats)
│
├── public/
│   └── posters/                  # High-quality movie poster artwork
│
├── src/
│   ├── main.tsx                  # React DOM client entry point
│   ├── App.tsx                   # Top-level state coordinator and routing manager
│   ├── index.css                 # Global CSS with Tailwind v4 & WCAG accessibility styles
│   ├── types.ts                  # TypeScript models, interfaces, and enums
│   │
│   ├── components/               # Modular UI Components
│   │   ├── AIAssistant.tsx       # CineBot AI chat assistant widget
│   │   ├── AccessibilityModal.tsx# Accessibility Settings modal (Alt+A)
│   │   ├── AdvancedMovieFilters.tsx# Multi-facet search and filtering controls
│   │   ├── BookingView.tsx       # Showtime selection, seat map, and booking progress
│   │   ├── BookingsDashboard.tsx # My Bookings management and history
│   │   ├── CanteenFoodSection.tsx# Express canteen snacks and combos catalogue
│   │   ├── CanteenSelector.tsx   # Food selector within booking workflow
│   │   ├── CineBotWelcomeModal.tsx# First-time visitor CineBot onboarding prompt
│   │   ├── InteractiveTour.tsx   # 11-step interactive DOM spotlight tour
│   │   ├── MoodRecommendationSection.tsx # 7-mood movie recommender
│   │   ├── MovieCard.tsx         # Movie card with posters and accessibility badges
│   │   ├── Navbar.tsx            # Sticky header with navigation and accessibility toggle
│   │   ├── OffersModal.tsx       # Rewards, discounts, and promo coupons modal
│   │   ├── PaymentModal.tsx      # Secure checkout modal with 300s seat hold timer
│   │   ├── PersonalizedRecommendations.tsx # History-based personalized movie carousel
│   │   ├── PosterArtwork.tsx     # Aspect-ratio resilient movie artwork renderer
│   │   ├── SeatMap.tsx           # 2D arrow-navigable auditorium grid with wheelchair seats
│   │   ├── TicketConfirmation.tsx# Ticket pass with genuine QR code and invoice print
│   │   ├── TicketVerificationPage.tsx # Turnstile verification page for scanned QR tickets
│   │   ├── VoiceAssistantWidget.tsx   # Floating voice assistant with mic & text input
│   │   ├── WatchedRatingModal.tsx# 1-to-5 star rating and review submission
│   │   ├── WatchlistPage.tsx     # My Watchlist saved movie management
│   │   └── WelcomePage.tsx       # Cinematic introduction landing page
│   │
│   ├── context/
│   │   └── AccessibilityContext.tsx # Central accessibility state, DOM classes & live announcements
│   │
│   ├── data/
│   │   ├── canteenMenu.ts        # Food, beverage, and combo pricing definitions
│   │   ├── movies.ts             # 16 active movie records with verified accessibility specs
│   │   └── offers.ts             # Promo coupons, discount rules, and tier rewards
│   │
│   └── utils/
│       ├── aiAssistantService.ts # Gemini API bridge with resilient offline fallback
│       ├── qrCode.ts             # QR code generation and cryptographic token signing
│       ├── recommendations.ts    # Mood matching and personalized scoring algorithms
│       └── voiceAssistant.ts     # Web Speech synthesis, recognition, and security parser
│
└── tests/                        # Automated QA and Verification Suites
    ├── accessibility-comprehensive-test.cjs # 20 accessibility & WCAG feature tests
    ├── cinebot-and-tour-test.cjs            # 12 CineBot & tour integration tests
    ├── e2e-customer-journeys.cjs            # End-to-end customer booking flow tests
    ├── final-qa-comprehensive-suite.cjs     # 42 exhaustive QA, QR, & concurrency tests
    ├── gemini-api-test.cjs                  # 13 server-side Gemini API & security tests
    ├── qr-and-project-test.cjs              # QR cryptographic verification tests
    ├── regression-test.cjs                  # 16 regression & business logic tests
    └── tour-highlighting-and-cutout-test.cjs# Guided tour DOM highlighting tests
```

---

## 🚀 Installation and Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher (recommended: `v20.x` or `v22.x`)
- **npm** (`v9.x` or higher) or **bun** / **yarn** / **pnpm**
- **Git** installed on your system

### 1. Clone the Repository
```bash
git clone https://github.com/joyce1510/Ai_cinebook.git
cd Ai_cinebook
```

### 2. Install Dependencies
```bash
npm install
```

---

## 🔑 Environment Configuration

CineBook connects to Google Gemini API on the server side to power CineBot. If an API key is not provided, CineBook automatically operates using its built-in rule-based knowledge engine without crashing.

### Setup Gemini API Key
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a `.env.local` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and add your API key:
   ```env
   # Google Gemini AI API Key (Server-Side Only)
   GEMINI_API_KEY=your_actual_gemini_api_key_here

   # Public Application URL (used for routing scanned QR codes)
   VITE_APP_URL=http://localhost:3000

   # Server Port
   PORT=3000
   ```

> **Security Note**: Never commit `.env` or `.env.local` to GitHub. The repository's `.gitignore` automatically isolates these files.

---

## 💻 Running the Application

### Start Development Server
```bash
npm run dev
```

The unified development server will compile TypeScript and launch Express with Vite middlewares:
```
Server running at http://localhost:3000
AI Assistant Status: Ready (Model: gemini-2.5-flash)
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the unified full-stack development server with tsx and Vite on port 3000. |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and produces the optimized production bundle (`vite build`). |
| `npm run start` | Starts the production server using `server.ts`. |
| `npm run lint` | Performs strict TypeScript static type analysis without emitting files (`tsc --noEmit`). |

---

## 🔒 Security & Data Protection

CineBook is designed with strict security boundaries protecting both user credentials and database consistency:

1. **Zero Client-Side API Key Exposure**: The Google Gemini API key (`GEMINI_API_KEY`) is stored strictly in server-side environment variables and is never transmitted or injected into client JavaScript bundles.
2. **Server-Side API Proxying**: All AI requests from the frontend are routed through the backend proxy (`POST /api/ai/chat`), which applies rate-limiting, error handling, and prompt sanitization.
3. **Cryptographic QR Code Validation**: Every booking receives an HMAC-SHA256 signature generated on the server (`server.ts`). When scanned at turnstiles, the endpoint `/api/bookings/verify/:bookingId` re-computes and matches the token hash before granting gate entry.
4. **Concurrency & Double-Booking Prevention**: Seat holds utilize a 300-second atomic lock with in-memory tokens. Concurrent requests attempting to book the same seat return HTTP 409 Conflict.
5. **Voice Recognition Financial Safety Gate**: Voice assistant commands can never confirm orders or execute payments. Any speech command containing payment keywords triggers an explicit security alert directing the user to complete checkout manually on screen.
6. **Environment Isolation**: `.env`, `.env.local`, and build artifacts are strictly catalogued in `.gitignore`.

---

## 🧪 Automated Testing Suite

CineBook includes a comprehensive automated testing suite covering unit logic, server concurrency, cryptographic QR validation, and accessibility:

| Test Suite | File | Tests | Purpose |
| :--- | :--- | :---: | :--- |
| **Comprehensive Accessibility** | `tests/accessibility-comprehensive-test.cjs` | **20 / 20** | Validates WCAG 2.2 AA features, focus styles, keyboard navigation, wheelchair seats C1/C8, and voice security. |
| **Final QA & Security Suite** | `tests/final-qa-comprehensive-suite.cjs` | **42 / 42** | Validates turnstile QR verification, jsQR decoding, database preservation, seat concurrency, and 5-min holds. |
| **Gemini API & Security** | `tests/gemini-api-test.cjs` | **13 / 13** | Validates server-side key isolation, proxy routes, User-Agent headers, and graceful fallback behavior. |
| **Regression Verification** | `tests/regression-test.cjs` | **16 / 16** | Verifies 300s seat holds, pricing tiers (₹240/₹160), combo savings, filters, and watchlist isolation. |
| **CineBot & Guided Tour** | `tests/cinebot-and-tour-test.cjs` | **12 / 12** | Validates CineBot knowledge base, 11-step tour spotlight, and contextual help triggers. |

### Run the Tests
```bash
# Run all automated test suites
node tests/accessibility-comprehensive-test.cjs
node tests/final-qa-comprehensive-suite.cjs
node tests/gemini-api-test.cjs
node tests/regression-test.cjs
node tests/cinebot-and-tour-test.cjs

# Run TypeScript type check
npm run lint

# Run production build
npm run build
```

---

## 🔧 Maintenance & Operations

- **Database Maintenance**: Confirmed bookings and seat allocations are persisted in `data/cinebook-db.json`. In-memory seat holds expire automatically after 300 seconds without manual cleanup.
- **Updating Movies**: To add or update theatrical releases, update `src/data/movies.ts` while maintaining the `Movie` interface and `accessibility` specifications.
- **Updating Canteen Menu**: Food items and combo savings can be adjusted in `src/data/canteenMenu.ts` and `src/data/offers.ts`.
- **Dependency Upgrades**: Run `npm outdated` to review updates. When upgrading major versions of React or Tailwind, test using `npm run lint` and `npm run build`.

---

## 👤 Developer Information

- **Developer**: Joyce S
- **GitHub Profile**: [@joyce1510](https://github.com/joyce1510)
- **Project Repository**: [https://github.com/joyce1510/Ai_cinebook](https://github.com/joyce1510/Ai_cinebook)

---

<p align="center">
  <b>CineBook</b> · Built with passion for inclusive, accessible, and intelligent cinema booking.
</p>
