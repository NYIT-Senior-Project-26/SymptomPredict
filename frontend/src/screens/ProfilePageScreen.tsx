import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Switch,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProfilePage'>;
};

type Section = 'profile' | 'medications' | 'settings' | 'privacy';

export default function ProfilePageScreen({ navigation }: Props) {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [notifications, setNotifications] = useState(true);
  const [shareAnon, setShareAnon] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const TABS: { key: Section; label: string; icon: string }[] = [
    { key: 'profile', label: 'Profile', icon: '👤' },
    { key: 'medications', label: 'Meds', icon: '💊' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
    { key: 'privacy', label: 'Privacy', icon: '🔒' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Avatar + name banner */}
      <View style={styles.avatarBanner}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>MH</Text>
        </View>
        <View style={styles.avatarInfo}>
          <Text style={styles.avatarName}>Muaz Hassan</Text>
          <Text style={styles.avatarSub}>Member since Sep 2026 · 3 sessions</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planText}>⭐ Premium</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeSection === tab.key && styles.tabActive]}
            onPress={() => setActiveSection(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeSection === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Tab */}
        {activeSection === 'profile' && (
          <View>
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              {[
                { label: 'Date of Birth', value: 'January 15, 1996 · Age 30' },
                { label: 'Biological Sex', value: 'Male' },
                { label: 'Blood Type', value: 'O+' },
                { label: 'Height', value: '5\'11"' },
                { label: 'Weight', value: '175 lbs' },
              ].map((item, i) => (
                <View key={i} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Medical Conditions</Text>
              {['Hypertension', 'Mild Asthma'].map((c, i) => (
                <View key={i} style={styles.chipItem}>
                  <View style={styles.chip}><Text style={styles.chipText}>{c}</Text></View>
                </View>
              ))}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Allergies</Text>
              {['Penicillin', 'Pollen', 'Dust Mites'].map((a, i) => (
                <View key={i} style={styles.chipItem}>
                  <View style={[styles.chip, styles.chipRed]}><Text style={styles.chipTextRed}>{a}</Text></View>
                </View>
              ))}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Insurance</Text>
              {[
                { label: 'Provider', value: 'BlueCross BlueShield' },
                { label: 'Member ID', value: 'BCB-00291-X' },
                { label: 'Group #', value: '44872' },
              ].map((item, i) => (
                <View key={i} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Medications Tab */}
        {activeSection === 'medications' && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Current Medications</Text>
            {[
              { name: 'Lisinopril', dose: '10mg', freq: 'Once daily', type: 'Blood Pressure' },
              { name: 'Metformin', dose: '500mg', freq: 'Twice daily with meals', type: 'Blood Sugar' },
              { name: 'Vitamin D3', dose: '2000 IU', freq: 'Once daily', type: 'Supplement' },
              { name: 'ProAir Inhaler', dose: '90mcg/puff', freq: 'As needed (PRN)', type: 'Rescue Inhaler' },
            ].map((med, i) => (
              <View key={i} style={styles.medRow}>
                <View style={styles.medIcon}>
                  <Text style={styles.medIconText}>💊</Text>
                </View>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{med.name} · {med.dose}</Text>
                  <Text style={styles.medFreq}>{med.freq}</Text>
                  <View style={styles.medTypeBadge}>
                    <Text style={styles.medTypeText}>{med.type}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Settings Tab */}
        {activeSection === 'settings' && (
          <View>
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Notifications</Text>
              {[
                { label: 'Push Notifications', sub: 'Reminders, follow-ups, results', value: notifications, setter: setNotifications },
                { label: 'Weekly Health Digest', sub: 'Summary email every Sunday', value: weeklyDigest, setter: setWeeklyDigest },
              ].map((s, i) => (
                <View key={i} style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{s.label}</Text>
                    <Text style={styles.settingSub}>{s.sub}</Text>
                  </View>
                  <Switch
                    value={s.value}
                    onValueChange={s.setter}
                    trackColor={{ false: '#D4E3DE', true: '#1A7A5E' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              ))}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Account</Text>
              {['Change Password', 'Linked Devices', 'Download My Data', 'Delete Account'].map((item, i) => (
                <TouchableOpacity key={i} style={styles.menuRow}>
                  <Text style={[styles.menuLabel, item === 'Delete Account' && styles.menuLabelRed]}>{item}</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Privacy Tab */}
        {activeSection === 'privacy' && (
          <View>
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Data & Privacy</Text>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Anonymous Data Sharing</Text>
                  <Text style={styles.settingSub}>Help improve AI accuracy with anonymized data</Text>
                </View>
                <Switch
                  value={shareAnon}
                  onValueChange={setShareAnon}
                  trackColor={{ false: '#D4E3DE', true: '#1A7A5E' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <View style={styles.privacyInfo}>
              <Text style={styles.privacyTitle}>🔒  Your Privacy Matters</Text>
              <Text style={styles.privacyText}>
                All your health data is stored encrypted on your device and optionally synced to our HIPAA-compliant servers. We never sell your personal data.{'\n\n'}
                You can delete your account and all associated data at any time from Settings.
              </Text>
            </View>
          </View>
        )}

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
  editBtn: { backgroundColor: '#E8F5F0', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  editBtnText: { color: '#1A7A5E', fontSize: 13, fontWeight: '600' },
  avatarBanner: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    gap: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E8EFEC',
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#1A7A5E', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  avatarInfo: { flex: 1 },
  avatarName: { fontSize: 18, fontWeight: '700', color: '#1A2B25' },
  avatarSub: { fontSize: 13, color: '#6B7C76', marginTop: 2 },
  planBadge: {
    backgroundColor: '#FFF8E6', paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10, alignSelf: 'flex-start', marginTop: 6,
  },
  planText: { fontSize: 12, color: '#8B6914', fontWeight: '600' },
  tabRow: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#E8EFEC',
  },
  tab: {
    flex: 1, alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#1A7A5E' },
  tabIcon: { fontSize: 18, marginBottom: 2 },
  tabLabel: { fontSize: 11, color: '#6B7C76', fontWeight: '500' },
  tabLabelActive: { color: '#1A7A5E', fontWeight: '700' },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#E8EFEC',
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1A2B25', marginBottom: 12 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F4F2',
  },
  infoLabel: { fontSize: 13, color: '#6B7C76' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#1A2B25' },
  chipItem: { marginBottom: 6 },
  chip: {
    backgroundColor: '#E8F5F0', paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  chipText: { fontSize: 14, color: '#1A7A5E', fontWeight: '500' },
  chipRed: { backgroundColor: '#FFE8E8' },
  chipTextRed: { fontSize: 14, color: '#CC0000', fontWeight: '500' },
  medRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  medIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#E8F5F0', alignItems: 'center', justifyContent: 'center',
  },
  medIconText: { fontSize: 20 },
  medInfo: { flex: 1 },
  medName: { fontSize: 14, fontWeight: '600', color: '#1A2B25' },
  medFreq: { fontSize: 13, color: '#6B7C76', marginTop: 2 },
  medTypeBadge: {
    backgroundColor: '#F0F4F2', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 8, alignSelf: 'flex-start', marginTop: 4,
  },
  medTypeText: { fontSize: 11, color: '#3D5247', fontWeight: '500' },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F4F2',
  },
  settingInfo: { flex: 1, marginRight: 12 },
  settingLabel: { fontSize: 14, color: '#1A2B25', fontWeight: '500' },
  settingSub: { fontSize: 12, color: '#6B7C76', marginTop: 2 },
  menuRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F4F2',
  },
  menuLabel: { fontSize: 14, color: '#1A2B25' },
  menuLabelRed: { color: '#CC0000' },
  menuArrow: { fontSize: 18, color: '#B0BDB8' },
  privacyInfo: {
    backgroundColor: '#E8F5F0', borderRadius: 14, padding: 16,
  },
  privacyTitle: { fontSize: 14, fontWeight: '700', color: '#1A5C45', marginBottom: 8 },
  privacyText: { fontSize: 13, color: '#1A5C45', lineHeight: 20 },
});
