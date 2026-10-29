import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function Chat() {
  return (
    <ScreenPlaceholder
      frame="4.1 / 4.2 Chatbots"
      title="Chat"
      links={[
        { label: 'Diagnosis chat', href: '/chat/diagnosis' },
        { label: 'Medication chat', href: '/chat/medication' },
      ]}
    />
  );
}
