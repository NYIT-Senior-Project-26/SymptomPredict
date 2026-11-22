import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { IntakeFooter, IntakeLayout, Subtitle, Title } from '@/intake/components';
import { FieldLabel, ProfileProgress } from '@/profile/components';
import { TextField } from '@/components/TextField';
import { BLOOD_PRESSURES, SEXES, SMOKING_STATUSES } from '@/profile/content';
import { useProfile } from '@/profile/state';

// 1.3 Profile · Basic info
export default function BasicInfo() {
  const { profile, update } = useProfile();

  return (
    <IntakeLayout
      progress={<ProfileProgress step={1} />}
      gap={20}
      footer={<IntakeFooter label="Continue" onPress={() => router.push('/setup/allergies')} />}
    >
      <Title>Tell us about you</Title>
      <Subtitle>This helps us tailor follow-up questions and results.</Subtitle>

      <TextField
        label="Age"
        value={profile.age}
        onChangeText={(age) => update({ age: age.replace(/[^0-9]/g, '') })}
        keyboardType="number-pad"
        maxLength={3}
      />

      <ChipGroup label="Biological sex" options={SEXES} value={profile.sex} onChange={(sex) => update({ sex })} />
      <ChipGroup
        label="Blood pressure"
        options={BLOOD_PRESSURES}
        value={profile.bloodPressure}
        onChange={(bloodPressure) => update({ bloodPressure })}
      />
      <ChipGroup
        label="Smoking status"
        options={SMOKING_STATUSES}
        value={profile.smoking}
        onChange={(smoking) => update({ smoking })}
      />
    </IntakeLayout>
  );
}

/** Single-choice chips; tapping the selected chip clears it. */
function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T | null;
  onChange: (value: T | null) => void;
}) {
  return (
    <View style={styles.group}>
      <FieldLabel>{label}</FieldLabel>
      <View style={styles.chips}>
        {options.map((o) => (
          <Chip key={o} label={o} selected={value === o} onPress={() => onChange(value === o ? null : o)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
