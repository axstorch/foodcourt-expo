import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const AsyncStorageAdapter = {
    getItem: (key) => AsyncStorage.getItem(key),
    setItem: (key, value) => AsyncStorage.setItem(key, value),
    removeItem: (key) => AsyncStorage.removeItem(key),
};

const SUPABASE_URL = Constants.expoConfig.extra.SUPABASE_URL;
const SUPABASE_KEY = Constants.expoConfig.extra.SUPABASE_KEY;

const isWeb = Platform.OS === 'web';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        storage: isWeb ? undefined : AsyncStorageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export default supabase;
