# PengoWay MVP

PengoWay is a narrative-driven React Native fitness concept built as an Expo MVP with a split-screen layout:

- Top 60%: procedural React Three Fiber Antarctic scene with fog, bloom, a walking traveler, and optional rescue vehicles.
- Bottom 40%: glassmorphism dashboard for daily steps, distance, mission status, and the live narrative ticker.
- Interaction loop: pedometer-driven motion, dummy login, dummy vehicle purchases, and emotional milestone overlays every 1,000 steps.

## Stack

- Expo / React Native / TypeScript
- `@react-three/fiber/native` with `three`
- `@react-three/postprocessing` for bloom
- `expo-sensors` for pedometer access
- `expo-blur` and `expo-linear-gradient` for the HUD

## Run

```bash
npm install
npm run start
```

Use a real device for pedometer input. In simulators or unsupported devices, the HUD exposes a `Demo step` button to drive the scene manually.

## MVP Notes

- The 3D scene is procedural and asset-light so the concept can be evaluated before committing to a full character/environment art pipeline.
- Vehicle purchases are dummy-only and switch the active support vehicle plus stride multiplier.
- The palette is intentionally high-key and bright. No dark theme is implemented.

## Suggested Next Production Steps

1. Replace the procedural traveler and vehicles with authored GLB assets plus animation clips.
2. Introduce a real auth provider and an actual in-app purchase layer.
3. Persist daily progress, story chapters, and rescue milestones.
4. Add audio design: wind beds, footfall layers, milestone stingers, and vehicle fly-ins.
