import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { AllergyCategory, BloodPressure, SmokingStatus, Sex } from './content';

// The profile lives in memory only. It is never written to a database or to the
// phone's storage, so it is gone when the app closes (see PROGRESS.md, Privacy).

export interface Allergy {
  name: string;
  category: AllergyCategory;
}

export interface Profile {
  age: string;
  sex: Sex | null;
  bloodPressure: BloodPressure | null;
  smoking: SmokingStatus | null;
  allergies: Allergy[];
  medications: string[];
  conditions: string[];
  insurance: { provider: string; plan: string; selfPay: boolean };
}

const EMPTY_PROFILE: Profile = {
  age: '',
  sex: null,
  bloodPressure: null,
  smoking: null,
  allergies: [],
  medications: [],
  conditions: [],
  insurance: { provider: '', plan: '', selfPay: false },
};

interface ProfileState {
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
}

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const update = useCallback((patch: Partial<Profile>) => setProfile((prev) => ({ ...prev, ...patch })), []);
  const value = useMemo(() => ({ profile, update }), [profile, update]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}

/** The health details that affect a symptom check (not age, sex or insurance). */
export function hasHealthDetails(profile: Profile) {
  return profile.allergies.length > 0 || profile.medications.length > 0 || profile.conditions.length > 0;
}

/** One-line summary for 2.7, e.g. "Penicillin allergy · Lisinopril, Metformin · Hypertension, Asthma". */
export function healthDetailsSummary(profile: Profile) {
  return [
    profile.allergies.map((a) => `${a.name} allergy`).join(', '),
    profile.medications.join(', '),
    profile.conditions.join(', '),
  ]
    .filter(Boolean)
    .join(' · ');
}
