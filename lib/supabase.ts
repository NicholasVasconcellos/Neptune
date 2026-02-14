// lib/supabase.js

// Old Async Storage from React Native
// import "react-native-url-polyfill/auto";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// Create global "localStorage" object
import "expo-sqlite/localStorage/install";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true, //Auto Refresh JWT Token
    persistSession: true, // Keep login when app restart
    detectSessionInUrl: false, // Disble OAuth URL Detection
  },
});

