## Plan: Solito Full Rewrite for Web + Mobile

Rebuild the current Vite React audio player into a standard Solito monorepo (`apps/next`, `apps/expo`, `packages/app`) in one coordinated pass, with shared business/UI logic and platform-specific audio/runtime adapters. This approach preserves current functionality while enabling native mobile capabilities (background playback with `react-native-track-player`) and retaining web PWA behavior.

**Steps**

1. Phase 1 - Scaffold Solito workspace and baseline tooling.
2. Create monorepo structure with package manager workspaces and app boundaries: `apps/next`, `apps/expo`, `packages/app`, `packages/config`, and optional `packages/scripts` for existing ingestion utilities. (_blocks all later steps_)
3. Install and align core dependencies for Solito + React Native web stack, including navigation/runtime packages and shared TypeScript/lint presets. Remove Vite-only tooling from runtime path while preserving old app in a temporary folder for reference during migration. (_depends on 2_)
4. Configure environment variable strategy across platforms: `NEXT_PUBLIC_*` for Next.js and `EXPO_PUBLIC_*` for Expo, with a shared config accessor in `packages/app` to avoid direct `import.meta.env` usage. (_depends on 2, parallel with 3 once workspace exists_)

5. Phase 2 - Move domain/state logic into shared package.
6. Port channel domain models, App context/state reducers, favoriting logic, and fetch services from current React app into `packages/app`, isolating platform APIs behind adapters (`storage`, `linking`, `window APIs`). (_depends on 3,4_)
7. Split utilities into:
    - shared pure utilities (`areEqual`, channel transforms)
    - web-only helpers (window sizing, PWA helpers)
    - native-only helpers (app lifecycle/background handling hooks).
      This removes runtime `window`/DOM assumptions from shared modules. (_depends on 6_)
8. Introduce a shared route contract (home, channel deep link) and map it via Solito navigation for both Next.js and Expo React Navigation. (_depends on 6, parallel with 7_)

9. Phase 3 - Rebuild UI with cross-platform primitives.
10. Recreate existing screens/components (`Header`, channel list, player controls, channel info) using cross-platform primitives and styling system (Tamagui or NativeWind-driven primitives, based on implementation preference at execution). Avoid Grommet component dependencies in shared UI. (_depends on 6_)
11. Keep platform-specific wrappers only where needed (safe area, gesture handlers, keyboard/layout behavior, web-only hover/focus affordances). (_depends on 10, parallel with 12_)
12. Re-establish theming tokens (colors/spacing/typography) to match current brand behavior while ensuring responsive parity on mobile and web. (_depends on 10_)

13. Phase 4 - Audio engine abstraction and platform implementations.
14. Define shared player interface in `packages/app` (`load`, `play`, `pause`, `seek`, `setVolume`, `subscribeToState`) and migrate player state orchestration to this interface. (_depends on 6_)
15. Implement web audio adapter using `hls.js` + HTML audio element for Next.js web runtime. (_depends on 14_)
16. Implement native audio adapter using `react-native-track-player` with background playback/transport controls and lock-screen integration. (_depends on 14_)
17. Wire both adapters into shared player UI/state through dependency injection or platform entry registration. (_depends on 15,16_)

18. Phase 5 - Web PWA and app-shell behavior.
19. Recreate service-worker strategy for Next.js (migrating behavior from current `public/sw.js`) and preserve manifest/icons support for installable web app behavior. (_depends on 3,10_)
20. Validate web caching strategy compatibility with streamed audio and avoid stale cache for channel metadata endpoints. (_depends on 19_)

21. Phase 6 - Data scripts, testing, and quality gates.
22. Keep existing ingestion scripts (`scripts/restdb`, `scripts/scrapper`) as standalone workspace package and ensure environment config remains compatible. (_parallel with phases 2-5 after step 2_)
23. Rebuild tests as follows:

- shared unit tests in `packages/app`
- web component/integration tests in `apps/next`
- native smoke tests/manual QA checklist in `apps/expo` (or add RN testing-library coverage if capacity allows).
  (_depends on 10,17_)

24. Add CI checks for lint, typecheck, shared tests, Next.js build, and Expo prebuild/doctor validation. (_depends on 23_)

25. Phase 7 - Cutover and cleanup.
26. Confirm feature parity checklist against existing app behavior: channel loading, favorites persistence, deep links, player mini/full states, autoplay/resume rules, and error handling.
27. Remove deprecated Vite entry/config and archive old implementation once parity is confirmed.
28. Update README with run/deploy instructions for `apps/next`, `apps/expo`, and script package.

**Relevant files**

- `/Users/prasanta/Code/audio-player/package.json` - current dependency/scripts baseline and migration source.
- `/Users/prasanta/Code/audio-player/tsconfig.json` - TypeScript baseline to split into workspace configs.
- `/Users/prasanta/Code/audio-player/src/App.tsx` - current app composition and theme entry behavior.
- `/Users/prasanta/Code/audio-player/src/Radio.tsx` - current screen/layout structure to map into shared screen modules.
- `/Users/prasanta/Code/audio-player/src/AppContext.tsx` - core state/actions and persistence flow to port.
- `/Users/prasanta/Code/audio-player/src/AppStateContext.ts` - shared state type contracts to preserve.
- `/Users/prasanta/Code/audio-player/src/ChannelsList.tsx` - channel listing/favorites interactions.
- `/Users/prasanta/Code/audio-player/src/Player.tsx` - current web playback orchestration and HLS usage.
- `/Users/prasanta/Code/audio-player/src/PlayerActions.tsx` - transport control behavior to preserve in shared UI.
- `/Users/prasanta/Code/audio-player/src/PlayerControls.tsx` - interaction model to map to cross-platform controls.
- `/Users/prasanta/Code/audio-player/src/util.ts` - fetch/environment/window helper logic requiring adapter split.
- `/Users/prasanta/Code/audio-player/public/sw.js` - current caching/service worker behavior for Next.js PWA migration.
- `/Users/prasanta/Code/audio-player/public/manifest.json` - manifest baseline to preserve web install metadata.
- `/Users/prasanta/Code/audio-player/scripts/index.ts` - script orchestration to migrate into workspace package.
- `/Users/prasanta/Code/audio-player/scripts/restdb/index.ts` - backend data sync script.
- `/Users/prasanta/Code/audio-player/scripts/scrapper/index.ts` - scraping pipeline script.

**Verification**

1. Run workspace bootstrap and ensure all packages install without peer dependency conflicts.
2. Run lint + typecheck across all workspaces and fail on platform API leaks in shared modules.
3. Validate web app behavior in Next.js: channel list load, favorite toggle persistence, deep-link open, play/pause/seek/volume, error fallback.
4. Validate native app behavior in Expo: stream start/stop reliability, app background/foreground transitions, lock-screen transport controls, audio interruption recovery.
5. Validate PWA requirements on web: service worker registration, manifest installability, and safe caching behavior for metadata endpoints.
6. Execute parity checklist against old app and sign off only when all critical user journeys pass on both targets.

**Decisions**

- Confirmed: standard Solito monorepo layout.
- Confirmed: full rewrite in one pass rather than phased rollout.
- Confirmed: mobile playback via `react-native-track-player` for robust background controls.
- Confirmed: use Tamagui as the cross-platform UI styling/component stack.
- Confirmed: preserve web PWA/service worker support.
- Confirmed: use `pnpm` workspaces as package manager.
- Confirmed: include React Native Testing Library suites for native test coverage.
- Included scope: full functional parity plus platform audio adaptation.
- Excluded scope: backend/data model redesign and new product features beyond parity.
