import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function Severity() {
  return (
    <ScreenPlaceholder
      frame="2.5 Intake · Stage 2 Severity & duration"
      title="Severity & duration"
      links={[
        { label: 'Next', href: '/intake/high-risk' },
      ]}
    />
  );
}
