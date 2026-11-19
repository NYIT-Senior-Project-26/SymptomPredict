import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IntakeReview'>;
};

const MOCK_REVIEW = {
  description: 'Throbbing headache on right side, started this morning, worse with movement',
  duration: '1–3 days',
  onset: 'Gradual',
  bodyAreas: ['Head / Face', 'Neck'],
  fever: 'Yes — 99.4°F',
  chills: 'No',
  vomiting: 'No',
  rash: 'No',
  painSeverity: '6/10 — Significant',
  painType: 'Throbbing, Pressure',
  safetyFlags: 'None',
};

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.reviewRow}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={styles.reviewValue}>{value}</Text>
  </View>
);

export default function IntakeReviewScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '87%' }]} />
        </View>
        <Text style={styles.stepLabel}>Step 7 of 8</Text>
        <Text style={styles.title}>Review Your Answers</Text>
        <Text style={styles.subtitle}>Confirm everything looks right before we analyze your symptoms.</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Symptoms</Text>
          <ReviewRow label="Description" value={MOCK_REVIEW.description} />
          <ReviewRow label="Duration" value={MOCK_REVIEW.duration} />
          <ReviewRow label="Onset" value={MOCK_REVIEW.onset} />
          <ReviewRow label="Body areas" value={MOCK_REVIEW.bodyAreas.join(', ')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌡️ Vitals & Related</Text>
          <ReviewRow label="Fever" value={MOCK_REVIEW.fever} />
          <ReviewRow label="Chills" value={MOCK_REVIEW.chills} />
          <ReviewRow label="Vomiting" value={MOCK_REVIEW.vomiting} />
          <ReviewRow label="Rash" value={MOCK_REVIEW.rash} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💊 Pain</Text>
          <ReviewRow label="Severity" value={MOCK_REVIEW.painSeverity} />
          <ReviewRow label="Type" value={MOCK_REVIEW.painType} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ Safety</Text>
          <ReviewRow label="Red flags" value={MOCK_REVIEW.safetyFlags} />
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.editBtnText}>✏️  Edit answers</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('IntakeLoading')}
        >
          <Text style={styles.btnText}>Analyze My Symptoms 🔍</Text>
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          AI analysis is not a medical diagnosis. Always consult a healthcare professional.
        </Text>
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
  subtitle: { fontSize: 14, color: '#6B7C76', lineHeight: 20 },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  section: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1A2B25', marginBottom: 12 },
  reviewRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  reviewLabel: { width: 100, fontSize: 13, color: '#6B7C76', fontWeight: '500' },
  reviewValue: { flex: 1, fontSize: 13, color: '#1A2B25', lineHeight: 18 },
  editBtn: {
    alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 10, borderWidth: 1.5, borderColor: '#D4E3DE',
    backgroundColor: '#FFFFFF', marginBottom: 8,
  },
  editBtnText: { color: '#1A7A5E', fontSize: 14, fontWeight: '500' },
  footer: { paddingHorizontal: 16, paddingBottom: 24 },
  btn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  disclaimer: { fontSize: 11, color: '#B0BDB8', textAlign: 'center', lineHeight: 16 },
});
