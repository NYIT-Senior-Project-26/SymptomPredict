import { Image } from 'expo-image';
import { ColorValue } from 'react-native';

// Icons exported from Figma. Most are single-color strokes, so `color` tints them;
// leave `color` unset to show the asset as exported (needed for multi-color ones).
const ICONS = {
  activity: require('../../assets/icons/activity.svg'),
  'activity-44': require('../../assets/icons/activity-44.svg'),
  alert: require('../../assets/icons/alert.svg'),
  'alert-18': require('../../assets/icons/alert-18.svg'),
  book: require('../../assets/icons/book.svg'),
  'book-12': require('../../assets/icons/book-12.svg'),
  /** 6×20 list bullet (a dot centered on a text line). */
  bullet: require('../../assets/icons/bullet.svg'),
  calendar: require('../../assets/icons/calendar.svg'),
  chart: require('../../assets/icons/chart.svg'),
  check: require('../../assets/icons/check.svg'),
  'check-12': require('../../assets/icons/check-12.svg'),
  'check-18': require('../../assets/icons/check-18.svg'),
  'check-small': require('../../assets/icons/check-small.svg'),
  'chevron-down': require('../../assets/icons/chevron-down.svg'),
  'chevron-left': require('../../assets/icons/chevron-left.svg'),
  'chevron-left-small': require('../../assets/icons/chevron-left-small.svg'),
  'chevron-right': require('../../assets/icons/chevron-right.svg'),
  'chevron-up': require('../../assets/icons/chevron-up.svg'),
  'chevron-up-18': require('../../assets/icons/chevron-up-18.svg'),
  circle: require('../../assets/icons/circle.svg'),
  clock: require('../../assets/icons/clock.svg'),
  'clock-14': require('../../assets/icons/clock-14.svg'),
  'clock-16': require('../../assets/icons/clock-16.svg'),
  close: require('../../assets/icons/close.svg'),
  /** Timeline dots (two colors each, so don't tint). */
  'dot-filled': require('../../assets/icons/dot-filled.svg'),
  'dot-open': require('../../assets/icons/dot-open.svg'),
  edit: require('../../assets/icons/edit.svg'),
  'edit-18': require('../../assets/icons/edit-18.svg'),
  eye: require('../../assets/icons/eye.svg'),
  flask: require('../../assets/icons/flask.svg'),
  grid: require('../../assets/icons/grid.svg'),
  home: require('../../assets/icons/home.svg'),
  'home-16': require('../../assets/icons/home-16.svg'),
  info: require('../../assets/icons/info.svg'),
  loader: require('../../assets/icons/loader.svg'),
  lock: require('../../assets/icons/lock.svg'),
  message: require('../../assets/icons/message.svg'),
  'message-16': require('../../assets/icons/message-16.svg'),
  mic: require('../../assets/icons/mic.svg'),
  pill: require('../../assets/icons/pill.svg'),
  'pill-16': require('../../assets/icons/pill-16.svg'),
  plus: require('../../assets/icons/plus.svg'),
  'radio-selected': require('../../assets/icons/radio-selected.svg'),
  search: require('../../assets/icons/search.svg'),
  shield: require('../../assets/icons/shield.svg'),
  'slider-knob': require('../../assets/icons/slider-knob.svg'),
  sparkles: require('../../assets/icons/sparkles.svg'),
  thermometer: require('../../assets/icons/thermometer.svg'),
  'thermometer-16': require('../../assets/icons/thermometer-16.svg'),
  user: require('../../assets/icons/user.svg'),
  'user-18': require('../../assets/icons/user-18.svg'),
  users: require('../../assets/icons/users.svg'),
};

export type IconName = keyof typeof ICONS;

interface Props {
  name: IconName;
  /** Height, and width unless `width` is given. */
  size: number;
  /** For icons that aren't square, e.g. `bullet` (6×20). */
  width?: number;
  color?: ColorValue;
}

export function Icon({ name, size, width, color }: Props) {
  return (
    <Image
      source={ICONS[name]}
      style={{ width: width ?? size, height: size }}
      tintColor={color as string | undefined}
      contentFit="contain"
    />
  );
}
