import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IntakeSafetyQuestions'>;
};

type YesNo = 'yes' | 'no' | null;

const RED_FLAG_QUESTIONS = [
  { id: 'chest_pain', label: 'Severe chest pain or pressure?', icon: '💔', urgent: true },
  { id: 'breathing', label: 'Difficulty breathing or shortness of breath?', icon: '😮‍💨', urgent: true },
  { id: 'consciousness', label: 'Loss of consciousness or near-fainting?', icon: '💫', urgent: true },
  { id: 'stroke', label: 'Sudden facial drooping, arm weakness, or slurred speech?', icon: '🧠', urgent: true },
  { id: 'severe_bleeding', label: 'Uncontrolled or severe bleeding?', icon: '🩸', urgent: true },
  { id: 'allergic', label: 'Severe allergic reaction (swollen throat, hives, difficulty breathing)?', icon: '🚨', urgent: true },
  { id: 'suicidal', label: 'Thoughts of self-harm or suicide?', icon: '💙', urgent: true },
  { id: 'poisoning', label: 'Possible poisoning or medication overdose?', icon: '⚗️', urgent: true },
];

export default function IntakeSafetyQuestionsScreen({ navigation }: Props) {
  const [answers, setAnswers] = useState<Record<string, YesNo>>({});

  const setAnswer = (id: string, val: YesNo) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const hasUrgentYes = RED_FLAG_QUESTIONS.some((q) => answers[q.id] === 'yes');
  const allAnswered = RED_FLAG_QUESTIONS.every((q) => answers[q.id] !== undefined);

  const handleContinue = () => {
    if (hasUrgentYes) {
      navigation.navigate('Emergency');
    } else {
      navigation.navigate('IntakeReview');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '62%' }]} />
        </View>
        <Text style={styles.stepLabel}>Step 5 of 8</Text>
        <Text style={styles.title}>Safety Check</Text>
        <Text style={styles.subtitle}>These help us identify if you need emergency care right now.</Text>
      </View>

      {hasUrgentYes && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>🚨 You may need emergency care. Continue to see your options.</Text>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {RED_FLAG_QUESTIONS.map((q) => (
          <View key={q.id} style={[styles.questionCard, answers[q.id] === 'yes' && styles.questionCardUrgent]}>
            <View style={styles.questionRow}>
              <Text style={styles.questionIcon}>{q.icon}</Text>
              <Text style={styles.questionText}>{q.label}</Text>
            </View>
            <View style={styles.ynRow}>
              <TouchableOpacity
                style={[
                  styles.ynBtn,
                  answers[q.id] === 'yes' && styles.ynBtnYes,
                ]}
                onPress={() => setAnswer(q.id, 'yes')}
              >
                <Text style={[styles.ynText, answers[q.id] === 'yes' && styles.ynTextActive]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.ynBtn,
                  answers[q.id] === 'no' && styles.ynBtnNo,
                ]}
                onPress={() => setAnswer(q.id, 'no')}
              >
                <Text style={[styles.ynText, answers[q.id] === 'no' && styles.ynTextActive]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, !allAnswered && styles.btnDisabled, hasUrgentYes && styles.btnEmergency]}
          onPress={() => allAnswered && handleContinue()}
          disabled={!allAnswered}
        >
          <Text style={styles.btnText}>
            {hasUrgentYes ? '🚨 Get Emergency Help' : 'Next: Review Answers →'}
          </Text>
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
  subtitle: { fontSize: 14, color: '#6B7C76', lineHeight: 20 },
  alertBanner: {
    backgroundColor: '#FFE8E8', borderLeftWidth: 4, borderLeftColor: '#CC0000',
    paddingHorizontal: 16, paddingVertical: 12, marginHorizontal: 16, borderRadius: 8,
    marginBottom: 4,
  },
  alertText: { color: '#CC0000', fontSize: 13, fontWeight: '600' },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  questionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  questionCardUrgent: { borderColor: '#FF6B6B', backgroundColor: '#FFF5F5' },
  questionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  questionIcon: { fontSize: 20, marginTop: 2 },
  questionText: { flex: 1, fontSize: 14, color: '#1A2B25', fontWeight: '500', lineHeight: 20 },
  ynRow: { flexDirection: 'row', gap: 10 },
  ynBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#D4E3DE', alignItems: 'center',
    backgroundColor: '#F8FFFE',
  },
  ynBtnYes: { backgroundColor: '#CC0000', borderColor: '#CC0000' },
  ynBtnNo: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  ynText: { fontSize: 14, fontWeight: '600', color: '#3D5247' },
  ynTextActive: { color: '#FFFFFF' },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  btn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#B0C4BC' },
  btnEmergency: { backgroundColor: '#CC0000' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
