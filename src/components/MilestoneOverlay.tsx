import { Platform, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, spacing, typography } from '../theme/tokens';

type MilestoneOverlayProps = {
  quote: string | null;
};

export function MilestoneOverlay({ quote }: MilestoneOverlayProps) {
  if (!quote) return null;

  const displayFont = Platform.select(typography.display) ?? typography.display.default;
  const bodyFont = Platform.select(typography.body) ?? typography.body.default;

  return (
    <View pointerEvents="none" style={styles.backdrop}>
      <View style={styles.scrim} />
      <BlurView intensity={30} tint="light" style={styles.cardOuter}>
        <LinearGradient
          colors={['rgba(255, 245, 200, 0.95)', 'rgba(220, 245, 255, 0.92)']}
          style={styles.card}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeEmoji}>🏔️</Text>
            <Text style={[styles.badgeLabel, { fontFamily: bodyFont }]}>1,000 STEPS</Text>
          </View>
          <Text style={[styles.quote, { fontFamily: displayFont }]}>{quote}</Text>
          <View style={styles.shimmer} />
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(200, 235, 255, 0.2)',
  },
  cardOuter: {
    width: '84%',
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#ffd46f',
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
    elevation: 10,
  },
  card: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  badgeEmoji: {
    fontSize: 14,
  },
  badgeLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  quote: {
    marginTop: spacing.lg,
    color: colors.textPrimary,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  shimmer: {
    marginTop: spacing.lg,
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
    opacity: 0.6,
  },
});
