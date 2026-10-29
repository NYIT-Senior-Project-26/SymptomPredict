import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts } from '@/theme';
import { Icon } from './Icon';

interface Props {
  title: string;
  /** Omit to hide the back button (e.g. on tab screens). */
  onBack?: () => void;
  right?: ReactNode;
}

/** "Header/Back" in Figma. Used as the stack header for every pushed screen. */
export function HeaderBack({ title, onBack, right }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        <View style={styles.slot}>
          {onBack && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={onBack}
              hitSlop={8}
              style={styles.back}
            >
              <Icon name="chevron-left" size={20} color={colors.textPrimary} />
            </Pressable>
          )}
        </View>
        <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
        <View style={styles.slot}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.bgSurface },
  bar: { height: 56, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 },
  slot: { width: 40, height: 40 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.semibold, fontSize: 17, color: colors.textPrimary },
});
