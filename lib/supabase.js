// lib/supabase.js
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://ucynmkqxqcmglnmnfgdr.supabase.co";
const supabaseAnonKey = "sb_publishable_q4JCqJ0Nzb013FZK4VG5gQ_nz_eRQyi";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
