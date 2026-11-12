import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

const STAGE_LABELS = ['Describe', 'Details', 'Review'];

interface Props {
  /** 1-based step. */
  step: number;
  labels?: string[];
  /**
   * `intake`: "Step 1 of 3" on the left, step name on the right (Figma "Stepper").
   * `profile`: step name on the left, "1 of 5" on the right (profile setup, 1.3–1.7).
   */
  variant?: 'intake' | 'profile';
}

export function Stepper({ step, labels = STAGE_LABELS, variant = 'intake' }: Props) {
  const total = labels.length;
  const label = labels[step - 1];
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: step }}
    >
      {variant === 'intake' ? (
        <View style={styles.row}>
          <Text style={styles.emphasis}>
            Step {step} of {total}
          </Text>
          <Text style={styles.secondary}>{label}</Text>
        </View>
      ) : (
        <View style={styles.row}>
          <Text style={styles.emphasis}>{label}</Text>
          <Text style={styles.secondary}>
            {step} of {total}
          </Text>
        </View>
      )}
      <View style={styles.bars}>
        {labels.map((l, i) => (
          <View
            key={l}
            style={[styles.bar, { backgroundColor: i < step ? colors.brandPrimary : colors.borderDefault }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, alignSelf: 'stretch' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  emphasis: { fontFamily: fonts.semibold, fontSize: 12, color: colors.brandPrimary },
  secondary: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  bars: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 6, borderRadius: 3 },
});
