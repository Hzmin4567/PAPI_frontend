import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive scaling helpers
const scale = SCREEN_WIDTH / 375; // 375 is a common base width (iPhone 11)
const verticalScale = SCREEN_HEIGHT / 812; // 812 is a common base height
const moderateScale = (size, factor = 0.5) => size + (scale * size - size) * factor;

export default function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/illustration.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.brand}>Papi</Text>
      <Text style={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </Text>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.registerText}>Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f3f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(16),
  },
  image: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.40, // 32% of screen height
    marginBottom: moderateScale(10),
  },
  title: {
    fontSize: moderateScale(36),
    color: '#0a1734',
    fontFamily: 'Sansation-Regular',
    textAlign: 'center',
  },
  brand: {
    fontSize: moderateScale(38),
    color: '#0a1734',
    fontFamily: 'Sansation-Bold',
    marginBottom: moderateScale(18),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: '#0a1734',
    textAlign: 'center',
    marginBottom: moderateScale(32),
    lineHeight: moderateScale(21),
  },
  loginButton: {
    backgroundColor: '#fdc856',
    paddingVertical: moderateScale(13),
    width: '100%',
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(12),
  },
  loginText: {
    color: '#0a1734',
    fontSize: moderateScale(17),
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Sansation-Bold',
  },
  registerButton: {
    borderColor: '#fdc856',
    borderWidth: 2,
    paddingVertical: moderateScale(13),
    width: '100%',
    borderRadius: moderateScale(10),
  },
  registerText: {
    color: '#0a1734',
    fontSize: moderateScale(17),
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Sansation-Bold',
  },
});