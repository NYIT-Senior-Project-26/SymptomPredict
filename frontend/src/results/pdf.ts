// 4.4 Doctor-Facing PDF Export: a one-page A4 summary of the check, built from the
// triage result and answers in memory. Shared from 4.5; the file is written to the
// app's cache only for sharing and deleted after.
import { Asset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';

import { PredictionResult } from '@/api/client';
import { DURATIONS, formatAnswer, getAllFollowUps, SEVERITIES, TRENDS } from '@/intake/content';
import { buildPredictInput, highRiskSummary } from '@/intake/request';
import { IntakeAnswers } from '@/intake/state';
import { Profile } from '@/profile/state';
import { colors as theme } from '@/theme';
import { LIKELIHOOD, URGENCY } from './urgency';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** A4 in points, as in the Figma frame. */
const PAGE = { width: 595, height: 842 };

const TONE_COLOR = { green: theme.triageGreen, yellow: theme.triageYellow, red: theme.triageRed };

/** e.g. "DiagnosisCloud_Summary_Nov22.pdf" (4.5 in Figma). */
export function pdfFileName(date = new Date()) {
  return `DiagnosisCloud_Summary_${MONTHS[date.getMonth()]}${date.getDate()}.pdf`;
}

/** Everything the summary shows, as plain values (used by the 4.5 preview and the PDF). */
export function summaryContent(result: PredictionResult, answers: IntakeAnswers, profile: Profile) {
  const input = buildPredictInput(answers, profile); // never includes insurance
  const urgency = URGENCY[result.urgency];
  const now = new Date();
  const duration = DURATIONS.find((d) => d.id === answers.duration);
  const trend = TRENDS.find((t) => t.id === answers.trend);

  const followUps: [string, string][] = getAllFollowUps(answers)
    .map((q): [string, string] => [q.summaryLabel, formatAnswer(answers.followUps[q.id])])
    .filter(([, answer]) => answer);
  followUps.push(['Severity', SEVERITIES.find((s) => s.id === answers.severity)?.label ?? '—']);
  if (duration || trend) {
    followUps.push(['Duration / trend', [duration?.label, trend?.summary].filter(Boolean).join(' · ')]);
  }
  if (answers.highRisk) followUps.push(['High-risk group', highRiskSummary(answers.highRisk)]);

  const profileParts = [
    profile.allergies.length > 0 && `Allergies: ${profile.allergies.map((a) => `${a.name} (${a.category.toLowerCase()})`).join(', ')}`,
    profile.medications.length > 0 && `Medications: ${profile.medications.join(', ')}`,
    profile.conditions.length > 0 && `Conditions: ${profile.conditions.join(', ')}`,
    profile.bloodPressure && `Blood pressure: ${profile.bloodPressure}`,
    profile.smoking && `Smoking: ${profile.smoking}`,
  ].filter((p): p is string => !!p);

  return {
    date: `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`,
    time: now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    patient: [input.age !== undefined ? String(input.age) : '', profile.sex ?? ''].filter(Boolean).join(' · '),
    headline: result.next_step,
    triage: { label: result.next_step, color: TONE_COLOR[urgency.pill.tone] },
    specialty: result.recommended_specialty,
    complaint: answers.complaint.trim() || input.symptoms.join(', '),
    symptoms: input.symptoms,
    followUps,
    conditions: result.conditions.map((c) => ({ name: c.name, likelihood: LIKELIHOOD[c.likelihood].label })),
    profile: profileParts.length > 0 ? profileParts.join('  ·  ') : 'None reported',
  };
}

type Summary = ReturnType<typeof summaryContent>;

/** User-typed text ends up in the HTML, so everything is escaped. */
function esc(text: string) {
  return text.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

/** The logo as a data URI, so the PDF doesn't need network or file access. */
export async function logoDataUri() {
  const asset = Asset.fromModule(require('../../assets/images/logo.png'));
  await asset.downloadAsync();
  const base64 = await new File(asset.localUri ?? asset.uri).base64();
  return `data:image/png;base64,${base64}`;
}

export function summaryHtml(s: Summary, logo: string) {
  const followUps = s.followUps
    .map(([q, a], i) => `<tr class="${i % 2 === 0 ? 'alt' : ''}"><td class="q">${esc(q)}</td><td class="a">${esc(a)}</td></tr>`)
    .join('');
  const conditions = s.conditions
    .map(
      (c, i) =>
        `<tr><td class="${i === 0 ? 'top' : ''}">${i + 1}. ${esc(c.name)}</td><td class="lvl">${esc(c.likelihood)}</td></tr>`,
    )
    .join('');

  return `<!doctype html>
<html><head><meta charset="utf-8"/>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body { font-family: Inter, -apple-system, Roboto, Helvetica, Arial, sans-serif; color: ${theme.textPrimary}; }
  .page { display: flex; flex-direction: column; gap: 14px; min-height: 100%; padding: 36px 40px; }
  .head { display: flex; justify-content: space-between; align-items: center; }
  .logo { position: relative; width: 150px; height: 29px; overflow: hidden; }
  .logo img { position: absolute; left: -13.29%; top: -152.34%; width: 126.35%; height: 431.42%; }
  .title { text-align: right; }
  .title b { display: block; font-size: 14px; }
  .title span { font-size: 9px; color: ${theme.textSecondary}; }
  .rule { height: 1px; background: ${theme.borderDefault}; }
  .facts { display: flex; gap: 24px; font-weight: 600; }
  .facts small { display: block; font-size: 8px; color: ${theme.textSecondary}; margin-bottom: 2px; }
  .facts div { font-size: 11px; }
  h2 { margin: 0; font-size: 11px; font-weight: 700; color: ${theme.brandPrimary}; }
  p { margin: 0; font-size: 10.5px; line-height: 1.45; }
  table { width: 100%; border-collapse: collapse; }
  .answers-box { border: 1px solid ${theme.borderDefault}; border-radius: 6px; overflow: hidden; }
  .answers { font-size: 10px; }
  .answers td { padding: 6px 10px; width: 50%; vertical-align: top; }
  .answers tr.alt { background: ${theme.bgCanvas}; }
  .answers .q { color: ${theme.textSecondary}; }
  .answers .a { font-weight: 500; }
  .conds td { padding: 3px 0; font-size: 10.5px; }
  .conds td.top { font-weight: 600; }
  .conds td.lvl { text-align: right; font-size: 10px; font-weight: 600; color: ${theme.brandPrimary}; }
  .spacer { flex: 1; }
  .foot { font-size: 8.5px; line-height: 1.4; color: ${theme.textSecondary}; }
</style></head>
<body><div class="page">
  <div class="head">
    <div class="logo"><img src="${logo}" alt="DiagnosisCloud"/></div>
    <div class="title"><b>Symptom Check Summary</b><span>Generated ${esc(s.date)}</span></div>
  </div>
  <div class="rule"></div>
  <div class="facts">
    <div><small>AGE / SEX</small>${esc(s.patient || '—')}</div>
    <div><small>SESSION DATE</small>${esc(`${s.date}, ${s.time}`)}</div>
    <div><small>TRIAGE LEVEL</small><span style="color:${s.triage.color}">${esc(s.triage.label)}</span></div>
  </div>

  <h2>CHIEF COMPLAINT</h2>
  <p>${esc(s.complaint)}</p>

  <h2>FOLLOW-UP ANSWERS</h2>
  <div class="answers-box"><table class="answers">${followUps}</table></div>

  <h2>TOP POSSIBLE CONDITIONS (LIKELIHOOD)</h2>
  <table class="conds">${conditions}</table>

  <h2>PATIENT PROFILE</h2>
  <p>${esc(s.profile)}</p>

  <div class="spacer"></div>
  <div class="rule"></div>
  <div class="foot">This report was generated by DiagnosisCloud from patient-entered information and is not a
  medical diagnosis. Likelihood levels reflect how well the reported symptoms fit each condition.</div>
</div></body></html>`;
}

/** Writes the PDF to the cache under its Figma file name. Delete it when done (`file.delete()`). */
export async function createSummaryPdf(html: string) {
  const { uri } = await Print.printToFileAsync({ html, ...PAGE, margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  const file = new File(Paths.cache, pdfFileName());
  if (file.exists) file.delete();
  await new File(uri).move(file);
  return file;
}

export { PAGE as PDF_PAGE };
