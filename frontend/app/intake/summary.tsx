import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function Summary() {
  return (
    <ScreenPlaceholder
      frame="2.7 Intake · Stage 3 Confirmation summary"
      title="Confirm your answers"
      links={[
        { label: 'Analyze my symptoms', href: '/intake/analyzing' },
      ]}
    />
  );
}
