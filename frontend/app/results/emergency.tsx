import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { useIntake } from '@/intake/state';
import { colors, fonts } from '@/theme';

const WHILE_WAITING = [
  'Stay calm and stay where you are',
  'Do not drive yourself to the emergency room',
  'Unlock your door for paramedics',
  'Keep your phone with you',
  'Have your medication list ready if you can',
];

const ALWAYS_CALL = [
  'Chest pain or pressure',
  'Difficulty breathing',
  'Sudden numbness or weakness, especially on one side',
  'Sudden confusion or trouble speaking',
  'Severe bleeding',
];

// 3.2 Emergency Escalation. Ported from the team's EmergencyScreen.
export default function Emergency() {
  const insets = useSafeAreaInsets();
  const { result } = useIntake();
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 24) }]}
    >
      <View style={styles.alert}>
        <Animated.View style={[styles.alertIcon, { transform: [{ scale: pulse }] }]}>
          <Icon name="alert" size={36} color={colors.triageRed} />
        </Animated.View>
        <Text style={styles.title} accessibilityRole="header">
          Get emergency help now
        </Text>
        <Text style={styles.subtitle}>Your symptoms may need emergency care. Don’t wait.</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Call 911"
        style={({ pressed }) => [styles.call, pressed && styles.pressed]}
        onPress={() => Linking.openURL('tel:911')}
      >
        <Text style={styles.callTitle}>Call 911</Text>
        <Text style={styles.callSub}>Tap to call emergency services</Text>
      </Pressable>

      {result?.urgency === 'emergency' && (
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Why we’re saying this</Text>
          <Text style={styles.boxText}>{result.advice}</Text>
        </View>
      )}

      <View style={styles.box}>
        <Text style={styles.boxTitle}>While you wait for help</Text>
        {WHILE_WAITING.map((item) => (
          <Text key={item} style={styles.boxText}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.box}>
        <Text style={styles.boxTitle}>Always call 911 for</Text>
        {ALWAYS_CALL.map((item) => (
          <Text key={item} style={styles.boxText}>
            • {item}
          </Text>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        onPress={() => Linking.openURL('tel:18002221222')}
      >
        <Text style={styles.secondaryText}>Poison Control: 1-800-222-1222</Text>
      </Pressable>
      <Pressable onPress={() => router.replace('/home')} hitSlop={8}>
        <Text style={styles.home}>Back to home</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.triageRed },
  content: { padding: 20, gap: 16 },
  alert: { alignItems: 'center', gap: 10, paddingVertical: 8 },
  alertIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSurface,
  },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.textOnPrimary, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.textOnPrimary, textAlign: 'center' },
  call: { alignItems: 'center', gap: 2, paddingVertical: 18, borderRadius: 16, backgroundColor: colors.bgSurface },
  callTitle: { fontFamily: fonts.bold, fontSize: 24, color: colors.triageRed },
  callSub: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  pressed: { opacity: 0.85 },
  box: { gap: 6, padding: 16, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.18)' },
  boxTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.textOnPrimary, marginBottom: 4 },
  boxText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.textOnPrimary },
  secondary: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  secondaryText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.textOnPrimary },
  home: { fontFamily: fonts.semibold, fontSize: 14, color: colors.textOnPrimary, textAlign: 'center' },
});
