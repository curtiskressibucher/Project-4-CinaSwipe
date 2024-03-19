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

const supabaseUrl = 'https://djrfuuerlprlafvvoxyu.supabase.co';
const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcmZ1dWVybHBybGFmdnZveHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3NTgzOTgsImV4cCI6MjAyNjMzNDM5OH0.ZAn7x8GYI2_0UrlfJZ0Z0MrjbMt3_JxKDIdM_mRMjII';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
