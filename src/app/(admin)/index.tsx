import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Link, Redirect } from 'expo-router';

export default function HomeScreen() {
    return (
        <>
            {/* <Redirect href='/(admin)' /> */}
            <View style={styles.pageContainer}>
                <Text style={styles.title}>Welcome to CinaSwipe App</Text>
                <Link href={'/movies/movie-page'} asChild>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>
                            Go to Movie Swiper
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
