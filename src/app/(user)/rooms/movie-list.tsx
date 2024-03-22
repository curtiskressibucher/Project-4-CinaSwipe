import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MovieList() {
    return (
        <LinearGradient
            colors={['#000428', '#004e92']}
            style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Matched Movies List</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        flex: 1,
    },
});
