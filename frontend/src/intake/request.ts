import { SymptomInput } from '@/api/client';
import { IntakeAnswers } from './state';
import { Profile } from '@/profile/state';
import {
  answerValues,
  DURATIONS,
  formatAnswer,
  getAllFollowUps,
  getBodyArea,
  HIGH_RISK_OPTIONS,
  SEVERITIES,
  TRENDS,
} from './content';

const API_SEX = { Female: 'female', Male: 'male', Intersex: 'other' } as const;

/**
 * Turns the intake answers and profile into a `/predict` request. Details the API
 * has no field for go in `notes`. Insurance is never sent.
 */
export function buildPredictInput(answers: IntakeAnswers, profile: Profile): SymptomInput {
  const complaint = answers.complaint.trim();
  const area = getBodyArea(answers.bodyArea);
  // The API needs at least one symptom: the chips, else the typed text, else the body area
  // (someone may only tap an area on the body map and answer its questions).
  const fallback = complaint || (area ? `Pain or discomfort: ${area.label}` : '');
  const symptoms = answers.symptoms.length > 0 ? answers.symptoms : [fallback];
  const duration = DURATIONS.find((d) => d.id === answers.duration);
  const age = parseInt(profile.age, 10);

  const notes: string[] = [];
  // The backend matches these to the ML model's symptoms; the full text also goes in notes.
  const followUpAnswers: Record<string, string[]> = {};
  if (complaint) notes.push(`In their words: ${complaint}`);
  if (area) notes.push(`Body area: ${area.label}`);
  for (const q of getAllFollowUps(answers)) {
    const values = answerValues(answers.followUps[q.id]);
    if (values.length > 0) followUpAnswers[q.id] = values;
    const answer = formatAnswer(answers.followUps[q.id]);
    if (answer) notes.push(`${q.question} ${answer}`);
  }
  notes.push(`Severity: ${SEVERITIES.find((s) => s.id === answers.severity)?.label}`);
  const trend = TRENDS.find((t) => t.id === answers.trend);
  if (duration || trend) {
    notes.push(`Duration: ${[duration?.label, trend?.summary].filter(Boolean).join(', ')}`);
  }
  if (answers.highRisk) notes.push(`High-risk groups: ${highRiskSummary(answers.highRisk)}`);

  if (profile.allergies.length > 0) {
    notes.push(`Allergies: ${profile.allergies.map((a) => `${a.name} (${a.category.toLowerCase()})`).join(', ')}`);
  }
  if (profile.medications.length > 0) notes.push(`Current medications: ${profile.medications.join(', ')}`);
  if (profile.conditions.length > 0) notes.push(`Ongoing conditions: ${profile.conditions.join(', ')}`);
  if (profile.bloodPressure) notes.push(`Blood pressure: ${profile.bloodPressure}`);
  if (profile.smoking) notes.push(`Smoking: ${profile.smoking}`);

  return {
    symptoms,
    follow_up_answers: followUpAnswers,
    age: age >= 0 && age <= 120 ? age : undefined,
    sex: profile.sex ? API_SEX[profile.sex] : undefined,
    duration_days: duration?.days,
    notes: notes.join('\n'),
  };
}

export function highRiskSummary(ids: IntakeAnswers['highRisk']) {
  if (!ids || ids.length === 0) return 'None';
  return HIGH_RISK_OPTIONS.filter((o) => ids.includes(o.id)).map((o) => o.summary).join(', ');
}
