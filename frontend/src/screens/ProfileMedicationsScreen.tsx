import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProfileMedications'>;
};

type Medication = { name: string; dose: string; frequency: string };

export default function ProfileMedicationsScreen({ navigation }: Props) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState('');

  const addMedication = () => {
    if (name.trim()) {
      setMedications((prev) => [...prev, { name: name.trim(), dose: dose.trim(), frequency: frequency.trim() }]);
      setName(''); setDose(''); setFrequency('');
    }
  };

  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '42%' }]} />
        </View>
        <Text style={styles.stepLabel}>Step 3 of 7 — Medications</Text>
        <Text style={styles.title}>Current Medications</Text>
        <Text style={styles.subtitle}>List any medications, vitamins, or supplements you're currently taking.</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {medications.length > 0 && (
          <View style={styles.medList}>
            {medications.map((med, index) => (
              <View key={index} style={styles.medCard}>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{med.name}</Text>
                  {(med.dose || med.frequency) && (
                    <Text style={styles.medDetails}>
                      {[med.dose, med.frequency].filter(Boolean).join(' · ')}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => removeMedication(index)} style={styles.removeBtn}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.addForm}>
          <Text style={styles.formTitle}>+ Add Medication</Text>
          <Text style={styles.label}>Medication Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Lisinopril, Metformin, Vitamin D"
            placeholderTextColor="#B0BDB8"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Dosage</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 10mg"
                placeholderTextColor="#B0BDB8"
                value={dose}
                onChangeText={setDose}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Frequency</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Once daily"
                placeholderTextColor="#B0BDB8"
                value={frequency}
                onChangeText={setFrequency}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={addMedication}>
            <Text style={styles.addBtnText}>Add Medication</Text>
          </TouchableOpacity>
        </View>

        {medications.length === 0 && (
          <TouchableOpacity style={styles.noneBtn} onPress={() => navigation.navigate('ProfileConditions')}>
            <Text style={styles.noneBtnText}>I take no medications — Skip</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ProfileConditions')}>
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
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  medList: { marginBottom: 16 },
  medCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#E0EDEA',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  medInfo: { flex: 1 },
  medName: { fontSize: 15, fontWeight: '600', color: '#1A2B25' },
  medDetails: { fontSize: 13, color: '#6B7C76', marginTop: 2 },
  removeBtn: { padding: 8 },
  removeText: { fontSize: 16, color: '#CC4444' },
  addForm: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: '#D4E3DE', marginBottom: 16,
  },
  formTitle: { fontSize: 15, fontWeight: '600', color: '#1A7A5E', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#3D5247', marginBottom: 8, marginTop: 4 },
  input: {
    borderWidth: 1.5, borderColor: '#D4E3DE', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15,
    backgroundColor: '#F8FFFE', color: '#1A2B25',
  },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  addBtn: {
    backgroundColor: '#E8F5F0', borderRadius: 12, paddingVertical: 12,
    alignItems: 'center', marginTop: 12,
  },
  addBtnText: { color: '#1A7A5E', fontWeight: '600', fontSize: 15 },
  noneBtn: { alignItems: 'center', paddingVertical: 12, marginBottom: 24 },
  noneBtnText: { color: '#6B7C76', fontSize: 14, textDecorationLine: 'underline' },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  btn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
