import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar,
  Linking,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FindCare'>;
};

const PROVIDERS = [
  {
    name: 'Dr. Sarah Chen, MD',
    specialty: 'Internal Medicine',
    distance: '0.4 mi',
    rating: 4.9,
    reviews: 128,
    nextAvail: 'Today 3:00 PM',
    network: 'In-network',
    networkColor: '#1A7A5E',
    networkBg: '#E8F5F0',
    type: 'doctor',
  },
  {
    name: 'CityMed Urgent Care',
    specialty: 'Urgent Care',
    distance: '0.7 mi',
    rating: 4.6,
    reviews: 89,
    nextAvail: 'Open Now · Closes 10 PM',
    network: 'In-network',
    networkColor: '#1A7A5E',
    networkBg: '#E8F5F0',
    type: 'urgent',
  },
  {
    name: 'Dr. James Park, MD',
    specialty: 'General Practice',
    distance: '1.2 mi',
    rating: 4.7,
    reviews: 203,
    nextAvail: 'Tomorrow 9:00 AM',
    network: 'Out-of-network',
    networkColor: '#8B6914',
    networkBg: '#FFF8E6',
    type: 'doctor',
  },
  {
    name: 'Walgreens Health Clinic',
    specialty: 'Retail Health Clinic',
    distance: '1.5 mi',
    rating: 4.3,
    reviews: 44,
    nextAvail: 'Walk-in available',
    network: 'In-network',
    networkColor: '#1A7A5E',
    networkBg: '#E8F5F0',
    type: 'clinic',
  },
];

const TYPE_FILTERS = ['All', 'Doctor', 'Urgent Care', 'Clinic'];

export default function FindCareScreen({ navigation }: Props) {
  const [filter, setFilter] = useState('All');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Find Care Near You</Text>
        <Text style={styles.subtitle}>Recommended: Internal Medicine</Text>
      </View>

      <View style={styles.filterRow}>
        {TYPE_FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {PROVIDERS.map((provider, i) => (
          <TouchableOpacity key={i} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.providerIcon}>
                <Text style={styles.providerEmoji}>
                  {provider.type === 'doctor' ? '👨‍⚕️' : provider.type === 'urgent' ? '🏥' : '💊'}
                </Text>
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerSpecialty}>{provider.specialty}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>⭐ {provider.rating} ({provider.reviews})</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>📍 {provider.distance}</Text>
                </View>
              </View>
              <View style={[styles.networkBadge, { backgroundColor: provider.networkBg }]}>
                <Text style={[styles.networkText, { color: provider.networkColor }]}>
                  {provider.network === 'In-network' ? '✓' : '~'}
                </Text>
              </View>
            </View>

            <View style={styles.cardBottom}>
              <View style={styles.availRow}>
                <Text style={styles.availLabel}>Next available:</Text>
                <Text style={styles.availValue}>{provider.nextAvail}</Text>
              </View>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => Linking.openURL('https://zocdoc.com')}
              >
                <Text style={styles.bookBtnText}>Book →</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
  subtitle: { fontSize: 14, color: '#1A7A5E', fontWeight: '500' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D4E3DE', backgroundColor: '#FFFFFF',
  },
  filterChipActive: { backgroundColor: '#1A7A5E', borderColor: '#1A7A5E' },
  filterText: { fontSize: 13, color: '#3D5247', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  cardTop: { flexDirection: 'row', marginBottom: 12 },
  providerIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#E8F5F0', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  providerEmoji: { fontSize: 22 },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '600', color: '#1A2B25', marginBottom: 2 },
  providerSpecialty: { fontSize: 13, color: '#6B7C76', marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#6B7C76' },
  metaDot: { color: '#D4E3DE', fontSize: 12 },
  networkBadge: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  networkText: { fontSize: 14, fontWeight: '700' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  availRow: { flex: 1 },
  availLabel: { fontSize: 12, color: '#6B7C76' },
  availValue: { fontSize: 13, color: '#1A2B25', fontWeight: '500' },
  bookBtn: { backgroundColor: '#1A7A5E', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  bookBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
});
