import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IntakeBodyArea'>;
};

const BODY_AREAS = [
  { id: 'head', label: 'Head / Face', icon: '🧠', zone: 'upper' },
  { id: 'eyes', label: 'Eyes', icon: '👁️', zone: 'upper' },
  { id: 'ears', label: 'Ears', icon: '👂', zone: 'upper' },
  { id: 'nose', label: 'Nose / Sinuses', icon: '👃', zone: 'upper' },
  { id: 'throat', label: 'Throat / Mouth', icon: '🗣️', zone: 'upper' },
  { id: 'neck', label: 'Neck', icon: '🧣', zone: 'upper' },
  { id: 'chest', label: 'Chest / Heart', icon: '❤️', zone: 'middle' },
  { id: 'lungs', label: 'Lungs / Breathing', icon: '🫁', zone: 'middle' },
  { id: 'stomach', label: 'Stomach / Abdomen', icon: '🫃', zone: 'middle' },
  { id: 'back', label: 'Back / Spine', icon: '🦷', zone: 'middle' },
  { id: 'arms', label: 'Arms / Hands', icon: '💪', zone: 'lower' },
  { id: 'legs', label: 'Legs / Feet', icon: '🦵', zone: 'lower' },
  { id: 'skin', label: 'Skin / Rash', icon: '🩹', zone: 'lower' },
  { id: 'urinary', label: 'Urinary / Kidney', icon: '💧', zone: 'lower' },
  { id: 'genital', label: 'Reproductive', icon: '🌸', zone: 'lower' },
  { id: 'whole', label: 'Whole Body / General', icon: '🧍', zone: 'lower' },
];

const ZONES = ['upper', 'middle', 'lower'];
const ZONE_LABELS: Record<string, string> = {
  upper: 'Head & Upper Body',
  middle: 'Chest & Midsection',
  lower: 'Lower Body',
};

export default function IntakeBodyAreaScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '25%' }]} />
        </View>
        <Text style={styles.stepLabel}>Step 2 of 8</Text>
        <Text style={styles.title}>Where do you feel it?</Text>
        <Text style={styles.subtitle}>Select all affected body areas.</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {ZONES.map((zone) => (
          <View key={zone} style={styles.zoneSection}>
            <Text style={styles.zoneLabel}>{ZONE_LABELS[zone]}</Text>
            <View style={styles.areaGrid}>
              {BODY_AREAS.filter((a) => a.zone === zone).map((area) => (
                <TouchableOpacity
                  key={area.id}
                  style={[styles.areaCard, selected.includes(area.id) && styles.areaCardActive]}
                  onPress={() => toggle(area.id)}
                >
                  <Text style={styles.areaIcon}>{area.icon}</Text>
                  <Text style={[styles.areaLabel, selected.includes(area.id) && styles.areaLabelActive]}>
                    {area.label}
                  </Text>
                  {selected.includes(area.id) && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footer}>
        {selected.length > 0 && (
          <Text style={styles.selectedCount}>{selected.length} area{selected.length > 1 ? 's' : ''} selected</Text>
        )}
        <TouchableOpacity
          style={[styles.btn, selected.length === 0 && styles.btnDisabled]}
          onPress={() => selected.length > 0 && navigation.navigate('IntakeFever')}
          disabled={selected.length === 0}
        >
          <Text style={styles.btnText}>Next: Fever & Vitals →</Text>
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
  zoneSection: { marginBottom: 20 },
  zoneLabel: { fontSize: 13, fontWeight: '600', color: '#3D5247', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  areaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  areaCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: '#D4E3DE', alignItems: 'center', position: 'relative',
  },
  areaCardActive: { backgroundColor: '#E8F5F0', borderColor: '#1A7A5E' },
  areaIcon: { fontSize: 28, marginBottom: 6 },
  areaLabel: { fontSize: 13, fontWeight: '500', color: '#3D5247', textAlign: 'center' },
  areaLabelActive: { color: '#1A5C45' },
  checkmark: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#1A7A5E', alignItems: 'center', justifyContent: 'center',
  },
  checkmarkText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  selectedCount: { fontSize: 13, color: '#1A7A5E', fontWeight: '500', textAlign: 'center', marginBottom: 8 },
  btn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#B0C4BC' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
