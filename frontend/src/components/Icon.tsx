import { Image } from 'expo-image';
import { ColorValue } from 'react-native';

// Icons exported from Figma. All are single-color strokes, so `color` tints them.
const ICONS = {
  activity: require('../../assets/icons/activity.svg'),
  alert: require('../../assets/icons/alert.svg'),
  calendar: require('../../assets/icons/calendar.svg'),
  check: require('../../assets/icons/check.svg'),
  'check-small': require('../../assets/icons/check-small.svg'),
  'chevron-down': require('../../assets/icons/chevron-down.svg'),
  'chevron-left': require('../../assets/icons/chevron-left.svg'),
  clock: require('../../assets/icons/clock.svg'),
  home: require('../../assets/icons/home.svg'),
  message: require('../../assets/icons/message.svg'),
  user: require('../../assets/icons/user.svg'),
};

export type IconName = keyof typeof ICONS;

interface Props {
  name: IconName;
  size: number;
  color?: ColorValue;
}

export function Icon({ name, size, color }: Props) {
  return (
    <Image
      source={ICONS[name]}
      style={{ width: size, height: size }}
      tintColor={color as string | undefined}
      contentFit="contain"
    />
  );
}
