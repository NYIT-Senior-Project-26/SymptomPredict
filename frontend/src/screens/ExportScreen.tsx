import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Share, Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Export'>;
};

const EXPORT_OPTIONS = [
  {
    id: 'pdf_session',
    title: 'Session PDF',
    description: 'Single session report with diagnosis, symptoms, and recommendations',
    icon: '📄',
    format: 'PDF',
  },
  {
    id: 'pdf_full',
    title: 'Full History PDF',
    description: 'Complete medical history export — all sessions, patterns, and medications',
    icon: '📚',
    format: 'PDF',
  },
  {
    id: 'doctor_pdf',
    title: 'Doctor-Facing Report',
    description: 'Clinical summary formatted for healthcare providers. Includes ICD codes.',
    icon: '🏥',
    format: 'PDF',
  },
  {
    id: 'json',
    title: 'Raw Data (JSON)',
    description: 'Machine-readable export for personal records or EHR integration',
    icon: '💾',
    format: 'JSON',
  },
];

export default function ExportScreen({ navigation }: Props) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (id: string, title: string) => {
    setExporting(id);
    setTimeout(() => {
      setExporting(null);
      Share.share({
        title: `DiagnosisCloud — ${title}`,
        message: `Your ${title} from DiagnosisCloud has been prepared. Open the app to download.`,
      }).catch(() => {
        Alert.alert('Export Ready', `Your ${title} is ready to share!`);
      });
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Export & Share</Text>
        <Text style={styles.subtitle}>Send your health records to doctors or save for your files.</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            🔒  All exports are encrypted and watermarked. Only share with trusted healthcare providers.
          </Text>
        </View>

        {EXPORT_OPTIONS.map((option) => (
          <View key={option.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <View style={styles.iconWrapper}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <View style={styles.formatBadge}>
                    <Text style={styles.formatText}>{option.format}</Text>
                  </View>
                </View>
                <Text style={styles.cardDesc}>{option.description}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.exportBtn, exporting === option.id && styles.exportBtnLoading]}
              onPress={() => handleExport(option.id, option.title)}
              disabled={exporting !== null}
            >
              <Text style={styles.exportBtnText}>
                {exporting === option.id ? '...' : '↓'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.shareSection}>
          <Text style={styles.shareSectionTitle}>Share with Provider</Text>
          <Text style={styles.shareSectionDesc}>
            Enter your doctor's email or use a secure link to share your health summary.
          </Text>
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>📧  Share via Secure Link</Text>
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
  title: { fontSize: 22, fontWeight: '700', color: '#1A2B25', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7C76' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  infoCard: {
    backgroundColor: '#E8F5F0', borderRadius: 10, padding: 12, marginBottom: 12,
  },
  infoText: { fontSize: 13, color: '#1A5C45', lineHeight: 18 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC', flexDirection: 'row', alignItems: 'center',
  },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrapper: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#F0F4F2', alignItems: 'center', justifyContent: 'center',
  },
  optionIcon: { fontSize: 22 },
  cardInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1A2B25' },
  formatBadge: { backgroundColor: '#E8F5F0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  formatText: { fontSize: 11, color: '#1A7A5E', fontWeight: '700' },
  cardDesc: { fontSize: 13, color: '#6B7C76', lineHeight: 18 },
  exportBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#1A7A5E', alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
  exportBtnLoading: { backgroundColor: '#B0C4BC' },
  exportBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  shareSection: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#E8EFEC', marginTop: 4,
  },
  shareSectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A2B25', marginBottom: 6 },
  shareSectionDesc: { fontSize: 13, color: '#6B7C76', lineHeight: 18, marginBottom: 12 },
  shareBtn: {
    backgroundColor: '#E8F5F0', borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  shareBtnText: { color: '#1A7A5E', fontSize: 14, fontWeight: '600' },
});
