import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function ProfileConditions() {
  return (
    <ScreenPlaceholder
      frame="1.6 Profile · Ongoing conditions"
      title="Ongoing conditions"
      links={[
        { label: 'Next', href: '/setup/insurance' },
      ]}
    />
  );
}
