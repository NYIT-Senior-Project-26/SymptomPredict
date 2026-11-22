import { Href, router } from 'expo-router';
import { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts } from '@/theme';
import { Button } from './Button';

const FIGMA_FILE = 'https://www.figma.com/design/6DFreMInyAv75dL3sLb8G0/Untitled';

export interface PlaceholderLink {
  label: string;
  href: Href;
  replace?: boolean;
}

/** One block of the Figma frame, top to bottom, with notes for whoever builds it. */
export interface ScaffoldSection {
  title: string;
  /** What it shows in Figma. */
  shows: string;
  /** Where the data comes from, what's missing, or anything to decide first. */
  todo?: string;
}

interface Props {
  /** Frame name in the Figma file, e.g. "1.1 Splash / Welcome". */
  frame: string;
  /** Node id of the frame in the Figma file, e.g. "91:766". Adds an "Open in Figma" link. */
  figmaNode?: string;
  title: string;
  /** The frame's sections, so the scaffold doubles as a build checklist. */
  sections?: ScaffoldSection[];
  links?: PlaceholderLink[];
  children?: ReactNode;
}

/** Stand-in for a screen that hasn't been built from its Figma frame yet. */
export function ScreenPlaceholder({ frame, figmaNode, title, sections = [], links = [], children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.frame}>Figma · {frame}</Text>
        <Text style={styles.title}>{title}</Text>
        {figmaNode && (
          <Pressable
            accessibilityRole="link"
            hitSlop={8}
            onPress={() => Linking.openURL(`${FIGMA_FILE}?node-id=${figmaNode.replace(':', '-')}`)}
          >
            <Text style={styles.figmaLink}>Open this frame in Figma</Text>
          </Pressable>
        )}
        {sections.length > 0 && <Text style={styles.notice}>Not built yet. This screen will have:</Text>}
        {sections.map((s, i) => (
          <View key={s.title} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i + 1}. {s.title}
            </Text>
            <Text style={styles.sectionText}>{s.shows}</Text>
            {s.todo && <Text style={styles.todo}>To do: {s.todo}</Text>}
          </View>
        ))}
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
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.textPrimary },
  figmaLink: { fontFamily: fonts.semibold, fontSize: 14, color: colors.brandPrimary },
  notice: { fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  section: {
    gap: 4,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderDefault,
  },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.textPrimary },
  sectionText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
  todo: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.triageYellow },
});
