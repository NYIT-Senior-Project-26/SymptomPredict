import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, TextInputInstance, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { IntakeFooter, IntakeLayout, Subtitle, Title } from '@/intake/components';
import { AddLink, FieldLabel, ListCard, ProfileProgress } from '@/profile/components';
import { SearchField } from '@/components/TextField';
import { ALLERGY_CATEGORIES, AllergyCategory } from '@/profile/content';
import { useProfile } from '@/profile/state';
import { colors } from '@/theme';

// 1.4 Profile · Allergies
export default function Allergies() {
  const { profile, update } = useProfile();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AllergyCategory>('Drug');
  const input = useRef<TextInputInstance>(null);

  /** Adds what's typed in the search box; returns the updated list. */
  function addTyped() {
    const trimmed = name.trim();
    if (!trimmed) return profile.allergies;
    const allergies = [
      ...profile.allergies.filter((a) => a.name.toLowerCase() !== trimmed.toLowerCase()),
      { name: trimmed, category },
    ];
    update({ allergies });
    setName('');
    return allergies;
  }

  function next() {
    router.push('/setup/medications');
  }

  return (
    <IntakeLayout
      progress={<ProfileProgress step={2} />}
      gap={18}
      footer={
        <IntakeFooter
          label="Continue"
          onPress={() => {
            addTyped();
            next();
          }}
          secondary={{
            label: 'I have no known allergies',
            onPress: () => {
              update({ allergies: [] });
              setName('');
              next();
            },
          }}
        />
      }
    >
      <Title>Any known allergies?</Title>
      <Subtitle>We'll filter out medications that could cause a reaction.</Subtitle>

      <SearchField
        ref={input}
        value={name}
        onChangeText={setName}
        onSubmitEditing={addTyped}
        placeholder="Search drugs, foods or substances"
        accessibilityLabel="Allergy name"
      />

      <View style={styles.group}>
        <FieldLabel>Category</FieldLabel>
        <View style={styles.chips}>
          {ALLERGY_CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </View>
      </View>

      {profile.allergies.length > 0 && <FieldLabel>Your allergies</FieldLabel>}
      <ListCard
        items={profile.allergies.map((a) => ({ key: a.name, title: a.name, subtitle: a.category }))}
        icon={{ name: 'alert-18', background: colors.triageRedBg }}
        action={{
          icon: 'close',
          label: 'Remove',
          onPress: (key) => update({ allergies: profile.allergies.filter((a) => a.name !== key) }),
        }}
      />
      <AddLink
        label={profile.allergies.length > 0 ? 'Add another allergy' : 'Add allergy'}
        onPress={() => (name.trim() ? addTyped() : input.current?.focus())}
      />
    </IntakeLayout>
  );
}

const styles = StyleSheet.create({
  group: { gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
