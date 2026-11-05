import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function Profile() {
  return (
    <ScreenPlaceholder
      frame="4.8 Profile & Settings"
      title="Profile & settings"
      links={[
        { label: 'Edit health profile', href: '/setup/basic' },
        { label: 'Chronic condition tracker', href: '/tracker' },
        { label: 'Component gallery', href: '/components' },
      ]}
    />
  );
}
