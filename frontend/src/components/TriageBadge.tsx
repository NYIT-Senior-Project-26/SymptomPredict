import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';
import { Icon, IconName } from './Icon';

export type TriageLevel = 'self-care' | 'appointment' | 'emergency';

const LEVELS: Record<TriageLevel, { title: string; icon: IconName; color: string; bg: string }> = {
  'self-care': { title: 'Self-care at home', icon: 'check', color: colors.triageGreen, bg: colors.triageGreenBg },
  appointment: { title: 'Book an appointment', icon: 'calendar', color: colors.triageYellow, bg: colors.triageYellowBg },
  emergency: { title: 'Seek emergency care', icon: 'alert', color: colors.triageRed, bg: colors.triageRedBg },
};

export function TriageBadge({ level }: { level: TriageLevel }) {
  const { title, icon, color, bg } = LEVELS[level];
  return (
    <View style={[styles.container, { backgroundColor: bg, borderColor: color }]} accessible>
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        <Icon name={icon} size={24} color={colors.textOnPrimary} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.eyebrow, { color }]}>TRIAGE LEVEL</Text>
        <Text style={[styles.title, { color }]}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 2 },
  eyebrow: { fontFamily: fonts.semibold, fontSize: 11 },
  title: { fontFamily: fonts.bold, fontSize: 20 },
});
