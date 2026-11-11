import { useLocalSearchParams } from 'expo-router';

import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

// 3.6a (details) and 3.6b (treatment options) are two views of this one screen.
export default function ConditionDetail() {
  const { name } = useLocalSearchParams<{ name: string }>();
  return <ScreenPlaceholder frame="3.6a / 3.6b Condition Detail" title={name ?? 'Condition'} />;
}
