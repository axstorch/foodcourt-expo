import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { createClient as createBrowserClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

let supabase;

if (Platform.OS === 'web') {
    //  Web: use default browser localStorage
    supabase = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}

else {
    // 📱 Native: use AsyncStorage
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    });
}

export default supabase;
