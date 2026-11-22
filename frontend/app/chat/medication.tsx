import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

// 4.1 Medication Chatbot: scaffold until a teammate builds it.
export default function MedicationChat() {
  return (
    <ScreenPlaceholder
      frame="4.1 Medication Chatbot"
      figmaNode="94:770"
      title="Medication assistant"
      sections={[
        {
          title: '“Your meds” banner',
          shows: 'The person’s medications, e.g. “Lisinopril · Metformin · Vitamin D3”.',
          todo: 'profile.medications from useProfile.',
        },
        {
          title: 'Conversation',
          shows: 'Question and answer bubbles with a timestamp; answers can include a yellow warning box and source chips (RxNav, openFDA, MedlinePlus); typing indicator.',
          todo:
            'Needs a chat endpoint on the backend (not built). Answers should come from Claude with RxNav / openFDA lookups (GET /medications/search, /medications/label), never hard-coded replies.',
        },
        {
          title: 'Quick replies',
          shows: 'Chips: Dosage, Side effects, Cheaper alternatives, Check an interaction.',
        },
        {
          title: 'Message box',
          shows: '“Ask about any medication…” with a microphone and a send button.',
          todo: 'The microphone needs speech recognition (a development build, not Expo Go).',
        },
        { title: 'Footer note', shows: '“AI can make mistakes. Always check with a pharmacist or doctor.”' },
      ]}
    />
  );
}
