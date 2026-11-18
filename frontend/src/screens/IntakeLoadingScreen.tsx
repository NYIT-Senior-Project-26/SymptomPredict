import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IntakeLoading'>;
};

const STEPS = [
  { text: 'Processing your symptoms...', icon: '🔍' },
  { text: 'Analyzing symptom patterns...', icon: '🧬' },
  { text: 'Cross-referencing medical database...', icon: '📚' },
  { text: 'Applying AI differential diagnosis...', icon: '🤖' },
  { text: 'Generating personalized insights...', icon: '✨' },
  { text: 'Preparing your results...', icon: '📋' },
];

export default function IntakeLoadingScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.9, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Step through loading stages
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < STEPS.length) {
        setStep(currentStep);
        const pct = Math.round((currentStep / STEPS.length) * 100);
        setProgress(pct);
        Animated.timing(progressAnim, {
          toValue: pct / 100,
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else {
        clearInterval(stepInterval);
        setTimeout(() => navigation.replace('DiagnosisResults', {}), 600);
      }
    }, 900);

    return () => clearInterval(stepInterval);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1A7A5E" />
      <View style={styles.container}>
        <Animated.View style={[styles.orb, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.orbIcon}>{STEPS[step]?.icon ?? '✨'}</Text>
          <Text style={styles.orbPct}>{progress}%</Text>
        </Animated.View>

        <Text style={styles.mainTitle}>Analyzing your symptoms</Text>
        <Text style={styles.stepText}>{STEPS[step]?.text}</Text>

        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        <View style={styles.stepsIndicator}>
          {STEPS.map((s, i) => (
            <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
          ))}
        </View>

        <Text style={styles.footerNote}>
          Our AI is reviewing your symptoms against thousands of medical records to give you the most accurate assessment.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F4D3A' },
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24,
  },
  orb: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 32,
  },
  orbIcon: { fontSize: 40, marginBottom: 4 },
  orbPct: { fontSize: 18, color: '#FFFFFF', fontWeight: '700' },
  mainTitle: {
    fontSize: 24, fontWeight: '700', color: '#FFFFFF',
    marginBottom: 10, textAlign: 'center',
  },
  stepText: {
    fontSize: 15, color: 'rgba(255,255,255,0.75)',
    marginBottom: 32, textAlign: 'center',
  },
  progressContainer: {
    width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3, overflow: 'hidden', marginBottom: 16,
  },
  progressBar: {
    height: 6, backgroundColor: '#52D9A8', borderRadius: 3,
  },
  stepsIndicator: { flexDirection: 'row', gap: 6, marginBottom: 40 },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: { backgroundColor: '#52D9A8' },
  footerNote: {
    fontSize: 12, color: 'rgba(255,255,255,0.5)',
    textAlign: 'center', lineHeight: 18, paddingHorizontal: 16,
  },
});
