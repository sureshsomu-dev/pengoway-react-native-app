import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { vehicleCatalog } from '../data/narrative';
import { VehicleType } from '../hooks/useJourneyController';
import { colors, gradients, radii, spacing, typography } from '../theme/tokens';

type VehicleSupportModalProps = {
  onClose: () => void;
  onSelectVehicle: (vehicle: VehicleType) => void;
  visible: boolean;
};

export function VehicleSupportModal({
  onClose,
  onSelectVehicle,
  visible,
}: VehicleSupportModalProps) {
  const displayFont = Platform.select(typography.display) ?? typography.display.default;
  const bodyFont = Platform.select(typography.body) ?? typography.body.default;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <BlurView intensity={50} tint="light" style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={[styles.title, { fontFamily: displayFont }]}>Boost your rescue</Text>
          <Text style={[styles.subtitle, { fontFamily: bodyFont }]}>
            Deploy support vehicles to multiply every step.
          </Text>

          <View style={styles.catalog}>
            {vehicleCatalog.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>
                    {item.id === 'snowmobile' ? '🛷' : '🚁'}
                  </Text>
                  <View style={styles.cardTitleWrap}>
                    <Text style={[styles.cardTitle, { fontFamily: displayFont }]}>
                      {item.title}
                    </Text>
                    <View style={styles.boostBadge}>
                      <Text style={[styles.boostBadgeText, { fontFamily: bodyFont }]}>
                        {item.boostLabel}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.cardDesc, { fontFamily: bodyFont }]}>{item.description}</Text>
                <Pressable
                  style={styles.buyBtn}
                  onPress={() => {
                    onSelectVehicle(item.id as VehicleType);
                    onClose();
                  }}
                >
                  <LinearGradient colors={gradients.cta} style={styles.buyBtnGradient}>
                    <Text style={[styles.buyBtnLabel, { fontFamily: bodyFont }]}>
                      Deploy {item.price}
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            ))}
          </View>

          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnLabel, { fontFamily: bodyFont }]}>Cancel</Text>
          </Pressable>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(180, 220, 240, 0.3)',
  },
  sheet: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderBottomWidth: 0,
    backgroundColor: Platform.OS === 'android' ? 'rgba(240, 250, 255, 0.95)' : 'transparent',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  catalog: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  card: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardTitleWrap: {
    flex: 1,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 20,
  },
  boostBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: 'rgba(255, 184, 77, 0.2)',
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  boostBadgeText: {
    color: colors.accentDark,
    fontSize: 12,
    fontWeight: '700',
  },
  cardDesc: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  buyBtn: {
    marginTop: spacing.md,
    borderRadius: radii.md,
    overflow: 'hidden',
    shadowColor: colors.accentDark,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buyBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  buyBtnLabel: {
    color: '#4a2800',
    fontSize: 15,
    fontWeight: '800',
  },
  closeBtn: {
    marginTop: spacing.lg,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  closeBtnLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});
