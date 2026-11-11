import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function BodyMap() {
  return (
    <ScreenPlaceholder
      frame="2.3 Intake · Stage 1 Body map"
      title="Where does it hurt?"
      links={[
        { label: 'Next', href: '/intake/follow-up' },
      ]}
    />
  );
}
