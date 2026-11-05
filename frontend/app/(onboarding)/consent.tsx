import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function Consent() {
  return (
    <ScreenPlaceholder
      frame="1.2 Privacy & Data Consent"
      title="Privacy & data consent"
      links={[
        { label: 'I agree', href: '/setup/basic' },
      ]}
    />
  );
}
