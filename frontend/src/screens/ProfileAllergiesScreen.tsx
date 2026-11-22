import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProfileAllergies'>;
};

const COMMON_ALLERGIES = [
  'Penicillin', 'Aspirin', 'Ibuprofen', 'Sulfa drugs', 'Latex', 'Peanuts',
  'Tree nuts', 'Shellfish', 'Dairy', 'Eggs', 'Gluten', 'Soy', 'Bee stings',
];

export default function ProfileAllergiesScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [customAllergies, setCustomAllergies] = useState<string[]>([]);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const addCustom = () => {
    const val = customInput.trim();
    if (val && !customAllergies.includes(val)) {
      setCustomAllergies((prev) => [...prev, val]);
      setCustomInput('');
    }
  };

  const removeCustom = (item: string) => {
    setCustomAllergies((prev) => prev.filter((x) => x !== item));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '28%' }]} />
        </View>
        <Text style={styles.stepLabel}>Step 2 of 7 — Allergies</Text>
        <Text style={styles.title}>Known Allergies</Text>
        <Text style={styles.subtitle}>Select all that apply. This helps avoid dangerous recommendations.</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.chipGrid}>
          {COMMON_ALLERGIES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, selected.includes(item) && styles.chipActive]}
              onPress={() => toggle(item)}
            >
              <Text style={[styles.chipText, selected.includes(item) && styles.chipTextActive]}>
                {selected.includes(item) ? '✓ ' : ''}{item}
              </Text>
            </TouchableOpacity>
          ))}
          {customAllergies.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, styles.chipActive]}
              onPress={() => removeCustom(item)}
            >
              <Text style={[styles.chipText, styles.chipTextActive]}>✓ {item} ✕</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customSection}>
          <Text style={styles.label}>Add other allergy</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Codeine, Mold..."
              placeholderTextColor="#B0BDB8"
              value={customInput}
              onChangeText={setCustomInput}
              onSubmitEditing={addCustom}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addCustom}>
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.noneCard}>
          <TouchableOpacity
            style={[styles.noneBtn, selected.length === 0 && customAllergies.length === 0 && styles.noneBtnActive]}
            onPress={() => { setSelected([]); setCustomAllergies([]); }}
          >
            <Text style={[styles.noneBtnText, selected.length === 0 && customAllergies.length === 0 && styles.noneBtnTextActive]}>
              No known allergies
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ProfileMedications')}>
          <Text style={styles.btnText}>Continue →</Text>
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
  title: { fontSize: 24, fontWeight: '700', color: '#1A2B25', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7C76', lineHeight: 20 },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D4E3DE', backgroundColor: '#FFFFFF',
  },
  chipActive: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  chipText: { fontSize: 14, color: '#3D5247', fontWeight: '500' },
  chipTextActive: { color: '#FFFFFF' },
  customSection: { marginTop: 24 },
  label: { fontSize: 13, fontWeight: '600', color: '#3D5247', marginBottom: 8 },
  inputRow: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1, borderWidth: 1.5, borderColor: '#D4E3DE', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15,
    backgroundColor: '#FFFFFF', color: '#1A2B25',
  },
  addBtn: {
    backgroundColor: '#E8F5F0', borderRadius: 12, paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addBtnText: { color: '#1A7A5E', fontWeight: '600', fontSize: 15 },
  noneCard: { marginTop: 20, marginBottom: 24, alignItems: 'center' },
  noneBtn: {
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D4E3DE', backgroundColor: '#FFFFFF',
  },
  noneBtnActive: { backgroundColor: '#FFF3E0', borderColor: '#F5A623' },
  noneBtnText: { fontSize: 14, color: '#6B7C76', fontWeight: '500' },
  noneBtnTextActive: { color: '#8B6914' },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  btn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
