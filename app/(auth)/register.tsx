import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Alert, ImageBackground, Image, Pressable } from 'react-native';
import supabase from '../../supabase';
import { router } from 'expo-router';
import { Keyboard } from 'react-native';
import { BlurView } from 'expo-blur';

// RegisterWithOTP Component
const RegisterWithOTP = () => {
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [isMailSent, setIsMailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [cnfrmpassword, setCnfrmPassword] = useState('');
  const [name, Setname] = useState('');

  const handleback = () => {
    router.replace('../index');
  }


  const handleSubmit = async () => {

    if (password === cnfrmpassword && (email.endsWith('@kiit.ac.in') || email.endsWith('@kims.ac.in'))) {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });


        // Step 2: Insert user details into "customer_details" table
        const userId = data.user?.id; // Get the user ID from Supabase Auth
        if (!userId) throw new Error('User ID not found.');

        console.log('User ID:', userId);

        const { data: customerData, error: customerError } = await supabase
          .from('customer_details')
          .insert([
            {
              user_id: userId, // Link to Supabase Auth user ID
              email,
              phonenumber: number,
              full_name: name,
            },
          ])
          .select();

        if (customerError) throw customerError;


        if (error) throw error;
        console.log('Thanks for Signing Up!:', data);
      }
      catch (error) {
        Alert.alert('Error signing up:', (error as Error).message);
      }
      finally {
        setLoading(false);
        // router.push('../index');
      }

    }
    else {
      Alert.alert('Error', 'Passwords do not match or email is invalid.');
    }


  }

  return (

    <Pressable onPress={() => Keyboard.dismiss()}>
      <ImageBackground style={styles.container} source={require('../../assets/images/HomeBG.jpg')} resizeMode='cover'>
        <Pressable onPress={() => Keyboard.dismiss()}>
          <BlurView intensity={100} experimentalBlurMethod='none' tint='default' style={{ backgroundColor: 'rgba(236, 228, 228, 0.75)', padding: 20, borderRadius: 25, overflow: 'hidden', width: '100%', alignSelf: 'center' }}>
            <Image source={require('../../assets/images/Logo.png')} style={styles.topImage} />
            <Text style={styles.dancingScriptFont}>Order fast, make it last</Text>

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              keyboardType="email-address"
            />

            <Text style={{ marginBottom: 10, marginTop: -8, marginHorizontal: 8, color: 'gray', fontWeight: 'light', fontStyle: 'italic', fontSize: 12, textAlign: 'right' }}>*Use university Email ID only</Text>

            {/* Password Input */}
            <TextInput
              style={styles.input}
              placeholder='Password'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {/* Confirm Password Input */}
            <TextInput
              style={styles.input}
              placeholder='Confirm Password'
              value={cnfrmpassword}
              onChangeText={setCnfrmPassword}
            />

            {/* Phone Number Input */}
            <TextInput
              style={styles.input}
              placeholder='Phone Number'
              value={number}
              onChangeText={setNumber}
              keyboardType='phone-pad'
            />

            {/* Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={Setname}
            />

            {/* Send or Verify Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >

              <Text style={styles.buttonText}>
                {loading ? 'Thanks!' : isMailSent ? 'Check Mail' : 'Register'}
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <Text style={{ marginTop: 20 }}>Already Registered? </Text>
              <TouchableOpacity onPress={handleback}>
                <Text style={styles.BackButton}> Log in</Text>
              </TouchableOpacity>
            </View>

          </BlurView>
        </Pressable>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 25,
    borderRadius: 50,
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ff6f61',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  dancingScriptFont: {
    fontFamily: 'DancingScript',
    fontSize: 25,
    textAlign: 'center',
    marginTop: -15,
    marginBottom: 15,
    color: '#808080',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  BackButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    color: '#007bff',
  },
});

export default RegisterWithOTP;
