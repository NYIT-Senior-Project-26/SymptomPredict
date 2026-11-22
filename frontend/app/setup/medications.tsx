import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, TextInputInstance } from 'react-native';

import { Button } from '@/components/Button';
import { IntakeFooter, IntakeLayout, Subtitle, Title } from '@/intake/components';
import { AddLink, ListCard, ProfileProgress } from '@/profile/components';
import { SearchField } from '@/components/TextField';
import { useProfile } from '@/profile/state';
import { colors } from '@/theme';

// 1.5 Profile · Medications
export default function Medications() {
  const { profile, update } = useProfile();
  const [name, setName] = useState('');
  const input = useRef<TextInputInstance>(null);

  function addTyped() {
    const trimmed = name.trim();
    if (!trimmed) return;
    update({
      medications: [...profile.medications.filter((m) => m.toLowerCase() !== trimmed.toLowerCase()), trimmed],
    });
    setName('');
  }

  /** The pencil moves the medication back into the box so it can be changed or cleared. */
  function edit(medication: string) {
    update({ medications: profile.medications.filter((m) => m !== medication) });
    setName(medication);
    input.current?.focus();
  }

  function next() {
    router.push('/setup/conditions');
  }

  return (
    <IntakeLayout
      progress={<ProfileProgress step={3} />}
      gap={18}
      footer={
        <IntakeFooter
          label="Continue"
          onPress={() => {
            addTyped();
            next();
          }}
          secondary={{
            label: "I don't take any medications",
            onPress: () => {
              update({ medications: [] });
              setName('');
              next();
            },
          }}
        />
      }
    >
      <Title>Current medications</Title>
      <Subtitle>Include prescriptions, OTC and supplements so we can check for interactions.</Subtitle>

      <SearchField
        ref={input}
        value={name}
        onChangeText={setName}
        onSubmitEditing={addTyped}
        placeholder="Search medication (e.g. Lisinopril)"
        accessibilityLabel="Medication name"
      />

      <ListCard
        items={profile.medications.map((m) => ({ key: m, title: m }))}
        icon={{ name: 'pill', background: colors.brandPrimaryLight }}
        action={{ icon: 'edit-18', label: 'Edit', onPress: edit }}
      />
      <AddLink label="Add medication" centered onPress={() => (name.trim() ? addTyped() : input.current?.focus())} />
      <Button
        label="Scan a prescription label"
        variant="neutral"
        onPress={() => Alert.alert('Scan a label', 'Scanning is not available yet. Please type the medication name.')}
      />
    </IntakeLayout>
  );
}
