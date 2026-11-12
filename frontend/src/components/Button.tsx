import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';
import { Icon, IconName } from './Icon';

interface Props {
  label: string;
  onPress?: () => void;
  /**
   * `primary` is the standard "Button" in Figma (e.g. "Get started").
   * `hero` is the larger call to action on 2.1 Home ("Check my symptoms").
   * `neutral` is the outlined Button in Figma (e.g. "Scan insurance card").
   */
  variant?: 'primary' | 'hero' | 'neutral';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', icon, disabled, loading, style }: Props) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        v.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.contentColor} />
      ) : (
        <>
          {icon && <Icon name={icon} size={v.iconSize} color={v.contentColor} />}
          <Text style={v.label}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandPrimary,
    borderWidth: 1,
    borderRadius: 8,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});

const VARIANTS = {
  primary: {
    iconSize: 16,
    contentColor: '#f5f5f5',
    ...StyleSheet.create({
      container: { borderColor: colors.brandPrimary, padding: 12, gap: 8 },
      label: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 16, color: '#f5f5f5' },
    }),
  },
  hero: {
    iconSize: 22,
    contentColor: colors.textOnPrimary,
    ...StyleSheet.create({
      container: { borderColor: colors.textPrimary, paddingHorizontal: 28, paddingVertical: 18, gap: 10 },
      label: { fontFamily: fonts.bold, fontSize: 18, color: colors.textOnPrimary },
    }),
  },
  neutral: {
    iconSize: 16,
    contentColor: colors.brandPrimary,
    ...StyleSheet.create({
      container: { borderColor: colors.brandPrimary, backgroundColor: colors.bgSurface, padding: 12, gap: 8 },
      label: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 16, color: colors.brandPrimary },
    }),
  },
};
