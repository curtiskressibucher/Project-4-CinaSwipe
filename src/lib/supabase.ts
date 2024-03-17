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
const supabaseAnonKey = 'ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        detectSessionInUrl: false,
    },
});
