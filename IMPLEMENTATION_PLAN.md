# Spin the Bottle — Truth or Dare: Implementation Plan

---

## A) Assumptions

### Device Targets
- **Primary**: Mobile phones (iOS Safari 15+, Android Chrome 90+)
- **Secondary**: Tablets (iPad Safari, Android tablets), Desktop browsers (Chrome, Firefox, Safari)
- **Screen sizes**: 320px–1920px viewport width
- **Touch-first**: All interactions designed for touch; mouse/keyboard as progressive enhancement

### Technology Stack
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18 + TypeScript | Type safety, ecosystem, team familiarity |
| Build | Vite 5 | Fast HMR, native ESM, PWA plugin support |
| Rendering | DOM + CSS transforms | MVP simplicity; 60fps achievable; Canvas/WebGL deferred to Phase 2 |
| State | Zustand | Minimal boilerplate, good DevTools, small bundle |
| Styling | Tailwind CSS + CSS variables | Utility-first, easy glassmorphism tokens |
| Storage | IndexedDB via Dexie.js | Robust offline storage, promise-based API |
| Audio | Web Audio API (raw) | Full control for velocity-mapped playback |
| PWA | vite-plugin-pwa (Workbox) | Precaching + runtime caching out of the box |
| Testing | Vitest + Testing Library + Playwright | Fast unit tests, realistic E2E |
| Linting | ESLint + Prettier | Consistent code style |

### Content & Localization
- MVP ships with **English (EN)** and **Turkish (TR)** prompt packs
- Prompts stored as JSON with stable IDs; translations keyed by locale
- No backend required for MVP; all data local

### Browser Constraints Handled
- **iOS audio unlock**: Resume AudioContext on first user tap
- **iOS PWA install**: Custom "Add to Home Screen" hint card
- **Reduced motion**: `prefers-reduced-motion` query disables spin animation, shows instant result

---

## B) Product Decisions

### MVP Screens & User Flow

```
┌─────────────┐
│   Home      │  "Play" / "Packs" / "Settings"
└──────┬──────┘
       │ Play
       ▼
┌─────────────┐
│   Setup     │  1. Choose Environment
│             │  2. Add Players (3–15)
│             │  3. House Rules & Intensity
└──────┬──────┘
       │ Start Game
       ▼
┌─────────────────────────────────────────────┐
│                  Game Loop                  │
│  ┌────────────┐                             │
│  │ Spin Stage │ ── spin gesture ──►         │
│  │ + Player   │                             │
│  │   Ring     │     ┌──────────────┐        │
│  └────────────┘     │ Truth/Dare   │        │
│        ▲            │   Choice     │        │
│        │            └──────┬───────┘        │
│        │                   │                │
│        │            ┌──────▼───────┐        │
│        │            │ Prompt Card  │        │
│        │            │ (Timer/Skip/ │        │
│        │            │  Replace)    │        │
│        │            └──────┬───────┘        │
│        │                   │ Done           │
│        └───────────────────┘                │
└─────────────────────────────────────────────┘
       │ Exit / End Game
       ▼
┌─────────────┐
│   Home      │
└─────────────┘
```

**Screen List (6 screens)**:
1. **Home** — Logo, Play button, Packs, Settings
2. **Setup** — Environment picker, player list, house rules accordion, intensity slider
3. **Game (Spin)** — Bottle + player ring, spin gesture area
4. **Truth or Dare Choice** — Modal overlay with two large buttons
5. **Prompt Card** — Prompt text, timer (optional), Skip / Replace / Done
6. **Settings** — Audio toggles, reduced motion, language, reset data

**Additional Overlays**:
- "Add Player" quick modal
- "How to Play" info sheet
- "Add to Home Screen" hint (iOS)

---

### MVP Environments (3)

| ID | Name | Visual Vibe | Surface | Audio Profile |
|----|------|-------------|---------|---------------|
| `desktop` | **Desktop Table** | Warm wood grain, coffee cup props, soft daylight | Wood, medium friction | Glass-on-wood taps, subtle room tone |
| `lounge` | **Authentic Lounge** | Dim warm lamps, Persian rug texture, low table, hookah silhouette | Fabric/rug on wood, higher friction feel | Muffled glass thuds, lounge ambience (soft chatter, clinking) |
| `rooftop` | **Rooftop City** | Night skyline bokeh, string lights, concrete surface | Concrete, lower friction | Crisp glass-on-stone, distant traffic hum |

