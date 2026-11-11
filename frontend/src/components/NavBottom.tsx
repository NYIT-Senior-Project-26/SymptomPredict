import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

/** "Nav/Bottom" in Figma. Passed to <Tabs tabBar={...}>; icons come from each tab's `tabBarIcon`. */
export function NavBottom({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 26) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = index === state.index;
        const color = focused ? colors.brandPrimary : colors.textSecondary;
        const label = options.title ?? route.name;

        function onPress() {
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.item}
          >
            <View style={[styles.pill, focused && styles.pillActive]}>
              {options.tabBarIcon?.({ focused, color, size: 20 })}
            </View>
            <Text style={[styles.label, { color, fontFamily: focused ? fonts.semibold : fonts.medium }]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  pill: { width: 56, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  pillActive: { backgroundColor: colors.brandPrimaryLight },
  label: { fontSize: 12 },
});
