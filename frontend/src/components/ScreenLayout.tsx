import { ReactNode } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';

interface Props {
  children: ReactNode;
  /** Buttons pinned below the scrolling content, above the home indicator. */
  footer?: ReactNode;
  /** Padding and gap of the scrolling content; screens differ slightly per Figma frame. */
  contentStyle?: StyleProp<ViewStyle>;
  footerStyle?: StyleProp<ViewStyle>;
}

/**
 * Scrolling content with optional buttons pinned at the bottom, used under the stack
 * header. Keeps the bottom clear of the home indicator (at least 24px).
 */
export function ScreenLayout({ children, footer, contentStyle, footerStyle }: Props) {
  const insets = useSafeAreaInsets();
  const bottom = { paddingBottom: Math.max(insets.bottom, 24) };
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[contentStyle, !footer && bottom]} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
      {footer && <View style={[styles.footer, footerStyle, bottom]}>{footer}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgSurface },
  footer: { paddingTop: 12, paddingHorizontal: 24, backgroundColor: colors.bgSurface },
});
