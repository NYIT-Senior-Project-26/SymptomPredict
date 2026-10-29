import { Href, Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PlaceholderLink, ScreenPlaceholder } from '@/components/ScreenPlaceholder';
import { TriageBadge, TriageLevel } from '@/components/TriageBadge';
import { PredictionResult } from '@/api/client';
import { useIntake } from '@/state/intake';
import { colors, fonts } from '@/theme';

type Urgency = PredictionResult['urgency'];

const TRIAGE_LEVEL: Record<Urgency, TriageLevel> = {
  self_care: 'self-care',
  see_doctor: 'appointment',
  urgent_care: 'appointment',
  emergency: 'emergency',
};

// Figma has one triage frame per urgency: 3.1a (moderate), 3.1b (mild), 3.1c (severe).
const FRAME: Record<Urgency, string> = {
  self_care: '3.1b Triage Result · Self-care (Mild)',
  see_doctor: '3.1a Triage Result · Book appointment (Moderate)',
  urgent_care: '3.1a Triage Result · Book appointment (Moderate)',
  emergency: '3.1c Triage Result · Emergency (Severe)',
};

const NEXT_STEP: Record<Urgency, PlaceholderLink> = {
  self_care: { label: 'Pharmacy & OTC options', href: '/results/pharmacy' },
  see_doctor: { label: 'Find a provider', href: '/results/providers' },
  urgent_care: { label: 'Find urgent care', href: '/results/providers' },
  emergency: { label: 'Get help now', href: '/results/emergency' },
};

export default function TriageResult() {
  const { result } = useIntake();

  if (!result) {
    return (
      <ScreenPlaceholder
        frame="3.1 Triage Result"
        title="No result yet"
        links={[{ label: 'Back to home', href: '/home', replace: true }]}
      />
    );
  }

  return (
    <ScreenPlaceholder
      frame={FRAME[result.urgency]}
      title="Your result"
      links={[
        NEXT_STEP[result.urgency],
        { label: 'Export & share', href: '/export' },
        { label: 'Done', href: '/feedback', replace: true },
      ]}
    >
      <TriageBadge level={TRIAGE_LEVEL[result.urgency]} />
      <Text style={styles.label}>Suggested specialty: {result.recommended_specialty}</Text>
      {result.conditions.map((c) => (
        <View key={c.name} style={styles.condition}>
          <Text style={styles.conditionName}>
            {c.name} · {c.likelihood}
          </Text>
          <Text style={styles.body}>{c.rationale}</Text>
          <ConditionLink name={c.name} />
        </View>
      ))}
      <Text style={styles.advice}>{result.advice}</Text>
      <Text style={styles.disclaimer}>{result.disclaimer}</Text>
    </ScreenPlaceholder>
  );
}

function ConditionLink({ name }: { name: string }) {
  const href: Href = { pathname: '/results/condition/[name]', params: { name } };
  return (
    <Link href={href} style={styles.link}>
      Learn more
    </Link>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary },
  condition: { gap: 2, borderWidth: 1, borderColor: colors.borderDefault, borderRadius: 14, padding: 16 },
  conditionName: { fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary },
  body: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  link: { fontFamily: fonts.medium, color: colors.brandPrimary, marginTop: 4 },
  advice: { fontFamily: fonts.regular, fontStyle: 'italic', color: colors.textPrimary },
  disclaimer: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
});
