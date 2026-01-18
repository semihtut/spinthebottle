# Spin the Bottle — Truth or Dare (PWA First)

## One-liner
A hyper-polished, offline-first PWA party game where players spin a realistic bottle in immersive environments and get dynamic Truth or Dare prompts tailored to 3–15 players.

## Product Vision
Make the classic “Spin the Bottle” feel surprisingly real:
- Visually: cinematic, glassy UI, ambient lighting, tactile controls
- Audibly: authentic bottle-on-surface sound that ramps down naturally as the spin slows
- Socially: frictionless pass-and-play for 3–15 people, with customizable vibe and content intensity

## Target Users & Use Cases
- Friends at home parties, dorm rooms, casual gatherings
- Travel / chalet / after-dinner hangouts with limited connectivity (offline!)
- Quick “ice-breaker” mode for 3–5, and “party chaos” for 8–15

## Core Gameplay Loop
1. Choose environment (tabletop, cozy authentic lounge, rooftop, campfire, arcade, etc.)
2. Add players (3–15), optional avatars/pronouns/roles
3. Spin the bottle with a gesture (swipe/drag/flick)
4. Bottle rotates with realistic easing + audio; selects a player
5. Present “Truth or Dare” choice and prompt
6. Optional: timers, skip tokens, house rules, intensity filters
7. Repeat

## Immersive Environments (Selectable Scenes)
Offer 6–10 “vibes”, each changes lighting, surface, audio profile, and micro-animations:
- **Desktop Table** (wood grain, coffee cups)
- **Authentic Lounge / Salon** (warm lamps, rugs, hookah silhouette, low table)
- **Campfire Night** (embers, subtle wind, bottle on a log slice)
- **Retro Arcade** (neon reflections, synth ambience)
- **Rooftop City** (distant traffic, skyline bokeh)
- **Beach Sunset** (sand texture, gentle waves)
Each environment has:
- Surface material parameters (friction, reflectivity)
- Sound profile (glass-on-wood, glass-on-rugged table, etc.)
- Idle ambience loop (low volume)
- Subtle “glassy UI” color grading to match vibe

## Bottle Spin Realism
### Motion
- Gesture-driven initial angular velocity
- Friction / drag causes realistic deceleration
- Slight wobble + micro jitter for “human” feel (configurable)
- Deterministic randomness option (seeded) for fairness & replay debug

### Audio
- Start: energetic rolling/clinking sound
- Mid: intermittent contact texture
- End: soft settling / final tap
- Doppler-ish pitch shift and volume fade tied to angular velocity
- Optional haptics (mobile) synced to “tap” events

## Player Count & Fairness (3–15)
- Weighted selection must be avoided: each spin outcome must be statistically fair
- Use a uniform final angle distribution, then map to players arranged evenly around bottle
- Ensure UI scales:
  - 3–6: large avatars around circle
  - 7–10: compact ring
  - 11–15: two-ring layout or condensed chips

## Modes
- **Classic**: Truth or Dare only
- **Quick Icebreaker (10 min)**: light prompts, fast pacing
- **Party (30–60 min)**: mixed intensity, optional challenges
- **Couples**: 2 players + “guest” mode disabled (optional add-on)
- **Custom Pack**: users build private prompt sets (local-only by default)

## Content System (Prompt Packs)
- Default packs:
  - Light / Funny / Awkward / Deep / Spicy (optional age-gated)
- Filters:
  - Intensity slider
  - Topics toggles (romance, embarrassment, physical dares, etc.)
  - “No alcohol / no touch / no phones” house-rule toggles
- Localization-ready: TR + EN at launch, scalable to more languages

## Safety & Consent by Design
- Prompts must avoid harm, illegality, hate/harassment, or coercion
- “Opt-out topics” per player
- “Skip” and “Replace prompt” options that don’t shame players
- Age gate for mature packs; default to safe content

## PWA Requirements (MVP)
- Offline-first with Service Worker + caching
- Installable (manifest, icons, splash screens)
- Works on iOS Safari limitations (audio unlock patterns)
- 60fps animation target for bottle spin
- No account required for MVP (local storage)

## Tech Direction (Suggested)
- Frontend: TypeScript + React + Vite (or Next.js static export)
- Animation: Canvas/WebGL (PixiJS/Three.js) OR pure CSS/DOM with requestAnimationFrame
- State: Zustand or Redux Toolkit
- Storage: IndexedDB (Dexie) for packs + settings
- Audio: Web Audio API (AudioContext + GainNode + filters)
- Optional backend (Phase 2): user packs sync, analytics events, remote pack store

## MVP Scope
- 3 environments
- Bottle spin physics (gesture + decel)
- 2 default packs (Light/Funny) + intensity slider
- Player management 3–15
- Glassy UI theme + accessibility basics
- Offline installable PWA

## Phase 2 (Nice-to-have)
- Account + cloud sync for custom packs
- Marketplace of curated packs
- Real-time multiplayer (websocket) (optional)
- Seasonal environments
- Shareable “party recap” (privacy-safe)

## Definition of Done (MVP)
- 3–15 players stable, no layout break
- Bottle spin feels realistic and fair
- Audio is synchronized, ramps naturally, no clipping
- Offline works after first load
- Lighthouse PWA checks pass
- Basic test coverage + performance budget documented

