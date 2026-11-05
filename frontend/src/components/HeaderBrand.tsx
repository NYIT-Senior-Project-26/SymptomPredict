import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme';
import { Logo } from './Logo';

interface Props {
  /** Hide the logo when the screen shows its own, as 2.1 Home does. */
  showLogo?: boolean;
  onNotificationsPress?: () => void;
}

/** "Header/Brand" in Figma: logo on the left, notifications bell on the right. */
export function HeaderBrand({ showLogo = true, onNotificationsPress }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        {showLogo ? <Logo size="header" /> : <View />}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={onNotificationsPress}
          hitSlop={8}
        >
          {/* Multi-color asset (white circle, bell, red dot), so it isn't tinted. */}
          <Image source={require('../../assets/icons/notifications.svg')} style={styles.bell} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.bgSurface },
  bar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  bell: { width: 40, height: 40 },
});
