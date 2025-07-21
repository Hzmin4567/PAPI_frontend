import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
  SafeAreaView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SignupScreen() {
  const navigation = useNavigation();
  const { signup } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // Animated label state
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = (anim) => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };
  const handleBlur = (anim, value) => {
    if (!value) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  };
  const getLabelStyle = (anim) => ({
    position: 'absolute',
    left: 15,
    top: anim.interpolate({ inputRange: [0, 1], outputRange: [14, -10] }),
    fontSize: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 14] }),
    color: anim.interpolate({ inputRange: [0, 1], outputRange: ['#6B7280', '#061437'] }),
    backgroundColor: anim.interpolate({ inputRange: [0, 1], outputRange: ['transparent','#fdf9fd'] }),
    paddingHorizontal: 5,
    zIndex: 1,
    fontFamily: 'Sansation-Regular',
  });

  const handleSignup = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const credential = await signup(email.trim(), password);
      const { uid } = credential.user;
      navigation.navigate('Register', { uid, email: email.trim() });
    } catch (err) {
      Alert.alert('Signup Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bg}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Image source={require('../assets/logo.png')} style={styles.logo} />
              <Text style={styles.hello}>HELLO</Text>
              <Text style={styles.subtitle}>Create your account</Text>
              {/* Email input with animated label */}
              <View style={styles.inputContainer}>
                <Animated.Text style={getLabelStyle(emailAnim)}>Email</Animated.Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => handleFocus(emailAnim)}
                  onBlur={() => handleBlur(emailAnim, email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {/* Password input with animated label */}
              <View style={styles.inputContainer}>
                <Animated.Text style={getLabelStyle(passwordAnim)}>Password</Animated.Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => handleFocus(passwordAnim)}
                    onBlur={() => handleBlur(passwordAnim, password)}
                    secureTextEntry={!passwordVisible}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Ionicons
                      name={passwordVisible ? 'eye' : 'eye-off'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Confirm Password input with animated label */}
              <View style={styles.inputContainer}>
                <Animated.Text style={getLabelStyle(confirmPasswordAnim)}>
                  Confirm Password
                </Animated.Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => handleFocus(confirmPasswordAnim)}
                    onBlur={() => handleBlur(confirmPasswordAnim, confirmPassword)}
                    secureTextEntry={!confirmPasswordVisible}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    <Ionicons
                      name={confirmPasswordVisible ? 'eye' : 'eye-off'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.registerButton, loading && styles.disabledButton]}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.registerText}>Register</Text>
                )}
              </TouchableOpacity>
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.orText}>Or continue with</Text>
                <View style={styles.line} />
              </View>
              <TouchableOpacity style={styles.googleButton}>
                <Image source={require('../assets/google.png')} style={styles.googleIcon} />
                <Text style={styles.googleText}>Google</Text>
              </TouchableOpacity>
              <Text style={styles.loginPrompt}>
                Already have an account?
                <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                  {' '}Login
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.92, 370);
const CARD_VERTICAL_PADDING = 36;
const CARD_HORIZONTAL_PADDING = 22;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#444245', // gray background
  },
  bg: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', // Center the card vertically
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: CARD_VERTICAL_PADDING,
    paddingHorizontal: CARD_HORIZONTAL_PADDING,
    alignItems: 'center',
    // No shadow/elevation for flat look
  },
  logo: {
    width: 240,
    height: 180,
    marginBottom: -25, // No gap between logo and HELLO
    resizeMode: 'contain',
  },
  hello: {
    fontSize: 32,
    fontFamily: 'Sansation-Bold',
    color: '#061437',
    marginBottom: 2,
    marginTop: 8,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    fontFamily: 'Sansation-Regular',
    marginBottom: 28,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#061437',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingTop: 14, // Make space for label
    fontFamily: 'Sansation-Regular',
    fontSize: 15,
    color: '#061437',
    backgroundColor: '#FAFAFA',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 14,
  },
  registerButton: {
    backgroundColor: '#FDC856',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 22,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerText: {
    color: '#061437',
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    width: '100%',
    marginTop: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  orText: {
    marginHorizontal: 8,
    color: '#888',
    fontFamily: 'Sansation-Bold',
    fontSize: 13,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 18,
    justifyContent: 'center',
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  googleText: {
    color: '#061437',
    fontFamily: 'Sansation-Bold',
    fontSize: 15,
  },
  loginPrompt: {
    color: '#888',
    fontSize: 13,
    fontFamily: 'Sansation-Bold',
    marginTop: 8,
    textAlign: 'center',
  },
  loginLink: {
    color: '#061437',
    fontFamily: 'Sansation-Bold',
    fontSize: 13,
    marginLeft: 2,
  },
});
