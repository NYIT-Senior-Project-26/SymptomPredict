import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SessionSummary'>;
};

export default function SessionSummaryScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Session Summary</Text>
        <Text style={styles.date}>November 8, 2026 · 10:32 AM</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.diagnosisRow}>
            <View style={styles.diagnosisIcon}>
              <Text style={styles.diagnosisIconText}>🤧</Text>
            </View>
            <View style={styles.diagnosisInfo}>
              <Text style={styles.diagnosisLabel}>Primary Diagnosis</Text>
              <Text style={styles.diagnosisName}>Common Cold</Text>
              <View style={styles.highBadge}>
                <Text style={styles.highBadgeText}>High Likelihood</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Symptoms reported */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Symptoms Reported</Text>
          {['Throbbing headache', 'Fatigue', 'Low-grade fever (99.4°F)', 'Nasal congestion'].map((s, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* AI Advice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 AI Recommendations</Text>
          <Text style={styles.bodyText}>
            Rest and stay well hydrated. Take acetaminophen or ibuprofen for comfort. If symptoms worsen after 7 days or you develop a high fever ({'>'}103°F), seek medical attention.
          </Text>
        </View>

        {/* Urgency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏥 Care Level</Text>
          <View style={styles.urgencyCard}>
            <View style={styles.urgencyGreenDot} />
            <Text style={styles.urgencyLabel}>Self-Care at Home</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('PharmacyOTC')}>
            <Text style={styles.actionIcon}>💊</Text>
            <Text style={styles.actionText}>OTC Meds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('FindCare')}>
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionText}>Find Care</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Export')}>
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionText}>Export PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MedicationAssistant')}>
            <Text style={styles.actionIcon}>🤖</Text>
            <Text style={styles.actionText}>Ask AI</Text>
          </TouchableOpacity>
        </View>

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
  title: { fontSize: 22, fontWeight: '700', color: '#1A2B25', marginBottom: 2 },
  date: { fontSize: 13, color: '#6B7C76' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  diagnosisRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  diagnosisIcon: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#E8F5F0', alignItems: 'center', justifyContent: 'center',
  },
  diagnosisIconText: { fontSize: 28 },
  diagnosisInfo: { flex: 1 },
  diagnosisLabel: { fontSize: 12, color: '#6B7C76', marginBottom: 2 },
  diagnosisName: { fontSize: 20, fontWeight: '700', color: '#1A2B25', marginBottom: 6 },
  highBadge: { backgroundColor: '#D6F5E8', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start' },
  highBadgeText: { fontSize: 12, color: '#1B6B4A', fontWeight: '600' },
  section: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1A2B25', marginBottom: 10 },
  listItem: { flexDirection: 'row', marginBottom: 6, gap: 8 },
  listBullet: { fontSize: 15, color: '#1A7A5E' },
  listText: { flex: 1, fontSize: 14, color: '#3D5247', lineHeight: 20 },
  bodyText: { fontSize: 14, color: '#3D5247', lineHeight: 20 },
  urgencyCard: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  urgencyGreenDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#1A7A5E' },
  urgencyLabel: { fontSize: 15, fontWeight: '600', color: '#1A7A5E' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  actionBtn: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#E8EFEC',
  },
  actionIcon: { fontSize: 24, marginBottom: 6 },
  actionText: { fontSize: 13, color: '#3D5247', fontWeight: '500' },
});
