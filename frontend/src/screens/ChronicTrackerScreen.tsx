import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChronicTracker'>;
};

// Generate a simple 5-week calendar heatmap (35 days)
const generateHeatmap = (): Array<{ day: number; level: number }> => {
  const data = [];
  for (let i = 0; i < 35; i++) {
    // Simulate some variability: level 0-4
    const rand = Math.random();
    const level = rand < 0.3 ? 0 : rand < 0.5 ? 1 : rand < 0.7 ? 2 : rand < 0.85 ? 3 : 4;
    data.push({ day: i + 1, level });
  }
  return data;
};

const HEATMAP = generateHeatmap();
const HEATMAP_COLORS = ['#E8EFEC', '#B6D6CC', '#7EC4B0', '#3D9E84', '#1A7A5E'];

const METRICS = [
  { label: 'Avg Systolic', value: '132', unit: 'mmHg', trend: '↓', trendGood: true },
  { label: 'Avg Diastolic', value: '84', unit: 'mmHg', trend: '↓', trendGood: true },
  { label: 'Logged Days', value: '28', unit: '/35', trend: '→', trendGood: null },
  { label: 'Goal Days', value: '22', unit: 'this month', trend: '✓', trendGood: true },
];

const RECENT_LOGS = [
  { date: 'Today, Nov 8', systolic: 128, diastolic: 82, pulse: 74, note: 'Morning reading' },
  { date: 'Nov 7', systolic: 135, diastolic: 87, pulse: 78, note: 'After exercise' },
  { date: 'Nov 6', systolic: 130, diastolic: 83, pulse: 72, note: 'Evening' },
  { date: 'Nov 5', systolic: 142, diastolic: 90, pulse: 80, note: '⚠️ Higher than usual' },
];

export default function ChronicTrackerScreen({ navigation }: Props) {
  const [activeCondition, setActiveCondition] = useState('Hypertension');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Chronic Tracker</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Log</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Condition Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.conditionScroll}>
        {['Hypertension', 'Asthma', '+ Add Condition'].map((cond, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.conditionTab,
              activeCondition === cond && styles.conditionTabActive,
              cond === '+ Add Condition' && styles.conditionTabAdd,
            ]}
            onPress={() => setActiveCondition(cond)}
          >
            <Text style={[
              styles.conditionTabText,
              activeCondition === cond && styles.conditionTabTextActive,
              cond === '+ Add Condition' && styles.conditionTabTextAdd,
            ]}>
              {cond}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Metrics Row */}
        <View style={styles.metricsRow}>
          {METRICS.map((m, i) => (
            <View key={i} style={styles.metricCard}>
              <Text style={styles.metricValue}>{m.value}<Text style={styles.metricUnit}>{m.unit}</Text></Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={[
                styles.metricTrend,
                m.trendGood === true ? styles.trendGood :
                m.trendGood === false ? styles.trendBad : styles.trendNeutral
              ]}>{m.trend}</Text>
            </View>
          ))}
        </View>

        {/* Heatmap Calendar */}
        <View style={styles.heatmapCard}>
          <Text style={styles.cardTitle}>October — November Activity</Text>
          <Text style={styles.cardSub}>Each cell = one day. Color = BP control level.</Text>
          <View style={styles.heatmapGrid}>
            {HEATMAP.map((cell, i) => (
              <View
                key={i}
                style={[styles.heatCell, { backgroundColor: HEATMAP_COLORS[cell.level] }]}
              />
            ))}
          </View>
          <View style={styles.heatLegend}>
            <Text style={styles.legendLabel}>Low</Text>
            {HEATMAP_COLORS.map((color, i) => (
              <View key={i} style={[styles.legendCell, { backgroundColor: color }]} />
            ))}
            <Text style={styles.legendLabel}>High</Text>
          </View>
        </View>

        {/* Recent Logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Readings</Text>
          {RECENT_LOGS.map((log, i) => (
            <View key={i} style={styles.logRow}>
              <View style={styles.logLeft}>
                <Text style={styles.logDate}>{log.date}</Text>
                <Text style={styles.logNote}>{log.note}</Text>
              </View>
              <View style={styles.logRight}>
                <Text style={styles.logBP}>{log.systolic}/{log.diastolic}</Text>
                <Text style={styles.logPulse}>♥ {log.pulse} bpm</Text>
              </View>
            </View>
          ))}
        </View>

        {/* AI Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>🤖  AI Insights</Text>
          <Text style={styles.insightText}>
            Your blood pressure has been trending downward this week — great progress! You had one elevated reading on Nov 5. Consider logging activity levels to identify triggers.
          </Text>
          <TouchableOpacity
            style={styles.insightBtn}
            onPress={() => navigation.navigate('MedicationAssistant')}
          >
            <Text style={styles.insightBtnText}>Ask Medication Assistant →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FFFE' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 16, color: '#1A7A5E', fontWeight: '500' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#1A2B25' },
  addBtn: { backgroundColor: '#1A7A5E', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  conditionScroll: { paddingHorizontal: 16, marginBottom: 4, flexGrow: 0 },
  conditionTab: {
    paddingHorizontal: 16, paddingVertical: 8, marginRight: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#D4E3DE', backgroundColor: '#F8FFFE',
  },
  conditionTabActive: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  conditionTabAdd: { borderStyle: 'dashed', borderColor: '#B0C4BC' },
  conditionTabText: { fontSize: 13, color: '#3D5247', fontWeight: '500' },
  conditionTabTextActive: { color: '#FFFFFF', fontWeight: '600' },
  conditionTabTextAdd: { color: '#B0BDB8' },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  metricCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  metricValue: { fontSize: 22, fontWeight: '800', color: '#1A2B25' },
  metricUnit: { fontSize: 13, fontWeight: '400', color: '#6B7C76' },
  metricLabel: { fontSize: 12, color: '#6B7C76', marginTop: 2 },
  metricTrend: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  trendGood: { color: '#1A7A5E' },
  trendBad: { color: '#CC0000' },
  trendNeutral: { color: '#6B7C76' },
  heatmapCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A2B25', marginBottom: 4 },
  cardSub: { fontSize: 12, color: '#6B7C76', marginBottom: 12 },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  heatCell: { width: 32, height: 32, borderRadius: 4 },
  heatLegend: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
  legendCell: { width: 14, height: 14, borderRadius: 2 },
  legendLabel: { fontSize: 11, color: '#B0BDB8' },
  section: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#1A2B25', marginBottom: 10 },
  logRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F4F2',
  },
  logLeft: {},
  logDate: { fontSize: 13, fontWeight: '600', color: '#1A2B25' },
  logNote: { fontSize: 12, color: '#6B7C76', marginTop: 2 },
  logRight: { alignItems: 'flex-end' },
  logBP: { fontSize: 16, fontWeight: '700', color: '#1A7A5E' },
  logPulse: { fontSize: 12, color: '#6B7C76', marginTop: 2 },
  insightCard: {
    backgroundColor: '#E8F5F0', borderRadius: 14, padding: 16, marginBottom: 8,
  },
  insightTitle: { fontSize: 14, fontWeight: '700', color: '#1A5C45', marginBottom: 8 },
  insightText: { fontSize: 14, color: '#1A5C45', lineHeight: 20, marginBottom: 12 },
  insightBtn: {
    backgroundColor: '#1A7A5E', borderRadius: 10, paddingVertical: 10, alignItems: 'center',
  },
  insightBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
});
