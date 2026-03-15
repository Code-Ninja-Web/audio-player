# Expo Runtime QA Checklist

## Scope

Validate native playback behavior for the Expo app (`apps/expo`) after Track Player integration.

## Automated checks run (this session)

1. `pnpm --filter @audio-player/expo exec expo config --type public` -> pass
2. `pnpm exec expo prebuild --platform all --no-install` (from `apps/expo`) -> pass
3. `pnpm dlx expo-doctor` (from `apps/expo`) -> pass after config adjustments/exclusions

Notes:
- `expo prebuild` generated `apps/expo/ios` and `apps/expo/android` locally; these are ignored in `.gitignore` for this monorepo flow.
- `react-native-track-player` is excluded from Expo Doctor React Native Directory checks due known New Architecture metadata warning.

## Manual runtime checklist

Run on physical device/simulator with native runtime (`expo run:ios` / `expo run:android`).

### A) Playback basics

- [ ] App launches and channel list renders.
- [ ] Selecting a station starts playback.
- [ ] Pause and resume controls work.
- [ ] Next/Prev controls change station and auto-play.
- [ ] Favourite toggle updates UI state correctly.

### B) Background playback

- [ ] Start playback, send app to background, audio continues for at least 2 minutes.
- [ ] Return app to foreground, state remains accurate (playing/paused/current channel).

### C) Remote transport controls (lock screen / notification)

- [ ] While playing, lock-screen or notification controls show Play/Pause.
- [ ] Remote Pause pauses playback.
- [ ] Remote Play resumes playback.
- [ ] Remote Stop stops playback and app state reflects stopped state.

### D) Interruptions

- [ ] Incoming call interruption pauses audio.
- [ ] After interruption ends, playback can be resumed from controls.
- [ ] Bluetooth headset disconnect/reconnect does not crash app.

### E) Resilience

- [ ] Switching channels repeatedly (10+ times) does not crash or hang.
- [ ] Network drop during playback shows error state and app remains interactive.
- [ ] Recovery after network restore works by replaying current station.

## Suggested command sequence for QA

```bash
pnpm --filter @audio-player/expo ios
# or
pnpm --filter @audio-player/expo android
```

