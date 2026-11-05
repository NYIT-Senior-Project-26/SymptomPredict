import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function FollowUp() {
  return (
    <ScreenPlaceholder
      frame="2.4 Intake · Stage 2 Follow-up question"
      title="Follow-up question"
      links={[
        { label: 'Next', href: '/intake/severity' },
      ]}
    />
  );
}
