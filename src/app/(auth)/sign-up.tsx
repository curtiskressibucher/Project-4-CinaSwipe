import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { Link, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

const SignUpScreen = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        setLoading(true);
        const { data: user, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            Alert.alert(error.message);
            setLoading(false);
            return;
        }

        // Update user profile with full name
        const { data, error: profileError } = await supabase
            .from('profiles')
            .upsert({ id: user.user?.id, full_name: fullName });

        if (profileError) {
            Alert.alert(profileError.message);
            setLoading(false);
            return;
        }

        setLoading(false);
    }

    return (
        <LinearGradient
            colors={['#000428', '#004e92']}
            style={styles.container}>
            <Stack.Screen options={{ title: 'Sign up' }} />

            <Text style={styles.label}>Full Name</Text>
            <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder='John Doe'
                style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder='jon@gmail.com'
                style={styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder=''
                style={styles.input}
                secureTextEntry
            />

            <Button
                onPress={signUpWithEmail}
                disabled={loading}
                text={loading ? 'Creating account...' : 'Create account'}
            />
            <Link href='/sign-in' style={styles.textButton}>
                Sign in
            </Link>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        flex: 1,
    },
    label: {
        color: 'gray',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    textButton: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Colors.light.tint,
        marginVertical: 10,
    },
});

export default SignUpScreen;
