import { Redirect } from 'expo-router';

// No saved profile yet, so every launch starts at onboarding.
export default function Index() {
  return <Redirect href="/welcome" />;
}
