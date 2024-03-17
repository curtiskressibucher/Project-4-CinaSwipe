import { View, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Redirect } from 'expo-router';
import React from 'react';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProviders';

const User = () => {
    const { session } = useAuth();

    if (!session) {
        return <Redirect href={'/sign-in'} />;
    }

    return (
        <View>
            <Text>User</Text>
            <Button text='Sign Out' onPress={() => supabase.auth.signOut()} />
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
};

export default User;
