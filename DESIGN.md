# design.md — Spin the Bottle PWA (Premium Visual & Feel Spec)

This document defines the art direction and visual design rules for the **Bottle + Surface** experience, including environments, materials, lighting, UI glass style, and micro-interactions. It is written to help design and implementation teams produce a premium, realistic feel without requiring full 3D.

---

## 1) Design North Star

**Make the bottle feel real.**  
Players should subconsciously believe the bottle has weight, glass thickness, surface contact, and friction. The stage should feel cinematic, while UI stays readable and lightweight.

**Keywords:** premium, tactile, cinematic, cozy, playful, consent-first.

---

## 2) Bottle Visual Spec (Core)

### 2.1 Silhouette & Proportions
- Classic bottle shape (recognizable instantly)
- Clear neck and base
- Slight asymmetry is acceptable if it improves realism

### 2.2 Glass Material (Must-Haves)
**A) Dual highlight edges**
- Outer rim highlight + inner rim highlight to suggest thickness

**B) Subtle refraction illusion**
- Very light background distortion near the bottle base (can be faked with a masked blur layer)

**C) Internal reflections**
- Faint inner sheen strip along the bottle body

**D) Label or emboss detail**
- Minimal label or embossed mark to provide scale and realism (can vary by environment)

### 2.3 Motion & Blur
- Avoid full blur; instead:
  - Use a **thin highlight streak** that becomes visible at higher speeds
  - Keep the bottle body relatively crisp to preserve readability and realism
- Add a tiny **wobble (yaw/tilt)**: 1–2 degrees max
- Add a **settle animation** (last 300–500ms): micro bounce + tiny rotation correction

### 2.4 Bottle Layers (Recommended Asset Structure)
Even without 3D, you can get a premium look with layered 2D:
1. `bottle_base.png` (main sprite, high-res)
2. `bottle_highlight_overlay.png` (screen/add blend highlight)
3. `bottle_label_overlay.png` (optional per environment)
4. `bottle_shadow_contact.png` (tight shadow)
5. `bottle_shadow_ambient.png` (soft shadow)

---

## 3) Surface (Stage) Design: Realism Comes From Contact

The surface is as important as the bottle.

### 3.1 Two-Layer Shadow Rule (Non-Negotiable)
Use both:
- **Contact Shadow:** small, darker, sharper (bottle touches surface)
- **Ambient Shadow:** larger, softer blur (bottle presence in space)

**During spin:**
- Contact shadow may “vibrate” subtly (1–2px shift) to mimic micro instability
- Ambient shadow remains stable and soft

### 3.2 Surface Texture Guidelines
- Use tasteful detail (grain, micro scratches, worn edges)
- Avoid noisy patterns that fight with UI readability
- Add a mild specular highlight where appropriate (semi-gloss surfaces)

---

## 4) Lighting & Cinematic Feel

### 4.1 Lighting Setup (Simple but Effective)
- **One key light** (creates strong glass highlight)
- **Soft ambient fill**
- Optional: **colored rim light** in neon environments

### 4.2 Camera & Depth
- Keep stage stable and centered
- Add extremely subtle **background parallax drift** (1–2px over time)
- Add mild **vignette** during spin for drama (not always-on)

### 4.3 “Premium Moment” Boost (Spin Start/Stop)
- On spin start: slight glow + vignette increases, then fades
- On stop: quick soft bloom pulse + selected player halo

---

## 5) Environments (MVP: 3 Scenes)

Each environment changes:
- surface material look
- color temperature
- ambience audio bed
- bottle reflection color grading
- tuning for “feel” (wobble, tap cadence, perceived friction)

### Environment A — Desktop Table (Wood)
**Mood:** clean, modern, casual  
**Palette:** warm-neutral wood, soft daylight, minimal clutter  
**Surface:** wood grain + subtle varnish sheen  
**Lighting:** neutral key light, soft ambient fill  
**Background elements (subtle):**
- blurred mug, notebook edge, plant shadow
**Bottle look:** clearer highlights, slightly stronger reflections  
**UI:** cool-white glass panels, minimal neon

**Surface + feel notes**
- Perceived friction: medium
- Shadow sharpness: medium
- Great default for first-time users

---

