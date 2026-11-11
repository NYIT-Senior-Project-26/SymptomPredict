import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function History() {
  return (
    <ScreenPlaceholder
      frame="4.3 Session History"
      title="Session history"
      links={[
        { label: 'Export a session', href: '/export' },
        { label: 'Chronic condition tracker', href: '/tracker' },
      ]}
    />
  );
}
