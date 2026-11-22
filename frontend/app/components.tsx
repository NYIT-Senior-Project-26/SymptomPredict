import { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { DiagnosisCard } from '@/components/DiagnosisCard';
import { HeaderBack } from '@/components/HeaderBack';
import { Logo } from '@/components/Logo';
import { Stepper } from '@/components/Stepper';
import { TriageBadge } from '@/components/TriageBadge';
import { colors, fonts, palette } from '@/theme';

// Development gallery mirroring the "🧩 DiagnosisCloud components" frame in Figma.
export default function ComponentGallery() {
  const [selected, setSelected] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Section title="Colors">
        <View style={styles.swatches}>
          {Object.entries(colors).map(([name, value]) => (
            <Swatch key={name} name={name} value={value} />
          ))}
        </View>
        {Object.entries(palette).map(([ramp, steps]) => (
          <View key={ramp} style={styles.ramp}>
            {Object.values(steps).map((value) => (
              <View key={value} style={[styles.rampStep, { backgroundColor: value }]} />
            ))}
          </View>
        ))}
      </Section>

      <Section title="Type · Inter">
        <Text style={{ fontFamily: fonts.regular, fontSize: 16 }}>Regular 400</Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 16 }}>Medium 500</Text>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 16 }}>SemiBold 600</Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 16 }}>Bold 700</Text>
      </Section>

      <Section title="Logo">
        <Logo size="welcome" />
        <Logo size="home" />
        <Logo size="header" />
      </Section>

      <Section title="Header/Back">
        <View style={styles.framed}>
          <HeaderBack title="Title" onBack={() => {}} />
        </View>
      </Section>

      <Section title="Button">
        <Button label="Get started" />
        <Button label="Check my symptoms" variant="hero" icon="activity" />
      </Section>

      <Section title="Stepper">
        <Stepper step={1} />
        <Stepper step={2} />
        <Stepper step={3} />
      </Section>

      <Section title="Chip">
        <View style={styles.row}>
          <Chip label="Label" selected={selected} onPress={() => setSelected(!selected)} />
          <Chip label="Label" selected={!selected} onPress={() => setSelected(!selected)} />
        </View>
      </Section>

      <Section title="Triage Badge">
        <TriageBadge level="self-care" />
        <TriageBadge level="appointment" />
        <TriageBadge level="emergency" />
      </Section>

      <Section title="Card/Diagnosis">
        <DiagnosisCard
          rank={1}
          name="Condition name"
          likelihood="High"
          description="Short plain-language description of the condition."
        />
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <View style={styles.swatch}>
      <View style={[styles.swatchColor, { backgroundColor: value }]} />
      <Text style={styles.swatchText}>{name}</Text>
      <Text style={styles.swatchText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 32 },
  section: { gap: 12 },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary, textTransform: 'uppercase' },
  row: { flexDirection: 'row', gap: 12 },
  framed: { borderWidth: 1, borderColor: colors.borderDefault, borderRadius: 8, overflow: 'hidden' },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatch: { width: 100, gap: 2 },
  swatchColor: { height: 40, borderRadius: 8, borderWidth: 1, borderColor: colors.borderDefault },
  swatchText: { fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary },
  ramp: { flexDirection: 'row', borderRadius: 8, overflow: 'hidden' },
  rampStep: { flex: 1, height: 28 },
});
