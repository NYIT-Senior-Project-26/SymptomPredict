// Options and questions shown during symptom intake (Figma section 2).
// The follow-up questions are a local set until the backend can supply them; the
// body-area questions are in bodyAreaQuestions.ts.
import { BODY_AREA_QUESTIONS } from './bodyAreaQuestions';

export const COMMON_SYMPTOMS = [
  'Fever', 'Headache', 'Cough', 'Sore throat', 'Stomach pain', 'Rash', 'Fatigue', 'Dizziness',
];

// ── Body map (2.3) ────────────────────────────────────────────────────────────

export type BodySide = 'front' | 'back';

/** A tappable rectangle, as fractions (0–1) of the body-figure image. */
export interface Box { x: number; y: number; w: number; h: number }

export interface BodyArea {
  id: string;
  label: string;
  symptoms: string[];
  /** Tap targets per side; an area may appear on one or both figures. */
  boxes: Partial<Record<BodySide, Box[]>>;
}

// Boxes are measured on the 447×447 body-figure.png: front figure on the left, back on the right.
const px = (x: number, y: number, w: number, h: number): Box => ({
  x: x / 447, y: y / 447, w: w / 447, h: h / 447,
});

const LIMB_SYMPTOMS = ['Joint pain', 'Muscle pain', 'Numbness or tingling', 'Swelling', 'Weakness'];

export const BODY_AREAS: BodyArea[] = [
  {
    id: 'head',
    label: 'Head',
    symptoms: ['Headache', 'Dizziness', 'Ear pain', 'Eye pain', 'Congestion'],
    boxes: { front: [px(100, 15, 56, 74)], back: [px(290, 15, 56, 74)] },
  },
  {
    id: 'throat-neck',
    label: 'Throat / Neck',
    symptoms: ['Sore throat', 'Painful swallowing', 'Swollen glands', 'Hoarse voice', 'Stiff neck'],
    boxes: { front: [px(108, 89, 40, 14)], back: [px(298, 89, 40, 14)] },
  },
  {
    id: 'chest',
    label: 'Chest',
    symptoms: ['Chest pain', 'Shortness of breath', 'Cough', 'Racing heartbeat'],
    boxes: { front: [px(90, 103, 76, 62)] },
  },
  {
    id: 'abdomen',
    label: 'Abdomen',
    symptoms: ['Stomach pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Bloating'],
    boxes: { front: [px(93, 165, 70, 70)] },
  },
  {
    id: 'upper-back',
    label: 'Upper back',
    symptoms: ['Back pain', 'Muscle stiffness', 'Pain when breathing'],
    boxes: { back: [px(278, 103, 80, 82)] },
  },
  {
    id: 'lower-back',
    label: 'Lower back',
    symptoms: ['Lower back pain', 'Muscle stiffness', 'Pain when urinating'],
    boxes: { back: [px(283, 185, 72, 58)] },
  },
  {
    id: 'arms',
    label: 'Arms & hands',
    symptoms: LIMB_SYMPTOMS,
    boxes: {
      front: [px(42, 100, 48, 168), px(166, 100, 48, 168)],
      back: [px(232, 100, 46, 168), px(358, 100, 48, 168)],
    },
  },
  {
    id: 'legs',
    label: 'Legs & feet',
    symptoms: LIMB_SYMPTOMS,
    boxes: { front: [px(93, 235, 70, 192)], back: [px(283, 243, 72, 184)] },
  },
];

export function getBodyArea(id: string | null) {
  return BODY_AREAS.find((a) => a.id === id) ?? null;
}

// ── Follow-up questions (2.4) ─────────────────────────────────────────────────

export const YES_NO = ['Yes', 'No', "I don't know"];

export interface FollowUpQuestion {
  id: string;
  /** Eyebrow above the question, e.g. "SORE THROAT". */
  topic: string;
  question: string;
  hint?: string;
  /** Label for the row on the review screen (2.7). */
  summaryLabel: string;
  /** Answer choices; defaults to Yes / No / I don't know. */
  options?: string[];
  /** Allow picking several options. */
  multiple?: boolean;
  /** With `multiple`, the option that clears the others (e.g. "None of these"). */
  exclusive?: string;
  /** Ask only when every condition given here holds. */
  when?: {
    /** One of these symptoms is selected. */
    symptoms?: string[];
    /** An earlier question was answered with one of these options. */
    answer?: { id: string; in: string[] };
  };
  /** Ids of symptom questions this one makes redundant, so they're skipped. */
  covers?: string[];
}

/** A single choice is a string; a multiple-choice answer is a list. */
export type FollowUpAnswer = string | string[];

export function answerValues(answer: FollowUpAnswer | undefined): string[] {
  if (answer === undefined) return [];
  return Array.isArray(answer) ? answer : [answer];
}

export function formatAnswer(answer: FollowUpAnswer | undefined) {
  return answerValues(answer).join(', ');
}

/** Always asked first. */
const GENERAL: FollowUpQuestion[] = [
  { id: 'fever', topic: 'General', question: 'Do you have a fever?', summaryLabel: 'Fever' },
];

