import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProfileBasic'>;
};

const SEX_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function ProfileBasicScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState('');

  const canContinue = firstName && lastName && dob && sex;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '14%' }]} />
          </View>
          <Text style={styles.stepLabel}>Step 1 of 7 — Basic Info</Text>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>This helps us personalize your health experience.</Text>
        </View>

        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              placeholderTextColor="#B0BDB8"
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              placeholderTextColor="#B0BDB8"
              value={lastName}
              onChangeText={setLastName}
            />

            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="MM / DD / YYYY"
              placeholderTextColor="#B0BDB8"
              value={dob}
              onChangeText={setDob}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Biological Sex</Text>
            <View style={styles.sexGrid}>
              {SEX_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.sexChip, sex === option && styles.sexChipActive]}
                  onPress={() => setSex(option)}
                >
                  <Text style={[styles.sexChipText, sex === option && styles.sexChipTextActive]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btn, !canContinue && styles.btnDisabled]}
            onPress={() => canContinue && navigation.navigate('ProfileAllergies')}
            disabled={!canContinue}
          >
            <Text style={styles.btnText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FFFE' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  progressBar: { height: 4, backgroundColor: '#E0EDEA', borderRadius: 2, marginBottom: 8 },
  progressFill: { height: 4, backgroundColor: '#1A7A5E', borderRadius: 2 },
  stepLabel: { fontSize: 12, color: '#1A7A5E', fontWeight: '600', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A2B25', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#6B7C76' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  form: { paddingTop: 24, paddingBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#3D5247', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1.5, borderColor: '#D4E3DE', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15,
    backgroundColor: '#FFFFFF', color: '#1A2B25',
  },
  sexGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  sexChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D4E3DE', backgroundColor: '#FFFFFF',
  },
  sexChipActive: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  sexChipText: { fontSize: 14, color: '#3D5247', fontWeight: '500' },
  sexChipTextActive: { color: '#FFFFFF' },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  btn: {
    backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#B0C4BC' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
