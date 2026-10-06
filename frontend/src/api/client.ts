const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export type Urgency = 'self_care' | 'see_doctor' | 'urgent_care' | 'emergency';

export interface SymptomInput {
  symptoms: string[];
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

export interface PredictionResult {
  conditions: Condition[];
  urgency: Urgency;
  recommended_specialty: string;
  advice: string;
  disclaimer: string;
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
