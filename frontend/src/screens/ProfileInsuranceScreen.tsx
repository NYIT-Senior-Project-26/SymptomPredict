import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProfileInsurance'>;
};

const INSURANCE_TYPES = ['Private / Employer', 'Medicare', 'Medicaid', 'No Insurance', 'Other'];

export default function ProfileInsuranceScreen({ navigation }: Props) {
  const [insuranceType, setInsuranceType] = useState('');
  const [provider, setProvider] = useState('');
  const [memberId, setMemberId] = useState('');
  const [groupNumber, setGroupNumber] = useState('');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '85%' }]} />
          </View>
          <Text style={styles.stepLabel}>Step 6 of 7 — Insurance</Text>
          <Text style={styles.title}>Insurance Info</Text>
          <Text style={styles.subtitle}>Optional. Helps us recommend in-network providers and care options.</Text>
        </View>

        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionLabel}>Coverage Type</Text>
          <View style={styles.typeGrid}>
            {INSURANCE_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, insuranceType === type && styles.typeChipActive]}
                onPress={() => setInsuranceType(type)}
              >
                <Text style={[styles.typeChipText, insuranceType === type && styles.typeChipTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {insuranceType && insuranceType !== 'No Insurance' && (
            <>
              <Text style={styles.label}>Insurance Provider</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Blue Cross Blue Shield, Aetna"
                placeholderTextColor="#B0BDB8"
                value={provider}
                onChangeText={setProvider}
              />

              <Text style={styles.label}>Member ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Found on your insurance card"
                placeholderTextColor="#B0BDB8"
                value={memberId}
                onChangeText={setMemberId}
              />

              <Text style={styles.label}>Group Number (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Found on your insurance card"
                placeholderTextColor="#B0BDB8"
                value={groupNumber}
                onChangeText={setGroupNumber}
              />
            </>
          )}

          <View style={styles.noteCard}>
            <Text style={styles.noteText}>
              🔒  Insurance information is encrypted and stored securely. We never share it with insurers.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('HomeDashboard')}>
            <Text style={styles.btnText}>Complete Setup 🎉</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('HomeDashboard')}>
            <Text style={styles.skipText}>Skip for now</Text>
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
  backText: { fontSize: 16, color: '#1A7A5E', fontWeight: '500' },
  progressBar: { height: 4, backgroundColor: '#E0EDEA', borderRadius: 2, marginBottom: 8 },
  progressFill: { height: 4, backgroundColor: '#1A7A5E', borderRadius: 2 },
  stepLabel: { fontSize: 12, color: '#1A7A5E', fontWeight: '600', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A2B25', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7C76', lineHeight: 20 },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#3D5247', marginTop: 16, marginBottom: 10 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  typeChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D4E3DE', backgroundColor: '#FFFFFF',
  },
  typeChipActive: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  typeChipText: { fontSize: 14, color: '#3D5247', fontWeight: '500' },
  typeChipTextActive: { color: '#FFFFFF' },
  label: { fontSize: 13, fontWeight: '600', color: '#3D5247', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1.5, borderColor: '#D4E3DE', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15,
    backgroundColor: '#FFFFFF', color: '#1A2B25',
  },
  noteCard: {
    backgroundColor: '#E8F5F0', borderRadius: 12, padding: 14,
    marginTop: 20, marginBottom: 24,
  },
  noteText: { fontSize: 13, color: '#1A5C45', lineHeight: 18 },
  footer: { paddingHorizontal: 16, paddingBottom: 24 },
  btn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { color: '#6B7C76', fontSize: 14, textDecorationLine: 'underline' },
});
