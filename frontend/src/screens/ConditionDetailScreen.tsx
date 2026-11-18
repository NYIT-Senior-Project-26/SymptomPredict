import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ConditionDetail'>;
  route: RouteProp<RootStackParamList, 'ConditionDetail'>;
};

const TABS = ['Overview', 'Symptoms', 'Treatment', 'When to See a Doctor'];

const CONDITION_DATA = {
  name: 'Common Cold',
  likelihood: 'high',
  icd10: 'J00',
  overview: `The common cold is a viral infection of the upper respiratory tract, primarily caused by rhinoviruses. It's the most common infectious disease in humans, with adults averaging 2-3 colds per year.\n\nMost colds resolve on their own within 7-10 days without medical treatment.`,
  symptoms: [
    'Runny or stuffy nose',
    'Sore throat',
    'Cough',
    'Sneezing',
    'Generally feeling unwell (malaise)',
    'Low-grade fever (more common in children)',
    'Mild headache or body aches',
  ],
  treatment: [
    'Rest and stay hydrated (water, clear broths, herbal teas)',
    'Over-the-counter pain relievers for aches and fever (acetaminophen or ibuprofen)',
    'Decongestants or nasal sprays for congestion',
    'Throat lozenges or warm saltwater gargle for sore throat',
    'Honey (for adults and children > 1 year) may soothe cough',
    'Zinc supplements may shorten duration if started early',
  ],
  whenToSee: [
    { flag: 'Fever above 103°F (39.4°C)', urgent: true },
    { flag: 'Symptoms lasting more than 10 days', urgent: false },
    { flag: 'Shortness of breath or wheezing', urgent: true },
    { flag: 'Severe sinus pain or pressure', urgent: false },
    { flag: 'Earache or ear discharge', urgent: false },
    { flag: 'Symptoms that worsen after initial improvement', urgent: false },
  ],
};

export default function ConditionDetailScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back to Results</Text>
        </TouchableOpacity>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{CONDITION_DATA.name}</Text>
          <View style={styles.likelihoodBadge}>
            <Text style={styles.likelihoodText}>High Likelihood</Text>
          </View>
        </View>
        <Text style={styles.icd}>ICD-10: {CONDITION_DATA.icd10}</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'Overview' && (
          <View style={styles.tabContent}>
            <Text style={styles.bodyText}>{CONDITION_DATA.overview}</Text>
          </View>
        )}

        {activeTab === 'Symptoms' && (
          <View style={styles.tabContent}>
            {CONDITION_DATA.symptoms.map((s, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.listBullet}>•</Text>
                <Text style={styles.listText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Treatment' && (
          <View style={styles.tabContent}>
            {CONDITION_DATA.treatment.map((t, i) => (
              <View key={i} style={styles.listItem}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.listText}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'When to See a Doctor' && (
          <View style={styles.tabContent}>
            <Text style={styles.bodyText}>
              Most colds don't require a doctor visit. Seek medical attention if you experience:
            </Text>
            {CONDITION_DATA.whenToSee.map((item, i) => (
              <View key={i} style={[styles.flagCard, item.urgent && styles.flagCardUrgent]}>
                <Text style={styles.flagIcon}>{item.urgent ? '🚨' : '⚠️'}</Text>
                <Text style={[styles.flagText, item.urgent && styles.flagTextUrgent]}>{item.flag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('FindCare')}>
          <Text style={styles.btnText}>Find Care Near Me →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FFFE' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backBtn: { marginBottom: 10 },
  backText: { fontSize: 15, color: '#1A7A5E', fontWeight: '500' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A2B25' },
  likelihoodBadge: {
    backgroundColor: '#D6F5E8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  likelihoodText: { fontSize: 12, color: '#1B6B4A', fontWeight: '600' },
  icd: { fontSize: 12, color: '#B0BDB8' },
  tabScroll: { paddingHorizontal: 16, marginBottom: 4, flexGrow: 0 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 10, marginRight: 4,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#1A7A5E' },
  tabText: { fontSize: 14, color: '#6B7C76', fontWeight: '500' },
  tabTextActive: { color: '#1A7A5E', fontWeight: '700' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  tabContent: { paddingTop: 12 },
  bodyText: { fontSize: 15, color: '#3D5247', lineHeight: 22, marginBottom: 16 },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 10 },
  listBullet: { fontSize: 16, color: '#1A7A5E', marginTop: 1 },
  listText: { flex: 1, fontSize: 15, color: '#3D5247', lineHeight: 22 },
  stepNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#E8F5F0', alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  stepNumText: { fontSize: 12, color: '#1A7A5E', fontWeight: '700' },
  flagCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FFF8E6', borderRadius: 10, padding: 12, marginBottom: 8,
  },
  flagCardUrgent: { backgroundColor: '#FFE8E8' },
  flagIcon: { fontSize: 16 },
  flagText: { flex: 1, fontSize: 14, color: '#8B6914', lineHeight: 20 },
  flagTextUrgent: { color: '#CC0000' },
  footer: { paddingHorizontal: 16, paddingVertical: 16 },
  btn: { backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
