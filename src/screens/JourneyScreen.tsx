import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CinematicScene } from '../components/CinematicScene';
import { HudPanel } from '../components/HudPanel';
import { MilestoneOverlay } from '../components/MilestoneOverlay';
import { VehicleSupportModal } from '../components/VehicleSupportModal';
import { useJourneyController } from '../hooks/useJourneyController';
import { colors, radii, spacing, typography } from '../theme/tokens';

type JourneyScreenProps = {
  onSignOut: () => void;
  travelerName: string;
};

export function JourneyScreen({ onSignOut, travelerName }: JourneyScreenProps) {
  const [vehicleMenuVisible, setVehicleMenuVisible] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const journey = useJourneyController();
  const bodyFont = Platform.select(typography.body) ?? typography.body.default;

  useEffect(() => {
    if (!paymentMessage) return;
    const timeout = setTimeout(() => setPaymentMessage(null), 2600);
    return () => clearTimeout(timeout);
  }, [paymentMessage]);

  return (
    <View style={styles.root}>
      {/* Full-screen 3D world */}
      <CinematicScene
        isMoving={journey.isMoving}
        sceneTravel={journey.sceneTravel}
        vehicle={journey.vehicle}
      />

      {/* Floating HUD overlay */}
      <SafeAreaView style={styles.overlay} pointerEvents="box-none" edges={['top', 'bottom']}>
        <HudPanel
          distanceKm={journey.distanceKm}
          headline={journey.headline}
          isMoving={journey.isMoving}
          onDemoStep={() => journey.takeDemoStep()}
          onOpenVehicleMenu={() => setVehicleMenuVisible(true)}
          onSignOut={onSignOut}
          pedometerAvailable={journey.pedometerAvailable}
          progressPercent={journey.progressPercent}
          remainingKm={journey.remainingKm}
          steps={journey.steps}
          stepsPerMinute={journey.stepsPerMinute}
          travelerName={travelerName}
          vehicle={journey.vehicle}
        />
      </SafeAreaView>

      {/* Payment toast */}
      {paymentMessage && (
        <View style={styles.toastWrap} pointerEvents="none">
          <BlurView intensity={60} tint="light" style={styles.toast}>
            <Text style={[styles.toastText, { fontFamily: bodyFont }]}>{paymentMessage}</Text>
          </BlurView>
        </View>
      )}

      <VehicleSupportModal
        onClose={() => setVehicleMenuVisible(false)}
        onSelectVehicle={(vehicle) => {
          journey.buyVehicle(vehicle);
          setPaymentMessage(
            vehicle === 'snowmobile'
              ? 'Snowmobile deployed — 1.8x stride boost active'
              : 'Helicopter deployed — 3.2x mission boost active'
          );
        }}
        visible={vehicleMenuVisible}
      />
      <MilestoneOverlay quote={journey.milestoneQuote} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#daf0ff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  toastWrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    top: '45%',
    alignItems: 'center',
  },
  toast: {
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: Platform.OS === 'android' ? colors.glassHeavy : 'transparent',
  },
  toastText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
