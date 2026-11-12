import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { CheckboxRow, Eyebrow, IntakeFooter, IntakeLayout, Subtitle, Title, useIntakeNext } from '@/components/intake';
import { getFollowUps, HIGH_RISK_OPTIONS, HighRiskId, questionNumbers } from '@/intake/content';
import { useIntake } from '@/state/intake';
import { colors, fonts } from '@/theme';

// 2.6 Intake · Stage 2 High-risk check
export default function HighRisk() {
  const { answers, update } = useIntake();
  const { next } = useIntakeNext();
  const numbers = questionNumbers(getFollowUps(answers).length);
  const selected = answers.highRisk ?? [];

  function toggle(id: HighRiskId) {
    update({ highRisk: selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id] });
  }

  return (
    <IntakeLayout
      step={2}
      gap={14}
      footer={
        <IntakeFooter
          label="Next"
          disabled={answers.highRisk === null}
          onPrevious={() => router.back()}
          onPress={() => next('/intake/summary')}
        />
      }
    >
      <Eyebrow>
        Question {numbers.highRisk} of ~{numbers.total}
      </Eyebrow>
      <Title>A few safety questions</Title>
      <Subtitle>Some groups need care sooner. Select any that apply to you.</Subtitle>

      {HIGH_RISK_OPTIONS.map((o) => (
        <CheckboxRow key={o.id} label={o.label} selected={selected.includes(o.id)} onPress={() => toggle(o.id)} />
      ))}
      {/* An empty list means the person chose "None of these apply". */}
      <CheckboxRow
        label="None of these apply"
        selected={answers.highRisk?.length === 0}
        onPress={() => update({ highRisk: answers.highRisk?.length === 0 ? null : [] })}
      />

      <View style={styles.warning}>
        <View style={styles.warningRow}>
          <Icon name="alert-18" size={18} />
          <Text style={styles.warningText}>
            Call 911 now if you have trouble breathing, chest pain, fainting or sudden confusion.
          </Text>
        </View>
        <Pressable accessibilityRole="link" onPress={() => router.push('/results/emergency')} hitSlop={8}>
          <Text style={styles.warningLink}>I have one of these</Text>
        </Pressable>
      </View>
    </IntakeLayout>
  );
}

const styles = StyleSheet.create({
  warning: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.triageRed,
    backgroundColor: colors.triageRedBg,
  },
  warningRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  warningText: { flex: 1, fontFamily: fonts.medium, fontSize: 13, lineHeight: 13 * 1.45, color: colors.textPrimary },
  warningLink: { fontFamily: fonts.semibold, fontSize: 14, color: colors.triageRed },
});