Each environment provides:
- Background image/gradient + ambient particles (CSS/canvas)
- Surface friction multiplier (affects spin deceleration *feel*, not probability)
- Color grading tokens (tint overlay, glass panel hue)
- Audio profile ID (mapped to asset bundle)

---

### House Rules & Filters (MVP)

**Intensity Slider**: 1–3 (Light → Bold)
- Level 1: silly, quick, icebreaker
- Level 2: playful personal, light dares
- Level 3: slightly bold, still party-safe

**Topic Toggles** (default all ON):
- Icebreaker / Funny / Story / Preferences / Challenges / Compliments

**Constraint Toggles** (house rules, default OFF):
- No physical contact (`no_touch`)
- No phones allowed (`no_phone`)
- Must stay seated (`seated`)

**Skip / Replace**:
- "Skip" — move to next spin without shame text
- "Replace" — draw new prompt of same type/intensity

---

## C) Architecture

### Module Boundaries

```
src/
├── app/                    # App shell, routing, providers
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers/          # Zustand stores, theme, i18n
│
├── ui/                     # Presentational components
│   ├── components/         # Button, Card, Modal, Chip, Slider
│   ├── glass/              # Glassmorphism primitives
│   ├── layout/             # Container, Ring, Stack
│   └── tokens/             # CSS variables, Tailwind config
│
├── domain/                 # Core types (no React)
│   ├── player.ts
│   ├── prompt.ts
│   ├── pack.ts
│   ├── environment.ts
│   └── houseRules.ts
│
├── features/               # Feature modules (UI + logic)
│   ├── home/
│   ├── setup/
│   ├── game/
│   ├── packs/
│   └── settings/
│
├── engine/                 # Game engine (no React)
│   ├── spin/
│   │   ├── SpinEngine.ts   # Core spin logic
│   │   ├── easing.ts       # Deceleration curves
│   │   ├── rng.ts          # Seedable RNG
│   │   ├── fairness.ts     # Uniform angle distribution
│   │   └── types.ts
│   └── layout/
│       └── ringLayout.ts   # Player position calculator
│
├── audio/                  # Web Audio engine
│   ├── AudioEngine.ts
│   ├── profiles.ts         # Per-environment audio config
│   └── unlock.ts           # iOS AudioContext resume
│
├── storage/                # IndexedDB + persistence
│   ├── db.ts               # Dexie schema
│   ├── packsRepo.ts
│   ├── settingsRepo.ts
│   └── playersRepo.ts
│
├── pwa/                    # Service worker + update flow
│   ├── sw.ts
│   ├── cache.ts
│   └── updateFlow.ts
│
├── i18n/                   # Localization
│   ├── en.json
│   ├── tr.json
│   └── useTranslation.ts
│
└── utils/                  # Pure helpers
    ├── clamp.ts
    ├── math.ts
    └── random.ts
```

---

### State Model & Data Types

```typescript
// domain/player.ts
interface Player {
  id: string;           // uuid
  name: string;
  emoji?: string;       // optional avatar
  pronouns?: 'he' | 'she' | 'they' | null;
}

// domain/prompt.ts
interface Prompt {
  id: string;
  type: 'truth' | 'dare';
  intensity: 1 | 2 | 3 | 4 | 5;
  topics: string[];
  constraints: string[];
  durationSec?: number;
  text: Record<Locale, string>;  // { en: "...", tr: "..." }
}

// domain/pack.ts
interface Pack {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  prompts: Prompt[];
  isDefault: boolean;
  isEnabled: boolean;
}

// domain/environment.ts
interface Environment {
  id: string;
  name: Record<Locale, string>;
  backgroundAsset: string;
  surfaceFriction: number;    // 0.5–1.5 (affects feel, not fairness)
  colorGrading: { tint: string; glassHue: string };
  audioProfileId: string;
}

// domain/houseRules.ts
interface HouseRules {
  intensityMax: 1 | 2 | 3;
  disabledTopics: string[];
  constraints: string[];      // active constraints
}

// stores/gameStore.ts (Zustand)
interface GameState {
  phase: 'idle' | 'spinning' | 'choosing' | 'prompt' | 'done';
  players: Player[];
  currentPlayerIndex: number | null;
  selectedType: 'truth' | 'dare' | null;
  currentPrompt: Prompt | null;
  environment: Environment;
  houseRules: HouseRules;
  spinSeed: number | null;    // for determinism/replay
}

// stores/settingsStore.ts
interface SettingsState {
  locale: 'en' | 'tr';
  sfxVolume: number;          // 0–1
  ambienceVolume: number;
  reducedMotion: boolean;
  haptics: boolean;
}
```

