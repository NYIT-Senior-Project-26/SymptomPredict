import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { card, colors, fonts } from '@/theme';
import { Icon } from './Icon';

interface Props {
  rank: number;
  name: string;
  /**
   * How likely, as words (e.g. "High"). Figma shows a match bar and percentage here;
   * the team chose likelihood levels instead (see PROGRESS.md, Open questions).
   */
  likelihood: string;
  description: string;
  /** "Diagnosis card · expanded" in Figma: highlighted, with `children` below. */
  expanded?: boolean;
  /** Tapping the header row expands or collapses the card. */
  onToggle?: () => void;
  children?: ReactNode;
}

/** "Card/Diagnosis" in Figma: one ranked possible condition. */
export function DiagnosisCard({ rank, name, likelihood, description, expanded, onToggle, children }: Props) {
  return (
    <View style={[styles.card, expanded && styles.cardExpanded]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: !!expanded }}
        accessibilityLabel={`${rank}. ${name}, ${likelihood} likelihood`}
        onPress={onToggle}
        style={styles.header}
      >
        <View style={styles.row}>
          <View style={[styles.rank, expanded && styles.rankExpanded]}>
            <Text style={[styles.rankText, expanded && styles.rankTextExpanded]}>{rank}</Text>
          </View>
          <Text style={[styles.name, expanded && styles.nameExpanded]}>{name}</Text>
          <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
        </View>
        <View style={styles.row}>
          <Text style={styles.matchLabel}>Likelihood</Text>
          <Text style={styles.level}>{likelihood}</Text>
        </View>
      </Pressable>
      <Text style={expanded ? styles.descriptionExpanded : styles.description}>{description}</Text>
      {expanded && children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { ...card, gap: 10 },
  cardExpanded: { gap: 12, borderColor: colors.brandPrimary },
  header: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandPrimaryLight,
  },
  rankExpanded: { backgroundColor: colors.brandPrimary },
  rankText: { fontFamily: fonts.bold, fontSize: 13, color: colors.brandPrimary },
  rankTextExpanded: { color: colors.textOnPrimary },
  name: { flex: 1, fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary },
  nameExpanded: { fontFamily: fonts.bold, fontSize: 17 },
  matchLabel: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  level: { fontFamily: fonts.semibold, fontSize: 13, color: colors.brandPrimary },
  description: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.4, color: colors.textSecondary },
  descriptionExpanded: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 14 * 1.5, color: colors.textPrimary },
});
