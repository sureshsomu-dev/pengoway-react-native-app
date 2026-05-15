import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { VehicleType } from '../hooks/useJourneyController';

type HudPanelProps = {
  distanceKm: number;
  headline: string;
  isMoving: boolean;
  pedometerAvailable: boolean | null;
  progressPercent: number;
  remainingKm: number;
  steps: number;
  stepsPerMinute: number;
  travelerName: string;
  vehicle: VehicleType;
  onOpenVehicleMenu: () => void;
  onDemoStep: () => void;
  onSignOut: () => void;
};

export function HudPanel({
  distanceKm,
  headline,
  isMoving,
  onDemoStep,
  onOpenVehicleMenu,
  onSignOut,
  pedometerAvailable,
  progressPercent,
  remainingKm,
  steps,
  stepsPerMinute,
  vehicle,
}: HudPanelProps) {
  const bodyFont = Platform.select(typography.body) ?? typography.body.default;
  const monoFont = Platform.select(typography.mono) ?? typography.mono.default;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Top navigation pill */}
      <View style={styles.topBar} pointerEvents="box-none">
        <BlurView intensity={60} tint="light" style={styles.navPill}>
          <Text style={[styles.navEmoji]}>🐧</Text>
          <View style={styles.navTextWrap}>
            <Text style={[styles.navDistance, { fontFamily: monoFont }]}>
              {remainingKm.toFixed(1)} km
            </Text>
            <Text style={[styles.navLabel, { fontFamily: bodyFont }]}>to Lost Penguin</Text>
          </View>
          <View style={styles.liveDot} />
        </BlurView>

        <Pressable onPress={onSignOut} style={styles.signOutPill}>
          <BlurView intensity={50} tint="light" style={styles.signOutInner}>
            <Text style={[styles.signOutLabel, { fontFamily: bodyFont }]}>Log out</Text>
          </BlurView>
        </Pressable>
      </View>

      {/* Bottom floating HUD */}
      <View style={styles.bottomWrap} pointerEvents="box-none">
        {/* Headline ticker */}
        <BlurView intensity={50} tint="light" style={styles.ticker}>
          <View style={styles.liveTag}>
            <Text style={styles.liveTagText}>LIVE</Text>
          </View>
          <Text style={[styles.tickerText, { fontFamily: bodyFont }]} numberOfLines={1}>
            {headline}
          </Text>
        </BlurView>

        {/* Stats card */}
        <BlurView intensity={70} tint="light" style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { fontFamily: monoFont }]}>
                {steps.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { fontFamily: bodyFont }]}>steps</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <Text style={[styles.statValue, { fontFamily: monoFont }]}>
                {distanceKm.toFixed(2)}
              </Text>
              <Text style={[styles.statLabel, { fontFamily: bodyFont }]}>km</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <Text style={[styles.statValue, { fontFamily: monoFont }]}>
                {stepsPerMinute}
              </Text>
              <Text style={[styles.statLabel, { fontFamily: bodyFont }]}>steps/min</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(2, progressPercent)}%` }]} />
            </View>
            <Text style={[styles.progressLabel, { fontFamily: bodyFont }]}>
              {progressPercent.toFixed(1)}% rescued
            </Text>
          </View>

          {/* Actions row */}
          <View style={styles.actionsRow}>
            {isMoving ? (
              <View style={styles.movingPill}>
                <View style={styles.movingDot} />
                <Text style={[styles.movingText, { fontFamily: bodyFont }]}>Walking</Text>
              </View>
            ) : (
              <View style={[styles.movingPill, styles.stoppedPill]}>
                <Text style={[styles.movingText, styles.stoppedText, { fontFamily: bodyFont }]}>
                  Waiting for steps
                </Text>
              </View>
            )}

            {vehicle !== 'none' && (
              <View style={styles.vehiclePill}>
                <Text style={[styles.vehicleText, { fontFamily: bodyFont }]}>
                  {vehicle === 'snowmobile' ? '🛷 1.8x' : '🚁 3.2x'}
                </Text>
              </View>
            )}

            <View style={{ flex: 1 }} />

            <Pressable style={styles.boostBtn} onPress={onOpenVehicleMenu}>
              <Text style={[styles.boostBtnLabel, { fontFamily: bodyFont }]}>Boost</Text>
            </Pressable>

            {pedometerAvailable === false && (
              <Pressable style={styles.demoBtn} onPress={onDemoStep}>
                <Text style={[styles.demoBtnLabel, { fontFamily: bodyFont }]}>+20 steps</Text>
              </Pressable>
            )}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  navPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: Platform.OS === 'android' ? colors.glassHeavy : 'transparent',
  },
  navEmoji: {
    fontSize: 22,
    marginRight: spacing.sm,
  },
  navTextWrap: {
    flex: 1,
  },
  navDistance: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  navLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4cd9a0',
    shadowColor: '#4cd9a0',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  signOutPill: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  signOutInner: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: Platform.OS === 'android' ? colors.glass : 'transparent',
  },
  signOutLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  bottomWrap: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },

  ticker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 11,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: Platform.OS === 'android' ? colors.glass : 'transparent',
  },
  liveTag: {
    backgroundColor: colors.alert,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginRight: 10,
  },
  liveTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  tickerText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },

  statsCard: {
    borderRadius: radii.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: Platform.OS === 'android' ? colors.glassHeavy : 'transparent',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -1,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },

  progressWrap: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  progressLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'right',
  },

  actionsRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  movingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 217, 160, 0.18)',
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  stoppedPill: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  movingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  movingText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  stoppedText: {
    color: colors.textSecondary,
  },
  vehiclePill: {
    backgroundColor: 'rgba(255, 184, 77, 0.18)',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  vehicleText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accentDark,
  },
  boostBtn: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: colors.accentDark,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  boostBtnLabel: {
    color: '#4a2800',
    fontSize: 14,
    fontWeight: '800',
  },
  demoBtn: {
    backgroundColor: colors.glass,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  demoBtnLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
});
