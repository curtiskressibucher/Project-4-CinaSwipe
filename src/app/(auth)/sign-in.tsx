import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { Link, Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    return (
        <LinearGradient
            colors={['#000428', '#004e92']}
            style={styles.container}>
            <View style={styles.container}>
                <Stack.Screen options={{ title: 'Sign in' }} />

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
                    onPress={signInWithEmail}
                    disabled={loading}
                    text={loading ? 'Signing in...' : 'Sign in'}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Don't have an account yet? </Text>
                    <Link href='/sign-up' style={styles.textButton}>
                        Create an account
                    </Link>
                </View>
            </View>
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
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    text: {
        color: 'white',
    },
});

export default SignInScreen;
