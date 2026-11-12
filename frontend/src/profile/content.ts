// Options shown during profile setup (Figma 1.3–1.7).

/** Progress bar labels. Figma shows "of 6" because it counts the hidden 1.8 Language step. */
export const PROFILE_STEPS = ['Basic info', 'Allergies', 'Medications', 'Conditions', 'Insurance'];

export const SEXES = ['Female', 'Male', 'Intersex'] as const;
export const BLOOD_PRESSURES = ['Normal', 'High', 'Low', 'Not sure'] as const;
export const SMOKING_STATUSES = ['Never', 'Former', 'Current'] as const;
export const ALLERGY_CATEGORIES = ['Drug', 'Food', 'Substance'] as const;

export type Sex = (typeof SEXES)[number];
export type BloodPressure = (typeof BLOOD_PRESSURES)[number];
export type SmokingStatus = (typeof SMOKING_STATUSES)[number];
export type AllergyCategory = (typeof ALLERGY_CATEGORIES)[number];

export const CONDITIONS = [
  'Diabetes', 'Hypertension', 'Asthma', 'Heart disease', 'COPD', 'Thyroid disorder', 'Kidney disease',
  'Arthritis', 'Migraine', 'Depression', 'Anxiety', 'Pregnant', 'Immunocompromised', 'Other',
];
