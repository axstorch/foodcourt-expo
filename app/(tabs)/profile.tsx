import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../Context/AuthContext';
import supabase from '../../supabase';

export default function Profile() {
  const { user, session, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<{
    full_name: string;
    email: string;
  } | null>(null);

  // Fetch user profile data from customer_details table
  const fetchUserProfile = async () => {
    if (!user || !session) return;

    try {
      // Query the customer_details table
      const { data, error } = await supabase
        .from('customer_details')
        .select('full_name, email')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching customer details:', error);
        // Fallback to auth user data
        setUserProfile({
          full_name:
            user.user_metadata?.full_name ||
            user.email?.split('@')[0]?.replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) ||
            'User',
          email: user.email || '',
        });
      } else if (data) {
        // Use data from customer_details
        setUserProfile({
          full_name: data.full_name || 'User',
          email: data.email || user.email || '',
        });
      } else {
        // No data found, use fallback
        setUserProfile({
          full_name:
            user.user_metadata?.full_name ||
            user.email?.split('@')[0]?.replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) ||
            'User',
          email: user.email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      // Fallback to auth user data
      setUserProfile({
        full_name:
          user.user_metadata?.full_name ||
          user.email?.split('@')[0]?.replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) ||
          'User',
        email: user.email || '',
      });
    }
  };

  useEffect(() => {
    if (user && session) {
      fetchUserProfile();
    }
  }, [user, session]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              await AsyncStorage.multiRemove(['@cart_items']);
              router.replace('/');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Loading state
  if (isLoading || !userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5722" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <View style={[styles.profileImage, styles.defaultAvatar]}>
            <Ionicons name="person" size={40} color="#999" />
          </View>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName} numberOfLines={1}>
            {userProfile.full_name}
          </Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#FF5722" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    top: 50
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  defaultAvatar: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    top: 50
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5722',
    marginLeft: 10,
  },
});