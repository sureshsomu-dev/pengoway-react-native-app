import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, gradients, radii, spacing, typography } from '../theme/tokens';

type LoginScreenProps = {
  onLogin: (name: string) => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [travelerName, setTravelerName] = useState('Explorer');
  const displayFont = Platform.select(typography.display) ?? typography.display.default;
  const bodyFont = Platform.select(typography.body) ?? typography.body.default;

  return (
    <LinearGradient colors={gradients.app} style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          {/* Hero area */}
          <View style={styles.hero}>
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>🐧</Text>
              <Text style={[styles.badgeText, { fontFamily: bodyFont }]}>RESCUE MISSION</Text>
            </View>

            <Text style={[styles.headline, { fontFamily: displayFont }]}>
              Walk the ice.{'\n'}Find the penguin.
            </Text>

            <Text style={[styles.subhead, { fontFamily: bodyFont }]}>
              Every step you take moves you closer through a living Antarctic world. Walk more, rescue faster.
            </Text>

            {/* Stats preview */}
            <View style={styles.previewRow}>
              <View style={styles.previewCard}>
                <Text style={[styles.previewValue, { fontFamily: displayFont }]}>10km</Text>
                <Text style={[styles.previewLabel, { fontFamily: bodyFont }]}>Rescue distance</Text>
              </View>
              <View style={styles.previewCard}>
                <Text style={[styles.previewValue, { fontFamily: displayFont }]}>3D</Text>
                <Text style={[styles.previewLabel, { fontFamily: bodyFont }]}>Live world</Text>
              </View>
              <View style={styles.previewCard}>
                <Text style={[styles.previewValue, { fontFamily: displayFont }]}>∞</Text>
                <Text style={[styles.previewLabel, { fontFamily: bodyFont }]}>Adventure</Text>
              </View>
            </View>
          </View>

          {/* Login card */}
          <BlurView intensity={40} tint="light" style={styles.card}>
            <Text style={[styles.label, { fontFamily: bodyFont }]}>Traveler name</Text>
            <TextInput
              autoCapitalize="words"
              onChangeText={setTravelerName}
              placeholder="Explorer"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { fontFamily: bodyFont }]}
              value={travelerName}
            />
            <Pressable
              onPress={() => onLogin(travelerName.trim() || 'Explorer')}
              style={styles.cta}
            >
              <LinearGradient colors={gradients.cta} style={styles.ctaGradient}>
                <Text style={[styles.ctaLabel, { fontFamily: bodyFont }]}>Begin Rescue</Text>
              </LinearGradient>
            </Pressable>
            <Text style={[styles.disclaimer, { fontFamily: bodyFont }]}>
              Payments are simulated in this MVP. No real transaction occurs.
            </Text>
          </BlurView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  flex: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },

  hero: {
    marginTop: spacing.xxl,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  badgeEmoji: {
    fontSize: 16,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  headline: {
    marginTop: spacing.xl,
    color: colors.textPrimary,
    fontSize: 42,
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  subhead: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 340,
  },

  previewRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  previewCard: {
    flex: 1,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
  },
  previewValue: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  previewLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  card: {
    borderRadius: radii.xl,
    padding: spacing.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: Platform.OS === 'android' ? colors.glassHeavy : 'transparent',
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    marginTop: spacing.sm,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  cta: {
    marginTop: spacing.lg,
    borderRadius: radii.lg,
    overflow: 'hidden',
    shadowColor: colors.accentDark,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  ctaGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: radii.lg,
  },
  ctaLabel: {
    color: '#4a2800',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  disclaimer: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    opacity: 0.7,
  },
});
