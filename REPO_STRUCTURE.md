# PWA Repo Structure (Suggested)

monorepo/
  apps/
    pwa/
      index.html
      vite.config.ts
      package.json
      public/
        icons/
        manifest.webmanifest
      src/
        app/
          App.tsx
          routes.tsx
          providers/
        ui/
          components/
          glass/
          tokens/
        domain/
          player.ts
          prompt.ts
          pack.ts
          houseRules.ts
        features/
          setup/
          game/
          packs/
          settings/
        engine/
          spin/
            SpinEngine.ts
            easing.ts
            rng.ts
            types.ts
            fairness.ts
          layout/
            ringLayout.ts
        audio/
          AudioEngine.ts
          profiles.ts
          unlock.ts
        storage/
          db.ts
          packsRepo.ts
          settingsRepo.ts
        pwa/
          sw.ts
          cache.ts
          updateFlow.ts
        utils/
          clamp.ts
          math.ts
        tests/
          spin.fairness.test.ts
          spin.determinism.test.ts
          filtering.test.ts

  packages/
    shared/
      types/
      lint-config/
      ts-config/

# Key Modules
- engine/spin: deterministic target angle + “physical-feeling” animation
- audio: Web Audio graph + velocity-driven mixing
- features/game: stage + player ring + prompt card flow
- pwa: service worker strategy + update UX
- storage: IndexedDB for packs/settings and player presets

