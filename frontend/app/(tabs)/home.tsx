import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { useIntake } from '@/state/intake';
import { colors, fonts } from '@/theme';

// 2.1 Home Dashboard. The bell is in the tab header (see app/(tabs)/_layout.tsx).
export default function Home() {
  const { reset } = useIntake();

  function onCheck() {
    reset();
    router.push('/intake');
  }

  return (
    <View style={styles.content}>
      <View style={styles.center}>
        <Logo size="home" />
        <View style={styles.spacer} />
        <Button label="Check my symptoms" variant="hero" icon="activity" onPress={onCheck} style={styles.cta} />
        <Text style={styles.caption}>Takes about 5 minutes · private & secure</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 32,
    backgroundColor: colors.bgSurface,
  },
  center: { alignItems: 'center', gap: 20, alignSelf: 'stretch' },
  spacer: { height: 12 },
  cta: { alignSelf: 'stretch' },
  caption: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
});