/** Asked when a matching symptom chip is selected (on 2.2 or 2.3). */
const SYMPTOM_FOLLOW_UPS: FollowUpQuestion[] = [
  {
    id: 'tonsil-patches',
    topic: 'Sore throat',
    question: 'Do you see white patches or pus on your tonsils?',
    hint: 'Use a mirror and a flashlight if you can.',
    summaryLabel: 'White patches on tonsils',
    when: { symptoms: ['Sore throat', 'Painful swallowing'] },
  },
  {
    id: 'worst-headache',
    topic: 'Headache',
    question: 'Is this the worst headache you have ever had?',
    summaryLabel: 'Worst headache ever',
    when: { symptoms: ['Headache'] },
  },
  {
    id: 'chest-pain-spread',
    topic: 'Chest pain',
    question: 'Does the pain spread to your arm, jaw or back?',
    summaryLabel: 'Pain spreads to arm, jaw or back',
    when: { symptoms: ['Chest pain'] },
  },
  {
    id: 'breathing-rest',
    topic: 'Breathing',
    question: 'Are you short of breath even while resting?',
    summaryLabel: 'Short of breath at rest',
    when: { symptoms: ['Shortness of breath', 'Cough'] },
  },
  {
    id: 'fainted',
    topic: 'Dizziness',
    question: 'Have you fainted or nearly fainted?',
    summaryLabel: 'Fainted or nearly fainted',
    when: { symptoms: ['Dizziness'] },
  },
  {
    id: 'rash-spreading',
    topic: 'Rash',
    question: 'Is the rash spreading quickly?',
    summaryLabel: 'Rash spreading quickly',
    when: { symptoms: ['Rash'] },
  },
  {
    id: 'keep-fluids-down',
    topic: 'Stomach',
    question: 'Are you able to keep fluids down?',
    summaryLabel: 'Keeping fluids down',
    when: { symptoms: ['Stomach pain', 'Nausea', 'Vomiting', 'Diarrhea'] },
  },
];

interface FollowUpContext {
  symptoms: string[];
  bodyArea: string | null;
  followUps: Record<string, FollowUpAnswer>;
}

function applies(q: FollowUpQuestion, ctx: FollowUpContext) {
  const { symptoms, answer } = q.when ?? {};
  if (symptoms && !symptoms.some((s) => ctx.symptoms.includes(s))) return false;
  if (answer && !answerValues(ctx.followUps[answer.id]).some((v) => answer.in.includes(v))) return false;
  return true;
}

// Conditional questions depend only on earlier ones, so changing an answer can add or
// remove later questions but never shifts earlier ones.

/**
 * Questions shown at the bottom of the body map (2.3) once an area is picked:
 * fever, then the area's questions. Empty when no area is picked.
 */
export function getBodyMapQuestions(ctx: FollowUpContext) {
  const area = (ctx.bodyArea && BODY_AREA_QUESTIONS[ctx.bodyArea]) || [];
  return area.length > 0 ? [...GENERAL, ...area].filter((q) => applies(q, ctx)) : [];
}

/**
 * Questions shown one per screen on 2.4: symptom questions the body map didn't
 * already cover. Fever is asked here only if the body map was skipped.
 */
export function getFollowUps(ctx: FollowUpContext) {
  const onBodyMap = getBodyMapQuestions(ctx);
  const covered = new Set(onBodyMap.flatMap((q) => q.covers ?? []));
  const symptomQuestions = SYMPTOM_FOLLOW_UPS.filter((q) => !covered.has(q.id) && applies(q, ctx));
  return [...(onBodyMap.length > 0 ? [] : GENERAL), ...symptomQuestions];
}

/** Every follow-up question that applies, in the order asked (for the review and the request). */
export function getAllFollowUps(ctx: FollowUpContext) {
  return [...getBodyMapQuestions(ctx), ...getFollowUps(ctx)];
}

/** Where to go after stage 1: the first follow-up screen, or straight to severity if there are none. */
export function afterStageOne(ctx: FollowUpContext) {
  return getFollowUps(ctx).length > 0 ? '/intake/follow-up' : '/intake/severity';
}

// ── Severity & duration (2.5) ─────────────────────────────────────────────────

export const SEVERITIES = [
  { id: 'mild', label: 'Mild', description: 'Mild — noticeable, but it doesn’t stop your day.' },
  { id: 'moderate', label: 'Moderate', description: 'Moderate — it affects eating, talking or sleep.' },
  { id: 'severe', label: 'Severe', description: 'Severe — it’s hard to do anything else.' },
] as const;
export type Severity = (typeof SEVERITIES)[number]['id'];

export const DURATIONS = [
  { id: 'under-1d', label: '< 24 hours', days: 0 },
  { id: '1-3d', label: '1–3 days', days: 2 },
  { id: '4-7d', label: '4–7 days', days: 5 },
  { id: '1-4w', label: '1–4 weeks', days: 14 },
  { id: 'over-1m', label: '> 1 month', days: 30 },
] as const;
export type DurationId = (typeof DURATIONS)[number]['id'];

export const TRENDS = [
  { id: 'better', label: 'Better', summary: 'getting better' },
  { id: 'same', label: 'About the same', summary: 'about the same' },
  { id: 'worse', label: 'Worse', summary: 'getting worse' },
] as const;
export type Trend = (typeof TRENDS)[number]['id'];

// ── High-risk check (2.6) ─────────────────────────────────────────────────────

export const HIGH_RISK_OPTIONS = [
  { id: 'age-65', label: "I'm 65 or older", summary: '65 or older' },
  { id: 'pregnant', label: "I'm pregnant or may be pregnant", summary: 'Pregnant or may be pregnant' },
  {
    id: 'immunocompromised',
    label: 'I have a weakened immune system (e.g. chemotherapy, HIV, organ transplant)',
    summary: 'Weakened immune system',
  },
] as const;
export type HighRiskId = (typeof HIGH_RISK_OPTIONS)[number]['id'];

// ── Question numbering ("QUESTION 3 OF ~8") ───────────────────────────────────
// 1 chief complaint, 2 body area, then follow-ups, then severity (counts as two:
// severity and duration), then the high-risk check. The total is approximate
// because the follow-ups change with the selected symptoms.

export function questionNumbers(followUpCount: number) {
  return {
    followUp: (index: number) => 3 + index,
    severity: 3 + followUpCount,
    highRisk: 5 + followUpCount,
    total: 6 + followUpCount,
  };
}
