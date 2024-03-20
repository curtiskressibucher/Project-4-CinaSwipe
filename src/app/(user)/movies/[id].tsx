import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { fetchMovieDetailsById } from '../../../api/TmdbApi';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Movie } from '../../../types';

const defaultMoviePoster =
    'http://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png';

type LocalSearchParams = {
    id: string;
};

const MovieDetailScreen = () => {
    const { id } = useLocalSearchParams<LocalSearchParams>();
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const movieData = await fetchMovieDetailsById(Number(id));
                setMovie(movieData);
            } catch (error) {
                console.error('Error fetching movie details: ', error);
            }
        };

        fetchMovie();
    }, [id]);

    if (!movie || !movie.title) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.posterContainer}>
                <Stack.Screen options={{ title: movie.title }} />
                <Image
                    source={{
                        uri: movie.poster_path
                            ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                            : defaultMoviePoster,
                    }}
                    style={styles.poster}
                />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.detailItem}>
                    <Text style={styles.bold}>Original Title:</Text>{' '}
                    {movie.original_title}
                </Text>
                <Text style={styles.detailItem}>
                    <Text style={styles.bold}>Release Date:</Text>{' '}
                    {movie.release_date}
                </Text>
                <Text style={styles.plot}>
                    <Text style={styles.bold}>Plot:</Text> {movie.overview}
                </Text>
                <Text style={styles.detailItem}>
                    <Text style={styles.bold}>Runtime:</Text> {movie.runtime}{' '}
                    minutes
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    posterContainer: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    poster: {
        width: 250,
        height: 375,
        resizeMode: 'cover',
        borderRadius: 10,
    },
    detailsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    detailItem: {
        fontSize: 18,
        marginBottom: 10,
        lineHeight: 24,
    },
    plot: {
        fontSize: 18,
        marginBottom: 20,
        lineHeight: 24,
    },
    bold: {
        fontWeight: 'bold',
        color: '#333', // Darken color a bit
    },
});

export default MovieDetailScreen;