---

### Offline Strategy

| Asset Type | Storage | Caching Strategy |
|------------|---------|------------------|
| App shell (HTML, JS, CSS) | Service Worker (Workbox precache) | Precache on install, stale-while-revalidate for updates |
| Environment images | SW runtime cache | Cache-first, versioned filenames |
| Audio assets | SW runtime cache | Cache-first, lazy-load per environment |
| Prompt packs (JSON) | IndexedDB (Dexie) | Bundled defaults precached; custom packs in IDB |
| Player presets | IndexedDB | Persisted across sessions |
| Settings | IndexedDB | Persisted across sessions |

**Update Flow**:
1. SW detects new version → downloads in background
2. Toast: "Update available" with "Reload" button
3. User taps → `skipWaiting()` + page reload
4. Never force-update mid-game (check `gameStore.phase`)

---

## D) Spin Realism & Fairness Design

### The Core Problem
Gesture-driven spins feel engaging, but allowing gesture strength to influence *who* gets selected would bias outcomes. We must decouple **feel** from **probability**.

### Solution: Pre-determined Fair Outcome + Animated Journey

```
┌─────────────────────────────────────────────────────────┐
│  1. User initiates spin gesture                         │
│  2. Immediately: pick uniformly random finalAngle       │
│     (using seedable PRNG, e.g., mulberry32)             │
│  3. Gesture velocity sets *duration* and *energy feel*  │
│  4. Animate from currentAngle → finalAngle with:        │
│     - Duration scaled by gesture (faster flick = longer │
│       spin, but same fair outcome)                      │
│     - Friction-based easing curve (ease-out-expo)       │
│     - Optional wobble/jitter layer (purely visual)      │
│  5. Map finalAngle to player index (evenly distributed) │
└─────────────────────────────────────────────────────────┘
```

### Math Model

```typescript
// Uniform random final angle
function pickFinalAngle(seed: number): number {
  const rng = mulberry32(seed);
  return rng() * 2 * Math.PI; // 0 to 2π
}

// Map angle to player
function angleToPlayerIndex(angle: number, playerCount: number): number {
  const sliceSize = (2 * Math.PI) / playerCount;
  const offset = Math.PI / 2; // bottle points "up" at index 0
  const normalizedAngle = ((angle + offset) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  return Math.floor(normalizedAngle / sliceSize);
}
```

### Animation Parameters

| Parameter | Description | Range |
|-----------|-------------|-------|
| `baseDuration` | Minimum spin time | 2000ms |
| `maxDuration` | Maximum spin time | 6000ms |
| `gestureMultiplier` | How much flick speed adds duration | 0.5–2.0 |
| `friction` | Deceleration feel (per environment) | 0.92–0.98 |
| `wobbleAmplitude` | Visual jitter (radians) | 0–0.02 |
| `wobbleFrequency` | Jitter oscillations per second | 3–8 Hz |

### Per-Environment Tuning

| Environment | Friction | Duration Feel | Wobble | Tap Cadence |
|-------------|----------|---------------|--------|-------------|
| Desktop | 0.96 | Medium | Low | Regular |
| Lounge | 0.94 | Slower, heavier | Medium | Muffled |
| Rooftop | 0.97 | Smooth, crisp | Low | Sharp |

### Engine API

