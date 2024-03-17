import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import movies from '@/assets/data/movies';
import { defaultMoviePoster } from '@/src/components/MovieCardSwipe/MovieCardSwipe';

const MovieDetailScreen = () => {
    const { id } = useLocalSearchParams();

    const movie = movies.find((m) => m.imdbID.toString() === id);

    if (!movie) {
        return <Text>Movie not found</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Stack.Screen options={{ title: movie.Title }} />
            <Image source={{ uri: movie.Poster }} style={styles.poster} />
            <Text style={styles.title}>{movie.Title}</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.detailItem}>Year: {movie.Year}</Text>
                <Text style={styles.detailItem}>Rated: {movie.Rated}</Text>
                <Text style={styles.detailItem}>Runtime: {movie.Runtime}</Text>
                <Text style={styles.detailItem}>Genre: {movie.Genre}</Text>
                <Text style={styles.detailItem}>
                    Director: {movie.Director}
                </Text>
                <Text style={styles.plot}>{movie.Plot}</Text>
                <Text style={styles.detailItem}>
                    Language: {movie.Language}
                </Text>
                <Text style={styles.detailItem}>Country: {movie.Country}</Text>
                <Text style={styles.detailItem}>Awards: {movie.Awards}</Text>
                <Text style={styles.detailItem}>
                    IMDb Rating: {movie.imdbRating}
                </Text>
                <Text style={styles.detailItem}>
                    IMDb Votes: {movie.imdbVotes}
                </Text>
            </View>
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
    detailsContainer: {
        width: '80%',
        paddingHorizontal: 20,
    },
    detailItem: {
        marginBottom: 10,
    },
    plot: {
        marginBottom: 20,
        fontStyle: 'italic',
    },
});

export default MovieDetailScreen;
