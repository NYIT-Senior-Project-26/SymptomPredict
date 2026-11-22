import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Condition, PredictionResult } from '@/api/client';
import { Button } from '@/components/Button';
import { DiagnosisCard } from '@/components/DiagnosisCard';
import { Icon, IconName } from '@/components/Icon';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TriageBadge } from '@/components/TriageBadge';
import { useIntake } from '@/intake/state';
import { BulletList, NoResult, Pill, Section } from '@/results/components';
import { LIKELIHOOD, URGENCY } from '@/results/urgency';
import { card, colors, fonts } from '@/theme';

const DISCLAIMER =
  'DiagnosisCloud provides information, not a medical diagnosis. If symptoms get worse, seek care right away.';

// 3.1a–c Triage Result. One screen; the badge, next step and "watch for" box follow the
// urgency (3.1a appointment, 3.1b self-care, 3.1c emergency).
export default function TriageResult() {
  const { result } = useIntake();
  const [expanded, setExpanded] = useState(0);
  if (!result) return <NoResult />;

  const urgency = URGENCY[result.urgency];
  const nextStep = () => router.push(urgency.nextStep.href);

  return (
    <ScreenLayout contentStyle={styles.content}>
      <TriageBadge level={urgency.badge} />

      <View style={styles.nextStep}>
        <Text style={styles.eyebrow}>WHAT TO DO NEXT</Text>
        <Text style={styles.headline}>{result.next_step}</Text>
        <Text style={styles.advice}>{result.advice}</Text>
        <Button label={urgency.nextStep.label} onPress={nextStep} />
      </View>

      {result.urgency === 'self_care' && result.warning_signs.length > 0 && (
        <View style={styles.watch}>
          <View style={styles.watchHeader}>
            <Icon name="eye" size={18} color={colors.triageYellow} />
            <Text style={styles.watchTitle}>See a doctor if you notice</Text>
          </View>
          <BulletList items={result.warning_signs} color={colors.triageYellow} />
        </View>
      )}

      <View style={styles.conditionsHeader}>
        <Text style={styles.sectionTitle}>Possible conditions</Text>
        <Link icon="info" label="How we rank" onPress={showHowWeRank} />
      </View>
      <Text style={styles.caption}>
        Ranked by how closely your symptoms match. Tap any condition for details. This is not a diagnosis.
      </Text>

      {result.conditions.map((c, i) => (
        <DiagnosisCard
          key={c.name}
          rank={i + 1}
          name={c.name}
          likelihood={LIKELIHOOD[c.likelihood].short}
          description={c.description}
          expanded={expanded === i}
          onToggle={() => setExpanded(expanded === i ? -1 : i)}
        >
          <ExpandedDetails condition={c} />
        </DiagnosisCard>
      ))}

      <View style={styles.actions}>
        <Button label={urgency.nextStep.label} onPress={nextStep} />
        <Button label="Export PDF for my doctor" variant="neutral" onPress={() => router.push('/export')} />
      </View>
      <Text style={styles.disclaimer}>{DISCLAIMER}</Text>
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => (result.urgency === 'emergency' ? router.replace('/home') : router.push('/feedback'))}
      >
        <Text style={styles.done}>Done</Text>
      </Pressable>

      {__DEV__ && <ModelRanking result={result} />}
    </ScreenLayout>
  );
}

function ExpandedDetails({ condition }: { condition: Condition }) {
  return (
    <>
      {condition.matching_symptoms.length > 0 && (
        <>
          <Text style={styles.matchingTitle}>Matching symptoms</Text>
          <View style={styles.pills}>
            {condition.matching_symptoms.map((s) => (
              <Pill key={s} label={s} tone="green" check />
            ))}
          </View>
        </>
      )}
      <View style={styles.why}>
        <Text style={styles.whyTitle}>Why this match</Text>
        <Text style={styles.whyText}>{condition.rationale}</Text>
      </View>
      <Link
        icon="chevron-right"
        label="Condition details"
        onPress={() => router.push({ pathname: '/results/condition/[name]', params: { name: condition.name } })}
      />
      <Link icon="message-16" label="Ask the diagnosis assistant" onPress={() => router.push('/chat/diagnosis')} />
    </>
  );
}

function Link({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8} style={styles.link}>
      <Icon name={icon} size={16} color={colors.brandPrimary} />
      <Text style={styles.linkText}>{label}</Text>
    </Pressable>
  );
}

function showHowWeRank() {
  Alert.alert(
    'How we rank',
    'A symptom model suggests conditions that fit what you reported, then an AI reviews all of your answers ' +
      'and health profile to rank them as high, medium or low likelihood. It is not a diagnosis.',
  );
}

/** The ML model's ranking that Claude was given. Development builds only; not in Figma. */
function ModelRanking({ result }: { result: PredictionResult }) {
  return (
    <Section title="Model ranking (development only)">
      <Text style={styles.small}>
        Symptoms used: {result.model_symptoms.length > 0 ? result.model_symptoms.join(', ') : 'none matched the model'}
      </Text>
      {result.unmatched_symptoms.length > 0 && (
        <Text style={styles.small}>Not in the model: {result.unmatched_symptoms.join(', ')}</Text>
      )}
      {result.model_candidates.map((c) => (
        <Text key={c.name} style={styles.small}>
          {c.name} · {c.match_score}%
        </Text>
      ))}
    </Section>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 12, paddingHorizontal: 24, paddingBottom: 24, gap: 16 },
  nextStep: { ...card, gap: 8 },
  eyebrow: { fontFamily: fonts.semibold, fontSize: 11, color: colors.textSecondary },
  headline: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 18 * 1.3, color: colors.textPrimary },
  advice: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 14 * 1.5, color: colors.textSecondary },
  watch: { gap: 8, padding: 16, borderRadius: 12, backgroundColor: colors.triageYellowBg },
  watchHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  watchTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.textPrimary },
  conditionsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.textPrimary },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.45, color: colors.textSecondary },
  matchingTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textPrimary },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  why: { gap: 6, padding: 12, borderRadius: 10, backgroundColor: colors.bgCanvas },
  whyTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textPrimary },
  whyText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.45, color: colors.textSecondary },
  link: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6 },
  linkText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.brandPrimary },
  actions: { gap: 10 },
  disclaimer: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 12 * 1.45,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  done: { fontFamily: fonts.semibold, fontSize: 14, color: colors.brandPrimary, textAlign: 'center' },
  small: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.textSecondary },
});
