import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Linking, Animated } from 'react-native';

type Props = { navigation?: any };

export default function EmergencyScreen({ navigation }: Props) {
  const pulseAnim = new Animated.Value(1);
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ])).start();
  }, []);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <View style={s.alertHeader}>
        <Animated.Text style={[s.alertIcon, { transform: [{ scale: pulseAnim }] }]}>🚨</Animated.Text>
        <Text style={s.alertTitle}>Emergency Alert</Text>
        <Text style={s.alertSubtitle}>Your symptoms may require immediate emergency care. Do not wait — act now.</Text>
      </View>
      <TouchableOpacity style={s.callBtn} onPress={() => Linking.openURL('tel:911')} activeOpacity={0.85}>
        <Text style={s.callBtnIcon}>📞</Text>
        <View>
          <Text style={s.callBtnTitle}>Call 911</Text>
          <Text style={s.callBtnSub}>Tap to call emergency services</Text>
        </View>
      </TouchableOpacity>
      <View style={s.instructBox}>
        <Text style={s.instructTitle}>While waiting for help:</Text>
        <Text style={s.instructItem}>• Stay calm and stay where you are</Text>
        <Text style={s.instructItem}>• Do NOT drive yourself to the ER</Text>
        <Text style={s.instructItem}>• Unlock your front door for paramedics</Text>
        <Text style={s.instructItem}>• Keep your phone with you</Text>
        <Text style={s.instructItem}>• Have your medication list ready if possible</Text>
      </View>
      <View style={s.warningsBox}>
        <Text style={s.warningsTitle}>Always call 911 for:</Text>
        {['Chest pain or pressure','Difficulty breathing','Sudden numbness or weakness','Severe abdominal pain'].map((sign, i) => (
          <View key={i} style={s.warningRow}>
            <Text style={s.warningDot}>⚠️</Text>
            <Text style={s.warningText}>{sign}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={s.secondaryBtn} onPress={() => Linking.openURL('tel:18002221222')}>
        <Text style={s.secondaryBtnText}>Poison Control: 1-800-222-1222</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#CC0000', paddingHorizontal: 20 },
  topBar: { paddingTop: 8, paddingBottom: 4 },
  backBtn: { paddingVertical: 6 },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '500' },
  alertHeader: { alignItems: 'center', paddingVertical: 20 },
  alertIcon: { fontSize: 56, marginBottom: 10 },
  alertTitle: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 10, textAlign: 'center' },
  alertSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.88)', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  callBtn: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 18, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 6 },
  callBtnIcon: { fontSize: 30, marginRight: 16 },
  callBtnTitle: { fontSize: 22, fontWeight: '900', color: '#CC0000' },
  callBtnSub: { fontSize: 13, color: '#888', marginTop: 2 },
  instructBox: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, marginBottom: 14 },
  instructTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 10 },
  instructItem: { color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 22 },
  warningsBox: { backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: 16, marginBottom: 16 },
  warningsTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 10 },
  warningRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  warningDot: { fontSize: 14, marginRight: 8 },
  warningText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, flex: 1 },
  secondaryBtn: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  secondaryBtnText: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' },
});
