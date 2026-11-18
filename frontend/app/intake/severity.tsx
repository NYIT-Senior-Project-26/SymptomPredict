import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { Eyebrow, IntakeFooter, IntakeLayout, Title, useIntakeNext } from '@/components/intake';
import { DURATIONS, getFollowUps, questionNumbers, SEVERITIES, TRENDS } from '@/intake/content';
import { useIntake } from '@/state/intake';
import { colors, fonts } from '@/theme';

const KNOB = 26;

// 2.5 Intake · Stage 2 Severity & duration
export default function Severity() {
  const { answers, update } = useIntake();
  const { next } = useIntakeNext();
  const numbers = questionNumbers(getFollowUps(answers).length);

  const level = SEVERITIES.findIndex((s) => s.id === answers.severity);
  const percent = (level / (SEVERITIES.length - 1)) * 100;
  const setLevel = (i: number) => update({ severity: SEVERITIES[Math.min(Math.max(i, 0), SEVERITIES.length - 1)].id });

  return (
    <IntakeLayout
      step={2}
      gap={18}
      footer={
        <IntakeFooter
          label="Next"
          disabled={!answers.duration || !answers.trend}
          onPrevious={() => router.back()}
          onPress={() => next('/intake/high-risk')}
        />
      }
    >
      <Eyebrow>
        Question {numbers.severity} of ~{numbers.total}
      </Eyebrow>
      <Title>How severe are your symptoms?</Title>

      <View style={styles.sliderCard}>
        <View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Severity"
          accessibilityValue={{ text: SEVERITIES[level].label }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(e) => setLevel(level + (e.nativeEvent.actionName === 'increment' ? 1 : -1))}
          style={styles.track}
        >
          <View style={[styles.fill, { width: `${percent}%` }]} />
          <View pointerEvents="none" style={[styles.knob, { left: `${percent}%` }]}>
            <Icon name="slider-knob" size={KNOB} />
          </View>
          {/* Tap targets: one per level, covering the track and a margin around it. */}
          <View style={styles.hitAreas}>
            {SEVERITIES.map((s, i) => (
              <Pressable key={s.id} onPress={() => setLevel(i)} style={styles.hitArea} />
            ))}
          </View>
        </View>
        <View style={styles.labels}>
          {SEVERITIES.map((s, i) => (
            <Pressable key={s.id} onPress={() => setLevel(i)} hitSlop={8}>
              <Text style={i === level ? styles.levelActive : styles.level}>{s.label}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.description}>{SEVERITIES[level].description}</Text>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupLabel}>How long has this been going on?</Text>
        <View style={styles.chips}>
          {DURATIONS.map((d) => (
            <Chip key={d.id} label={d.label} selected={answers.duration === d.id} onPress={() => update({ duration: d.id })} />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupLabel}>Is it getting better or worse?</Text>
        <View style={styles.chips}>
          {TRENDS.map((t) => (
            <Chip key={t.id} label={t.label} selected={answers.trend === t.id} onPress={() => update({ trend: t.id })} />
          ))}
        </View>
      </View>
    </IntakeLayout>
  );
}

const styles = StyleSheet.create({
  sliderCard: {
    gap: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  track: { height: 8, marginTop: 9, borderRadius: 4, backgroundColor: colors.borderDefault },
  fill: { height: 8, borderRadius: 4, backgroundColor: colors.brandPrimary },
  knob: { position: 'absolute', top: -9, marginLeft: -KNOB / 2 },
  hitAreas: { position: 'absolute', left: -12, right: -12, top: -16, bottom: -16, flexDirection: 'row' },
  hitArea: { flex: 1 },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  level: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  levelActive: { fontFamily: fonts.bold, fontSize: 13, color: colors.brandPrimary },
  description: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  group: { gap: 10 },
  groupLabel: { fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
