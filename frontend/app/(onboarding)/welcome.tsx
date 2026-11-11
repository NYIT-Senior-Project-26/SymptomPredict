import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function Welcome() {
  return (
    <ScreenPlaceholder
      frame="1.1 Splash / Welcome"
      title="Welcome to DiagnosisCloud"
      links={[
        { label: 'Get started', href: '/consent' },
      ]}
    />
  );
}
