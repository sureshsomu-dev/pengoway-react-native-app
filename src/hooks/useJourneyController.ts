import { useEffect, useMemo, useRef, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { getMilestoneQuote, getNarrativeHeadline } from '../data/narrative';

export type VehicleType = 'none' | 'snowmobile' | 'helicopter';

const STEP_TO_KM = 0.00078;
const STEP_TO_WORLD_UNITS = 0.1;
const MOVING_TIMEOUT_MS = 3500;
const PENGUIN_GOAL_KM = 10;
const SPEED_WINDOW_MS = 30_000;

function getVehicleMultiplier(vehicle: VehicleType) {
  switch (vehicle) {
    case 'snowmobile':
      return 1.8;
    case 'helicopter':
      return 3.2;
    default:
      return 1;
  }
}

export function useJourneyController() {
  const [steps, setSteps] = useState(0);
  const [sceneTravel, setSceneTravel] = useState(0);
  const [pedometerAvailable, setPedometerAvailable] = useState<boolean | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleType>('none');
  const [milestoneQuote, setMilestoneQuote] = useState<string | null>(null);
  const [stepsPerMinute, setStepsPerMinute] = useState(0);

  const movingUntilRef = useRef(0);
  const lastMilestoneRef = useRef(0);
  const lastWatchValueRef = useRef(0);
  const vehicleRef = useRef<VehicleType>('none');
  const stepTimestamps = useRef<number[]>([]);

  useEffect(() => {
    vehicleRef.current = vehicle;
  }, [vehicle]);

  const registerSteps = (delta: number) => {
    if (delta <= 0) return;

    const now = Date.now();
    for (let i = 0; i < delta; i++) stepTimestamps.current.push(now);

    setSteps((currentSteps) => {
      const nextSteps = currentSteps + delta;
      const currentMilestone = Math.floor(nextSteps / 1000);
      if (currentMilestone > lastMilestoneRef.current) {
        lastMilestoneRef.current = currentMilestone;
        setMilestoneQuote(getMilestoneQuote(currentMilestone));
      }
      return nextSteps;
    });

    movingUntilRef.current = now + MOVING_TIMEOUT_MS;
    setIsMoving(true);
    setSceneTravel((currentTravel) => {
      const multiplier = getVehicleMultiplier(vehicleRef.current);
      return currentTravel + delta * STEP_TO_WORLD_UNITS * multiplier;
    });
  };

  useEffect(() => {
    let mounted = true;
    let subscription: { remove: () => void } | null = null;

    async function initPedometer() {
      try {
        const available = await Pedometer.isAvailableAsync();
        if (!mounted) return;
        setPedometerAvailable(available);
        if (!available) return;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const initial = await Pedometer.getStepCountAsync(startOfDay, new Date());
        if (!mounted) return;

        setSteps(initial.steps);
        setSceneTravel(initial.steps * STEP_TO_WORLD_UNITS);
        lastMilestoneRef.current = Math.floor(initial.steps / 1000);
        lastWatchValueRef.current = 0;

        subscription = Pedometer.watchStepCount(({ steps: watchedSteps }) => {
          const delta = watchedSteps - lastWatchValueRef.current;
          lastWatchValueRef.current = watchedSteps;
          registerSteps(delta);
        });
      } catch {
        if (mounted) setPedometerAvailable(false);
      }
    }

    initPedometer();
    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now > movingUntilRef.current) setIsMoving(false);

      const cutoff = now - SPEED_WINDOW_MS;
      stepTimestamps.current = stepTimestamps.current.filter((t) => t > cutoff);
      const recentSteps = stepTimestamps.current.length;
      setStepsPerMinute(Math.round((recentSteps / SPEED_WINDOW_MS) * 60_000));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!milestoneQuote) return;
    const timeout = setTimeout(() => setMilestoneQuote(null), 4200);
    return () => clearTimeout(timeout);
  }, [milestoneQuote]);

  const distanceKm = useMemo(() => steps * STEP_TO_KM, [steps]);
  const headline = useMemo(() => getNarrativeHeadline(distanceKm), [distanceKm]);
  const remainingKm = useMemo(() => Math.max(0, PENGUIN_GOAL_KM - distanceKm), [distanceKm]);
  const progressPercent = useMemo(() => Math.min(100, (distanceKm / PENGUIN_GOAL_KM) * 100), [distanceKm]);

  return {
    distanceKm,
    headline,
    isMoving,
    milestoneQuote,
    pedometerAvailable,
    remainingKm,
    progressPercent,
    sceneTravel,
    steps,
    stepsPerMinute,
    vehicle,
    buyVehicle: (nextVehicle: VehicleType) => setVehicle(nextVehicle),
    takeDemoStep: (amount = 20) => registerSteps(amount),
  };
}
