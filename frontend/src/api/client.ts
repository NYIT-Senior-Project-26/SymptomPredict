const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

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
  rationale: string;
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
  recommended_specialty: string;
  advice: string;
  disclaimer: string;
  /** The ML model's ranking; empty when no symptom matched the dataset or the model isn't trained. */
  model_candidates: ModelCandidate[];
  /** Dataset symptoms the model's ranking is based on, e.g. `skin_rash`. */
  model_symptoms: string[];
  /** Reported symptoms the model never saw; Claude assessed them on its own. */
  unmatched_symptoms: string[];
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

  nearbyProviders: (specialty: string, lat: number, lng: number) =>
    request<unknown[]>(
      `/providers/nearby?specialty=${encodeURIComponent(specialty)}&lat=${lat}&lng=${lng}`,
    ),

  searchMedication: (name: string) =>
    request<unknown[]>(`/medications/search?name=${encodeURIComponent(name)}`),
};
