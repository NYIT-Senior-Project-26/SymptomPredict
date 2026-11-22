import { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputInstance, TextInputProps, View } from 'react-native';

import { colors, fonts } from '@/theme';
import { Icon } from './Icon';

// Border color of the "Input Field" in Figma's starter design system; not in our theme.
const FIELD_BORDER = colors.borderField;

/** "Input Field" in Figma: a label above a single-line input. */
export function TextField({ label, ...input }: TextInputProps & { label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textSecondary}
        accessibilityLabel={label}
        {...input}
      />
    </View>
  );
}

/** The search box used on the profile setup screens (1.4–1.6). */
export const SearchField = forwardRef<TextInputInstance, TextInputProps>(function SearchField(input, ref) {
  return (
    <View style={styles.search}>
      <Icon name="search" size={18} />
      <TextInput
        ref={ref}
        style={styles.searchInput}
        placeholderTextColor={colors.textSecondary}
        returnKeyType="done"
        {...input}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  field: { gap: 8, alignSelf: 'stretch' },
  label: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 16 * 1.4, color: colors.textPrimary },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    backgroundColor: colors.bgSurface,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.textPrimary,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  searchInput: { flex: 1, padding: 0, fontFamily: fonts.regular, fontSize: 14, color: colors.textPrimary },
});
