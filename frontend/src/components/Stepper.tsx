import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

const STAGE_LABELS = ['Describe', 'Details', 'Review'];

interface Props {
  /** 1-based intake stage. */
  step: number;
  labels?: string[];
}

export function Stepper({ step, labels = STAGE_LABELS }: Props) {
  const total = labels.length;
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: step }}
    >
      <View style={styles.row}>
        <Text style={styles.count}>
          Step {step} of {total}
        </Text>
        <Text style={styles.label}>{labels[step - 1]}</Text>
      </View>
      <View style={styles.bars}>
        {labels.map((label, i) => (
          <View
            key={label}
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
  count: { fontFamily: fonts.semibold, fontSize: 12, color: colors.brandPrimary },
  label: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  bars: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 6, borderRadius: 3 },
});
