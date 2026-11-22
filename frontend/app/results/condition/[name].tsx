import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { api, Condition, ConditionDetail as Detail } from '@/api/client';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ScreenLayout } from '@/components/ScreenLayout';
import { buildPredictInput } from '@/intake/request';
import { useIntake } from '@/intake/state';
import { useProfile } from '@/profile/state';
import { BulletList, DetailCard, NoResult, Pill } from '@/results/components';
import { LIKELIHOOD, URGENCY } from '@/results/urgency';
import { colors, fonts } from '@/theme';

type Tab = 'details' | 'treatment';
type Load = { status: 'loading' } | { status: 'missing' } | { status: 'error' } | { status: 'done'; detail: Detail };

// Loaded details are kept in memory for this app session only (nothing is saved).
const cache = new Map<string, Detail>();

// 3.6a Condition details / 3.6b Treatment options: one screen with two tabs. The
// content comes from MedlinePlus, sorted into sections by the backend.
export default function ConditionDetail() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { result, answers } = useIntake();
  const { profile } = useProfile();
  const [tab, setTab] = useState<Tab>('details');
  const index = result?.conditions.findIndex((c) => c.name === name) ?? -1;
  const condition = index >= 0 ? result!.conditions[index] : undefined;
  const [load, setLoad] = useState<Load>(() =>
    name && cache.has(name) ? { status: 'done', detail: cache.get(name)! } : { status: 'loading' },
  );

  const fetchDetail = useCallback(async () => {
    if (!condition) return;
    setLoad({ status: 'loading' });
    try {
      const reported = [...buildPredictInput(answers, profile).symptoms, ...condition.matching_symptoms];
      const detail = await api.conditionDetail({
        name: condition.name,
        reported: [...new Set(reported)],
        allergies: profile.allergies.map((a) => a.name),
      });
      cache.set(condition.name, detail);
      setLoad({ status: 'done', detail });
    } catch (e) {
      setLoad({ status: e instanceof Error && e.message.startsWith('API 404') ? 'missing' : 'error' });
    }
  }, [condition, answers, profile]);

  useEffect(() => {
    if (load.status === 'loading') fetchDetail();
    // Load once on arrival; "Try again" calls fetchDetail directly.
  }, []);

  if (!result || !condition) return <NoResult />;
  const urgency = URGENCY[result.urgency];
  const detail = load.status === 'done' ? load.detail : null;

  return (
    <ScreenLayout
      contentStyle={styles.screenContent}
      footerStyle={styles.footer}
      footer={
        <View style={styles.footerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ask the diagnosis assistant"
            onPress={() => router.push('/chat/diagnosis')}
            style={styles.askButton}
          >
            <Icon name="message" size={20} color={colors.brandPrimary} />
          </Pressable>
          <Button label={urgency.nextStep.label} onPress={() => router.push(urgency.nextStep.href)} style={styles.primary} />
        </View>
      }
    >
      <Hero rank={index + 1} condition={condition} pill={urgency.pill} sourceTitle={detail?.source_title} />

      <View style={styles.tabs} accessibilityRole="tablist">
        <TabButton label="Condition details" active={tab === 'details'} onPress={() => setTab('details')} />
        <TabButton label="Treatment options" active={tab === 'treatment'} onPress={() => setTab('treatment')} />
      </View>

      <View style={styles.content}>
        {load.status === 'loading' && (
          <View style={styles.message}>
            <ActivityIndicator color={colors.brandPrimary} />
            <Text style={styles.messageText}>Loading details from MedlinePlus…</Text>
          </View>
        )}
        {(load.status === 'missing' || load.status === 'error') && (
          <Fallback condition={condition} missing={load.status === 'missing'} onRetry={fetchDetail} />
        )}
        {detail && (tab === 'details' ? <DetailsTab detail={detail} /> : <TreatmentTab detail={detail} />)}
        {detail && <Sources detail={detail} />}
      </View>
    </ScreenLayout>
  );
}

function Hero({
  rank,
  condition,
  pill,
  sourceTitle,
}: {
  rank: number;
  condition: Condition;
  pill: (typeof URGENCY)[keyof typeof URGENCY]['pill'];
  sourceTitle?: string;
}) {
  const showSource = sourceTitle && sourceTitle.toLowerCase() !== condition.name.toLowerCase();
  return (
    <View style={styles.hero}>
      <View style={styles.heroRow}>
        <Text style={styles.rankLabel}>#{rank} MATCH</Text>
        <Pill label={pill.label} tone={pill.tone} />
      </View>
      <Text style={styles.name} accessibilityRole="header">
        {condition.name}
      </Text>
      {showSource && <Text style={styles.subtitle}>Covered on MedlinePlus under “{sourceTitle}”</Text>}
      <View style={styles.heroRow}>
        <Text style={styles.likelihoodLabel}>Likelihood</Text>
        <Text style={styles.likelihoodValue}>{LIKELIHOOD[condition.likelihood].label}</Text>
      </View>
    </View>
  );
}

function TabButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
    >
      <Text style={active ? styles.tabTextActive : styles.tabText}>{label}</Text>
    </Pressable>
  );
}

function DetailsTab({ detail }: { detail: Detail }) {
  const empty =
    !detail.overview && !detail.symptoms.length && !detail.how_common.length && !detail.risk_factors.length && !detail.tests.length;
  if (empty) return <Empty />;
  return (
    <>
      {!!detail.overview && (
        <DetailCard icon="book" title="Overview">
          <Text style={styles.paragraph}>{detail.overview}</Text>
        </DetailCard>
      )}

      {detail.symptoms.length > 0 && (
        <DetailCard icon="thermometer-16" title="Symptoms">
          <Text style={styles.caption}>Matched against what you reported</Text>
          <View style={styles.symptoms}>
            {detail.symptoms.map((s) => (
              <View key={s.label} style={styles.symptomRow}>
                <Icon name={s.reported ? 'check-18' : 'circle'} size={18} />
                <Text style={s.reported ? styles.symptomReported : styles.symptomOther}>{s.label}</Text>
                {s.reported && <Pill label="You" tone="green" />}
              </View>
            ))}
          </View>
          {!!detail.symptoms_note && (
            <View style={styles.note}>
              <Icon name="info" size={16} color={colors.brandPrimary} />
              <Text style={styles.noteText}>{detail.symptoms_note}</Text>
            </View>
          )}
        </DetailCard>
      )}

      {(detail.how_common.length > 0 || !!detail.how_common_note) && (
        <DetailCard icon="chart" title="How common">
          {detail.how_common.length > 0 && (
            <View style={styles.stats}>
              {detail.how_common.map((s) => (
                <View key={s.value + s.label} style={styles.stat}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}
          {!!detail.how_common_note && <Text style={styles.paragraph}>{detail.how_common_note}</Text>}
        </DetailCard>
      )}

      {detail.risk_factors.length > 0 && (
        <DetailCard icon="users" title="Risk factors">
          <BulletList items={detail.risk_factors} />
        </DetailCard>
      )}

      {detail.tests.length > 0 && (
        <DetailCard icon="flask" title="Screening & diagnosis options">
          {detail.tests.map((t) => (
            <View key={t.name} style={styles.inset}>
              <View style={styles.insetHeader}>
                <Text style={styles.insetTitle}>{t.name}</Text>
                {!!t.timing && <Pill label={t.timing} tone="green" />}
              </View>
              {!!t.description && <Text style={styles.insetText}>{t.description}</Text>}
            </View>
          ))}
        </DetailCard>
      )}
    </>
  );
}

function TreatmentTab({ detail }: { detail: Detail }) {
  const empty =
    !detail.treatment &&
    !detail.treatment_points.length &&
    !detail.at_home_care.length &&
    !detail.timeline.length &&
    !detail.get_help.length;
  if (empty) return <Empty />;
  return (
    <>
      {(!!detail.treatment || detail.treatment_points.length > 0 || !!detail.allergy_warning) && (
        <DetailCard icon="pill-16" title="Treatment">
          {!!detail.treatment && <Text style={styles.paragraph}>{detail.treatment}</Text>}
          {!!detail.allergy_warning && (
            <View style={styles.allergy}>
              <Icon name="alert-18" size={18} color={colors.triageYellow} />
              <Text style={styles.allergyText}>{detail.allergy_warning}</Text>
            </View>
          )}
          {detail.treatment_points.length > 0 && <BulletList items={detail.treatment_points} />}
        </DetailCard>
      )}

      {detail.at_home_care.length > 0 && (
        <DetailCard icon="home-16" title="At-home care">
          <BulletList items={detail.at_home_care} />
        </DetailCard>
      )}

      {(detail.timeline.length > 0 || !!detail.timeline_note) && (
        <DetailCard icon="clock-16" title="What to expect">
          {detail.timeline.length > 0 && (
            <View>
              {detail.timeline.map((step, i) => (
                <View key={step.when + i} style={styles.timelineRow}>
                  <View style={styles.timelineRail}>
                    <Icon name={i === 0 ? 'dot-filled' : 'dot-open'} size={12} />
                    {i < detail.timeline.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineText}>
                    <Text style={styles.timelineWhen}>{step.when}</Text>
                    <Text style={styles.timelineWhat}>{step.what}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          {!!detail.timeline_note && <Text style={styles.paragraph}>{detail.timeline_note}</Text>}
        </DetailCard>
      )}

      {detail.get_help.length > 0 && (
        <View style={styles.getHelp}>
          <View style={styles.getHelpHeader}>
            <Icon name="alert-18" size={18} />
            <Text style={styles.getHelpTitle}>Get help right away if you:</Text>
          </View>
          <BulletList items={detail.get_help} />
        </View>
      )}
    </>
  );
}

function Sources({ detail }: { detail: Detail }) {
  return (
    <Pressable accessibilityRole="link" onPress={() => Linking.openURL(detail.source_url)} style={styles.sources}>
      <Icon name="book-12" size={12} color={colors.textSecondary} />
      <Text style={styles.sourcesText}>
        Source: MedlinePlus, “{detail.source_title}”. Information only — not a diagnosis.
      </Text>
    </Pressable>
  );
}

function Empty() {
  return (
    <Text style={styles.messageText}>
      MedlinePlus doesn’t cover this part for this condition. Ask your doctor or pharmacist.
    </Text>
  );
}

function Fallback({ condition, missing, onRetry }: { condition: Condition; missing: boolean; onRetry: () => void }) {
  const search = `https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?v%3Aproject=medlineplus&query=${encodeURIComponent(condition.name)}`;
  return (
    <>
      <DetailCard icon="book" title="Why it came up">
        <Text style={styles.paragraph}>{condition.rationale}</Text>
      </DetailCard>
      <View style={styles.message}>
        <Text style={styles.messageText}>
          {missing
            ? 'MedlinePlus has no page for this condition, so details and treatment options aren’t available.'
            : 'We couldn’t load the details right now.'}
        </Text>
        {missing ? (
          <Button label="Search MedlinePlus" variant="neutral" icon="search" onPress={() => Linking.openURL(search)} />
        ) : (
          <Button label="Try again" variant="neutral" onPress={onRetry} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingBottom: 24 },
  footer: { borderTopWidth: 1, borderTopColor: colors.borderDefault },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  askButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSurface,
  },
  primary: { flex: 1 },
  hero: { gap: 10, paddingTop: 8, paddingHorizontal: 24 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rankLabel: { fontFamily: fonts.semibold, fontSize: 11, color: colors.brandPrimary },
  name: { fontFamily: fonts.bold, fontSize: 28, color: colors.textPrimary },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary },
  likelihoodLabel: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  likelihoodValue: { fontFamily: fonts.bold, fontSize: 14, color: colors.brandPrimary },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDefault,
  },
  tab: { flex: 1, alignItems: 'center', paddingTop: 14, paddingBottom: 12, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.brandPrimary },
  tabText: { fontFamily: fonts.medium, fontSize: 15, color: colors.textSecondary },
  tabTextActive: { fontFamily: fonts.bold, fontSize: 15, color: colors.brandPrimary },
  content: { gap: 14, paddingTop: 16, paddingHorizontal: 24 },
  message: { alignItems: 'center', gap: 12, paddingVertical: 12 },
  messageText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.textSecondary, textAlign: 'center' },
  paragraph: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 14 * 1.55, color: colors.textSecondary },
  caption: { fontFamily: fonts.regular, fontSize: 12, color: colors.textSecondary },
  symptoms: { gap: 10 },
  symptomRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  symptomReported: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.textPrimary },
  symptomOther: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.brandPrimaryLight,
  },
  noteText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 12 * 1.45, color: colors.textPrimary },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, gap: 4, padding: 12, borderRadius: 10, backgroundColor: colors.bgCanvas },
  statValue: { fontFamily: fonts.bold, fontSize: 20, color: colors.brandPrimary },
  statLabel: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 12 * 1.4, color: colors.textSecondary },
  inset: { gap: 6, padding: 12, borderRadius: 10, backgroundColor: colors.bgCanvas },
  insetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  insetTitle: { flexShrink: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.textPrimary },
  insetText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.45, color: colors.textSecondary },
  allergy: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.triageYellow,
    backgroundColor: colors.triageYellowBg,
  },
  allergyText: { flex: 1, fontFamily: fonts.medium, fontSize: 13, lineHeight: 13 * 1.45, color: colors.textPrimary },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineRail: { width: 14, alignItems: 'center' },
  timelineLine: { flex: 1, width: 2, backgroundColor: colors.brandPrimaryLight },
  timelineText: { flex: 1, gap: 2, paddingBottom: 16 },
  timelineWhen: { fontFamily: fonts.semibold, fontSize: 14, color: colors.textPrimary },
  timelineWhat: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 13 * 1.45, color: colors.textSecondary },
  getHelp: {
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.triageRed,
    backgroundColor: colors.triageRedBg,
  },
  getHelpHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  getHelpTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.triageRed },
  sources: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sourcesText: { flex: 1, fontFamily: fonts.regular, fontSize: 11, color: colors.textSecondary },
});
