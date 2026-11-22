import Constants from 'expo-constants';

// EXPO_PUBLIC_API_URL from the repo-root .env, passed in by app.config.js
const API_URL = (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? 'http://localhost:8000/api/v1';

export type Urgency = 'self_care' | 'see_doctor' | 'urgent_care' | 'emergency';

export interface SymptomInput {
  symptoms: string[];
  /** Follow-up question id → selected options, e.g. `{ fever: ['Yes'] }`. */
  follow_up_answers?: Record<string, string[]>;
  age?: number;
  sex?: 'male' | 'female' | 'other';
  duration_days?: number;
  notes?: string;
}

export interface Condition {
  name: string;
  likelihood: 'low' | 'medium' | 'high';
  /** One sentence on what the condition is. */
  description: string;
  /** Reported symptoms that fit it, as short labels ("Fever", "No cough"). */
  matching_symptoms: string[];
  /** Why it fits this person's answers ("Why this match"). */
  rationale: string;
}

/** Condition details and treatment options (3.6), from MedlinePlus. Empty sections are hidden. */
export interface ConditionDetail {
  overview: string;
  symptoms: { label: string; reported: boolean }[];
  symptoms_note: string;
  how_common: { value: string; label: string }[];
  how_common_note: string;
  risk_factors: string[];
  tests: { name: string; timing: string; description: string }[];
  treatment: string;
  treatment_points: string[];
  allergy_warning: string;
  at_home_care: string[];
  timeline: { when: string; what: string }[];
  timeline_note: string;
  get_help: string[];
  source_title: string;
  source_url: string;
}

/** One condition ranked by the ML model, before Claude's analysis. */
export interface ModelCandidate {
  name: string;
  probability: number;
  /** probability as 0–100 */
  match_score: number;
}

export interface PredictionResult {
  conditions: Condition[];
  urgency: Urgency;
  /** Headline for "What to do next", e.g. "See a doctor within 24–48 hours". */
  next_step: string;
  recommended_specialty: string;
  advice: string;
  /** Self-care only: "See a doctor if you notice". */
  warning_signs: string[];
  disclaimer: string;
  /** The ML model's ranking; empty when no symptom matched the dataset or the model isn't trained. */
  model_candidates: ModelCandidate[];
  /** Dataset symptoms the model's ranking is based on, e.g. `skin_rash`. */
  model_symptoms: string[];
  /** Reported symptoms the model never saw; Claude assessed them on its own. */
  unmatched_symptoms: string[];
}

/** A place from Google Places (backend /providers/nearby). Fields may be missing. */
export interface Place {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  nationalPhoneNumber?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  predict: (input: SymptomInput) =>
    request<PredictionResult>('/predict', { method: 'POST', body: JSON.stringify(input) }),

  conditionDetail: (input: { name: string; reported: string[]; allergies: string[] }) =>
    request<ConditionDetail>('/conditions/detail', { method: 'POST', body: JSON.stringify(input) }),

  nearbyProviders: (specialty: string, lat: number, lng: number) =>
    request<Place[]>(
      `/providers/nearby?specialty=${encodeURIComponent(specialty)}&lat=${lat}&lng=${lng}`,
    ),

  searchMedication: (name: string) =>
    request<unknown[]>(`/medications/search?name=${encodeURIComponent(name)}`),
};
