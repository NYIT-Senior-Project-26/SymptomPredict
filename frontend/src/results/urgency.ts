// What each urgency level from /predict means on the results screens (Figma section 3).
// Adapted from the triage tiers in the team's React Navigation screens.
import { Href } from 'expo-router';

import { Urgency } from '@/api/client';
import { TriageLevel } from '@/components/TriageBadge';

interface UrgencyInfo {
  /** The Figma triage banner: 3.1b self-care, 3.1a appointment, 3.1c emergency. */
  badge: TriageLevel;
  headline: string;
  description: string;
  /** General next steps. Medication advice is left to Claude's `advice` and a pharmacist. */
  steps: string[];
  nextStep: { label: string; href: Href };
  /** Short label for pills, e.g. the 3.6 hero ("See a doctor"), with its triage color. */
  pill: { label: string; tone: 'green' | 'yellow' | 'red' };
}

export const URGENCY: Record<Urgency, UrgencyInfo> = {
  self_care: {
    badge: 'self-care',
    headline: 'You can likely manage this at home',
    description: 'Your symptoms sound mild. Rest and keep an eye on how they change.',
    steps: [
      'Rest and get plenty of sleep',
      'Drink water and clear fluids',
      'Ask a pharmacist before taking anything new, especially with your current medications',
      'See a doctor if you are not improving in 3–5 days, or sooner if you get worse',
    ],
    nextStep: { label: 'Find a pharmacy nearby', href: '/results/pharmacy' },
    pill: { label: 'Self-care', tone: 'green' },
  },
  see_doctor: {
    badge: 'appointment',
    headline: 'See a doctor in the next day or two',
    description: 'Your symptoms should be checked by a doctor, but it does not need to be today.',
    steps: [
      'Book a visit with your primary care doctor, or use a telehealth visit',
      'Bring a list of your current medications',
      'Note when your symptoms started and how they have changed',
    ],
    nextStep: { label: 'Find care near me', href: '/results/providers' },
    pill: { label: 'See a doctor', tone: 'yellow' },
  },
  urgent_care: {
    badge: 'appointment',
    headline: 'Get care today',
    description: 'Your symptoms need attention today. An urgent care clinic can see you without an appointment.',
    steps: [
      'Go to an urgent care clinic today; don’t wait for a regular appointment',
      'Bring your ID, insurance card and medication list',
      'Call 911 if your symptoms suddenly get worse',
    ],
    nextStep: { label: 'Find urgent care', href: { pathname: '/results/providers', params: { query: 'Urgent care' } } },
    pill: { label: 'Get care today', tone: 'yellow' },
  },
  emergency: {
    badge: 'emergency',
    headline: 'Get emergency help now',
    description: 'Your symptoms may be serious. Call 911 or go to the nearest emergency room.',
    steps: [
      'Call 911, or have someone take you to the emergency room',
      'Do not drive yourself',
      'Bring your medication list if you can',
    ],
    nextStep: { label: 'Get help now', href: '/results/emergency' },
    pill: { label: 'Emergency', tone: 'red' },
  },
};

export const LIKELIHOOD = {
  high: { label: 'High likelihood', short: 'High' },
  medium: { label: 'Medium likelihood', short: 'Medium' },
  low: { label: 'Low likelihood', short: 'Low' },
} as const;
