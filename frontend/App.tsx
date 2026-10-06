import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { api, PredictionResult } from './src/api/client';

const URGENCY_LABEL: Record<PredictionResult['urgency'], string> = {
  self_care: 'Self-care at home',
  see_doctor: 'See a doctor',
  urgent_care: 'Go to urgent care',
  emergency: 'Call 911 / go to the ER',
};

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);

  async function onCheck() {
    const symptoms = text.split(',').map((s) => s.trim()).filter(Boolean);
    if (symptoms.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      setResult(await api.predict({ symptoms }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>SymptomPredict</Text>
        <Text style={styles.label}>Describe your symptoms (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. headache, fever, sore throat"
          value={text}
          onChangeText={setText}
          multiline
        />
        <Pressable style={styles.button} onPress={onCheck} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Check symptoms</Text>}
        </Pressable>

        {error && <Text style={styles.error}>{error}</Text>}

        {result && (
          <View style={styles.card}>
            <Text style={styles.urgency}>{URGENCY_LABEL[result.urgency]}</Text>
            <Text style={styles.label}>Suggested specialty: {result.recommended_specialty}</Text>
            {result.conditions.map((c) => (
              <View key={c.name} style={styles.condition}>
                <Text style={styles.conditionName}>
                  {c.name} · {c.likelihood}
                </Text>
                <Text>{c.rationale}</Text>
              </View>
            ))}
            <Text style={styles.advice}>{result.advice}</Text>
            <Text style={styles.disclaimer}>{result.disclaimer}</Text>
          </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, gap: 12 },
  title: { fontSize: 28, fontWeight: '700', marginTop: 20 },
  label: { fontSize: 15, color: '#444' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, minHeight: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  error: { color: '#b91c1c' },
  card: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 16, gap: 10 },
  urgency: { fontSize: 20, fontWeight: '700' },
  condition: { gap: 2 },
  conditionName: { fontWeight: '600' },
  advice: { fontStyle: 'italic' },
  disclaimer: { fontSize: 12, color: '#6b7280' },
});
