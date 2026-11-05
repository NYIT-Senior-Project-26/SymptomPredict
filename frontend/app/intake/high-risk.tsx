import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function HighRisk() {
  return (
    <ScreenPlaceholder
      frame="2.6 Intake · Stage 2 High-risk check"
      title="High-risk check"
      links={[
        { label: 'None of these', href: '/intake/summary' },
        { label: 'I have one of these', href: '/results/emergency' },
      ]}
    />
  );
}
