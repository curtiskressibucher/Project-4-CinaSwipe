import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { fetchMovieDetails } from '../../../api/TmdbApi';
import { Movie } from '../../../types';

const defaultMoviePoster =
    'http://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png';

type MovieDetailScreenProps = {
    route: { params: { id: string } };
};

const MovieDetailScreen: React.FC<MovieDetailScreenProps> = ({ route }) => {
    const { id } = route.params;
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        async function fetchMovie() {
            try {
                const movieData: Movie | null = await fetchMovieDetails(id);
                setMovie(movieData);
            } catch (error) {
                console.error('Error fetching movie details: ', error);
            }
        }

        fetchMovie();
    }, [id]);

    if (!movie) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={{
                    uri: movie.poster_path
                        ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                        : defaultMoviePoster,
                }}
                style={styles.poster}
            />
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.detailItem}>
                Original Title: {movie.original_title}
            </Text>
            <Text style={styles.detailItem}>
                Release Date: {movie.release_date}
            </Text>
            <Text style={styles.detailItem}>Plot: {movie.overview}</Text>
            <Text style={styles.detailItem}>
                Runtime: {movie.runtime} minutes
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: 'lightblue',
    },
    poster: {
        width: 200,
        height: 300,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    detailItem: {
        marginBottom: 10,
    },
});

export default MovieDetailScreen;
