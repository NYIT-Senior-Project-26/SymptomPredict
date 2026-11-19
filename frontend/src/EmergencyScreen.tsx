import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Animated,
} from 'react-native';

type Props = {
  navigation?: any;
};

const WARNING_SIGNS = [
  'Chest pain or pressure',
  'Difficulty breathing or shortness of breath',
  'Sudden numbness or weakness (face, arm, leg)',
  'Sudden confusion or trouble speaking',
  'Severe abdominal pain',
  'Uncontrolled bleeding',
  'Loss of consciousness or fainting',
  'High fever with stiff neck or rash',
];

export default function EmergencyScreen({ navigation }: Props) {
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  function call911() {
    Linking.openURL('tel:911');
  }

  function callPoisonControl() {
    Linking.openURL('tel:18002221222');
  }

  function goBack() {
    navigation?.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Alert header */}
      <View style={styles.alertHeader}>
        <Animated.Text style={[styles.alertIcon, { transform: [{ scale: pulseAnim }] }]}>
          🚨
        </Animated.Text>
        <Text style={styles.alertTitle}>Emergency Alert</Text>
        <Text style={styles.alertSubtitle}>
          Your symptoms may require immediate emergency care. Do not wait — act now.
        </Text>
      </View>

      {/* Call 911 button */}
      <TouchableOpacity style={styles.callBtn} onPress={call911} activeOpacity={0.85}>
        <Text style={styles.callBtnIcon}>📞</Text>
        <View>
          <Text style={styles.callBtnTitle}>Call 911</Text>
          <Text style={styles.callBtnSub}>Tap to call emergency services</Text>
        </View>
      </TouchableOpacity>

      {/* Instructions */}
      <View style={styles.instructBox}>
        <Text style={styles.instructTitle}>While waiting for help:</Text>
        <Text style={styles.instructItem}>• Stay calm and stay where you are</Text>
        <Text style={styles.instructItem}>• Do NOT drive yourself to the ER</Text>
        <Text style={styles.instructItem}>• Unlock your front door for paramedics</Text>
        <Text style={styles.instructItem}>• Keep your phone with you</Text>
        <Text style={styles.instructItem}>• Have your medication list ready if possible</Text>
      </View>

      {/* Warning signs */}
      <View style={styles.warningsBox}>
        <Text style={styles.warningsTitle}>Always call 911 for:</Text>
        {WARNING_SIGNS.slice(0, 4).map((sign, i) => (
          <View key={i} style={styles.warningRow}>
            <Text style={styles.warningDot}>⚠️</Text>
            <Text style={styles.warningText}>{sign}</Text>
          </View>
        ))}
      </View>

      {/* Secondary: Poison control */}
      <TouchableOpacity style={styles.secondaryBtn} onPress={callPoisonControl}>
        <Text style={styles.secondaryBtnText}>Poison Control: 1-800-222-1222</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CC0000',
    paddingHorizontal: 20,
  },
  topBar: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    paddingVertical: 6,
  },
  backText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontWeight: '500',
  },
  alertHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  alertIcon: {
    fontSize: 56,
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  callBtn: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  callBtnIcon: {
    fontSize: 30,
    marginRight: 16,
  },
  callBtnTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#CC0000',
  },
  callBtnSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  instructBox: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  instructTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 10,
  },
  instructItem: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 22,
  },
  warningsBox: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  warningsTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 10,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  warningDot: {
    fontSize: 14,
    marginRight: 8,
  },
  warningText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    flex: 1,
  },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
});
