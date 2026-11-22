import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Body, resultStyles, ResultsLayout, Section, StepList } from '@/results/components';
import { URGENCY } from '@/results/urgency';
import { useIntake } from '@/intake/state';
import { colors } from '@/theme';

const SEEK_CARE = [
  'Difficulty breathing or chest pain',
  'A high fever that won’t come down',
  'Symptoms that get worse instead of better',
  'A sudden, severe headache',
];

// 4.6 Post-Diagnosis. Ported from the team's PostDiagnosisScreen: a checklist of next
// steps for this result (kept in memory) and when to seek care. Their follow-up
// reminder was left out, since the app saves nothing and can't schedule reminders.
export default function Feedback() {
  const { result } = useIntake();
  const steps = result ? URGENCY[result.urgency].steps : URGENCY.self_care.steps;
  const [done, setDone] = useState<string[]>([]);
  const [helpful, setHelpful] = useState<boolean | null>(null);

  function toggle(step: string) {
    setDone((prev) => (prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]));
  }

  return (
    <ResultsLayout footer={<Button label="Done — back to home" onPress={() => router.replace('/home')} />}>
      <View style={styles.heading}>
        <Text style={resultStyles.title}>What to do next</Text>
        {result && <Text style={resultStyles.subtitle}>{URGENCY[result.urgency].headline}</Text>}
      </View>

      <Section title="Your checklist">
        {steps.map((step) => (
          <Checkbox
            key={step}
            label={step}
            checked={done.includes(step)}
            onPress={() => toggle(step)}
            labelStyle={done.includes(step) && styles.done}
          />
        ))}
      </Section>

      <Section title="Get care right away if you have" tone="warning">
        <StepList items={SEEK_CARE} bullets />
        <Button label="Emergency help" variant="neutral" icon="alert" onPress={() => router.push('/results/emergency')} />
      </Section>

      <Section title="Was this check helpful?">
        <View style={styles.helpfulRow}>
          <Button label="Yes" variant={helpful === true ? 'primary' : 'neutral'} onPress={() => setHelpful(true)} style={styles.half} />
          <Button label="No" variant={helpful === false ? 'primary' : 'neutral'} onPress={() => setHelpful(false)} style={styles.half} />
        </View>
        {helpful !== null && <Body>Thanks for letting us know.</Body>}
      </Section>
    </ResultsLayout>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 6 },
  done: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  helpfulRow: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
});