```typescript
interface SpinEngine {
  start(gesture: GestureData, seed?: number): void;
  cancel(): void;
  onFrame: (callback: (angle: number, velocity: number) => void) => void;
  onComplete: (callback: (result: SpinResult) => void) => void;
}

interface SpinResult {
  finalAngle: number;
  selectedPlayerIndex: number;
  duration: number;
  seed: number;
}
```

### Fairness Guarantee
- `pickFinalAngle` uses cryptographically-seeded or time-seeded PRNG
- Distribution is uniform across [0, 2π]
- Player slices are equal: each player has probability `1/n`
- Gesture strength **cannot** influence `finalAngle`—only spin duration

---

## E) Audio Design

### Web Audio Graph

```
┌─────────────────────────────────────────────────────────────┐
│                      AudioContext                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Ambience Loop] ──► GainNode (ambienceVol) ──┐            │
│                                                │            │
│  [Spin Loop] ──► GainNode (velocityGain) ──┐  │            │
│                  └► BiquadFilter (lowpass) │  │            │
│                                            │  │            │
│  [Tap Samples] ──► GainNode (tapVol) ──────┤  │            │
│                                            │  │            │
│  [Settle Hit] ──► GainNode (settleVol) ────┤  │            │
│                                            │  │            │
│                                            ▼  ▼            │
│                              ┌─────────────────────┐       │
│                              │   Master GainNode   │       │
│                              │   (sfxVolume)       │       │
│                              └──────────┬──────────┘       │
│                                         │                  │
│                              ┌──────────▼──────────┐       │
│                              │  DynamicsCompressor │       │
│                              │  (limiter)          │       │
│                              └──────────┬──────────┘       │
│                                         │                  │
│                                         ▼                  │
│                                   destination              │
└─────────────────────────────────────────────────────────────┘
```

### Layers

1. **Ambience Loop** (per environment)
   - Low volume (0.1–0.3), always playing during game
   - Crossfade when switching environments

2. **Spin Loop**
   - Looping "rolling glass" texture (~2s loop)
   - **Velocity mapping**:
     - `gain = clamp(velocity / maxVelocity, 0, 1)`
     - `lowpassFrequency = 200 + velocity * 2000` (brighter at high speed)
   - Fades to 0 as spin stops

3. **Tap Samples** (3–5 variations)
   - Triggered at rotation milestones (every 90° or random interval)
   - Volume and pitch slight randomization for realism
   - Rate decreases as velocity drops

4. **Settle Hit**
   - Single one-shot when spin ends
   - Slightly different per environment (wood thud vs. stone clink)

### Velocity Mapping Formula

```typescript
function updateSpinAudio(velocity: number, maxVelocity: number) {
  const normalizedVel = clamp(velocity / maxVelocity, 0, 1);

  spinLoopGain.gain.value = normalizedVel * 0.8;
  spinLoopFilter.frequency.value = 200 + normalizedVel * 3000;

  // Tap probability increases with speed
  if (Math.random() < normalizedVel * 0.3) {
    playRandomTap(normalizedVel);
  }
}
```

### iOS Audio Unlock

```typescript
// unlock.ts
let audioContext: AudioContext | null = null;
let unlocked = false;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

export function unlockAudio(): Promise<void> {
  if (unlocked) return Promise.resolve();

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    return ctx.resume().then(() => { unlocked = true; });
  }
  unlocked = true;
  return Promise.resolve();
}

// Called on first user tap (in App.tsx or game screen)
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });
```

### Audio Assets Needed

| Asset | Format | Duration | Notes |
|-------|--------|----------|-------|
| `spin-loop-wood.mp3` | MP3 | ~2s loop | Glass rolling on wood |
| `spin-loop-fabric.mp3` | MP3 | ~2s loop | Muffled, lounge feel |
| `spin-loop-stone.mp3` | MP3 | ~2s loop | Crisp, rooftop |
| `tap-wood-1.mp3` | MP3 | ~0.1s | Wood tap variation 1 |
| `tap-wood-2.mp3` | MP3 | ~0.1s | Wood tap variation 2 |
| `tap-wood-3.mp3` | MP3 | ~0.1s | Wood tap variation 3 |
| `tap-fabric-1.mp3` | MP3 | ~0.1s | Muffled tap |
| `tap-stone-1.mp3` | MP3 | ~0.1s | Stone clink |
| `settle-wood.mp3` | MP3 | ~0.3s | Final thud on wood |
| `settle-fabric.mp3` | MP3 | ~0.3s | Soft settle |
| `settle-stone.mp3` | MP3 | ~0.3s | Crisp settle |
| `ambience-desktop.mp3` | MP3 | ~30s loop | Room tone, soft |
| `ambience-lounge.mp3` | MP3 | ~30s loop | Chatter, clinks |
| `ambience-rooftop.mp3` | MP3 | ~30s loop | City hum, wind |
| `ui-tap.mp3` | MP3 | ~0.05s | Button feedback |
| `ui-success.mp3` | MP3 | ~0.2s | Positive action |

