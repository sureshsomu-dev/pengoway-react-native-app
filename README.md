# 🐧 PengoWay: The Quest for the Lost Penguin

**Fitness meets Virality.** PengoWay is more than a step tracker—it's a real-world simulator and a journey of rescue. 

## 🏔️ The Narrative
In the heart of the frozen Antarctic, a penguin has been lost. Your mission is to find them. 

PengoWay transforms your physical movement into progress through the ice. Every step you take in the real world brings you closer to the lost penguin in the simulator. 

- **Fitness + Virality**: Share your rescue milestones and challenge the world to join the search.
- **Real-World Sync**: Your actual steps are the only way to navigate the tundra.
- **Closure Through Motion**: The more you walk, the closer you get to bringing the penguin home.

---

## 🛠️ Technical Stack
Built as a high-fidelity React Native MVP using Expo:

- **Core**: Expo / React Native / TypeScript
- **3D Engine**: `@react-three/fiber/native` + `three.js`
- **Visuals**: `@react-three/postprocessing` (Bloom, Fog, Cinematic lighting)
- **Tracking**: `expo-sensors` (Pedometer API)
- **UI/UX**: Glassmorphism HUD via `expo-blur` and `expo-linear-gradient`

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the journey
npm run start
```

> [!TIP]
> Use a **real device** for the best experience with the pedometer. If you're on a simulator, use the **"Demo Step"** button in the HUD to simulate movement.

---

## 📝 MVP Features
- **Cinematic Scene**: A procedural Antarctic environment that reacts to your pace.
- **HUD Dashboard**: Real-time stats for steps, distance, and mission status.
- **Rescue Support**: Dummy vehicle "purchases" that provide stride multipliers and change the scene.
- **Emotional Milestones**: Narrative overlays triggered every 1,000 steps to keep the rescue mission engaging.

## 🗺️ Roadmap
1. **High-Poly Assets**: Replace procedural models with custom GLB characters and vehicles.
2. **Persistence**: Save rescue progress and story chapters across sessions.
3. **Social Layer**: Global leaderboards and "Rescue Squad" virality features.
4. **Atmospheric Sound**: Dynamic wind, crunching snow, and milestone audio stingers.

