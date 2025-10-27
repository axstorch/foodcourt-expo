import React, { useState, useEffect } from 'react';
import 'react-native-reanimated';
import { View, Text, Button, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, TouchableWithoutFeedback, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter, Redirect } from 'expo-router';
import { useFonts } from 'expo-font';
import { Keyboard } from 'react-native';
import supabase from '../supabase';
import { useAuth } from './Context/AuthContext';
import 'react-native-url-polyfill/auto';
import Toast from 'react-native-toast-message';


  export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { user, session, isLoading, signOut } = useAuth();

  const [fontsLoaded] = useFonts({
    Dancingscript: require('../assets/fonts/DancingScript-Regular.ttf'),
  });

  useEffect(() => {

    if (!isLoading && user) {
      router.replace('/(tabs)/home');
    }
  }, [user, isLoading]);

  const handleSignIn = async () => {
    console.log('Sign In clicked');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error signing in', error.message);
        console.error('Error signing in:', error.message);
        return;
      }

      if (data.session) {
        // Session is already persisted by Supabase
        router.replace('/(tabs)/home');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };



  const handleGoogleSignIn = () => {
    // Add Google sign-in logic here
    console.log('Google Sign-In clicked');

    Toast.show({
      type: 'error',
      text1: 'Google Sign-In not implemented yet'
    });
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback>
      <ImageBackground style={styles.container} source={require('../assets/images/HomeBG.jpg')} resizeMode='repeat'>
        <TouchableWithoutFeedback>
          <BlurView intensity={100} experimentalBlurMethod='none' tint='default' style={{ backgroundColor: 'rgba(236, 228, 228, 0.75)', padding: 20, borderRadius: 25, overflow: 'hidden' }}>
            <Image source={require('../assets/images/Logo.png')} style={styles.topImage} />
            {/* Username Input */}
            <TextInput
              style={styles.input}
              placeholder='Email'
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={{ marginBottom: 10, marginTop: -8, marginHorizontal: 8, color: 'gray', fontWeight: 'light', fontStyle: 'italic', fontSize: 12, textAlign: 'right' }}>*Use university Email ID only</Text>

            {/* Password Input */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Forgot Password */}
            <TouchableOpacity onPress={() => console.log('Forgot Password clicked')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Social Login Buttons */}
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
              <Image source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }} style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('./(auth)/register')}>
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </TouchableWithoutFeedback>

  );
  }

  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  topImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 25,
    borderRadius: 50,
  },

  title: {
    fontSize: 42,
    fontFamily: 'DancingScript',
    fontWeight: 'bold',
    color: '#ff6f61',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: 'right',
    color: '#007BFF',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#ff6f61', // Black button
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#000',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dancingScriptFont: {
    fontFamily: 'DancingScript',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  registerLink: {
    color: '#007BFF',
  },
});