---

## F) UI/UX Specification

### Design Tokens

```css
:root {
  /* Spacing (8px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;

  /* Glassmorphism */
  --glass-blur: 16px;
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.15);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Outfit', var(--font-sans);
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 2rem;      /* 32px */

  /* Colors (dark theme default) */
  --color-bg: #0f0f14;
  --color-surface: #1a1a24;
  --color-text: #f5f5f7;
  --color-text-muted: #9ca3af;
  --color-primary: #8b5cf6;
  --color-primary-hover: #a78bfa;
  --color-danger: #ef4444;
  --color-success: #22c55e;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.4);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

### Component List

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, ghost, danger variants; loading state |
| `IconButton` | Round button for close, settings, etc. |
| `GlassCard` | Frosted glass container |
| `GlassModal` | Centered modal with backdrop blur |
| `GlassSheet` | Bottom sheet for mobile |
| `PlayerChip` | Avatar + name chip for ring |
| `PlayerRing` | Circular/adaptive layout for 3–15 players |
| `BottleSpinner` | SVG bottle + rotation animation |
| `EnvironmentPicker` | Horizontal scroll cards |
| `IntensitySlider` | 1–3 slider with labels |
| `ToggleChip` | Pill toggle for topics/constraints |
| `PromptCard` | Large prompt display + actions |
| `Timer` | Circular countdown (optional) |
| `Toast` | Notification popup |
| `Tooltip` | Info hints |

### Layout Strategy for Player Counts

**3–6 Players**: Single ring, large chips
```
       [P1]
    [P6]  [P2]
       🍾
    [P5]  [P3]
       [P4]
```
- Chip size: 64px diameter
- Ring radius: 40% of container

**7–10 Players**: Single ring, compact chips
```
      [P1][P2]
   [P10]    [P3]
  [P9]  🍾   [P4]
   [P8]    [P5]
      [P7][P6]
```
- Chip size: 48px diameter
- Ring radius: 42% of container

**11–15 Players**: Two-ring layout OR condensed single ring
```
Option A: Two rings
  Outer ring: P1–P10 (48px chips)
  Inner ring: P11–P15 (40px chips)

Option B: Single condensed
  All 15 in one ring, 36px chips
  Zoom on selection
```
- Selected player chip scales up 1.2x
- Non-selected chips dim slightly (opacity 0.7)

### Accessibility Checklist

| Requirement | Implementation |
|-------------|----------------|
| **Keyboard navigation** | All buttons focusable, Enter/Space to activate, Tab order logical |
| **Focus indicators** | Visible 2px ring on focus (`:focus-visible`) |
| **Color contrast** | Minimum 4.5:1 for text, 3:1 for UI elements |
| **Reduced motion** | `@media (prefers-reduced-motion: reduce)` disables animations; spin shows instant result |
| **Screen reader** | ARIA labels on icons, live regions for game state changes |
| **Touch targets** | Minimum 44x44px for all interactive elements |
| **Text scaling** | UI responds to system font size (rem units) |

### Reduced Motion Behavior

When `prefers-reduced-motion: reduce` OR `settings.reducedMotion === true`:
- Bottle spin: No animation; instant jump to result
- Result announced via `aria-live` region
- Transitions reduced to opacity fades only
- No particle effects or parallax

---

## G) Testing & QA

### Unit Tests

| Test Suite | Coverage |
|------------|----------|
| `spin.fairness.test.ts` | Run 100,000 spins, verify χ² test passes for uniform distribution |
| `spin.determinism.test.ts` | Same seed → same result; different seeds → different results |
| `spin.easing.test.ts` | Verify easing function outputs valid range |
| `filtering.test.ts` | Verify prompts filter correctly by intensity, topics, constraints |
| `ringLayout.test.ts` | Positions are evenly distributed, no overlaps |
| `angleToPlayer.test.ts` | Edge cases: 0°, 359.9°, exactly on boundary |

### Fairness Test Example

```typescript
// spin.fairness.test.ts
import { pickFinalAngle, angleToPlayerIndex } from '../engine/spin';

