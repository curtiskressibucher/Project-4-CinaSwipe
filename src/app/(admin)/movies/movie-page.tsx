import React from 'react';
import { View, StyleSheet } from 'react-native';
import movies from '../../../../assets/data/movies';
import MovieCardSwipe from '../../../components/MovieCardSwipe/MovieCardSwipe';

export default function Home() {
    return (
        <View style={styles.container}>
            <MovieCardSwipe movies={movies} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
