import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PostDiagnosis'>;
};

const FOLLOW_UP_DAYS = [3, 5, 7, 10, 14];

const CHECKLIST = [
  { id: 'rest', label: 'Get 8+ hours of sleep tonight', icon: '😴' },
  { id: 'hydrate', label: 'Drink at least 8 glasses of water', icon: '💧' },
  { id: 'meds', label: 'Take Acetaminophen if needed (every 6h)', icon: '💊' },
  { id: 'avoid_work', label: 'Limit screen time and stressful activities', icon: '📵' },
  { id: 'monitor', label: 'Monitor temperature twice daily', icon: '🌡️' },
];

export default function PostDiagnosisScreen({ navigation }: Props) {
  const [checked, setChecked] = useState<string[]>([]);
  const [followUpDay, setFollowUpDay] = useState<number | null>(7);

  const toggleCheck = (id: string) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allChecked = checked.length === CHECKLIST.length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>What To Do Next</Text>
        <Text style={styles.subtitle}>Follow-up plan for Common Cold · Self-Care</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Recovery Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardTitle}>Expected Recovery</Text>
          <View style={styles.timelineLine}>
            {[
              { day: 'Day 1–2', label: 'Worst symptoms', color: '#CC3300' },
              { day: 'Day 3–5', label: 'Improving', color: '#D97706' },
              { day: 'Day 7–10', label: 'Full recovery', color: '#1A7A5E' },
            ].map((step, i) => (
              <View key={i} style={styles.timelineStep}>
                <View style={[styles.timelineDot, { backgroundColor: step.color }]} />
                <Text style={[styles.timelineDay, { color: step.color }]}>{step.day}</Text>
                <Text style={styles.timelineLabel}>{step.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Today's Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Self-Care Checklist</Text>
          {CHECKLIST.map((item) => {
            const isChecked = checked.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.checkItem, isChecked && styles.checkItemDone]}
                onPress={() => toggleCheck(item.id)}
              >
                <Text style={styles.checkIcon}>{item.icon}</Text>
                <Text style={[styles.checkLabel, isChecked && styles.checkLabelDone]}>
                  {item.label}
                </Text>
                <View style={[styles.checkbox, isChecked && styles.checkboxDone]}>
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
          {allChecked && (
            <View style={styles.allDoneCard}>
              <Text style={styles.allDoneText}>🎉  Great job! You've completed your self-care plan for today.</Text>
            </View>
          )}
        </View>

        {/* Set Follow-up Reminder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Set Follow-up Check-in</Text>
          <Text style={styles.sectionDesc}>We'll remind you to log your symptoms and see if you're feeling better.</Text>
          <View style={styles.dayChips}>
            {FOLLOW_UP_DAYS.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayChip, followUpDay === day && styles.dayChipActive]}
                onPress={() => setFollowUpDay(day)}
              >
                <Text style={[styles.dayChipText, followUpDay === day && styles.dayChipTextActive]}>
                  {day}d
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {followUpDay && (
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderInfoText}>
                📅  Follow-up check-in set for {followUpDay} days from now.
              </Text>
            </View>
          )}
        </View>

        {/* Warning Signs */}
        <View style={styles.warnCard}>
          <Text style={styles.warnTitle}>⚠️  When to Seek Immediate Care</Text>
          {[
            'Fever above 103°F (39.4°C)',
            'Difficulty breathing or chest pain',
            'Symptoms not improving after 10 days',
            'Severe or unusual headache',
          ].map((w, i) => (
            <Text key={i} style={styles.warnItem}>• {w}</Text>
          ))}
          <TouchableOpacity style={styles.erBtn} onPress={() => navigation.navigate('Emergency')}>
            <Text style={styles.erBtnText}>🚨  Go to Emergency Screen</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('HomeDashboard')}>
          <Text style={styles.homeBtnText}>Done — Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FFFE' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, color: '#1A7A5E', fontWeight: '500' },
  title: { fontSize: 22, fontWeight: '700', color: '#1A2B25', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7C76' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  timelineCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A2B25', marginBottom: 14 },
  timelineLine: { flexDirection: 'row', justifyContent: 'space-between' },
  timelineStep: { flex: 1, alignItems: 'center' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 6 },
  timelineDay: { fontSize: 12, fontWeight: '700', marginBottom: 3 },
  timelineLabel: { fontSize: 11, color: '#6B7C76', textAlign: 'center' },
  section: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A2B25', marginBottom: 10 },
  sectionDesc: { fontSize: 13, color: '#6B7C76', marginBottom: 12 },
  checkItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F0F4F2', gap: 10,
  },
  checkItemDone: { opacity: 0.6 },
  checkIcon: { fontSize: 20, width: 28 },
  checkLabel: { flex: 1, fontSize: 14, color: '#3D5247' },
  checkLabelDone: { textDecorationLine: 'line-through', color: '#B0BDB8' },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#D4E3DE', alignItems: 'center', justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  checkmark: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  allDoneCard: {
    backgroundColor: '#E8F5F0', borderRadius: 10, padding: 12, marginTop: 10,
  },
  allDoneText: { fontSize: 13, color: '#1A5C45', fontWeight: '500' },
  dayChips: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  dayChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D4E3DE', backgroundColor: '#F8FFFE',
  },
  dayChipActive: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  dayChipText: { fontSize: 14, color: '#3D5247', fontWeight: '500' },
  dayChipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  reminderInfo: { backgroundColor: '#E8F5F0', borderRadius: 10, padding: 10 },
  reminderInfoText: { fontSize: 13, color: '#1A5C45' },
  warnCard: {
    backgroundColor: '#FFF8E6', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#F0D87A', marginBottom: 8,
  },
  warnTitle: { fontSize: 14, fontWeight: '700', color: '#7B5900', marginBottom: 10 },
  warnItem: { fontSize: 14, color: '#7B5900', lineHeight: 22 },
  erBtn: {
    backgroundColor: '#CC0000', borderRadius: 10, paddingVertical: 12,
    alignItems: 'center', marginTop: 12,
  },
  erBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  homeBtn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  homeBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
