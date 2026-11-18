import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { IntakeFooter, IntakeLayout, Subtitle, Title } from '@/components/intake';
import { ProfileProgress } from '@/components/profile';
import { SearchField } from '@/components/TextField';
import { CONDITIONS } from '@/profile/content';
import { useProfile } from '@/state/profile';

// 1.6 Profile · Ongoing conditions.
// Figma's note about unlocking the Chronic Condition Tracker is left out: the tracker
// needs saved data, which this app doesn't keep.
export default function Conditions() {
  const { profile, update } = useProfile();
  const [query, setQuery] = useState('');
  const shown = CONDITIONS.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()));

  function toggle(condition: string) {
    const selected = profile.conditions.includes(condition);
    update({
      conditions: selected ? profile.conditions.filter((c) => c !== condition) : [...profile.conditions, condition],
    });
  }

  function next() {
    router.push('/setup/insurance');
  }

  return (
    <IntakeLayout
      progress={<ProfileProgress step={4} />}
      gap={18}
      footer={
        <IntakeFooter
          label="Continue"
          onPress={next}
          secondary={{
            label: 'None of these',
            onPress: () => {
              update({ conditions: [] });
              next();
            },
          }}
        />
      }
    >
      <Title>Any ongoing conditions?</Title>
      <Subtitle>Chronic conditions change which causes are most likely for you.</Subtitle>

      <SearchField value={query} onChangeText={setQuery} placeholder="Search conditions" accessibilityLabel="Search conditions" />

      <View style={styles.chips}>
        {shown.map((c) => (
          <Chip key={c} label={c} selected={profile.conditions.includes(c)} onPress={() => toggle(c)} />
        ))}
      </View>
    </IntakeLayout>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
