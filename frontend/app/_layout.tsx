// Import each weight by path so only these four fonts are bundled.
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { HeaderBack } from '@/components/HeaderBack';
import { IntakeProvider } from '@/intake/state';
import { ProfileProvider } from '@/profile/state';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync();

// Screen titles here mirror the frame names in the Figma file (page 1).
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ProfileProvider>
      <IntakeProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: colors.bgSurface },
            header: ({ options, back, navigation }) => (
              <HeaderBack
                title={options.title ?? ''}
                onBack={back && options.headerBackVisible !== false ? navigation.goBack : undefined}
              />
            ),
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* 1 · Onboarding & profile setup (no login; the profile is kept in memory only) */}
          <Stack.Screen name="(onboarding)/welcome" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)/consent" options={{ title: 'Privacy & consent' }} />
          <Stack.Screen name="setup/basic" options={{ title: 'Profile setup' }} />
          <Stack.Screen name="setup/allergies" options={{ title: 'Profile setup' }} />
          <Stack.Screen name="setup/medications" options={{ title: 'Profile setup' }} />
          <Stack.Screen name="setup/conditions" options={{ title: 'Profile setup' }} />
          <Stack.Screen name="setup/insurance" options={{ title: 'Profile setup' }} />

          {/* Home, History, Chat, Profile */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          {/* 2 · Symptom intake (every step shares the "Symptom check" header) */}
          <Stack.Screen name="intake/index" options={{ title: 'Symptom check' }} />
          <Stack.Screen name="intake/body-map" options={{ title: 'Symptom check' }} />
          <Stack.Screen name="intake/follow-up" options={{ title: 'Symptom check' }} />
          <Stack.Screen name="intake/severity" options={{ title: 'Symptom check' }} />
          <Stack.Screen name="intake/high-risk" options={{ title: 'Symptom check' }} />
          <Stack.Screen name="intake/summary" options={{ title: 'Symptom check' }} />
          <Stack.Screen
            name="intake/analyzing"
            options={{ headerShown: false, gestureEnabled: false }}
          />

          {/* 3 · Results & Care */}
          <Stack.Screen name="results/index" options={{ title: 'Your results', headerBackVisible: false }} />
          <Stack.Screen name="results/emergency" options={{ title: 'Get help now' }} />
          <Stack.Screen name="results/providers" options={{ title: 'Providers near you' }} />
          <Stack.Screen name="results/pharmacy" options={{ title: 'Pharmacy & OTC' }} />
          <Stack.Screen name="results/condition/[name]" options={{ title: 'Condition details' }} />

          {/* 4 · Chat, History & Follow-up */}
          <Stack.Screen name="chat/diagnosis" options={{ title: 'Diagnosis chat' }} />
          <Stack.Screen name="chat/medication" options={{ title: 'Medication chat' }} />
          <Stack.Screen name="export" options={{ title: 'Export & share', presentation: 'modal' }} />
          <Stack.Screen name="feedback" options={{ title: 'Feedback' }} />
          <Stack.Screen name="tracker" options={{ title: 'Condition tracker' }} />

          {/* Development only */}
          <Stack.Screen name="components" options={{ title: 'Components' }} />
        </Stack>
        <StatusBar style="auto" />
      </IntakeProvider>
    </ProfileProvider>
  );
}
