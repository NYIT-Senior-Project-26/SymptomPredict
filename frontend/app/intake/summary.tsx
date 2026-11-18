import { Href, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { IntakeFooter, IntakeLayout, Subtitle, Title } from '@/components/intake';
import {
  DURATIONS,
  formatAnswer,
  getAllFollowUps,
  getBodyArea,
  getBodyMapQuestions,
  getFollowUps,
  SEVERITIES,
  TRENDS,
} from '@/intake/content';
import { highRiskSummary } from '@/intake/request';
import { useIntake } from '@/state/intake';
import { hasHealthDetails, healthDetailsSummary, useProfile } from '@/state/profile';
import { colors, fonts } from '@/theme';

interface Row {
  label: string;
  value: string;
  /** The step to reopen for editing; it returns here when done. */
  edit: Href;
}

// 2.7 Intake · Stage 3 Confirmation summary
export default function Summary() {
  const { answers } = useIntake();
  const { profile } = useProfile();
  const edit = (pathname: string, params: Record<string, string> = {}): Href =>
    ({ pathname, params: { ...params, edit: '1' } }) as Href;

  const rows: Row[] = [];
  if (answers.complaint.trim()) {
    rows.push({ label: 'Chief complaint', value: answers.complaint.trim(), edit: edit('/intake') });
  }
  if (answers.symptoms.length > 0) {
    rows.push({ label: 'Symptoms', value: answers.symptoms.join(', '), edit: edit('/intake') });
  }
  const area = getBodyArea(answers.bodyArea);
  if (area) rows.push({ label: 'Body area', value: area.label, edit: edit('/intake/body-map') });
  // A changed answer can reveal a new conditional question, which shows as "Not answered" here.
  // Body-map questions are edited on the body map; the rest on their own 2.4 screen.
  const onBodyMap = new Set(getBodyMapQuestions(answers).map((q) => q.id));
  const onScreens = getFollowUps(answers).map((q) => q.id);
  getAllFollowUps(answers).forEach((q) => {
    rows.push({
      label: q.summaryLabel,
      value: formatAnswer(answers.followUps[q.id]) || 'Not answered',
      edit: onBodyMap.has(q.id)
        ? edit('/intake/body-map')
        : edit('/intake/follow-up', { q: String(onScreens.indexOf(q.id)) }),
    });
  });
  rows.push({
    label: 'Severity',
    value: SEVERITIES.find((s) => s.id === answers.severity)?.label ?? '',
    edit: edit('/intake/severity'),
  });
  const duration = DURATIONS.find((d) => d.id === answers.duration);
  const trend = TRENDS.find((t) => t.id === answers.trend);
  rows.push({
    label: 'Duration',
    value: [duration?.label, trend?.summary].filter(Boolean).join(' · ') || 'Not answered',
    edit: edit('/intake/severity'),
  });
  rows.push({ label: 'High-risk group', value: highRiskSummary(answers.highRisk), edit: edit('/intake/high-risk') });

  return (
    <IntakeLayout
      step={3}
      gap={16}
      footer={<IntakeFooter label="Analyze my symptoms" onPress={() => router.push('/intake/analyzing')} />}
    >
      <Title>Review your answers</Title>
      <Subtitle>Tap any item to edit before we analyze.</Subtitle>

      <View style={styles.card}>
        {rows.map((row, i) => (
          <Pressable
            key={`${i}-${row.label}`}
            accessibilityRole="button"
            accessibilityHint="Edit this answer"
            onPress={() => router.push(row.edit)}
            style={[styles.row, i < rows.length - 1 && styles.rowDivider]}
          >
            <View style={styles.rowText}>
              <Text style={styles.label}>{row.label}</Text>
              <Text style={styles.value}>{row.value}</Text>
            </View>
            <Icon name="edit" size={16} />
          </Pressable>
        ))}
      </View>

      {hasHealthDetails(profile) && (
        <View style={styles.profileBox}>
          <Icon name="user-18" size={18} />
          <Text style={styles.profileText}>Also using your profile: {healthDetailsSummary(profile)}</Text>
        </View>
      )}
    </IntakeLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.borderDefault },
  rowText: { flex: 1, gap: 2 },
  label: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  value: { fontFamily: fonts.medium, fontSize: 15, color: colors.textPrimary },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.brandPrimaryLight,
  },
  profileText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.45, color: colors.textPrimary },
});
