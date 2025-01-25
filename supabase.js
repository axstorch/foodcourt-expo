// supabase.js
import { createClient } from '@supabase/supabase-js';
//import { SUPABASE_URL , SUPABASE_KEY } from '@env';
import Constants from 'expo-constants';

const { SUPABASE_URL, SUPABASE_KEY } = Constants.expoConfig.extra;

// Replace with your Supabase project credentials
const supabaseUrl = SUPABASE_URL; // Found in your Supabase dashboard
const supabaseKey = SUPABASE_KEY; // Found in the API section your Supabase dashboard

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
