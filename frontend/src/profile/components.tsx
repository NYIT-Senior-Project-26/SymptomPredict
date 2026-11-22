// Building blocks shared by the profile setup screens (Figma 1.3–1.7).
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PROFILE_STEPS } from './content';
import { card, colors, fonts } from '@/theme';
import { Icon, IconName } from '@/components/Icon';
import { Stepper } from '@/components/Stepper';

export function ProfileProgress({ step }: { step: number }) {
  return <Stepper step={step} labels={PROFILE_STEPS} variant="profile" />;
}

/** Leaves profile setup for Home, removing onboarding from the history so Back can't return to it. */
export function finishProfile() {
  router.dismissAll();
  router.replace('/home');
}

export interface ListItem {
  key: string;
  title: string;
  subtitle?: string;
}

interface ListCardProps {
  items: ListItem[];
  /** Icon in the circle on the left, with its circle color. */
  icon: { name: IconName; background: string };
  /** Icon on the right and what tapping it does. */
  action: { icon: IconName; label: string; onPress: (key: string) => void };
}

/** The card listing added allergies (1.4) or medications (1.5). */
export function ListCard({ items, icon, action }: ListCardProps) {
  if (items.length === 0) return null;
  return (
    <View style={styles.card}>
      {items.map((item) => (
        <View key={item.key} style={styles.row}>
          <View style={[styles.rowIcon, { backgroundColor: icon.background }]}>
            <Icon name={icon.name} size={18} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            {item.subtitle && <Text style={styles.rowSubtitle}>{item.subtitle}</Text>}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${action.label} ${item.title}`}
            onPress={() => action.onPress(item.key)}
            hitSlop={10}
          >
            <Icon name={action.icon} size={18} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

/** "+ Add another allergy" style link. */
export function AddLink({ label, onPress, centered }: { label: string; onPress: () => void; centered?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      style={[styles.addLink, centered && styles.addLinkCentered]}
    >
      <Icon name="plus" size={18} />
      <Text style={styles.addLinkText}>{label}</Text>
    </Pressable>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: { ...card, gap: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.textPrimary },
  rowSubtitle: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.4, color: colors.textSecondary },
  addLink: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start' },
  addLinkCentered: { alignSelf: 'center' },
  addLinkText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.brandPrimary },
  fieldLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.textPrimary },
});
