import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { IntakeFooter, IntakeLayout, Subtitle, Title } from '@/components/intake';
import { finishProfile, ProfileProgress } from '@/components/profile';
import { TextField } from '@/components/TextField';
import { useProfile } from '@/state/profile';
import { colors, fonts, palette } from '@/theme';

// 1.7 Profile · Insurance. Kept for showing in-network doctors later; it is not sent with symptom checks.
export default function Insurance() {
  const { profile, update } = useProfile();
  const { provider, plan } = profile.insurance;
  const setInsurance = (patch: Partial<typeof profile.insurance>) =>
    update({ insurance: { ...profile.insurance, ...patch } });

  return (
    <IntakeLayout
      progress={<ProfileProgress step={5} />}
      gap={18}
      footer={
        <IntakeFooter
          label="Continue"
          onPress={() => {
            setInsurance({ selfPay: false });
            finishProfile();
          }}
          secondary={{
            label: "I'll pay out of pocket",
            onPress: () => {
              setInsurance({ provider: '', plan: '', selfPay: true });
              finishProfile();
            },
          }}
        />
      }
    >
      <Title>Add your insurance</Title>
      <Subtitle>We'll only show Zocdoc doctors who accept your plan.</Subtitle>

      {/* Card preview; fills in as the fields below are typed. */}
      <View style={styles.card} accessible accessibilityLabel={`Health plan: ${provider || 'not entered'} ${plan}`}>
        <View style={styles.cardTop}>
          <Text style={styles.cardLabel}>Health plan</Text>
          <Icon name="shield" size={20} color={colors.textOnPrimary} />
        </View>
        <Text style={styles.cardPlan}>{[provider, plan].filter(Boolean).join(' · ') || 'Your plan'}</Text>
      </View>

      <Button
        label="Scan insurance card"
        variant="neutral"
        onPress={() => Alert.alert('Scan your card', 'Scanning is not available yet. Please type your plan details.')}
      />
      <TextField
        label="Insurance provider"
        value={provider}
        onChangeText={(v) => setInsurance({ provider: v })}
        placeholder="e.g. Aetna"
      />
      <TextField
        label="Plan name"
        value={plan}
        onChangeText={(v) => setInsurance({ plan: v })}
        placeholder="e.g. Choice POS II"
      />
    </IntakeLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: palette.secondary[500],
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.textOnPrimary },
  cardPlan: { fontFamily: fonts.bold, fontSize: 18, color: colors.textOnPrimary },
});
