import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HomeDashboard'>;
};

const QUICK_ACTIONS = [
  { icon: '🩺', label: 'Check Symptoms', screen: 'IntakeSymptom' },
  { icon: '💊', label: 'Medications', screen: 'MedicationAssistant' },
  { icon: '📋', label: 'History', screen: 'DiagnosisTimeline' },
  { icon: '👤', label: 'Profile', screen: 'ProfilePage' },
];

const RECENT_SESSIONS = [
  {
    date: 'Nov 8, 2026',
    symptoms: 'Headache, fatigue, mild fever',
    result: 'Common Cold',
    urgency: 'self_care',
    urgencyLabel: 'Self-Care',
    urgencyColor: '#1A7A5E',
    urgencyBg: '#E8F5F0',
  },
  {
    date: 'Oct 22, 2026',
    symptoms: 'Chest tightness, shortness of breath',
    result: 'Asthma exacerbation',
    urgency: 'urgent',
    urgencyLabel: 'See Doctor',
    urgencyColor: '#1565C0',
    urgencyBg: '#E3F2FD',
  },
];

export default function HomeDashboardScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, Muaz 👋</Text>
            <Text style={styles.date}>Wednesday, November 11, 2026</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProfilePage')} style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </TouchableOpacity>
        </View>

        {/* CTA Banner */}
        <TouchableOpacity
          style={styles.ctaBanner}
          onPress={() => navigation.navigate('IntakeSymptom')}
        >
          <View style={styles.ctaLeft}>
            <Text style={styles.ctaTitle}>How are you feeling today?</Text>
            <Text style={styles.ctaSubtitle}>Start a new symptom check</Text>
          </View>
          <View style={styles.ctaIcon}>
            <Text style={styles.ctaIconText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickCard}
              onPress={() => navigation.navigate(action.screen as any)}
            >
              <Text style={styles.quickIcon}>{action.icon}</Text>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Health Snapshot */}
        <View style={styles.snapshotCard}>
          <Text style={styles.sectionTitle}>Health Snapshot</Text>
          <View style={styles.snapshotRow}>
            <View style={styles.snapshotItem}>
              <Text style={styles.snapshotValue}>3</Text>
              <Text style={styles.snapshotLabel}>Sessions</Text>
            </View>
            <View style={styles.snapshotDivider} />
            <View style={styles.snapshotItem}>
              <Text style={styles.snapshotValue}>2</Text>
              <Text style={styles.snapshotLabel}>Medications</Text>
            </View>
            <View style={styles.snapshotDivider} />
            <View style={styles.snapshotItem}>
              <Text style={styles.snapshotValue}>0</Text>
              <Text style={styles.snapshotLabel}>Alerts</Text>
            </View>
          </View>
        </View>

        {/* Recent Sessions */}
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {RECENT_SESSIONS.map((session, i) => (
          <TouchableOpacity
            key={i}
            style={styles.sessionCard}
            onPress={() => navigation.navigate('SessionSummary')}
          >
            <View style={styles.sessionTop}>
              <Text style={styles.sessionDate}>{session.date}</Text>
              <View style={[styles.urgencyBadge, { backgroundColor: session.urgencyBg }]}>
                <Text style={[styles.urgencyText, { color: session.urgencyColor }]}>
                  {session.urgencyLabel}
                </Text>
              </View>
            </View>
            <Text style={styles.sessionSymptoms}>{session.symptoms}</Text>
            <Text style={styles.sessionResult}>→ {session.result}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FFFE' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 20, paddingBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: '#1A2B25' },
  date: { fontSize: 13, color: '#6B7C76', marginTop: 2 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#1A7A5E', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  ctaBanner: {
    backgroundColor: '#1A7A5E', borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
  },
  ctaLeft: { flex: 1 },
  ctaTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  ctaSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  ctaIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  ctaIconText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A2B25', marginBottom: 12 },
  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  quickCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#E8EFEC',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  quickIcon: { fontSize: 24, marginBottom: 6 },
  quickLabel: { fontSize: 12, color: '#3D5247', fontWeight: '500', textAlign: 'center' },
  snapshotCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  snapshotRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 },
  snapshotItem: { alignItems: 'center' },
  snapshotValue: { fontSize: 28, fontWeight: '700', color: '#1A7A5E' },
  snapshotLabel: { fontSize: 12, color: '#6B7C76', marginTop: 2 },
  snapshotDivider: { width: 1, backgroundColor: '#E8EFEC' },
  sessionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  sessionTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  sessionDate: { fontSize: 13, color: '#6B7C76', fontWeight: '500' },
  urgencyBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  urgencyText: { fontSize: 12, fontWeight: '600' },
  sessionSymptoms: { fontSize: 14, color: '#1A2B25', marginBottom: 4 },
  sessionResult: { fontSize: 13, color: '#1A7A5E', fontWeight: '500' },
});
