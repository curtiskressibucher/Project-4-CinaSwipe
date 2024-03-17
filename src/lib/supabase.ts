import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const ExpoSecureStoreAdapter = {
    getItem: async (key: string) => {
        return await SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
    },
};

const supabaseUrl = 'https://lewcwkndcqzhabigcewd.supabase.co';
const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxld2N3a25kY3F6aGFiaWdjZXdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA1NTkwNzksImV4cCI6MjAyNjEzNTA3OX0.Qc7Z7RyJT-zC-kzRmuqGTylAZk3LaDk3KV3scjOsTqw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        detectSessionInUrl: false,
    },
});
