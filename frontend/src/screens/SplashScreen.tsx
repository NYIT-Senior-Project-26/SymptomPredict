import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export default function SplashScreen({ navigation }: Props) {
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Privacy');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A7A5E" />
      <Animated.View style={[styles.logoContainer, { opacity, transform: [{ scale }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>🏥</Text>
        </View>
        <Text style={styles.appName}>DiagnosisCloud</Text>
        <Text style={styles.tagline}>AI-Powered Health Intelligence</Text>
      </Animated.View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Advanced AI</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A7A5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  logoIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
});
