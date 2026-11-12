import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { AnswerOptions, IntakeFooter, IntakeLayout, useIntakeNext } from '@/components/intake';
import { answerValues, formatAnswer, getFollowUps, questionNumbers } from '@/intake/content';
import { useIntake } from '@/state/intake';
import { colors, fonts } from '@/theme';

// 2.4 Intake · Stage 2 Follow-up question. One screen per question: /intake/follow-up?q=<index>.
// The body-area questions (and fever) are asked on the body map instead; see getFollowUps.
export default function FollowUp() {
  const { answers } = useIntake();
  const { next } = useIntakeNext();
  const index = Number(useLocalSearchParams<{ q?: string }>().q ?? 0);

  const questions = getFollowUps(answers);
  const question = questions[index];
  const previous = questions[index - 1];
  const numbers = questionNumbers(questions.length);
  if (!question) return null;

  const answered = answerValues(answers.followUps[question.id]).length > 0;
  const isLast = index === questions.length - 1;

  return (
    <IntakeLayout
      step={2}
      gap={14}
      footer={
        <IntakeFooter
          label="Next"
          disabled={!answered}
          onPrevious={() => router.back()}
          onPress={() =>
            next(isLast ? '/intake/severity' : { pathname: '/intake/follow-up', params: { q: index + 1 } })
          }
        />
      }
    >
      {/* The previous question and answer, as a short chat transcript. */}
      {previous && formatAnswer(answers.followUps[previous.id]) !== '' && (
        <>
          <View style={[styles.bubble, styles.botBubble]}>
            <Text style={styles.botText}>{previous.question}</Text>
          </View>
          <View style={[styles.bubble, styles.userBubble]}>
            <Text style={styles.userText}>{formatAnswer(answers.followUps[previous.id])}</Text>
          </View>
        </>
      )}

      <View style={styles.questionCard}>
        <View style={styles.eyebrowRow}>
          <Icon name="thermometer" size={14} />
          <Text style={styles.eyebrow}>
            {question.topic} · Question {numbers.followUp(index)} of ~{numbers.total}
          </Text>
        </View>
        <Text style={styles.question} accessibilityRole="header">
          {question.question}
        </Text>
        {question.hint && <Text style={styles.hint}>{question.hint}</Text>}
      </View>

      <AnswerOptions question={question} gap={14} />
    </IntakeLayout>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: '85%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  botBubble: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.brandPrimary },
  botText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 14 * 1.45, color: colors.textPrimary },
  userText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 14 * 1.45, color: colors.textOnPrimary },
  questionCard: {
    gap: 10,
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  eyebrow: { fontFamily: fonts.semibold, fontSize: 11, color: colors.brandPrimary, textTransform: 'uppercase' },
  question: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, color: colors.textPrimary },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
});
