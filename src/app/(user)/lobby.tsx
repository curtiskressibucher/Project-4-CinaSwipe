import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CreateRoomForm from '@/src/components/CreateRoomForm/CreateRoomForm';

export default function Lobby() {
    return (
        <LinearGradient
            colors={['#000428', '#004e92']}
            style={styles.container}>
            <CreateRoomForm />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
});
