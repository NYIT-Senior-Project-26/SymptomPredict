import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DiagnosisTimeline'>;
};

const SESSIONS = [
  {
    date: 'Nov 8, 2026',
    time: '10:32 AM',
    primaryDiagnosis: 'Common Cold',
    symptoms: ['Headache', 'Fatigue', 'Low fever'],
    urgency: 'self_care',
    urgencyLabel: 'Self-Care',
    urgencyColor: '#1A7A5E',
    urgencyBg: '#E8F5F0',
    followUpDue: false,
  },
  {
    date: 'Oct 22, 2026',
    time: '2:15 PM',
    primaryDiagnosis: 'Asthma exacerbation',
    symptoms: ['Chest tightness', 'Shortness of breath', 'Wheezing'],
    urgency: 'urgent',
    urgencyLabel: 'Urgent Care',
    urgencyColor: '#D95E00',
    urgencyBg: '#FFF3E0',
    followUpDue: true,
  },
  {
    date: 'Sep 14, 2026',
    time: '8:40 AM',
    primaryDiagnosis: 'Acute Sinusitis',
    symptoms: ['Sinus pressure', 'Nasal congestion', 'Headache'],
    urgency: 'see_doctor',
    urgencyLabel: 'See Doctor',
    urgencyColor: '#1565C0',
    urgencyBg: '#E3F2FD',
    followUpDue: false,
  },
];

const PATTERNS = [
  { label: 'Headaches', count: 3, icon: '🧠', trend: '↑' },
  { label: 'Respiratory', count: 2, icon: '🫁', trend: '→' },
  { label: 'Avg severity', count: '5.2/10', icon: '📊', trend: null },
];

export default function DiagnosisTimelineScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Diagnosis Timeline</Text>
        <Text style={styles.subtitle}>Your health history over the past 6 months</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Pattern Chips */}
        <Text style={styles.sectionLabel}>Patterns Detected</Text>
        <View style={styles.patternRow}>
          {PATTERNS.map((p, i) => (
            <View key={i} style={styles.patternCard}>
              <Text style={styles.patternIcon}>{p.icon}</Text>
              <Text style={styles.patternValue}>{p.count}{p.trend ? ` ${p.trend}` : ''}</Text>
              <Text style={styles.patternLabel}>{p.label}</Text>
            </View>
          ))}
        </View>

        {/* Timeline */}
        <Text style={styles.sectionLabel}>History</Text>
        {SESSIONS.map((session, i) => (
          <View key={i} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
              <View style={[styles.dot, { borderColor: session.urgencyColor }]} />
              {i < SESSIONS.length - 1 && <View style={styles.line} />}
            </View>
            <TouchableOpacity
              style={styles.sessionCard}
              onPress={() => navigation.navigate('SessionSummary')}
            >
              <View style={styles.sessionTop}>
                <View>
                  <Text style={styles.sessionDate}>{session.date}</Text>
                  <Text style={styles.sessionTime}>{session.time}</Text>
                </View>
                <View style={[styles.urgencyBadge, { backgroundColor: session.urgencyBg }]}>
                  <Text style={[styles.urgencyText, { color: session.urgencyColor }]}>
                    {session.urgencyLabel}
                  </Text>
                </View>
              </View>

              <Text style={styles.sessionDiagnosis}>{session.primaryDiagnosis}</Text>

              <View style={styles.symptomChips}>
                {session.symptoms.map((s, si) => (
                  <View key={si} style={styles.symptomChip}>
                    <Text style={styles.symptomChipText}>{s}</Text>
                  </View>
                ))}
              </View>

              {session.followUpDue && (
                <View style={styles.followUpBanner}>
                  <Text style={styles.followUpText}>⚠️ Follow-up recommended</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.exportBtn} onPress={() => navigation.navigate('Export')}>
          <Text style={styles.exportBtnText}>📄  Export Full History</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
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
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#3D5247', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  patternRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  patternCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: '#E8EFEC',
  },
  patternIcon: { fontSize: 20, marginBottom: 4 },
  patternValue: { fontSize: 16, fontWeight: '700', color: '#1A2B25', marginBottom: 2 },
  patternLabel: { fontSize: 11, color: '#6B7C76', textAlign: 'center' },
  timelineRow: { flexDirection: 'row', marginBottom: 4 },
  timelineLeft: { width: 24, alignItems: 'center', paddingTop: 16 },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, backgroundColor: '#FFFFFF',
  },
  line: { flex: 1, width: 2, backgroundColor: '#E8EFEC', marginTop: 4 },
  sessionCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    marginLeft: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E8EFEC',
  },
  sessionTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  sessionDate: { fontSize: 13, fontWeight: '600', color: '#1A2B25' },
  sessionTime: { fontSize: 12, color: '#6B7C76', marginTop: 2 },
  urgencyBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start' },
  urgencyText: { fontSize: 12, fontWeight: '600' },
  sessionDiagnosis: { fontSize: 15, fontWeight: '600', color: '#1A2B25', marginBottom: 8 },
  symptomChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  symptomChip: {
    backgroundColor: '#F0F4F2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  symptomChipText: { fontSize: 12, color: '#3D5247' },
  followUpBanner: {
    backgroundColor: '#FFF8E6', borderRadius: 8, padding: 8, marginTop: 8,
  },
  followUpText: { fontSize: 12, color: '#8B6914', fontWeight: '500' },
  exportBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14,
    borderWidth: 1.5, borderColor: '#D4E3DE', alignItems: 'center', marginBottom: 8,
  },
  exportBtnText: { fontSize: 14, color: '#1A7A5E', fontWeight: '600' },
});