describe('Spin Fairness', () => {
  it('distributes uniformly across players over 100k trials', () => {
    const playerCount = 8;
    const counts = new Array(playerCount).fill(0);
    const trials = 100_000;

    for (let i = 0; i < trials; i++) {
      const seed = Date.now() + i;
      const angle = pickFinalAngle(seed);
      const index = angleToPlayerIndex(angle, playerCount);
      counts[index]++;
    }

    const expected = trials / playerCount;
    const chiSquared = counts.reduce((sum, c) => {
      return sum + Math.pow(c - expected, 2) / expected;
    }, 0);

    // χ² critical value for df=7, p=0.01 is ~18.48
    expect(chiSquared).toBeLessThan(20);
  });
});
```

### E2E Test Scenarios (Playwright)

| Scenario | Steps | Expected |
|----------|-------|----------|
| **Setup → Spin → Prompt** | Home → Play → Add 5 players → Select Desktop → Start → Swipe to spin → Choose Truth → See prompt → Done | Full loop completes without error |
| **3 Player Layout** | Setup with 3 players → Start game | All chips visible, no overlap, ring centered |
| **15 Player Layout** | Setup with 15 players → Start game | All chips visible, readable names, no overlap |
| **Skip/Replace** | Spin → Truth → Skip | New spin initiated, no shaming message |
| **Offline Play** | Load app → Go offline → Full game loop | Game works entirely offline |
| **Reduced Motion** | Enable reduced motion → Spin | Instant result, no animation |
| **iOS Audio** | First tap unlocks audio → Spin | Audio plays correctly |

### Performance Budget

| Metric | Target | Tool |
|--------|--------|------|
| Spin animation | 60 FPS (16.6ms/frame) | Chrome DevTools Performance |
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Bundle size (gzipped) | < 150KB (JS) | Vite build |
| Audio decode time | < 200ms per asset | Web Audio profiling |
| Memory (during game) | < 100MB | Chrome Task Manager |

### Device Test Matrix

| Device | OS | Browser | Priority |
|--------|-----|---------|----------|
| iPhone 12+ | iOS 15+ | Safari | P0 |
| iPhone SE (2020) | iOS 15+ | Safari | P0 |
| Pixel 5 | Android 12+ | Chrome | P0 |
| Samsung Galaxy S21 | Android 12+ | Chrome | P1 |
| iPad (10th gen) | iPadOS 16+ | Safari | P1 |
| MacBook | macOS 13+ | Chrome, Safari | P1 |
| Windows laptop | Windows 11 | Chrome, Edge | P2 |

---

## H) Milestones

### Milestone 1: Project Setup & Core Architecture
**Deliverables**:
- Vite + React + TypeScript project scaffolded
- Folder structure per REPO_STRUCTURE.md
- Tailwind configured with design tokens
- Zustand stores stubbed (gameStore, settingsStore)
- Dexie database schema defined
- Basic routing (Home, Setup, Game, Settings)
- PWA manifest + service worker skeleton

**Acceptance Criteria**:
- `npm run dev` starts app
- `npm run build` produces working PWA
- Lighthouse PWA audit passes basic checks
- Folder structure matches spec

---

### Milestone 2: Player Ring & Spin Engine (No Audio)
**Deliverables**:
- `SpinEngine` with fairness-first implementation
- `ringLayout.ts` for 3–15 player positioning
- `PlayerChip` and `PlayerRing` components
- `BottleSpinner` component with CSS transform animation
- Gesture detection (touch/mouse drag → velocity)
- Visual spin with easing, no audio yet

**Acceptance Criteria**:
- Spin feels responsive to gesture
- Fairness test passes (100k trials)
- Determinism test passes
- Player ring adapts to 3, 8, 15 players
- 60 FPS on mid-range mobile

---

### Milestone 3: Audio Engine & Environment System
**Deliverables**:
- `AudioEngine` with Web Audio graph
- Velocity-mapped spin audio (loop + taps + settle)
- iOS audio unlock
- 3 environment definitions with audio profiles
- Environment picker UI
- Background/ambience system

**Acceptance Criteria**:
- Audio plays and ramps naturally with spin
- iOS Safari audio works after tap
- Each environment has distinct audio feel
- No audio clipping or stuck loops
- Mute toggle works

---

### Milestone 4: Prompt System & Content Packs
**Deliverables**:
- Prompt domain types and filtering logic
- 2 default packs (Light, Funny) in EN and TR
- Pack storage in IndexedDB
- Truth/Dare choice modal
- Prompt card component
- Skip/Replace functionality
- Intensity slider and topic toggles

**Acceptance Criteria**:
- Filtering tests pass
- Prompts display correctly in both locales
- Skip/Replace work without shaming text
- Intensity slider filters prompts correctly
- Packs persist across sessions

---

### Milestone 5: Full Game Loop & Setup Flow
**Deliverables**:
- Complete Setup screen (environment, players, house rules)
- Game loop state machine (spin → choice → prompt → repeat)
- Player management (add, remove, edit)
- Current player highlighting
- Game end/restart flow
- Home screen with Play button

**Acceptance Criteria**:
- Setup < 30 seconds for 5 players
- Full game loop works 10+ rounds without bugs
- Back/exit works at any point
- State persists if app backgrounded

---

### Milestone 6: Glassmorphism UI & Polish
**Deliverables**:
- Glass card, modal, sheet components
- All screens styled to design tokens
- Micro-animations (button press, selection glow)
- Responsive layouts for phone/tablet/desktop
- Reduced motion mode
- Loading states and error boundaries

**Acceptance Criteria**:
- Visual polish matches "premium party" goal
- Text readable on all glass surfaces (contrast)
- Reduced motion mode fully functional
- No layout breaks at any viewport size

---

### Milestone 7: Offline-First PWA & Settings
**Deliverables**:
- Workbox service worker with precaching
- Runtime caching for assets
- Offline detection and UI feedback
- Update flow ("Reload to update" toast)
- Settings screen (audio, locale, reduced motion, reset)
- "Add to Home Screen" hint for iOS

**Acceptance Criteria**:
- App works fully offline after first load
- Lighthouse PWA score ≥ 90
- Update flow doesn't interrupt mid-game
- Settings persist and apply correctly

---

### Milestone 8: QA, Performance, & Launch Prep
**Deliverables**:
- All unit tests passing
- E2E test suite (Playwright)
- Performance profiling and fixes
- Cross-device testing (see matrix)
- Accessibility audit fixes
- Final content review (prompts safe)
- Production build and deployment config

**Acceptance Criteria**:
- All tests pass in CI
- 60 FPS spin on all P0 devices
- Lighthouse scores: Performance ≥ 80, Accessibility ≥ 90, PWA ≥ 90
- No P0/P1 bugs open
- Ready for production deployment

---

## Summary Checklist

| Requirement | Covered In |
|-------------|------------|
| PWA-first, offline-first | Milestone 7, Section C (Offline Strategy) |
| 3–15 players, no UI overlap | Milestone 2, Section F (Layout Strategy) |
| Realistic + fair bottle spin | Milestone 2, Section D (Spin Design) |
| Realistic audio with velocity mapping | Milestone 3, Section E (Audio Design) |
| 3 immersive environments | Milestone 3, Section B (Environments) |
| Glassy, premium UI | Milestone 6, Section F (Design Tokens) |
| Consent & safety, skip/replace | Milestone 4, Section B (House Rules) |
| Accessibility & reduced motion | Milestone 6, Section F (Accessibility) |
| Testing & 60 FPS target | Milestone 8, Section G (Testing & QA) |

---

*Awaiting your approval to proceed with Milestone 1.*
