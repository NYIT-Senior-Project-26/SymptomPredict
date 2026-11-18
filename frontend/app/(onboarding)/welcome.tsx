import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { colors, fonts } from '@/theme';

// 1.1 Splash / Welcome
export default function Welcome() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: Math.max(insets.bottom, 40) }]}>
      <View style={styles.spacer} />
      <Logo size="welcome" />
      <Text style={styles.tagline}>Check your symptoms, understand your options, and get the right care — fast.</Text>
      {/* Page indicator from the design; there is only one welcome page for now. */}
      <View style={styles.dots} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <View style={styles.spacer} />
      <Button label="Get started" onPress={() => router.push('/consent')} style={styles.button} />
      <Text style={styles.terms}>By continuing you agree to our Terms & Conditions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', gap: 24, paddingHorizontal: 32, backgroundColor: colors.bgSurface },
  spacer: { flex: 1 },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderDefault },
  dotActive: { width: 20, backgroundColor: colors.brandPrimary },
  button: { alignSelf: 'stretch' },
  terms: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
});
