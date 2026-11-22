import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IntakeSymptom'>;
};

const DURATION_OPTIONS = ['< 1 day', '1–3 days', '4–7 days', '1–2 weeks', '> 2 weeks'];
const ONSET_OPTIONS = ['Sudden', 'Gradual'];

export default function IntakeSymptomScreen({ navigation }: Props) {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [onset, setOnset] = useState('');

  const canContinue = description.trim().length > 10 && duration && onset;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '12%' }]} />
          </View>
          <Text style={styles.stepLabel}>Step 1 of 8</Text>
          <Text style={styles.title}>Describe your symptoms</Text>
          <Text style={styles.subtitle}>Be as specific as possible. Include location, character, and what makes it better or worse.</Text>
        </View>

        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>What's going on? *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. I have a throbbing headache on the right side of my head, started this morning, feels worse when I move..."
            placeholderTextColor="#B0BDB8"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length} characters</Text>

          <Text style={styles.label}>How long have you had these symptoms?</Text>
          <View style={styles.optionRow}>
            {DURATION_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.optionChip, duration === opt && styles.optionChipActive]}
                onPress={() => setDuration(opt)}
              >
                <Text style={[styles.optionText, duration === opt && styles.optionTextActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>How did symptoms start?</Text>
          <View style={styles.onsetRow}>
            {ONSET_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.onsetBtn, onset === opt && styles.onsetBtnActive]}
                onPress={() => setOnset(opt)}
              >
                <Text style={styles.onsetIcon}>{opt === 'Sudden' ? '⚡' : '🌊'}</Text>
                <Text style={[styles.onsetText, onset === opt && styles.onsetTextActive]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipText}>💡 Tip: Mention any triggers, recent travel, contact with sick people, or changes in diet/environment.</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btn, !canContinue && styles.btnDisabled]}
            onPress={() => canContinue && navigation.navigate('IntakeBodyArea')}
            disabled={!canContinue}
          >
            <Text style={styles.btnText}>Next: Body Area →</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FFFE' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: 20, color: '#6B7C76' },
  progressBar: { height: 4, backgroundColor: '#E0EDEA', borderRadius: 2, marginBottom: 8 },
  progressFill: { height: 4, backgroundColor: '#1A7A5E', borderRadius: 2 },
  stepLabel: { fontSize: 12, color: '#1A7A5E', fontWeight: '600', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A2B25', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7C76', lineHeight: 20 },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#3D5247', marginBottom: 10, marginTop: 8 },
  textArea: {
    borderWidth: 1.5, borderColor: '#D4E3DE', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15,
    backgroundColor: '#FFFFFF', color: '#1A2B25', minHeight: 120,
  },
  charCount: { fontSize: 12, color: '#B0BDB8', textAlign: 'right', marginTop: 4 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  optionChip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D4E3DE', backgroundColor: '#FFFFFF',
  },
  optionChipActive: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  optionText: { fontSize: 13, color: '#3D5247', fontWeight: '500' },
  optionTextActive: { color: '#FFFFFF' },
  onsetRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  onsetBtn: {
    flex: 1, borderWidth: 1.5, borderColor: '#D4E3DE', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', backgroundColor: '#FFFFFF',
  },
  onsetBtnActive: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  onsetIcon: { fontSize: 24, marginBottom: 6 },
  onsetText: { fontSize: 14, fontWeight: '600', color: '#3D5247' },
  onsetTextActive: { color: '#FFFFFF' },
  tipCard: {
    backgroundColor: '#E8F5F0', borderRadius: 12, padding: 14, marginTop: 8, marginBottom: 24,
  },
  tipText: { fontSize: 13, color: '#1A5C45', lineHeight: 18 },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  btn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#B0C4BC' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
