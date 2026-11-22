import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { NoResult } from '@/results/components';
import { createSummaryPdf, logoDataUri, PDF_PAGE, pdfFileName, summaryContent, summaryHtml } from '@/results/pdf';
import { useIntake } from '@/intake/state';
import { useProfile } from '@/profile/state';
import { colors, fonts, palette } from '@/theme';

// 4.5 Export & Share Sheet: a one-page PDF of the triage result, shared through the
// phone's own share sheet (AirDrop, Messages, Mail, Files, Copy, Print, Save to Files).
// Nothing is saved: the PDF is written to the cache for sharing, then deleted.
export default function Export() {
  const insets = useSafeAreaInsets();
  const { result, answers } = useIntake();
  const { profile } = useProfile();
  const [busy, setBusy] = useState<'share' | 'print' | null>(null);

  const summary = useMemo(
    () => (result ? summaryContent(result, answers, profile) : null),
    [result, answers, profile],
  );
  if (!result || !summary) return <NoResult />;
  const buildHtml = async () => summaryHtml(summary, await logoDataUri());

  async function share() {
    setBusy('share');
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing isn’t available on this device');
        return;
      }
      const file = await createSummaryPdf(await buildHtml());
      try {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Share summary' });
      } finally {
        file.delete();
      }
    } catch {
      Alert.alert('Couldn’t create the PDF', 'Please try again.');
    } finally {
      setBusy(null);
    }
  }

  async function print() {
    setBusy('print');
    try {
      await Print.printAsync({ html: await buildHtml(), ...PDF_PAGE });
    } catch {
      // Closing the print dialog without printing also lands here on some devices
    } finally {
      setBusy(null);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Preview of the PDF page */}
        <View style={styles.page} accessible accessibilityLabel="Preview of the PDF summary">
          <Text style={styles.brand}>DiagnosisCloud</Text>
          <Text style={styles.pageTitle}>Symptom Check Summary</Text>
          <Text style={styles.pageMuted}>
            {summary.date}
            {summary.patient ? ` · ${summary.patient}` : ''}
          </Text>
          <Text style={[styles.pageBold, { color: summary.triage.color }]}>{summary.triage.label}</Text>
          <Text style={styles.pageHeading}>CHIEF COMPLAINT</Text>
          <Text style={styles.pageText} numberOfLines={2}>
            {summary.complaint}
          </Text>
          <Text style={styles.pageHeading}>TOP POSSIBLE CONDITIONS</Text>
          {summary.conditions.map((c, i) => (
            <Text key={c.name} style={styles.pageText} numberOfLines={1}>
              {i + 1}. {c.name} · {c.likelihood}
            </Text>
          ))}
          <View style={styles.pageLines}>
            {[90, 75, 85, 60].map((w) => (
              <View key={w} style={[styles.pageLine, { width: `${w}%` }]} />
            ))}
          </View>
        </View>
        <Text style={styles.fileName}>{pdfFileName()}</Text>
        <Text style={styles.fileInfo}>1 page · PDF</Text>
      </ScrollView>

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.grabber} />
        <Button label="Share PDF" icon="message" loading={busy === 'share'} disabled={busy !== null} onPress={share} />
        <Button label="Print" variant="neutral" loading={busy === 'print'} disabled={busy !== null} onPress={print} />
        <Text style={styles.note}>
          Includes your result, possible conditions and what you reported, but not your insurance. Once shared, it’s kept
          by the app you send it to, so only share it with people you trust.
        </Text>
      </View>
    </View>
  );
}

const PAGE_TEXT = { fontFamily: fonts.regular, fontSize: 9, lineHeight: 13, color: colors.textPrimary };

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgBackdrop },
  content: { alignItems: 'center', paddingTop: 28, paddingBottom: 20, paddingHorizontal: 24 },
  page: { width: 240, minHeight: 300, padding: 18, gap: 3, borderRadius: 6, backgroundColor: colors.bgSurface },
  brand: { fontFamily: fonts.bold, fontSize: 11, color: colors.brandPrimary, marginBottom: 4 },
  pageTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.textPrimary },
  pageMuted: { ...PAGE_TEXT, color: colors.textSecondary },
  pageBold: { ...PAGE_TEXT, fontFamily: fonts.semibold, marginVertical: 4 },
  pageText: PAGE_TEXT,
  pageHeading: { ...PAGE_TEXT, fontSize: 7, color: colors.textSecondary, marginTop: 6 },
  pageLines: { gap: 6, marginTop: 8 },
  pageLine: { height: 5, borderRadius: 3, backgroundColor: colors.borderDefault },
  fileName: { fontFamily: fonts.semibold, fontSize: 14, color: colors.textOnPrimary, marginTop: 16 },
  fileInfo: { fontFamily: fonts.regular, fontSize: 12, color: palette.grey[300], marginTop: 4 },
  sheet: {
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.bgSurface,
  },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.borderDefault, marginBottom: 4 },
  note: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.textSecondary },
});
