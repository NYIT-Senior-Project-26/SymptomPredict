import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

type UrgencyLevel = 'self_care' | 'see_doctor' | 'urgent_care' | 'emergency';

type Tier = {
  id: UrgencyLevel;
  label: string;
  shortLabel: string;
  color: string;
  bg: string;
  icon: string;
  description: string;
  actions: string[];
};

const TIERS: Tier[] = [
  {
    id: 'self_care',
    label: 'Self-Care at Home',
    shortLabel: 'Self-Care',
    color: '#1B6B4A',
    bg: '#D6F5E8',
    icon: '🏠',
    description: 'Your symptoms are mild and can be managed at home with rest and over-the-counter remedies.',
    actions: [
      'Rest and get plenty of sleep',
      'Stay hydrated — drink water and clear fluids',
      'Take OTC medication as directed (ibuprofen, antihistamines)',
      'Monitor symptoms — see a doctor if they worsen after 3–5 days',
    ],
  },
  {
    id: 'see_doctor',
    label: 'Schedule a Doctor Visit',
    shortLabel: 'See a Doctor',
    color: '#1A5A99',
    bg: '#D6E8FF',
    icon: '🩺',
    description: 'Your symptoms suggest you should see a doctor within the next day or two for proper evaluation.',
    actions: [
      'Book an appointment with your primary care physician',
      'Use a telehealth service if in-person isn\'t available',
      'Bring a list of your current medications',
      'Describe when symptoms started and how they\'ve changed',
    ],
  },
  {
    id: 'urgent_care',
    label: 'Visit Urgent Care',
    shortLabel: 'Urgent Care',
    color: '#B85C00',
    bg: '#FFE8CC',
    icon: '⚡',
    description: 'Your symptoms need attention today. Visit an urgent care clinic — no appointment needed.',
    actions: [
      'Find the nearest urgent care clinic',
      'Go today — do not wait for a primary care appointment',
      'Bring your insurance card and ID',
      'Tell them your symptoms started: describe timeline and severity',
    ],
  },
  {
    id: 'emergency',
    label: 'Go to Emergency Room',
    shortLabel: 'Emergency',
    color: '#CC0000',
    bg: '#FFE0E0',
    icon: '🚨',
    description: 'Your symptoms may be serious. Call 911 or go to the ER immediately.',
    actions: [
      'Call 911 or have someone drive you to the ER',
      'Do NOT drive yourself',
      'Bring your medications list if possible',
      'Tell ER staff your most severe symptoms first',
    ],
  },
];

type Props = {
  navigation?: any;
  route?: {
    params?: {
      urgency?: UrgencyLevel;
      recommended_specialty?: string;
      advice?: string;
    };
  };
};

export default function TriageScreen({ navigation, route }: Props) {
  const urgency: UrgencyLevel = route?.params?.urgency ?? 'see_doctor';
  const specialty = route?.params?.recommended_specialty ?? 'Primary Care';
  const advice = route?.params?.advice ?? 'Monitor your symptoms and follow the recommendations below.';

  const activeTier = TIERS.find(t => t.id === urgency) ?? TIERS[1];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DiagnosisCloud</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Care Recommendation</Text>

        {/* Active triage card */}
        <View style={[styles.activeCard, { borderColor: activeTier.color, backgroundColor: activeTier.bg }]}>
          <Text style={styles.activeIcon}>{activeTier.icon}</Text>
          <Text style={[styles.activeLabel, { color: activeTier.color }]}>{activeTier.label}</Text>
          <Text style={[styles.activeDesc, { color: activeTier.color }]}>{activeTier.description}</Text>
        </View>

        {/* Recommended specialty */}
        <View style={styles.specialtyRow}>
          <Text style={styles.specialtyLabel}>Recommended Specialist</Text>
          <Text style={styles.specialtyValue}>{specialty}</Text>
        </View>

        {/* AI advice */}
        <View style={styles.adviceBox}>
          <Text style={styles.adviceTitle}>What to do next</Text>
          <Text style={styles.adviceText}>{advice}</Text>
        </View>

        {/* Action steps */}
        <Text style={styles.stepsTitle}>Suggested Steps</Text>
        {activeTier.actions.map((action, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={[styles.stepDot, { backgroundColor: activeTier.color }]}>
              <Text style={styles.stepNum}>{i + 1}</Text>
            </View>
            <Text style={styles.stepText}>{action}</Text>
          </View>
        ))}

        {/* Triage tier overview */}
        <Text style={styles.overviewTitle}>Urgency Levels</Text>
        <View style={styles.tierRow}>
          {TIERS.map(tier => (
            <View
              key={tier.id}
              style={[
                styles.tierChip,
                { backgroundColor: tier.id === urgency ? tier.color : '#E8ECF0' },
              ]}
            >
              <Text style={[styles.tierChipText, { color: tier.id === urgency ? '#fff' : '#6B7C8D' }]}>
                {tier.icon} {tier.shortLabel}
              </Text>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This is not a medical diagnosis. Always follow the advice of your healthcare provider.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: '#1A2E3B',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A7A5E',
  },
  scroll: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2E3B',
    marginBottom: 16,
  },
  activeCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  activeIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  activeLabel: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  activeDesc: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    opacity: 0.85,
  },
  specialtyRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  specialtyLabel: {
    fontSize: 14,
    color: '#6B7C8D',
    fontWeight: '500',
  },
  specialtyValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2E3B',
  },
  adviceBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  adviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2E3B',
    marginBottom: 8,
  },
  adviceText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 21,
  },
  stepsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A2E3B',
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  stepNum: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 21,
  },
  overviewTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2E3B',
    marginTop: 20,
    marginBottom: 10,
  },
  tierRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tierChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  tierChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  disclaimer: {
    backgroundColor: '#FFF8E6',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#F5A623',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#7A5C00',
    lineHeight: 19,
  },
});
