import { Text, View, StyleSheet } from 'react-native';
import React from 'react';
import CreateRoomForm from '@/src/components/CreateRoomForm/CreateRoomForm';

export default function Lobby() {
    return (
        <View style={styles.container}>
            <CreateRoomForm />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightblue',
        padding: 20,
        justifyContent: 'center',
    },
});
