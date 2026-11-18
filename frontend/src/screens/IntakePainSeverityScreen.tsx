import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IntakePainSeverity'>;
};

const PAIN_DESCRIPTORS = [
  'Sharp', 'Dull', 'Throbbing', 'Burning', 'Stabbing',
  'Cramping', 'Pressure', 'Aching', 'Shooting', 'Tightness',
];

export default function IntakePainSeverityScreen({ navigation }: Props) {
  const [severity, setSeverity] = useState<number | null>(null);
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [constant, setConstant] = useState<boolean | null>(null);

  const toggleDescriptor = (d: string) => {
    setDescriptors((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };

  const getEmoji = (n: number) => {
    if (n <= 2) return '😊';
    if (n <= 4) return '😕';
    if (n <= 6) return '😣';
    if (n <= 8) return '😫';
    return '😭';
  };

  const getSeverityLabel = (n: number) => {
    if (n <= 2) return 'Mild';
    if (n <= 4) return 'Moderate';
    if (n <= 6) return 'Significant';
    if (n <= 8) return 'Severe';
    return 'Extreme';
  };

  const getSeverityColor = (n: number) => {
    if (n <= 2) return '#1A7A5E';
    if (n <= 4) return '#8B6914';
    if (n <= 6) return '#D95E00';
    return '#CC0000';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>
        <Text style={styles.stepLabel}>Step 4 of 8</Text>
        <Text style={styles.title}>Rate your pain</Text>
        <Text style={styles.subtitle}>0 = No pain, 10 = Worst pain imaginable</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Pain Scale */}
        <View style={styles.scaleCard}>
          {severity !== null && (
            <View style={styles.selectedDisplay}>
              <Text style={styles.emojiLarge}>{getEmoji(severity)}</Text>
              <Text style={[styles.severityNum, { color: getSeverityColor(severity) }]}>
                {severity}/10
              </Text>
              <Text style={[styles.severityLabel, { color: getSeverityColor(severity) }]}>
                {getSeverityLabel(severity)}
              </Text>
            </View>
          )}

          <View style={styles.scaleRow}>
            {Array.from({ length: 11 }, (_, i) => i).map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.scaleBtn,
                  severity === n && { backgroundColor: getSeverityColor(n), borderColor: getSeverityColor(n) },
                ]}
                onPress={() => setSeverity(n)}
              >
                <Text style={[styles.scaleBtnText, severity === n && styles.scaleBtnTextActive]}>
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabelText}>No pain</Text>
            <Text style={styles.scaleLabelText}>Worst</Text>
          </View>
        </View>

        {/* Pain Type */}
        <Text style={styles.sectionLabel}>How would you describe the pain?</Text>
        <View style={styles.chipGrid}>
          {PAIN_DESCRIPTORS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, descriptors.includes(d) && styles.chipActive]}
              onPress={() => toggleDescriptor(d)}
            >
              <Text style={[styles.chipText, descriptors.includes(d) && styles.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Constant vs Intermittent */}
        <Text style={styles.sectionLabel}>Is it constant or comes and goes?</Text>
        <View style={styles.constRow}>
          <TouchableOpacity
            style={[styles.constBtn, constant === true && styles.constBtnActive]}
            onPress={() => setConstant(true)}
          >
            <Text style={styles.constIcon}>🔴</Text>
            <Text style={[styles.constText, constant === true && styles.constTextActive]}>Constant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.constBtn, constant === false && styles.constBtnActive]}
            onPress={() => setConstant(false)}
          >
            <Text style={styles.constIcon}>🔄</Text>
            <Text style={[styles.constText, constant === false && styles.constTextActive]}>Comes & Goes</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, severity === null && styles.btnDisabled]}
          onPress={() => severity !== null && navigation.navigate('IntakeSafetyQuestions')}
          disabled={severity === null}
        >
          <Text style={styles.btnText}>Next: Safety Check →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FFFE' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: 16, color: '#1A7A5E', fontWeight: '500' },
  progressBar: { height: 4, backgroundColor: '#E0EDEA', borderRadius: 2, marginBottom: 8 },
  progressFill: { height: 4, backgroundColor: '#1A7A5E', borderRadius: 2 },
  stepLabel: { fontSize: 12, color: '#1A7A5E', fontWeight: '600', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A2B25', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7C76' },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  scaleCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  selectedDisplay: { alignItems: 'center', marginBottom: 20 },
  emojiLarge: { fontSize: 48, marginBottom: 8 },
  severityNum: { fontSize: 36, fontWeight: '700' },
  severityLabel: { fontSize: 16, fontWeight: '500', marginTop: 2 },
  scaleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  scaleBtn: {
    width: 42, height: 42, borderRadius: 21,
    borderWidth: 1.5, borderColor: '#D4E3DE', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F8FFFE',
  },
  scaleBtnText: { fontSize: 14, fontWeight: '600', color: '#3D5247' },
  scaleBtnTextActive: { color: '#FFFFFF' },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  scaleLabelText: { fontSize: 12, color: '#B0BDB8' },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#3D5247', marginBottom: 10 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D4E3DE', backgroundColor: '#FFFFFF',
  },
  chipActive: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  chipText: { fontSize: 13, color: '#3D5247', fontWeight: '500' },
  chipTextActive: { color: '#FFFFFF' },
  constRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  constBtn: {
    flex: 1, borderWidth: 1.5, borderColor: '#D4E3DE', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', backgroundColor: '#FFFFFF',
  },
  constBtnActive: { backgroundColor: '#E8F5F0', borderColor: '#1A7A5E' },
  constIcon: { fontSize: 24, marginBottom: 4 },
  constText: { fontSize: 14, fontWeight: '600', color: '#3D5247' },
  constTextActive: { color: '#1A5C45' },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  btn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#B0C4BC' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
