import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function Emergency() {
  return (
    <ScreenPlaceholder
      frame="3.2 Emergency Escalation (Severe)"
      title="Get help now"
      links={[
        { label: 'Back to home', href: '/home', replace: true },
      ]}
    />
  );
}
