import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

type UrgencyLevel = 'self_care' | 'see_doctor' | 'urgent_care' | 'emergency';
type Props = { navigation?: any; route?: { params?: { urgency?: UrgencyLevel; recommended_specialty?: string; advice?: string } } };

const TIERS = [
  { id: 'self_care' as UrgencyLevel, label: 'Self-Care at Home', shortLabel: 'Self-Care', color: '#1B6B4A', bg: '#D6F5E8', icon: '🏠', description: 'Your symptoms are mild and can be managed at home with rest and over-the-counter remedies.', actions: ['Rest and get plenty of sleep', 'Stay hydrated — drink water and clear fluids', 'Take OTC medication as directed (ibuprofen, antihistamines)', 'Monitor symptoms — see a doctor if they worsen after 3–5 days'] },
  { id: 'see_doctor' as UrgencyLevel, label: 'Schedule a Doctor Visit', shortLabel: 'See a Doctor', color: '#1A5A99', bg: '#D6E8FF', icon: '🩺', description: 'Your symptoms suggest you should see a doctor within the next day or two for proper evaluation.', actions: ['Book an appointment with your primary care physician', 'Use a telehealth service if in-person isn\'t available', 'Bring a list of your current medications', 'Describe when symptoms started and how they\'ve changed'] },
  { id: 'urgent_care' as UrgencyLevel, label: 'Visit Urgent Care', shortLabel: 'Urgent Care', color: '#B85C00', bg: '#FFE8CC', icon: '⚡', description: 'Your symptoms need attention today. Visit an urgent care clinic — no appointment needed.', actions: ['Find the nearest urgent care clinic', 'Go today — do not wait for a primary care appointment', 'Bring your insurance card and ID', 'Tell them your symptoms started: describe timeline and severity'] },
  { id: 'emergency' as UrgencyLevel, label: 'Go to Emergency Room', shortLabel: 'Emergency', color: '#CC0000', bg: '#FFE0E0', icon: '🚨', description: 'Your symptoms may be serious. Call 911 or go to the ER immediately.', actions: ['Call 911 or have someone drive you to the ER', 'Do NOT drive yourself', 'Bring your medications list if possible', 'Tell ER staff your most severe symptoms first'] },
];

export default function TriageScreen({ navigation, route }: Props) {
  const urgency: UrgencyLevel = route?.params?.urgency ?? 'see_doctor';
  const specialty = route?.params?.recommended_specialty ?? 'Primary Care';
  const advice = route?.params?.advice ?? 'Monitor your symptoms and follow the recommendations below.';
  const activeTier = TIERS.find(t => t.id === urgency) ?? TIERS[1];

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>DiagnosisCloud</Text>
        <View style={{ width: 36 }} />
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.title}>Care Recommendation</Text>
        <View style={[s.activeCard, { borderColor: activeTier.color, backgroundColor: activeTier.bg }]}>
          <Text style={s.activeIcon}>{activeTier.icon}</Text>
          <Text style={[s.activeLabel, { color: activeTier.color }]}>{activeTier.label}</Text>
          <Text style={[s.activeDesc, { color: activeTier.color }]}>{activeTier.description}</Text>
        </View>
        <View style={s.specialtyRow}>
          <Text style={s.specialtyLabel}>Recommended Specialist</Text>
          <Text style={s.specialtyValue}>{specialty}</Text>
        </View>
        <View style={s.adviceBox}>
          <Text style={s.adviceTitle}>What to do next</Text>
          <Text style={s.adviceText}>{advice}</Text>
        </View>
        <Text style={s.stepsTitle}>Suggested Steps</Text>
        {activeTier.actions.map((action, i) => (
          <View key={i} style={s.stepRow}>
            <View style={[s.stepDot, { backgroundColor: activeTier.color }]}><Text style={s.stepNum}>{i + 1}</Text></View>
            <Text style={s.stepText}>{action}</Text>
          </View>
        ))}
        <Text style={s.overviewTitle}>Urgency Levels</Text>
        <View style={s.tierRow}>
          {TIERS.map(tier => (
            <View key={tier.id} style={[s.tierChip, { backgroundColor: tier.id === urgency ? tier.color : '#E8ECF0' }]}>
              <Text style={[s.tierChipText, { color: tier.id === urgency ? '#fff' : '#6B7C8D' }]}>{tier.icon} {tier.shortLabel}</Text>
            </View>
          ))}
        </View>
        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>⚠️ This is not a medical diagnosis. Always follow the advice of your healthcare provider.</Text>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E8ECF0' },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backArrow: { fontSize: 22, color: '#1A2E3B' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A7A5E' },
  scroll: { padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A2E3B', marginBottom: 16 },
  activeCard: { borderRadius: 16, borderWidth: 2, padding: 20, alignItems: 'center', marginBottom: 20 },
  activeIcon: { fontSize: 40, marginBottom: 10 },
  activeLabel: { fontSize: 20, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  activeDesc: { fontSize: 14, lineHeight: 20, textAlign: 'center', opacity: 0.85 },
  specialtyRow: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  specialtyLabel: { fontSize: 14, color: '#6B7C8D', fontWeight: '500' },
  specialtyValue: { fontSize: 15, fontWeight: '700', color: '#1A2E3B' },
  adviceBox: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
  adviceTitle: { fontSize: 15, fontWeight: '700', color: '#1A2E3B', marginBottom: 8 },
  adviceText: { fontSize: 14, color: '#4A5568', lineHeight: 21 },
  stepsTitle: { fontSize: 17, fontWeight: '700', color: '#1A2E3B', marginBottom: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  stepDot: { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 1 },
  stepNum: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 14, color: '#4A5568', lineHeight: 21 },
  overviewTitle: { fontSize: 15, fontWeight: '700', color: '#1A2E3B', marginTop: 20, marginBottom: 10 },
  tierRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tierChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  tierChipText: { fontSize: 12, fontWeight: '600' },
  disclaimer: { backgroundColor: '#FFF8E6', borderRadius: 10, padding: 14, borderLeftWidth: 3, borderLeftColor: '#F5A623' },
  disclaimerText: { fontSize: 13, color: '#7A5C00', lineHeight: 19 },
});
