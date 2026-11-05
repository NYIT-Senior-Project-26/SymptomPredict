import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function Pharmacy() {
  return (
    <ScreenPlaceholder
      frame="3.5 Pharmacy & OTC (Mild)"
      title="Pharmacy & over-the-counter"
      links={[
        { label: 'Ask about a medication', href: '/chat/medication' },
      ]}
    />
  );
}
