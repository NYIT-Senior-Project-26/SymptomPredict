import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PharmacyOTC'>;
};

const OTC_RECOMMENDATIONS = [
  {
    category: 'Pain & Fever Relief',
    icon: '💊',
    items: [
      { name: 'Acetaminophen (Tylenol)', dose: '500–1000mg every 4–6 hrs', note: 'Safe choice; avoids GI irritation', caution: false },
      { name: 'Ibuprofen (Advil/Motrin)', dose: '200–400mg every 4–6 hrs', note: 'Anti-inflammatory; take with food', caution: true },
    ],
  },
  {
    category: 'Decongestants',
    icon: '🌬️',
    items: [
      { name: 'Pseudoephedrine (Sudafed)', dose: '30–60mg every 4–6 hrs', note: 'Best for nasal congestion', caution: false },
      { name: 'Oxymetazoline (Afrin)', dose: '2 sprays each nostril 2x/day', note: 'Max 3 days to avoid rebound congestion', caution: true },
    ],
  },
  {
    category: 'Nasal / Allergy',
    icon: '👃',
    items: [
      { name: 'Loratadine (Claritin)', dose: '10mg once daily', note: 'Non-drowsy antihistamine', caution: false },
      { name: 'Fluticasone (Flonase)', dose: '1–2 sprays each nostril daily', note: 'Best for nasal inflammation', caution: false },
    ],
  },
  {
    category: 'Throat & Cough',
    icon: '🗣️',
    items: [
      { name: 'Dextromethorphan (Robitussin DM)', dose: '10–20mg every 4 hrs', note: 'Cough suppressant', caution: false },
      { name: 'Zinc lozenges', dose: '1 lozenge every 2–3 hrs', note: 'May reduce cold duration', caution: false },
    ],
  },
];

export default function PharmacyOTCScreen({ navigation }: Props) {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (cat: string) => {
    setExpanded((prev) => prev.includes(cat) ? prev.filter((x) => x !== cat) : [...prev, cat]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>OTC Recommendations</Text>
        <Text style={styles.subtitle}>Based on your symptoms: Common Cold</Text>
      </View>

      <View style={styles.warningCard}>
        <Text style={styles.warningText}>
          ⚠️  Check with a pharmacist if you take other medications. Avoid combining acetaminophen and ibuprofen without guidance.
        </Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {OTC_RECOMMENDATIONS.map((group) => (
          <View key={group.category} style={styles.groupCard}>
            <TouchableOpacity
              style={styles.groupHeader}
              onPress={() => toggle(group.category)}
            >
              <Text style={styles.groupIcon}>{group.icon}</Text>
              <Text style={styles.groupTitle}>{group.category}</Text>
              <Text style={styles.expandIcon}>{expanded.includes(group.category) ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {(!expanded.includes(group.category) || true) && (
              <View style={styles.itemList}>
                {group.items.map((item, i) => (
                  <View key={i} style={[styles.itemRow, i < group.items.length - 1 && styles.itemDivider]}>
                    <View style={styles.itemInfo}>
                      <View style={styles.itemNameRow}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.caution && (
                          <View style={styles.cautionBadge}>
                            <Text style={styles.cautionText}>Caution</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.itemDose}>{item.dose}</Text>
                      <Text style={styles.itemNote}>{item.note}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.pharmacyCard}>
          <Text style={styles.pharmacyTitle}>📍 Find a Pharmacy</Text>
          <TouchableOpacity style={styles.pharmacyBtn}>
            <Text style={styles.pharmacyBtnText}>Walgreens — 0.3 mi away</Text>
            <Text style={styles.pharmacyArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pharmacyBtn}>
            <Text style={styles.pharmacyBtnText}>CVS Pharmacy — 0.5 mi away</Text>
            <Text style={styles.pharmacyArrow}>→</Text>
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
  title: { fontSize: 22, fontWeight: '700', color: '#1A2B25', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#1A7A5E', fontWeight: '500' },
  warningCard: {
    backgroundColor: '#FFF8E6', borderLeftWidth: 4, borderLeftColor: '#F5A623',
    marginHorizontal: 16, borderRadius: 8, padding: 12, marginBottom: 12,
  },
  warningText: { fontSize: 13, color: '#8B6914', lineHeight: 18 },
  scroll: { flex: 1, paddingHorizontal: 16 },
  groupCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC', overflow: 'hidden',
  },
  groupHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 10 },
  groupIcon: { fontSize: 20 },
  groupTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1A2B25' },
  expandIcon: { fontSize: 12, color: '#6B7C76' },
  itemList: { borderTopWidth: 1, borderTopColor: '#F0F4F2' },
  itemRow: { padding: 14 },
  itemDivider: { borderBottomWidth: 1, borderBottomColor: '#F0F4F2' },
  itemInfo: {},
  itemNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#1A2B25' },
  cautionBadge: { backgroundColor: '#FFF3CD', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  cautionText: { fontSize: 11, color: '#8B6914', fontWeight: '600' },
  itemDose: { fontSize: 13, color: '#1A7A5E', fontWeight: '500', marginBottom: 2 },
  itemNote: { fontSize: 12, color: '#6B7C76' },
  pharmacyCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginTop: 4,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  pharmacyTitle: { fontSize: 15, fontWeight: '600', color: '#1A2B25', marginBottom: 10 },
  pharmacyBtn: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F4F2',
  },
  pharmacyBtnText: { fontSize: 14, color: '#1A7A5E', fontWeight: '500' },
  pharmacyArrow: { fontSize: 14, color: '#1A7A5E' },
});
