import { createContext, ReactNode, useContext, useState } from 'react';

import { PredictionResult } from '../api/client';

interface IntakeState {
  symptoms: string[];
  setSymptoms: (symptoms: string[]) => void;
  result: PredictionResult | null;
  setResult: (result: PredictionResult | null) => void;
}

const IntakeContext = createContext<IntakeState | null>(null);

/** Holds the answers from the intake screens until the result comes back. */
export function IntakeProvider({ children }: { children: ReactNode }) {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<PredictionResult | null>(null);
  return (
    <IntakeContext.Provider value={{ symptoms, setSymptoms, result, setResult }}>
      {children}
    </IntakeContext.Provider>
  );
}

export function useIntake() {
  const ctx = useContext(IntakeContext);
  if (!ctx) throw new Error('useIntake must be used inside IntakeProvider');
  return ctx;
}
