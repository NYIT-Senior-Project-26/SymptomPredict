// Building blocks shared by the step-by-step screens: symptom intake (Figma 2.2–2.7)
// and profile setup (1.3–1.7).
import { Href, router, useLocalSearchParams } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { CheckBox } from '@/components/Checkbox';
import { Icon } from '@/components/Icon';
import { ScreenLayout } from '@/components/ScreenLayout';
import { Stepper } from '@/components/Stepper';
import { card, colors, fonts } from '@/theme';
import { answerValues, FollowUpQuestion, YES_NO } from './content';
import { useIntake } from './state';

interface LayoutProps {
  /** Intake stage for the stepper: 1 Describe, 2 Details, 3 Review. Ignored when `progress` is set. */
  step?: number;
  /** A custom progress bar to show instead of the intake stepper. */
  progress?: ReactNode;
  /** Vertical spacing between items; varies slightly per frame in Figma. */
  gap: number;
  footer: ReactNode;
  children: ReactNode;
}

/** Scrolling content with the stepper on top and the action buttons pinned below. */
export function IntakeLayout({ step = 1, progress, gap, footer, children }: LayoutProps) {
  return (
    <ScreenLayout footer={footer} contentStyle={[styles.content, { gap }]}>
      {progress ?? <Stepper step={step} />}
      {children}
    </ScreenLayout>
  );
}

interface FooterProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Shows the "Previous" link on the left. */
  onPrevious?: () => void;
  /** A text link under the button, e.g. "I have no known allergies" (profile setup). */
  secondary?: { label: string; onPress: () => void };
}

export function IntakeFooter({ label, onPress, disabled, onPrevious, secondary }: FooterProps) {
  return (
    <View style={styles.footerStack}>
      <View style={styles.footerRow}>
        {onPrevious && (
          <Pressable accessibilityRole="button" onPress={onPrevious} hitSlop={8} style={styles.previous}>
            <Icon name="chevron-left-small" size={18} />
            <Text style={styles.previousText}>Previous</Text>
          </Pressable>
        )}
        <Button label={label} onPress={onPress} disabled={disabled} style={styles.primary} />
      </View>
      {secondary && (
        <Pressable accessibilityRole="button" onPress={secondary.onPress} hitSlop={8}>
          <Text style={styles.secondaryText}>{secondary.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

/**
 * The review screen (2.7) opens a step with `?edit=1`; in that case the step's
 * main button returns to the review instead of moving forward.
 */
export function useIntakeNext() {
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const editing = edit === '1';
  return {
    editing,
    next: (href: Href) => (editing ? router.back() : router.push(href)),
  };
}

export function Title({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

/** Small caps line above a question, e.g. "QUESTION 5 OF ~8". */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

interface ChoiceProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Single-choice answer row with a radio button (2.4). */
export function OptionRow({ label, selected, onPress }: ChoiceProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.choice, selected && styles.choiceSelected]}
    >
      <Text style={styles.optionLabel}>{label}</Text>
      {selected ? <Icon name="radio-selected" size={22} /> : <View style={styles.radio} />}
    </Pressable>
  );
}

/** Multiple-choice row with a checkbox (2.6). */
export function CheckboxRow({ label, selected, onPress }: ChoiceProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.choice, selected && styles.choiceSelected]}
    >
      <CheckBox checked={selected} />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </Pressable>
  );
}

/**
 * The answer choices for a follow-up question, saved straight to the intake answers.
 * Radio buttons for a single answer, checkboxes when `question.multiple` is set.
 */
export function AnswerOptions({ question, gap }: { question: FollowUpQuestion; gap: number }) {
  const { answers, update } = useIntake();
  const options = question.options ?? YES_NO;
  const selected = answerValues(answers.followUps[question.id]);
  const setAnswer = (answer: string | string[]) =>
    update({ followUps: { ...answers.followUps, [question.id]: answer } });

  /** Toggles an option; the exclusive one ("None of these") clears the rest. */
  function toggle(option: string) {
    if (option === question.exclusive) return setAnswer(selected.includes(option) ? [] : [option]);
    const rest = selected.filter((o) => o !== question.exclusive);
    setAnswer(rest.includes(option) ? rest.filter((o) => o !== option) : [...rest, option]);
  }

  return question.multiple ? (
    <View style={{ gap }}>
      {options.map((option) => (
        <CheckboxRow key={option} label={option} selected={selected.includes(option)} onPress={() => toggle(option)} />
      ))}
    </View>
  ) : (
    <View accessibilityRole="radiogroup" style={{ gap }}>
      {options.map((option) => (
        <OptionRow key={option} label={option} selected={selected[0] === option} onPress={() => setAnswer(option)} />
      ))}
    </View>
  );
}

/** A follow-up question with its answers in a card, for showing several on one screen (2.3). */
export function InlineQuestion({ question, number }: { question: FollowUpQuestion; number: number }) {
  return (
    <View style={styles.inlineCard}>
      <Text style={styles.inlineNumber}>Question {number}</Text>
      <Text style={styles.inlineQuestion}>{question.question}</Text>
      {question.hint && <Text style={styles.inlineHint}>{question.hint}</Text>}
      <AnswerOptions question={question} gap={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  inlineCard: { ...card, gap: 10 },
  inlineNumber: { fontFamily: fonts.semibold, fontSize: 11, color: colors.brandPrimary, textTransform: 'uppercase' },
  inlineQuestion: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22, color: colors.textPrimary },
  inlineHint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  content: { paddingTop: 12, paddingHorizontal: 24, paddingBottom: 24 },
  footerStack: { gap: 18 },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  secondaryText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.brandPrimary, textAlign: 'center' },
  previous: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  previousText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.brandPrimary },
  primary: { flex: 1 },
  title: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 30, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 14 * 1.45, color: colors.textSecondary },
  eyebrow: { fontFamily: fonts.semibold, fontSize: 11, color: colors.brandPrimary, textTransform: 'uppercase' },
  sectionLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.textPrimary },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  choiceSelected: { borderColor: colors.brandPrimary, backgroundColor: colors.brandPrimaryLight },
  optionLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.textPrimary },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  checkboxLabel: { flex: 1, fontFamily: fonts.medium, fontSize: 14, lineHeight: 14 * 1.45, color: colors.textPrimary },
});
