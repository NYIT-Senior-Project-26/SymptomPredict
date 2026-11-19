import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

type Likelihood = 'high' | 'medium' | 'low';

type Condition = {
  name: string;
  likelihood: Likelihood;
  rationale: string;
};

type Props = {
  navigation?: any;
  route?: {
    params?: {
      conditions?: Condition[];
      urgency?: string;
      recommended_specialty?: string;
      advice?: string;
    };
  };
};

const MOCK_CONDITIONS: Condition[] = [
  { name: 'Common Cold', likelihood: 'high', rationale: 'Runny nose, sore throat, and mild fever are classic cold symptoms.' },
  { name: 'Seasonal Allergies', likelihood: 'high', rationale: 'Sneezing and watery eyes suggest an allergic response.' },
  { name: 'Influenza', likelihood: 'medium', rationale: 'Body aches and fatigue could indicate flu, though fever is mild.' },
  { name: 'Sinusitis', likelihood: 'medium', rationale: 'Congestion and facial pressure may point to sinus inflammation.' },
  { name: 'Strep Throat', likelihood: 'low', rationale: 'Throat pain is present but no visible white patches reported.' },
];

const LIKELIHOOD_CONFIG: Record<Likelihood, { color: string; bg: string; label: string }> = {
  high:   { color: '#1B6B4A', bg: '#D6F5E8', label: 'High' },
  medium: { color: '#7A5C00', bg: '#FFF3CD', label: 'Medium' },
  low:    { color: '#5C6B7A', bg: '#E9EEF2', label: 'Low' },
};

export default function DiagnosisResultsScreen({ navigation, route }: Props) {
  const conditions = route?.params?.conditions ?? MOCK_CONDITIONS;
  const urgency = route?.params?.urgency ?? 'see_doctor';
  const specialty = route?.params?.recommended_specialty ?? 'Primary Care';
  const advice = route?.params?.advice ?? 'Rest, stay hydrated, and monitor your symptoms over the next 48 hours.';

  const isEmergency = urgency === 'emergency';

  function handleContinue() {
    if (isEmergency) {
      navigation?.navigate('Emergency');
    } else {
      navigation?.navigate('Triage', { urgency, specialty, advice });
    }
  }

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
        <Text style={styles.sectionTitle}>Top Possible Conditions</Text>
        <Text style={styles.subTitle}>Based on your symptoms, here are the most likely diagnoses ranked by probability.</Text>

        {conditions.slice(0, 5).map((cond, index) => {
          const cfg = LIKELIHOOD_CONFIG[cond.likelihood];
          return (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.rankCircle}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <Text style={styles.conditionName}>{cond.name}</Text>
                <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
              <Text style={styles.rationale}>{cond.rationale}</Text>
            </View>
          );
        })}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This is not a medical diagnosis. Always consult a healthcare professional for proper evaluation and treatment.
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, isEmergency && styles.ctaBtnRed]}
          onPress={handleContinue}
        >
          <Text style={styles.ctaBtnText}>
            {isEmergency ? '🚨 Get Emergency Help' : 'See Care Recommendations →'}
          </Text>
        </TouchableOpacity>

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
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 14,
    color: '#6B7C8D',
    marginBottom: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rankCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A7A5E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  conditionName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2E3B',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rationale: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: '#FFF8E6',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#F5A623',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#7A5C00',
    lineHeight: 19,
  },
  ctaBtn: {
    backgroundColor: '#1A7A5E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnRed: {
    backgroundColor: '#CC0000',
  },
  ctaBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
