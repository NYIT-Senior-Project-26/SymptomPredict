import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Icon, IconName } from '@/components/Icon';
import { ScreenLayout } from '@/components/ScreenLayout';
import { card, colors, fonts } from '@/theme';

// The app has no accounts and saves nothing, so these points describe that
// rather than the storage claims in the Figma frame (see PROGRESS.md).
const POINTS: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'lock',
    title: 'No account, nothing saved',
    description: 'No login. Your profile and answers are cleared when you close the app.',
  },
  {
    icon: 'shield',
    title: 'Used only for your check',
    description: 'Your answers are sent to our AI service only to produce your result.',
  },
  {
    icon: 'user',
    title: "You're in control",
    description: 'Share only what you choose. You can stop at any time.',
  },
];

// 1.2 Privacy & Data Consent
export default function Consent() {
  const [terms, setTerms] = useState(false);
  const [processing, setProcessing] = useState(false);

  function onAgree() {
    router.push('/setup/basic');
  }

  return (
    <ScreenLayout
      contentStyle={styles.content}
      footerStyle={styles.footer}
      footer={
        <>
          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            checked={terms}
            onPress={() => setTerms(!terms)}
          />
          <Checkbox
            label="I consent to DiagnosisCloud processing my health information"
            checked={processing}
            onPress={() => setProcessing(!processing)}
          />
          <Button label="Agree & continue" disabled={!terms || !processing} onPress={onAgree} />
        </>
      }
    >
      <Text style={styles.title} accessibilityRole="header">
          Your health data stays private
        </Text>
        <Text style={styles.subtitle}>
          We only use your information for your symptom check. You're always in control.
        </Text>

        <View style={styles.card}>
          {POINTS.map((p) => (
            <View key={p.title} style={styles.point}>
              <View style={styles.pointIcon}>
                <Icon name={p.icon} size={20} color={colors.brandPrimary} />
              </View>
              <View style={styles.pointText}>
                <Text style={styles.pointTitle}>{p.title}</Text>
                <Text style={styles.pointDescription}>{p.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.banner}>
          <Icon name="alert-18" size={18} color={colors.triageYellow} />
          <Text style={styles.bannerText}>
            DiagnosisCloud does not replace professional medical advice. In an emergency, call 911.
          </Text>
        </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { gap: 18, paddingTop: 12, paddingHorizontal: 24, paddingBottom: 18 },
  title: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 30, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 14 * 1.45, color: colors.textSecondary },
  card: { ...card, gap: 18 },
  point: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pointIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandPrimaryLight,
  },
  pointText: { flex: 1, gap: 2 },
  pointTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.textPrimary },
  pointDescription: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.4, color: colors.textSecondary },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.triageYellowBg,
  },
  bannerText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.45, color: colors.textPrimary },
  footer: { gap: 18 },
});
