import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, SafeAreaView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Privacy'>;
};

export default function PrivacyConsentScreen({ navigation }: Props) {
  const [dataConsent, setDataConsent] = useState(false);
  const [shareConsent, setShareConsent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);

  const allChecked = dataConsent && termsConsent;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FFFE" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Text style={styles.icon}>🔒</Text>
          </View>
          <Text style={styles.title}>Privacy & Consent</Text>
          <Text style={styles.subtitle}>
            We take your health data seriously. Please review and accept the following before getting started.
          </Text>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.consentCard}>
            <View style={styles.consentRow}>
              <View style={styles.consentTextContainer}>
                <Text style={styles.consentTitle}>Data Collection & Storage</Text>
                <Text style={styles.consentDesc}>
                  We collect and store your health data to provide personalized AI-powered diagnosis support.
                  Data is encrypted and never sold.
                </Text>
              </View>
              <Switch
                value={dataConsent}
                onValueChange={setDataConsent}
                trackColor={{ false: '#E0E0E0', true: '#1A7A5E' }}
                thumbColor={dataConsent ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.consentRow}>
              <View style={styles.consentTextContainer}>
                <Text style={styles.consentTitle}>Anonymous Research Sharing</Text>
                <Text style={styles.consentDesc}>
                  Optionally help improve AI models by sharing anonymized data with our research team.
                </Text>
              </View>
              <Switch
                value={shareConsent}
                onValueChange={setShareConsent}
                trackColor={{ false: '#E0E0E0', true: '#1A7A5E' }}
                thumbColor={shareConsent ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.consentRow}>
              <View style={styles.consentTextContainer}>
                <Text style={styles.consentTitle}>Terms of Service & HIPAA</Text>
                <Text style={styles.consentDesc}>
                  I agree to the Terms of Service and acknowledge this app is not a substitute for professional medical advice.
                </Text>
              </View>
              <Switch
                value={termsConsent}
                onValueChange={setTermsConsent}
                trackColor={{ false: '#E0E0E0', true: '#1A7A5E' }}
                thumbColor={termsConsent ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteText}>
              ⚠️  DiagnosisCloud provides AI-assisted health insights only. Always consult a qualified healthcare provider for medical decisions.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btn, !allChecked && styles.btnDisabled]}
            onPress={() => allChecked && navigation.navigate('ProfileBasic')}
            disabled={!allChecked}
          >
            <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FFFE' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { alignItems: 'center', paddingTop: 32, paddingBottom: 24 },
  iconWrapper: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#E8F5F0', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  icon: { fontSize: 36 },
  title: { fontSize: 24, fontWeight: '700', color: '#1A2B25', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7C76', textAlign: 'center', lineHeight: 20 },
  scroll: { flex: 1 },
  consentCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, marginBottom: 16,
  },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  consentTextContainer: { flex: 1 },
  consentTitle: { fontSize: 15, fontWeight: '600', color: '#1A2B25', marginBottom: 4 },
  consentDesc: { fontSize: 13, color: '#6B7C76', lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#F0F4F2', marginVertical: 16 },
  noteCard: {
    backgroundColor: '#FFF8E6', borderRadius: 12, padding: 16,
    borderLeftWidth: 4, borderLeftColor: '#F5A623', marginBottom: 24,
  },
  noteText: { fontSize: 13, color: '#8B6914', lineHeight: 18 },
  footer: { paddingVertical: 16 },
  btn: {
    backgroundColor: '#1A7A5E', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#B0C4BC' },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
