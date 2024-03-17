import React, { useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Redirect } from 'expo-router';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProviders';

const User = () => {
    const { session } = useAuth();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (session) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    if (error) throw error;
                    setUserData(data);
                    console.log('User Data:', data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error as Error);
            }
        };

        fetchUserData();
    }, [session]);

    if (!session) {
        return <Redirect href={'/sign-in'} />;
    }

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error signing out:', (error as Error).message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {userData && (userData as any).full_name}
                </Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                {userData && (
                    <>
                        <Text>
                            Name: {userData && (userData as any).full_name}
                        </Text>
                    </>
                )}
            </View>
            <Button
                text='Sign Out'
                onPress={handleSignOut}
                style={{ backgroundColor: 'red', marginBottom: 20 }}
            />
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 10,
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default User;
