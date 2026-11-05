import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function ProfileMedications() {
  return (
    <ScreenPlaceholder
      frame="1.5 Profile · Medications"
      title="Medications"
      links={[
        { label: 'Next', href: '/setup/conditions' },
      ]}
    />
  );
}
