import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

import { colors, fonts } from '@/theme';
import { Icon } from './Icon';

/** The square checkbox on its own, for rows that lay out their own label. */
export function CheckBox({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.box, checked && styles.boxChecked]}>
      {checked && <Icon name="check-small" size={14} color={colors.textOnPrimary} />}
    </View>
  );
}

interface Props {
  label: string;
  checked: boolean;
  onPress: () => void;
  labelStyle?: StyleProp<TextStyle>;
}

/** A checkbox with its label, e.g. the consent checkboxes on 1.2. */
export function Checkbox({ label, checked, onPress, labelStyle }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={styles.row}
    >
      <CheckBox checked={checked} />
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { borderColor: colors.brandPrimary, backgroundColor: colors.brandPrimary },
  label: { flex: 1, fontFamily: fonts.regular, fontSize: 14, lineHeight: 14 * 1.45, color: colors.textPrimary },
});
