import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Share,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DoctorPDF'>;
};

export default function DoctorFacingPDFScreen({ navigation }: Props) {
  const handleShare = () => {
    Share.share({
      title: 'Clinical Summary — DiagnosisCloud',
      message: 'Secure clinical report from DiagnosisCloud. Please open the app to download the full PDF.',
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Clinical Summary</Text>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.shareBtnText}>Share PDF</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Formatted for healthcare providers</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* PDF Preview Card */}
        <View style={styles.pdfCard}>
          {/* Letterhead */}
          <View style={styles.letterhead}>
            <View style={styles.letterheadLeft}>
              <Text style={styles.logoText}>DiagnosisCloud</Text>
              <Text style={styles.logoSub}>AI-Assisted Symptom Analysis</Text>
            </View>
            <View style={styles.letterheadRight}>
              <Text style={styles.reportDate}>Report Date</Text>
              <Text style={styles.reportDateVal}>November 8, 2026</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Patient Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PATIENT INFORMATION</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>Muaz Hassan</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>Jan 15, 1996</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Biological Sex</Text>
                <Text style={styles.infoValue}>Male</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Session ID</Text>
                <Text style={styles.infoValue}>#DC-2026-1108-A</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Chief Complaint */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CHIEF COMPLAINT</Text>
            <Text style={styles.bodyText}>
              Patient reports throbbing headache, fatigue, and low-grade fever of approximately 2 days duration. Onset described as gradual. Severity rated 5/10.
            </Text>
          </View>

          <View style={styles.divider} />

          {/* AI Diagnosis */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI DIFFERENTIAL DIAGNOSIS</Text>
            {[
              { rank: 1, name: 'Common Cold (Acute URI)', icd: 'J00', confidence: 'High', pct: '84%' },
              { rank: 2, name: 'Influenza A or B', icd: 'J10.1', confidence: 'Moderate', pct: '62%' },
              { rank: 3, name: 'Allergic Rhinitis', icd: 'J30.9', confidence: 'Low', pct: '28%' },
            ].map((item) => (
              <View key={item.rank} style={styles.diagRow}>
                <View style={styles.diagRank}>
                  <Text style={styles.diagRankText}>{item.rank}</Text>
                </View>
                <View style={styles.diagInfo}>
                  <Text style={styles.diagName}>{item.name}</Text>
                  <Text style={styles.diagIcd}>ICD-10: {item.icd}</Text>
                </View>
                <View style={[
                  styles.confBadge,
                  item.confidence === 'High' ? styles.confHigh :
                  item.confidence === 'Moderate' ? styles.confMod : styles.confLow
                ]}>
                  <Text style={[
                    styles.confText,
                    item.confidence === 'High' ? styles.confTextHigh :
                    item.confidence === 'Moderate' ? styles.confTextMod : styles.confTextLow
                  ]}>{item.pct}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Vitals / Reported */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REPORTED VITALS & SYMPTOMS</Text>
            <View style={styles.vitalsGrid}>
              {[
                { label: 'Temp', value: '99.4°F' },
                { label: 'Pain', value: '5/10' },
                { label: 'Fever', value: 'Yes' },
                { label: 'Chills', value: 'No' },
                { label: 'Vomiting', value: 'No' },
                { label: 'Rash', value: 'No' },
              ].map((v, i) => (
                <View key={i} style={styles.vitalItem}>
                  <Text style={styles.vitalLabel}>{v.label}</Text>
                  <Text style={styles.vitalValue}>{v.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Medications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CURRENT MEDICATIONS</Text>
            {['Lisinopril 10mg · Daily', 'Metformin 500mg · Twice daily', 'Vitamin D3 2000IU · Daily'].map((m, i) => (
              <Text key={i} style={styles.medItem}>• {m}</Text>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              ⚠️  This report was generated by an AI symptom analysis tool and is NOT a substitute for a clinical examination or professional medical diagnosis. This information is provided to assist, not replace, clinical decision-making.
            </Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.downloadBtn} onPress={handleShare}>
          <Text style={styles.downloadBtnText}>📄  Download / Share PDF</Text>
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
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A2B25' },
  shareBtn: { backgroundColor: '#E8F5F0', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  shareBtnText: { color: '#1A7A5E', fontSize: 13, fontWeight: '600' },
  subtitle: { fontSize: 14, color: '#6B7C76' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  pdfCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#E8EFEC', marginBottom: 8,
  },
  letterhead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  letterheadLeft: {},
  logoText: { fontSize: 18, fontWeight: '800', color: '#1A7A5E' },
  logoSub: { fontSize: 11, color: '#6B7C76', marginTop: 2 },
  letterheadRight: { alignItems: 'flex-end' },
  reportDate: { fontSize: 11, color: '#6B7C76' },
  reportDateVal: { fontSize: 13, fontWeight: '600', color: '#1A2B25', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#F0F4F2', marginVertical: 14 },
  section: {},
  sectionTitle: {
    fontSize: 10, fontWeight: '800', color: '#6B7C76',
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10,
  },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoItem: { width: '45%' },
  infoLabel: { fontSize: 11, color: '#B0BDB8', marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1A2B25' },
  bodyText: { fontSize: 14, color: '#3D5247', lineHeight: 20 },
  diagRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  diagRank: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#F0F4F2', alignItems: 'center', justifyContent: 'center',
  },
  diagRankText: { fontSize: 12, fontWeight: '700', color: '#1A7A5E' },
  diagInfo: { flex: 1 },
  diagName: { fontSize: 14, fontWeight: '600', color: '#1A2B25' },
  diagIcd: { fontSize: 12, color: '#6B7C76', marginTop: 1 },
  confBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  confHigh: { backgroundColor: '#D6F5E8' },
  confMod: { backgroundColor: '#FFF8E6' },
  confLow: { backgroundColor: '#F0F4F2' },
  confText: { fontSize: 12, fontWeight: '700' },
  confTextHigh: { color: '#1B6B4A' },
  confTextMod: { color: '#8B6914' },
  confTextLow: { color: '#6B7C76' },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  vitalItem: { width: '30%', backgroundColor: '#F8FFFE', borderRadius: 10, padding: 10 },
  vitalLabel: { fontSize: 11, color: '#B0BDB8', marginBottom: 3 },
  vitalValue: { fontSize: 14, fontWeight: '700', color: '#1A2B25' },
  medItem: { fontSize: 14, color: '#3D5247', lineHeight: 22 },
  disclaimer: { backgroundColor: '#FFF8E6', borderRadius: 10, padding: 12 },
  disclaimerText: { fontSize: 12, color: '#8B6914', lineHeight: 18 },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  downloadBtn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  downloadBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
