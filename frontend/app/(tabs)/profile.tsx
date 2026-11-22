import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

// 4.8 Profile & Settings: scaffold until a teammate builds it.
export default function Profile() {
  return (
    <ScreenPlaceholder
      frame="4.8 Profile & Settings"
      figmaNode="96:1052"
      title="Profile"
      sections={[
        {
          title: 'Profile card',
          shows: 'Initials, name, “34 · Female · Non-smoker” and an edit button.',
          todo: 'Age, sex and smoking come from useProfile. Setup doesn’t ask for a name; decide whether to add it or drop it here.',
        },
        {
          title: 'Health profile',
          shows: 'Rows with counts: Allergies, Medications, Ongoing conditions, Insurance; each opens its setup step.',
          todo: 'Counts from useProfile; rows open /setup/allergies, /setup/medications, /setup/conditions, /setup/insurance.',
        },
        {
          title: 'Preferences',
          shows: 'Language and Notifications.',
          todo: 'Language (1.8) is hidden in Figma; notifications have nothing to send yet.',
        },
        {
          title: 'Privacy & data',
          shows: 'Privacy & consent, Export my data, Sign out.',
          todo: 'The app has no accounts and saves nothing, so “Sign out” and “Export my data” need rethinking (see PROGRESS.md, Privacy).',
        },
      ]}
      links={[
        { label: 'Edit health profile', href: '/setup/basic' },
        { label: 'Chronic condition tracker', href: '/tracker' },
        { label: 'Component gallery', href: '/components' },
      ]}
    />
  );
}
