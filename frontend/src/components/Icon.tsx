import { Image } from 'expo-image';
import { ColorValue } from 'react-native';

// Icons exported from Figma. Most are single-color strokes, so `color` tints them;
// leave `color` unset to show the asset as exported (needed for multi-color ones).
const ICONS = {
  activity: require('../../assets/icons/activity.svg'),
  'activity-44': require('../../assets/icons/activity-44.svg'),
  alert: require('../../assets/icons/alert.svg'),
  'alert-18': require('../../assets/icons/alert-18.svg'),
  calendar: require('../../assets/icons/calendar.svg'),
  check: require('../../assets/icons/check.svg'),
  'check-18': require('../../assets/icons/check-18.svg'),
  'check-small': require('../../assets/icons/check-small.svg'),
  'chevron-down': require('../../assets/icons/chevron-down.svg'),
  'chevron-left': require('../../assets/icons/chevron-left.svg'),
  'chevron-left-small': require('../../assets/icons/chevron-left-small.svg'),
  'chevron-right': require('../../assets/icons/chevron-right.svg'),
  circle: require('../../assets/icons/circle.svg'),
  clock: require('../../assets/icons/clock.svg'),
  'clock-14': require('../../assets/icons/clock-14.svg'),
  close: require('../../assets/icons/close.svg'),
  edit: require('../../assets/icons/edit.svg'),
  'edit-18': require('../../assets/icons/edit-18.svg'),
  grid: require('../../assets/icons/grid.svg'),
  home: require('../../assets/icons/home.svg'),
  loader: require('../../assets/icons/loader.svg'),
  lock: require('../../assets/icons/lock.svg'),
  message: require('../../assets/icons/message.svg'),
  mic: require('../../assets/icons/mic.svg'),
  pill: require('../../assets/icons/pill.svg'),
  plus: require('../../assets/icons/plus.svg'),
  'radio-selected': require('../../assets/icons/radio-selected.svg'),
  search: require('../../assets/icons/search.svg'),
  shield: require('../../assets/icons/shield.svg'),
  'slider-knob': require('../../assets/icons/slider-knob.svg'),
  sparkles: require('../../assets/icons/sparkles.svg'),
  thermometer: require('../../assets/icons/thermometer.svg'),
  user: require('../../assets/icons/user.svg'),
  'user-18': require('../../assets/icons/user-18.svg'),
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
