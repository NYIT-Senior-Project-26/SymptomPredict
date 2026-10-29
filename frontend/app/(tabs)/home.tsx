import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function Home() {
  return (
    <ScreenPlaceholder
      frame="2.1 Home Dashboard"
      title="DiagnosisCloud"
      links={[
        { label: 'Check my symptoms', href: '/intake' },
      ]}
    />
  );
}
