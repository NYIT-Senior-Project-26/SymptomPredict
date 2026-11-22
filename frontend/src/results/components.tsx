// Building blocks shared by the results & care screens (Figma section 3) and the
// follow-up screens (section 4).
import { router } from 'expo-router';
import { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Condition } from '@/api/client';
import { Button } from '@/components/Button';
import { Icon, IconName } from '@/components/Icon';
import { ScreenLayout } from '@/components/ScreenLayout';
import { card, colors, fonts } from '@/theme';
import { LIKELIHOOD } from './urgency';

/** Scrolling content with optional buttons pinned at the bottom, with a divider above them. */
export function ResultsLayout({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <ScreenLayout footer={footer} contentStyle={styles.content} footerStyle={styles.footer}>
      {children}
    </ScreenLayout>
  );
}

/** A titled card. */
export function Section({ title, children, tone }: { title?: string; children: ReactNode; tone?: 'warning' }) {
  return (
    <View style={[styles.section, tone === 'warning' && styles.sectionWarning]}>
      {title && <Text style={[styles.sectionTitle, tone === 'warning' && styles.warningText]}>{title}</Text>}
      {children}
    </View>
  );
}

export function Body({ children }: { children: ReactNode }) {
  return <Text style={styles.body}>{children}</Text>;
}

/** Numbered steps, or a bulleted list with `bullets`. */
export function StepList({ items, bullets }: { items: string[]; bullets?: boolean }) {
  return (
    <View style={styles.steps}>
      {items.map((item, i) => (
        <View key={item} style={styles.step}>
          {bullets ? (
            <Text style={styles.bullet}>•</Text>
          ) : (
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{i + 1}</Text>
            </View>
          )}
          <Text style={styles.stepText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function LikelihoodBadge({ likelihood, short }: { likelihood: Condition['likelihood']; short?: boolean }) {
  const info = LIKELIHOOD[likelihood];
  return (
    <View style={[styles.badge, BADGE_COLORS[likelihood]]}>
      <Text style={[styles.badgeText, { color: BADGE_COLORS[likelihood].borderColor }]}>
        {short ? info.short : info.label}
      </Text>
    </View>
  );
}

const PILL_TONES = {
  green: { backgroundColor: colors.triageGreenBg, color: colors.triageGreen },
  yellow: { backgroundColor: colors.triageYellowBg, color: colors.triageYellow },
  red: { backgroundColor: colors.triageRedBg, color: colors.triageRed },
};

/** "Pill" in Figma: a small rounded tag, optionally with a check (matching symptoms). */
export function Pill({ label, tone, check }: { label: string; tone: keyof typeof PILL_TONES; check?: boolean }) {
  const { backgroundColor, color } = PILL_TONES[tone];
  return (
    <View style={[styles.pill, { backgroundColor }]}>
      {check && <Icon name="check-12" size={12} color={color} />}
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

/** Bulleted list with the Figma bullet dot (brand color, or yellow inside warning boxes). */
export function BulletList({ items, color = colors.brandPrimary }: { items: string[]; color?: string }) {
  return (
    <View style={styles.bullets}>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Icon name="bullet" size={20} width={6} color={color} />
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * A section card with an icon and a collapse chevron (Condition detail, 3.6).
 * Starts open; tapping the header collapses it.
 */
export function DetailCard({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={styles.detailCard}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
        style={styles.detailHeader}
      >
        <View style={styles.detailIcon}>
          <Icon name={icon} size={16} color={colors.brandPrimary} />
        </View>
        <Text style={styles.detailTitle}>{title}</Text>
        <Icon name={open ? 'chevron-up-18' : 'chevron-down'} size={18} color={colors.textSecondary} />
      </Pressable>
      {open && children}
    </View>
  );
}

export function Disclaimer({ text }: { text: string }) {
  return <Text style={styles.disclaimer}>{text}</Text>;
}

/** Shown when a results screen is opened without a finished symptom check. */
export function NoResult() {
  return (
    <ResultsLayout>
      <Text style={styles.title}>No result yet</Text>
      <Body>Finish a symptom check to see this screen.</Body>
      <Button label="Back to home" onPress={() => router.replace('/home')} />
    </ResultsLayout>
  );
}

const BADGE_COLORS = {
  high: { backgroundColor: colors.brandPrimaryLight, borderColor: colors.brandPrimary },
  medium: { backgroundColor: colors.triageYellowBg, borderColor: colors.triageYellow },
  low: { backgroundColor: colors.bgMuted, borderColor: colors.textSecondary },
};

export const resultStyles = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.textSecondary },
});

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  footer: { gap: 10, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: colors.borderDefault },
  title: resultStyles.title,
  section: { ...card, gap: 10 },
  sectionWarning: { borderColor: colors.triageYellow, backgroundColor: colors.triageYellowBg },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.textPrimary },
  warningText: { color: colors.triageYellow },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.textPrimary },
  steps: { gap: 10 },
  step: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandPrimaryLight,
  },
  stepNumberText: { fontFamily: fonts.bold, fontSize: 12, color: colors.brandPrimary },
  bullet: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 21, color: colors.textSecondary },
  stepText: { flex: 1, fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.textPrimary },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  badgeText: { fontFamily: fonts.semibold, fontSize: 12 },
  disclaimer: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.textSecondary },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: { fontFamily: fonts.semibold, fontSize: 12 },
  bullets: { gap: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bulletText: { flex: 1, fontFamily: fonts.regular, fontSize: 14, lineHeight: 14 * 1.45, color: colors.textPrimary },
  detailCard: { ...card, gap: 12 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandPrimaryLight,
  },
  detailTitle: { flex: 1, fontFamily: fonts.bold, fontSize: 17, color: colors.textPrimary },
});
