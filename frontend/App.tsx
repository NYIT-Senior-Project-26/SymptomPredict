import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ─── Onboarding ───────────────────────────────────────────────────────────────
import SplashScreen from './src/screens/SplashScreen';
import PrivacyConsentScreen from './src/screens/PrivacyConsentScreen';
import ProfileBasicScreen from './src/screens/ProfileBasicScreen';
import ProfileAllergiesScreen from './src/screens/ProfileAllergiesScreen';
import ProfileMedicationsScreen from './src/screens/ProfileMedicationsScreen';
import ProfileConditionsScreen from './src/screens/ProfileConditionsScreen';
import ProfileInsuranceScreen from './src/screens/ProfileInsuranceScreen';

// ─── Home ─────────────────────────────────────────────────────────────────────
import HomeDashboardScreen from './src/screens/HomeDashboardScreen';

// ─── Symptom Intake ───────────────────────────────────────────────────────────
import IntakeSymptomScreen from './src/screens/IntakeSymptomScreen';
import IntakeBodyAreaScreen from './src/screens/IntakeBodyAreaScreen';
import IntakeFeverScreen from './src/screens/IntakeFeverScreen';
import IntakePainSeverityScreen from './src/screens/IntakePainSeverityScreen';
import IntakeSafetyQuestionsScreen from './src/screens/IntakeSafetyQuestionsScreen';
import IntakeReviewScreen from './src/screens/IntakeReviewScreen';
import IntakeLoadingScreen from './src/screens/IntakeLoadingScreen';

// ─── Results & Care ───────────────────────────────────────────────────────────
import DiagnosisResultsScreen from './src/screens/DiagnosisResultsScreen';
import TriageScreen from './src/screens/TriageScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import FindCareScreen from './src/screens/FindCareScreen';
import PharmacyOTCScreen from './src/screens/PharmacyOTCScreen';
import ConditionDetailScreen from './src/screens/ConditionDetailScreen';

// ─── Chat / History / Profile ─────────────────────────────────────────────────
import MedicationAssistantScreen from './src/screens/MedicationAssistantScreen';
import DiagnosisTimelineScreen from './src/screens/DiagnosisTimelineScreen';
import SessionSummaryScreen from './src/screens/SessionSummaryScreen';
import DoctorFacingPDFScreen from './src/screens/DoctorFacingPDFScreen';
import ExportScreen from './src/screens/ExportScreen';
import PostDiagnosisScreen from './src/screens/PostDiagnosisScreen';
import ChronicTrackerScreen from './src/screens/ChronicTrackerScreen';
import ProfilePageScreen from './src/screens/ProfilePageScreen';

// ─────────────────────────────────────────────────────────────────────────────
// Navigation param types
// ─────────────────────────────────────────────────────────────────────────────
export type RootStackParamList = {
  // Onboarding
  Splash: undefined;
  Privacy: undefined;
  ProfileBasic: undefined;
  ProfileAllergies: undefined;
  ProfileMedications: undefined;
  ProfileConditions: undefined;
  ProfileInsurance: undefined;

  // Home
  HomeDashboard: undefined;

  // Intake flow
  IntakeSymptom: undefined;
  IntakeBodyArea: undefined;
  IntakeFever: undefined;
  IntakePainSeverity: undefined;
  IntakeSafetyQuestions: undefined;
  IntakeReview: undefined;
  IntakeLoading: undefined;

  // Results & care
  DiagnosisResults: undefined;
  Triage: undefined;
  Emergency: undefined;
  FindCare: undefined;
  PharmacyOTC: undefined;
  ConditionDetail: undefined;

  // Chat / history / profile
  MedicationAssistant: undefined;
  DiagnosisTimeline: undefined;
  SessionSummary: undefined;
  DoctorPDF: undefined;
  Export: undefined;
  PostDiagnosis: undefined;
  ChronicTracker: undefined;
  ProfilePage: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        {/* ── Onboarding ── */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Privacy" component={PrivacyConsentScreen} />
        <Stack.Screen name="ProfileBasic" component={ProfileBasicScreen} />
        <Stack.Screen name="ProfileAllergies" component={ProfileAllergiesScreen} />
        <Stack.Screen name="ProfileMedications" component={ProfileMedicationsScreen} />
        <Stack.Screen name="ProfileConditions" component={ProfileConditionsScreen} />
        <Stack.Screen name="ProfileInsurance" component={ProfileInsuranceScreen} />

        {/* ── Home ── */}
        <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />

        {/* ── Intake Flow ── */}
        <Stack.Screen name="IntakeSymptom" component={IntakeSymptomScreen} />
        <Stack.Screen name="IntakeBodyArea" component={IntakeBodyAreaScreen} />
        <Stack.Screen name="IntakeFever" component={IntakeFeverScreen} />
        <Stack.Screen name="IntakePainSeverity" component={IntakePainSeverityScreen} />
        <Stack.Screen name="IntakeSafetyQuestions" component={IntakeSafetyQuestionsScreen} />
        <Stack.Screen name="IntakeReview" component={IntakeReviewScreen} />
        <Stack.Screen name="IntakeLoading" component={IntakeLoadingScreen} />

        {/* ── Results & Care ── */}
        <Stack.Screen name="DiagnosisResults" component={DiagnosisResultsScreen} />
        <Stack.Screen name="Triage" component={TriageScreen} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} />
        <Stack.Screen name="FindCare" component={FindCareScreen} />
        <Stack.Screen name="PharmacyOTC" component={PharmacyOTCScreen} />
        <Stack.Screen name="ConditionDetail" component={ConditionDetailScreen} />

        {/* ── Chat / History / Profile ── */}
        <Stack.Screen name="MedicationAssistant" component={MedicationAssistantScreen} />
        <Stack.Screen name="DiagnosisTimeline" component={DiagnosisTimelineScreen} />
        <Stack.Screen name="SessionSummary" component={SessionSummaryScreen} />
        <Stack.Screen name="DoctorPDF" component={DoctorFacingPDFScreen} />
        <Stack.Screen name="Export" component={ExportScreen} />
        <Stack.Screen name="PostDiagnosis" component={PostDiagnosisScreen} />
        <Stack.Screen name="ChronicTracker" component={ChronicTrackerScreen} />
        <Stack.Screen name="ProfilePage" component={ProfilePageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
