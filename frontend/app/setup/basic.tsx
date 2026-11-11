import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function ProfileBasic() {
  return (
    <ScreenPlaceholder
      frame="1.3 Profile · Basic info"
      title="Basic info"
      links={[
        { label: 'Next', href: '/setup/allergies' },
      ]}
    />
  );
}
