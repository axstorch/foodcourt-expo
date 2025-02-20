import { createClient } from '@supabase/supabase-js';
import  Constants  from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
//import 'react-native-url-polyfill/auto';

// when using keys from supabase, use EXPO_PUBLIC_ prefix

const SUPABASE_URL=Constants.expoConfig.extra.SUPABASE_URL;
const SUPABASE_KEY=Constants.expoConfig.extra.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY,
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: Platform.OS !== 'web', // Disable persistSession for web
            detectSessionInUrl: false, // Prevent issues with URL detection on web
          },
    }
);

export default supabase;