import { Href, router } from 'expo-router';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts } from '@/theme';
import { Button } from './Button';

export interface PlaceholderLink {
  label: string;
  href: Href;
  replace?: boolean;
}

interface Props {
  /** Frame name in the Figma file, e.g. "1.1 Splash / Welcome". */
  frame: string;
  title: string;
  links?: PlaceholderLink[];
  children?: ReactNode;
}

/** Stand-in for a screen that hasn't been built from its Figma frame yet. */
export function ScreenPlaceholder({ frame, title, links = [], children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.frame}>Figma · {frame}</Text>
        <Text style={styles.title}>{title}</Text>
        {children}
        {links.map((link) => (
          <Button
            key={link.label}
            label={link.label}
            onPress={() => (link.replace ? router.replace(link.href) : router.push(link.href))}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgSurface },
  container: { padding: 24, gap: 12 },
  frame: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.textPrimary, marginBottom: 8 },
});
