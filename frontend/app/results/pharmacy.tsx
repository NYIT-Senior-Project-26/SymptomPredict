import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

// 3.5 Pharmacy & OTC: scaffold until a teammate builds it.
// Starting point: src/results/PlacesList.tsx (query "Pharmacy") for nearby pharmacies.
export default function Pharmacy() {
  return (
    <ScreenPlaceholder
      frame="3.5 Pharmacy & OTC (Mild)"
      figmaNode="91:957"
      title="Pharmacy & OTC"
      sections={[
        {
          title: 'Interaction warning',
          shows: 'Yellow banner, e.g. “Ibuprofen may interact with Lisinopril, which you take.”',
          todo: 'Check each suggestion against the profile’s medications and allergies (useProfile). Needs a reliable interaction source, not hard-coded rules.',
        },
        {
          title: 'Map',
          shows: 'Map with pins for the nearby pharmacies.',
          todo: 'Needs a map library (e.g. react-native-maps).',
        },
        {
          title: 'Nearby pharmacies',
          shows: 'Name, distance, address, hours and an Open now / Closes soon badge; “Map view” link.',
          todo: 'GET /providers/nearby with “pharmacy” (needs GOOGLE_PLACES_API_KEY). Opening hours need an extra Places field.',
        },
        {
          title: 'Recommended OTC',
          shows: 'Medicine name and strength, what it’s for, prices at each pharmacy, “MedlinePlus info” link.',
          todo:
            'Suggestions must depend on the person’s symptoms, allergies and medications; the team’s fixed drug and dose list was removed. Prices: GET /medications/prices (GoodRx, partner-only; returns 501 for now).',
        },
      ]}
    />
  );
}
