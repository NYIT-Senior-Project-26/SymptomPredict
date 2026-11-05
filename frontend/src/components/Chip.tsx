import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme';
import { Icon } from './Icon';

interface Props {
  label: string;
  selected: boolean;
  onPress?: () => void;
}

export function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.base, selected ? styles.selected : styles.unselected]}
    >
      {selected && <Icon name="check-small" size={14} color={colors.textOnPrimary} />}
      <Text style={[styles.label, { color: selected ? colors.textOnPrimary : colors.textPrimary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  selected: { backgroundColor: colors.brandPrimary, gap: 6 },
  unselected: { backgroundColor: colors.bgSurface, borderWidth: 1, borderColor: colors.borderDefault },
  label: { fontFamily: fonts.medium, fontSize: 14 },
});
