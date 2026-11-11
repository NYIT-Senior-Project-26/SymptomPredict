import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme';
import { Icon, IconName } from './Icon';

interface Props {
  label: string;
  onPress?: () => void;
  /**
   * `primary` is the standard "Button" in Figma (e.g. "Get started").
   * `hero` is the larger call to action on 2.1 Home ("Check my symptoms").
   */
  variant?: 'primary' | 'hero';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
}

export function Button({ label, onPress, variant = 'primary', icon, disabled, loading }: Props) {
  const v = variant === 'hero' ? hero : primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        v.container,
        (pressed || disabled) && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textOnPrimary} />
      ) : (
        <>
          {icon && <Icon name={icon} size={v.iconSize} color={colors.textOnPrimary} />}
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
  dimmed: { opacity: 0.85 },
});

const primary = {
  iconSize: 16,
  ...StyleSheet.create({
    container: { borderColor: colors.brandPrimary, padding: 12, gap: 8 },
    label: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 16, color: '#f5f5f5' },
  }),
};

const hero = {
  iconSize: 22,
  ...StyleSheet.create({
    container: { borderColor: colors.textPrimary, paddingHorizontal: 28, paddingVertical: 18, gap: 10 },
    label: { fontFamily: fonts.bold, fontSize: 18, color: colors.textOnPrimary },
  }),
};
