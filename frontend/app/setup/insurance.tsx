import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function ProfileInsurance() {
  return (
    <ScreenPlaceholder
      frame="1.7 Profile · Insurance"
      title="Insurance"
      links={[
        { label: 'Finish', href: '/home', replace: true },
      ]}
    />
  );
}
