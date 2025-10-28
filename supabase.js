import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const SUPABASE_URL = Constants.expoConfig.extra.SUPABASE_URL;
const SUPABASE_KEY = Constants.expoConfig.extra.SUPABASE_KEY;

console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key:', SUPABASE_KEY);


// const isWeb = Platform.OS === 'web';

// console.log('Platform:', Platform.OS);
// console.log('Storage used:', isWeb ? 'Web default' : 'AsyncStorage');


const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        storage: AsyncStorage, // ✅ direct AsyncStorage
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export default supabase;
