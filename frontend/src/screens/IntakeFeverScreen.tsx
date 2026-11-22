import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IntakeFever'>;
};

type YesNoMaybe = 'yes' | 'no' | 'unsure' | null;

export default function IntakeFeverScreen({ navigation }: Props) {
  const [hasFever, setHasFever] = useState<YesNoMaybe>(null);
  const [temp, setTemp] = useState('');
  const [hasChills, setHasChills] = useState<YesNoMaybe>(null);
  const [hasVomiting, setHasVomiting] = useState<YesNoMaybe>(null);
  const [hasDiarrhea, setHasDiarrhea] = useState<YesNoMaybe>(null);
  const [hasRash, setHasRash] = useState<YesNoMaybe>(null);

  const canContinue = hasFever !== null && hasChills !== null;

  const YNButtons = ({ value, onChange }: { value: YesNoMaybe; onChange: (v: YesNoMaybe) => void }) => (
    <View style={styles.ynRow}>
      {(['yes', 'no', 'unsure'] as YesNoMaybe[]).map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.ynBtn, value === opt && styles.ynBtnActive]}
          onPress={() => onChange(opt)}
        >
          <Text style={[styles.ynText, value === opt && styles.ynTextActive]}>
            {opt === 'yes' ? '✓ Yes' : opt === 'no' ? '✗ No' : '? Unsure'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '37%' }]} />
        </View>
        <Text style={styles.stepLabel}>Step 3 of 8</Text>
        <Text style={styles.title}>Fever & Related Symptoms</Text>
        <Text style={styles.subtitle}>Answer as accurately as you can.</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <Text style={styles.question}>🌡️  Do you have a fever?</Text>
          <YNButtons value={hasFever} onChange={setHasFever} />
          {hasFever === 'yes' && (
            <View style={styles.tempRow}>
              <TextInput
                style={styles.tempInput}
                placeholder="Temperature (°F)"
                placeholderTextColor="#B0BDB8"
                value={temp}
                onChangeText={setTemp}
                keyboardType="decimal-pad"
              />
            </View>
          )}
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.question}>🥶  Do you have chills or sweating?</Text>
          <YNButtons value={hasChills} onChange={setHasChills} />
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.question}>🤢  Nausea or vomiting?</Text>
          <YNButtons value={hasVomiting} onChange={setHasVomiting} />
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.question}>🚽  Diarrhea or unusual bowel changes?</Text>
          <YNButtons value={hasDiarrhea} onChange={setHasDiarrhea} />
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.question}>🔴  Any visible rash or skin changes?</Text>
          <YNButtons value={hasRash} onChange={setHasRash} />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, !canContinue && styles.btnDisabled]}
          onPress={() => canContinue && navigation.navigate('IntakePainSeverity')}
          disabled={!canContinue}
        >
          <Text style={styles.btnText}>Next: Pain Severity →</Text>
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
  questionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  question: { fontSize: 15, fontWeight: '600', color: '#1A2B25', marginBottom: 12 },
  ynRow: { flexDirection: 'row', gap: 8 },
  ynBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#D4E3DE', alignItems: 'center',
    backgroundColor: '#F8FFFE',
  },
  ynBtnActive: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  ynText: { fontSize: 13, fontWeight: '600', color: '#3D5247' },
  ynTextActive: { color: '#FFFFFF' },
  tempRow: { marginTop: 12 },
  tempInput: {
    borderWidth: 1.5, borderColor: '#D4E3DE', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15,
    backgroundColor: '#F8FFFE', color: '#1A2B25',
  },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  btn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#B0C4BC' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
