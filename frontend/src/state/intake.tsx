import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { PredictionResult } from '../api/client';
import { DurationId, FollowUpAnswer, HighRiskId, Severity, Trend } from '../intake/content';

export interface IntakeAnswers {
  /** Free-text description from 2.2. */
  complaint: string;
  /** Symptoms picked from chips on 2.2 and 2.3. */
  symptoms: string[];
  bodyArea: string | null;
  /** Follow-up answers keyed by question id. */
  followUps: Record<string, FollowUpAnswer>;
  severity: Severity;
  duration: DurationId | null;
  trend: Trend | null;
  /** High-risk groups that apply; `null` until answered, `[]` means "None of these apply". */
  highRisk: HighRiskId[] | null;
}

const EMPTY_ANSWERS: IntakeAnswers = {
  complaint: '',
  symptoms: [],
  bodyArea: null,
  followUps: {},
  severity: 'moderate',
  duration: null,
  trend: null,
  highRisk: null,
};

interface IntakeState {
  answers: IntakeAnswers;
  update: (patch: Partial<IntakeAnswers>) => void;
  toggleSymptom: (symptom: string) => void;
  /** Clears all answers and the previous result before a new check. */
  reset: () => void;
  result: PredictionResult | null;
  setResult: (result: PredictionResult | null) => void;
}

const IntakeContext = createContext<IntakeState | null>(null);

/** Holds the answers from the intake screens until the result comes back. */
export function IntakeProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const update = useCallback((patch: Partial<IntakeAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleSymptom = useCallback((symptom: string) => {
    setAnswers((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  }, []);

  const reset = useCallback(() => {
    setAnswers(EMPTY_ANSWERS);
    setResult(null);
  }, []);

  const value = useMemo(
    () => ({ answers, update, toggleSymptom, reset, result, setResult }),
    [answers, update, toggleSymptom, reset, result],
  );

  return <IntakeContext.Provider value={value}>{children}</IntakeContext.Provider>;
}

export function useIntake() {
  const ctx = useContext(IntakeContext);
  if (!ctx) throw new Error('useIntake must be used inside IntakeProvider');
  return ctx;
}