### Environment B — Authentic Lounge / Salon (Cozy & Warm)
**Mood:** warm, intimate, “otantik” vibe  
**Palette:** amber lamps, warm browns, deep textiles  
**Surface:** low table, slightly matte finish  
**Lighting:** warm key light + very soft fill; gentle bokeh lamps  
**Background elements (subtle silhouettes):**
- patterned rug edge, lantern glow, cushions outline
**Bottle look:** warmer reflection tint, softer highlights  
**UI:** warm glass panels (slightly increased opacity for readability)

**Surface + feel notes**
- Perceived friction: slightly higher (slower feel)
- Shadow: softer and more diffused
- Ambient loop: quiet lounge hum (low volume)

---

### Environment C — Neon Rooftop / Arcade (Vibrant)
**Mood:** energetic, cinematic, fun  
**Palette:** deep night + neon accents (pink/blue/purple)  
**Surface:** semi-gloss tabletop or bar counter  
**Lighting:** key light + colored rim reflections  
**Background elements:**
- skyline bokeh or arcade lights, gentle animated flicker
**Bottle look:** colored edge highlights, neon tint reflections  
**UI:** darker glass panels with stronger border glow

**Surface + feel notes**
- Perceived friction: lower (longer spins feel right)
- Shadow: sharper contact, stronger specular cues
- Ambient loop: distant city/arcade hum

---

## 6) Motion & Micro-Interactions

### 6.1 Player Feedback (Small, High Impact)
- **Spin button:** press “squish” + glow
- **Tick indicator:** small pulses synced to bottle tap events
- **Selected player:** halo ring + 2-step pulse (fast then slow)

### 6.2 Reduced Motion Mode
When reduced motion is enabled:
- Disable parallax drift
- Reduce wobble amplitude
- Remove vignette pulses
- Keep only essential transitions (fade/slide short)

---

## 7) Glassy UI (Premium, Readable, Not Overdone)

### 7.1 Glass Panel Rules
- Use blur + translucent fill + subtle border
- Avoid ultra-low contrast text on busy backgrounds
- Add minimal noise grain in glass panels (prevents banding)

### 7.2 Recommended UI Tokens (Guidance)
**Corner radius:** large (12–20)  
**Blur:** medium-high but tasteful  
**Opacity:** 10–18% typical, higher (20–28%) in bright scenes  
**Border:** 1px subtle, slightly brighter than fill  
**Shadow:** soft and wide, never harsh

### 7.3 UI Layout: “Stage First”
- Bottle stage is hero area
- UI controls sit on glass panels near edges
- Keep center mostly clear for the bottle

---

## 8) Player Ring Layout (3–15 People)

**Goal:** Always readable and not cluttered.

### 3–6 players
- Large avatars/chips around a single ring
- Names visible at all times

### 7–10 players
- Smaller chips, single ring
- Names may shorten (e.g., first 6–8 chars) with full name on tap

### 11–15 players
- Two-ring layout OR condensed chips
- Only selected player expands to show full name and highlight

**Selected state**
- Expand selected chip
- Add halo glow
- Optional subtle “camera attention” (tiny vignette shift)

---

## 9) Audio-Visual Sync (Design-Level Spec)

Even if audio is handled separately, design must anticipate sync points:
- “Tap” moments align with subtle shadow jitter + UI tick pulse
- Final stop aligns with:
  - micro settle animation
  - brief glow pulse
  - selected player highlight pulse

---

## 10) Asset List (MVP Minimum)

### Bottle (per style, can be shared across environments)
- bottle_base (hi-res)
- bottle_highlight_overlay
- bottle_label_overlay (optional variants)
- bottle_shadow_contact
- bottle_shadow_ambient

### Per Environment
- stage_background (layered, with bokeh)
- surface_texture (or combined surface layer)
- light_map / vignette overlay (optional)
- ambience loop (audio)
- optional small props silhouettes (very subtle)

### UI
- glass panel base (optional reusable)
- icons (spin, settings, packs, sound, haptics)
- halo ring / glow assets (or generated)

---

## 11) Quality Bar Checklist

A build meets the premium feel if:
- Bottle reads as glass (thickness + highlight)
- Bottle feels “on” the surface (contact + ambient shadows)
- Spin motion has believable deceleration + mild wobble
- Stop moment feels satisfying (settle + final tap + highlight)
- UI is glassy but always readable
- Environments feel distinct via lighting, surface, and color grading

---

## 12) Optional “Wow” Upgrades (Phase 2)
- Subtle reflection of UI glow on bottle
- Procedural grain/noise overlay for filmic look
- Seasonal skins (winter lounge, summer beach)
- Dynamic light flicker (lantern/neon) tied to ambience

---
End of design.md

