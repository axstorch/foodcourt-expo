import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
// @ts-ignore: local JS module has no TS declaration
import supabase from '../../supabase';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import Toast from 'react-native-toast-message';

const RegisterWithOTP = () => {
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [cnfrmpassword, setCnfrmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Email validation
  const isValidEmail = (email: string) => {
    return email.endsWith('@kiit.ac.in') || email.endsWith('@kims.ac.in');
  };

  // Phone validation
  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format
    return phoneRegex.test(phone);
  };

  // Form validation
  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return false;
    }

    if (name.trim().length < 2) {
      Alert.alert('Validation Error', 'Name must be at least 2 characters long');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address');
      return false;
    }

    if (!isValidEmail(email)) {
      Alert.alert(
        'Invalid Email',
        'Please use your university email (@kiit.ac.in or @kims.ac.in)'
      );
      return false;
    }

    if (!number.trim()) {
      Alert.alert('Validation Error', 'Please enter your phone number');
      return false;
    }

    if (!isValidPhone(number)) {
      Alert.alert(
        'Invalid Phone Number',
        'Please enter a valid 10-digit Indian mobile number'
      );
      return false;
    }

    if (!password) {
      Alert.alert('Validation Error', 'Please enter a password');
      return false;
    }

    if (password.length < 8) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters long'
      );
      return false;
    }

    if (!cnfrmpassword) {
      Alert.alert('Validation Error', 'Please confirm your password');
      return false;
    }

    if (password !== cnfrmpassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    Keyboard.dismiss();
    Alert.alert('Please check your email for verification link :)');

    try {
      // Step 1: Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('User creation failed');

      // Step 2: Insert user details into customer_details table
      const userId = data.user.id;
      if (!userId) throw new Error('User ID not found');

      const { error: customerError } = await supabase
        .from('customer_details')
        .insert({
          full_name: name.trim(),
          email: email.trim(),
          phonenumber: number.trim(),
          created_at: new Date().toISOString(),
          user_id: userId,
        });

      if (customerError) throw customerError;

      Toast.show({
        type: 'success',
        text1: 'Registration Successful!',
        text2: 'Please check your email to verify your account',
      });

      // Navigate to sign in after successful registration
      setTimeout(() => {
        router.replace('../index');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        (error as Error).message || 'An error occurred during registration'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/images/HomeBG.jpg')}
      resizeMode="repeat"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.contentWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.blurBox}>
              <BlurView
                intensity={100}
                tint="default"
                style={styles.blurContainer}
              >
                <View style={styles.innerContent}>
                  <Image
                    source={require('../../assets/images/Logo.png')}
                    style={styles.topImage}
                  />
                  <Text>Order fast, make it last</Text>

                  {/* Name Input */}
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    editable={!loading}
                  />

                  {/* Email Input */}
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={(text) => setEmail(text.trim())}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loading}
                  />

                  <Text style={styles.helperText}>
                    *Use university Email ID only
                  </Text>

                  {/* Phone Number Input */}
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#999"
                    value={number}
                    onChangeText={setNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!loading}
                  />

                  {/* Password Input */}
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!loading}
                  />

                  {/* Confirm Password Input */}
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#999"
                    value={cnfrmpassword}
                    onChangeText={setCnfrmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    editable={!loading}
                  />

                  {/* Register Button */}
                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Register</Text>
                    )}
                  </TouchableOpacity>

                  {/* Login Link */}
                  <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity
                      onPress={() => router.back()}
                      disabled={loading}
                    >
                      <Text style={styles.loginLink}>Log in</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </BlurView>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  blurContainer: {
    backgroundColor: 'rgba(236, 228, 228, 0.75)',
    padding: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  topImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 15,
    borderRadius: 50,
  },
  tagline: {
    fontFamily: 'DancingScript',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 25,
    color: '#808080',
  },
  blurBox: {
    backgroundColor: 'rgba(236, 228, 228, 0.75)',
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative',
    padding: 20,
  },
  innerContent: {
    zIndex: 1,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 16,
  },
  helperText: {
    marginBottom: 15,
    marginHorizontal: 8,
    color: 'gray',
    fontWeight: '300',
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#ff6f61',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#333',
    fontSize: 14,
  },
  loginLink: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default RegisterWithOTP;