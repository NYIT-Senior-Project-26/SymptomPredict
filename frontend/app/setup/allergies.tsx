import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function ProfileAllergies() {
  return (
    <ScreenPlaceholder
      frame="1.4 Profile · Allergies"
      title="Allergies"
      links={[
        { label: 'Next', href: '/setup/medications' },
      ]}
    />
  );
}
