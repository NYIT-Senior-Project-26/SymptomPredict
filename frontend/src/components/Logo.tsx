import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

// Sizes of the logo frames in Figma.
const SIZES = {
  header: { width: 170, height: 33 }, // Header/Brand
  home: { width: 280, height: 54 }, // 2.1 Home Dashboard
  welcome: { width: 336, height: 71 }, // 1.1 Splash / Welcome
};

interface Props {
  size: keyof typeof SIZES;
}

/** The DiagnosisCloud wordmark. The source PNG has padding, so Figma crops it inside a frame. */
export function Logo({ size }: Props) {
  return (
    <View
      style={[styles.frame, SIZES[size]]}
      accessible
      accessibilityRole="image"
      accessibilityLabel="DiagnosisCloud"
    >
      <Image source={require('../../assets/images/logo.png')} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden' },
  image: {
    position: 'absolute',
    left: '-13.29%',
    top: '-152.34%',
    width: '126.35%',
    height: '431.42%',
  },
});
