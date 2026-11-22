import { Href, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { Icon, IconName } from '@/components/Icon';
import { IntakeFooter, IntakeLayout, SectionLabel, Subtitle, Title, useIntakeNext } from '@/intake/components';
import { afterStageOne, COMMON_SYMPTOMS } from '@/intake/content';
import { useIntake } from '@/intake/state';
import { card, colors, fonts } from '@/theme';

const MAX_LENGTH = 500;

// 2.2 Intake · Stage 1 Chief complaint
export default function ChiefComplaint() {
  const { answers, update, toggleSymptom } = useIntake();
  const { next } = useIntakeNext();
  const [focused, setFocused] = useState(false);
  const canContinue = answers.complaint.trim().length > 0 || answers.symptoms.length > 0;

  return (
    <IntakeLayout
      step={1}
      gap={16}
      footer={<IntakeFooter label="Continue" disabled={!canContinue} onPress={() => next(afterStageOne(answers))} />}
    >
      <Title>What's bothering you today?</Title>
      <Subtitle>Describe it in your own words — like you'd tell a doctor.</Subtitle>

      <View style={[styles.inputCard, focused && styles.inputCardFocused]}>
        <TextInput
          style={styles.input}
          value={answers.complaint}
          onChangeText={(complaint) => update({ complaint })}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="e.g. I've had a sore throat and fever since yesterday, and it hurts to swallow."
          placeholderTextColor={colors.textSecondary}
          maxLength={MAX_LENGTH}
          multiline
          accessibilityLabel="Describe your symptoms"
        />
        <View style={styles.inputFooter}>
          <Text style={styles.counter}>
            {answers.complaint.length} / {MAX_LENGTH}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => Alert.alert('Voice input', 'Speaking your symptoms is not available yet. Please type them instead.')}
            style={styles.speak}
          >
            <Icon name="mic" size={16} />
            <Text style={styles.speakText}>Speak</Text>
          </Pressable>
        </View>
      </View>

      <SectionLabel>Or describe it another way</SectionLabel>
      <View style={styles.card}>
        <AltRow
          icon="grid"
          title="Pick a body area"
          description="Tap where it hurts on a body map"
          href="/intake/body-map"
        />
        <AltRow
          icon="sparkles"
          title="Chat with the AI assistant"
          description="Answer questions conversationally"
          href="/chat/diagnosis"
        />
      </View>

      <SectionLabel>Common symptoms</SectionLabel>
      <View style={styles.chips}>
        {COMMON_SYMPTOMS.map((s) => (
          <Chip key={s} label={s} selected={answers.symptoms.includes(s)} onPress={() => toggleSymptom(s)} />
        ))}
      </View>
    </IntakeLayout>
  );
}

function AltRow({ icon, title, description, href }: { icon: IconName; title: string; description: string; href: Href }) {
  return (
    <Pressable accessibilityRole="button" onPress={() => router.push(href)} style={styles.altRow}>
      <View style={styles.altIcon}>
        <Icon name={icon} size={20} />
      </View>
      <View style={styles.altText}>
        <Text style={styles.altTitle}>{title}</Text>
        <Text style={styles.altDescription}>{description}</Text>
      </View>
      <Icon name="chevron-right" size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inputCard: { ...card, gap: 12 },
  inputCardFocused: { borderColor: colors.brandPrimary },
  input: {
    minHeight: 46,
    padding: 0,
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 15 * 1.5,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  inputFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counter: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  speak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.brandPrimary,
  },
  speakText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textOnPrimary },
  card: { ...card, gap: 16 },
  altRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  altIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandPrimaryLight,
  },
  altText: { flex: 1, gap: 2 },
  altTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.textPrimary },
  altDescription: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.4, color: colors.textSecondary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
