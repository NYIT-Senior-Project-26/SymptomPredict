import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';
import { Icon } from './Icon';

interface Props {
  rank: number;
  name: string;
  /** How closely the symptoms match, from 0 to 1. */
  match: number;
  description: string;
  onPress?: () => void;
}

export function DiagnosisCard({ rank, name, match, description, onPress }: Props) {
  const percent = Math.round(Math.min(Math.max(match, 0), 1) * 100);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.rank}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Icon name="chevron-down" size={20} color={colors.textSecondary} />
      </View>
      <View style={styles.row}>
        <Text style={styles.matchLabel}>Match</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percent}%` }]} />
        </View>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandPrimaryLight,
  },
  rankText: { fontFamily: fonts.bold, fontSize: 13, color: colors.brandPrimary },
  name: { flex: 1, fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary },
  matchLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  track: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: colors.borderDefault },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.brandPrimary },
  percent: { fontFamily: fonts.semibold, fontSize: 13, color: colors.brandPrimary },
  description: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.4, color: colors.textSecondary },
});
