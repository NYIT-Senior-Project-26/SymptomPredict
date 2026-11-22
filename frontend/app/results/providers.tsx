import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

// 3.3 Provider Recommendations: scaffold until a teammate builds it.
// Starting point: src/results/PlacesList.tsx already lists real nearby places from
// /providers/nearby (Google Places) using the phone's location.
export default function Providers() {
  return (
    <ScreenPlaceholder
      frame="3.3 Provider Recommendations (Moderate)"
      figmaNode="91:766"
      title="Find care"
      sections={[
        {
          title: 'Recommended specialty banner',
          shows: '“Recommended: Primary care”, matched to the top result.',
          todo: 'Use result.recommended_specialty and the first of result.conditions (useIntake).',
        },
        {
          title: 'Filter chips',
          shows: 'Accepts my insurance, Available today, Within 5 mi, Female doctor.',
          todo: 'Insurance comes from the in-memory profile. Availability needs Zocdoc.',
        },
        {
          title: 'Provider cards',
          shows: 'Initials, name, specialty, distance, rating, in-network badge, next available times, Book appointment.',
          todo:
            'Places: GET /providers/nearby (needs GOOGLE_PLACES_API_KEY). Times and booking: GET /providers/availability (Zocdoc, partner-only; returns 501 for now). Use real data only, no sample doctors.',
        },
        { title: 'Footer', shows: '“Appointments powered by Zocdoc”.' },
      ]}
    />
  );
}
