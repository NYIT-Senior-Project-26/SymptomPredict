import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip } from '@/components/Chip';
import {
  InlineQuestion,
  IntakeFooter,
  IntakeLayout,
  SectionLabel,
  Subtitle,
  Title,
  useIntakeNext,
} from '@/components/intake';
import {
  afterStageOne,
  answerValues,
  BODY_AREAS,
  BodySide,
  Box,
  getBodyArea,
  getBodyMapQuestions,
} from '@/intake/content';
import { useIntake } from '@/state/intake';
import { colors, fonts } from '@/theme';

const SIDES: { id: BodySide; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
];

// 2.3 Intake · Stage 1 Body map. Once an area is picked, its follow-up questions (and
// "Do you have a fever?") are listed at the bottom instead of on separate 2.4 screens.
export default function BodyMap() {
  const { answers, update, toggleSymptom } = useIntake();
  const { next } = useIntakeNext();
  const [side, setSide] = useState<BodySide>('front');
  const area = getBodyArea(answers.bodyArea);
  const questions = getBodyMapQuestions(answers);
  const unanswered = questions.filter((q) => answerValues(answers.followUps[q.id]).length === 0).length;
  const described = answers.complaint.trim().length > 0 || answers.symptoms.length > 0;
  const canContinue = (described || area !== null) && unanswered === 0;

  return (
    <IntakeLayout
      step={1}
      gap={16}
      footer={
        <IntakeFooter label="Continue" disabled={!canContinue} onPress={() => next(afterStageOne(answers))} />
      }
    >
      <Title>Where does it hurt?</Title>
      <Subtitle>Tap an area on the body. Toggle to see the back.</Subtitle>

      <View style={styles.toggle} accessibilityRole="tablist">
        {SIDES.map((s) => {
          const active = s.id === side;
          return (
            <Pressable
              key={s.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setSide(s.id)}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <Text style={active ? styles.segmentTextActive : styles.segmentText}>{s.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.mapCard}>
        <View style={styles.figure}>
          <Image source={require('../../assets/images/body-figure.png')} style={StyleSheet.absoluteFill} />
          {/* The image shows both figures; dim the one that isn't active. */}
          <View pointerEvents="none" style={[styles.dim, side === 'front' ? styles.dimRight : styles.dimLeft]} />
          {BODY_AREAS.flatMap((a) =>
            (a.boxes[side] ?? []).map((box, i) => (
              <Pressable
                key={`${a.id}-${i}`}
                accessibilityRole="button"
                accessibilityLabel={a.label}
                accessibilityState={{ selected: a.id === answers.bodyArea }}
                onPress={() => update({ bodyArea: a.id })}
                style={[styles.region, toPercent(box), a.id === answers.bodyArea && styles.regionSelected]}
              />
            )),
          )}
        </View>
      </View>

      <View style={styles.selectedRow}>
        <Text style={styles.selectedLabel}>Selected area:</Text>
        {area ? (
          <View style={styles.pill}>
            <Text style={styles.pillText}>{area.label}</Text>
          </View>
        ) : (
          <Text style={styles.selectedLabel}>none yet</Text>
        )}
      </View>

      {area && (
        <>
          <SectionLabel>{area.label} symptoms</SectionLabel>
          <View style={styles.chips}>
            {area.symptoms.map((s) => (
              <Chip key={s} label={s} selected={answers.symptoms.includes(s)} onPress={() => toggleSymptom(s)} />
            ))}
          </View>
        </>
      )}

      {questions.length > 0 && (
        <>
          <SectionLabel>A few questions about your {area?.label.toLowerCase()}</SectionLabel>
          {questions.map((q, i) => (
            <InlineQuestion key={q.id} question={q} number={i + 1} />
          ))}
          {unanswered > 0 && (
            <Text style={styles.remaining}>
              Answer {unanswered === 1 ? 'the last question' : `${unanswered} more questions`} to continue.
            </Text>
          )}
        </>
      )}
    </IntakeLayout>
  );
}

function toPercent(box: Box) {
  return {
    left: `${box.x * 100}%`,
    top: `${box.y * 100}%`,
    width: `${box.w * 100}%`,
    height: `${box.h * 100}%`,
  } as const;
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', padding: 4, borderRadius: 10, backgroundColor: colors.borderDefault },
  segment: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  segmentActive: { backgroundColor: colors.bgSurface },
  segmentText: { fontFamily: fonts.medium, fontSize: 14, color: colors.textSecondary },
  segmentTextActive: { fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary },
  mapCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  figure: { width: '100%', maxWidth: 300, aspectRatio: 1 },
  dim: { position: 'absolute', top: 0, bottom: 0, width: '50%', backgroundColor: 'rgba(255,255,255,0.6)' },
  dimLeft: { left: 0 },
  dimRight: { right: 0 },
  region: { position: 'absolute', borderRadius: 8 },
  regionSelected: { backgroundColor: 'rgba(57,107,118,0.2)' }, // brandPrimary at 20%
  selectedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectedLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: colors.triageGreenBg },
  pillText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.triageGreen },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  remaining: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
});
