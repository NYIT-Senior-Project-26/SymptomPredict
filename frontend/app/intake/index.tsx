import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';

import { Button } from '@/components/Button';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';
import { Stepper } from '@/components/Stepper';
import { useIntake } from '@/state/intake';
import { colors, fonts } from '@/theme';

export default function ChiefComplaint() {
  const { symptoms, setSymptoms } = useIntake();
  const [text, setText] = useState(symptoms.join(', '));

  function onNext() {
    const parsed = text.split(',').map((s) => s.trim()).filter(Boolean);
    if (parsed.length === 0) return;
    setSymptoms(parsed);
    router.push('/intake/body-map');
  }

  return (
    <ScreenPlaceholder frame="2.2 Intake · Stage 1 Chief complaint" title="What's bothering you?">
      <Stepper step={1} />
      <Text style={styles.label}>Describe your symptoms (comma separated)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. headache, fever, sore throat"
        placeholderTextColor={colors.textSecondary}
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button label="Next" onPress={onNext} />
    </ScreenPlaceholder>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary },
  input: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
