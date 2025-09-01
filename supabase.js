import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = Constants.expoConfig.extra.SUPABASE_URL;
const SUPABASE_KEY = Constants.expoConfig.extra.SUPABASE_KEY;

const isWeb = Platform.OS === 'web';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        storage: isWeb ? undefined : AsyncStorage,
        autoRefreshToken: true,
        persistSession: !isWeb,  // ✅ only persist on native
        detectSessionInUrl: !isWeb, // ✅ only detect URLs in web env
    },
});

export default supabase;
