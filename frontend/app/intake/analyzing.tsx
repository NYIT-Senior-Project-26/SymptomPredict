import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '@/api/client';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { buildPredictInput } from '@/intake/request';
import { useIntake } from '@/state/intake';
import { hasHealthDetails, useProfile } from '@/state/profile';
import { colors, fonts } from '@/theme';

/** How often the checklist advances while waiting for the API. It never passes the last step on its own. */
const STEP_INTERVAL_MS = 2500;

// 2.8 Loading / Analysis
export default function Analyzing() {
  const insets = useSafeAreaInsets();
  const { answers, setResult } = useIntake();
  const { profile } = useProfile();
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(1);

  // Figma's third step is "Checking allergies & medications"; it only applies when the profile has them.
  const usesProfile = hasHealthDetails(profile);
  const steps = [
    'Symptoms reviewed',
    'Matching likely conditions',
    usesProfile ? 'Checking allergies & medications' : 'Checking for warning signs',
    'Choosing your next step',
  ];

  const analyze = useCallback(async () => {
    setError(null);
    setActive(1);
    try {
      const result = await api.predict(buildPredictInput(answers, profile));
      setResult(result);
      setActive(steps.length);
      setTimeout(() => router.replace('/results'), 400);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [answers, profile, setResult, steps.length]);

  useEffect(() => {
    analyze();
    // Run once on arrival; "Try again" calls analyze() directly.
  }, []);

  useEffect(() => {
    if (error) return;
    const id = setInterval(() => setActive((a) => Math.min(a + 1, steps.length - 1)), STEP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [error, steps.length]);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: Math.max(insets.bottom, 40) }]}>
      <View style={styles.spacer} />
      <Pulse />
      <Text style={styles.title} accessibilityRole="header">
        Analyzing your symptoms…
      </Text>
      <Text style={styles.subtitle}>
        Comparing your answers with thousands of conditions{usesProfile ? ' and your health profile' : ''}.
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Something went wrong: {error}</Text>
          <Button label="Try again" onPress={analyze} />
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Text style={styles.link}>Go back</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.steps}>
            {steps.map((label, i) => (
              <Step key={label} label={label} state={i < active ? 'done' : i === active ? 'active' : 'pending'} />
            ))}
          </View>
          <View style={styles.wait}>
            <Icon name="clock-14" size={14} />
            <Text style={styles.waitText}>Usually about 10 seconds</Text>
          </View>
        </>
      )}

      <View style={styles.spacer} />
      <Text style={styles.footnote}>Not for emergencies. If this is urgent, call 911.</Text>
    </View>
  );
}

function Step({ label, state }: { label: string; state: 'done' | 'active' | 'pending' }) {
  return (
    <View style={styles.step}>
      {state === 'done' && <Icon name="check-18" size={18} />}
      {state === 'active' && <Spinner />}
      {state === 'pending' && <Icon name="circle" size={18} />}
      <Text
        style={[
          styles.stepText,
          state === 'active' && styles.stepTextActive,
          state === 'pending' && styles.stepTextPending,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

function Spinner() {
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Icon name="loader" size={18} />
    </Animated.View>
  );
}

/** "Pulse animation" in Figma: the outer ring gently grows and shrinks. */
function Pulse() {
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.06, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale]);

  return (
    <View style={styles.pulse}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.pulseOuter, { transform: [{ scale }] }]} />
      <View style={styles.pulseMiddle}>
        <View style={styles.pulseInner}>
          <Icon name="activity-44" size={44} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', gap: 20, paddingHorizontal: 32, backgroundColor: colors.bgSurface },
  spacer: { flex: 1 },
  pulse: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  pulseOuter: { borderRadius: 100, backgroundColor: colors.brandPrimaryLight },
  pulseMiddle: {
    width: 144,
    height: 144,
    borderRadius: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSurface,
  },
  pulseInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandPrimary,
  },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.textPrimary, textAlign: 'center' },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  steps: {
    alignSelf: 'stretch',
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepText: { fontFamily: fonts.regular, fontSize: 14, color: colors.textPrimary },
  stepTextActive: { fontFamily: fonts.semibold },
  stepTextPending: { color: colors.textSecondary },
  wait: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.brandPrimaryLight,
  },
  waitText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.brandPrimary },
  errorBox: { alignSelf: 'stretch', alignItems: 'center', gap: 16 },
  errorText: { fontFamily: fonts.regular, fontSize: 14, color: colors.triageRed, textAlign: 'center' },
  link: { fontFamily: fonts.semibold, fontSize: 14, color: colors.brandPrimary },
  footnote: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
});
