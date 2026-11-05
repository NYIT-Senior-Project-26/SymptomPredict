import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function Feedback() {
  return (
    <ScreenPlaceholder
      frame="4.6 Post-Diagnosis Feedback"
      title="How did we do?"
      links={[
        { label: 'Done', href: '/home', replace: true },
      ]}
    />
  );
}
