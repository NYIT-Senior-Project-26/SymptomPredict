import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { api } from '@/api/client';
import { Button } from '@/components/Button';
import { useIntake } from '@/state/intake';
import { colors, fonts } from '@/theme';

// 2.8 Loading / Analysis
export default function Analyzing() {
  const { symptoms, setResult } = useIntake();
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    setError(null);
    try {
      setResult(await api.predict({ symptoms }));
      router.replace('/results');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [symptoms, setResult]);

  useEffect(() => {
    analyze();
  }, [analyze]);

  return (
    <View style={styles.container}>
      {error ? (
        <>
          <Text style={styles.error}>{error}</Text>
          <Button label="Try again" onPress={analyze} />
          <Pressable onPress={() => router.back()}>
            <Text style={styles.link}>Go back</Text>
          </Pressable>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
          <Text style={styles.label}>Analyzing your symptoms…</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: colors.bgSurface,
  },
  label: { fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary },
  error: { fontFamily: fonts.regular, color: colors.triageRed, textAlign: 'center' },
  link: { fontFamily: fonts.medium, fontSize: 15, color: colors.brandPrimary },
});
