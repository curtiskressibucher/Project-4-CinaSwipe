import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/src/providers/AuthProviders';
import { supabase } from '../../lib/supabase';
import { fetchMovieById } from '@/src/api/TmdbApi';

interface MovieMatch {
    match_id: any;
    liked_movie_id: any;
    room_id: any;
    created_at: any;
    room_name: any;
    movie_details: any;
}

export default function MovieList() {
    const { session, profile } = useAuth();
    const [movieMatches, setMovieMatches] = useState<MovieMatch[]>([]);

    useEffect(() => {
        fetchMovieMatches();
        // Polling caused a bug in the app, so it was removed.
        // const interval = setInterval(() => {
        //     fetchMovieMatches();
        // }, 10000);
        // return () => clearInterval(interval);
    }, []);

    const fetchMovieMatches = async () => {
        try {
            const { data: movieMatchesData, error: movieMatchesError } =
                await supabase
                    .from('movie_match')
                    .select(
                        'match_id, liked_movie_id, match_id, room_id, created_at'
                    )
                    .eq('user_id', profile.id);

            if (movieMatchesError) {
                throw movieMatchesError;
            }

            const roomIds = movieMatchesData.map((match: any) => match.room_id);
            const { data: roomData, error: roomError } = await supabase
                .from('rooms')
                .select('id, room_name')
                .in('id', roomIds);

            if (roomError) {
                throw roomError;
            }

            const mergedData = await Promise.all(
                movieMatchesData.map(async (match: any) => {
                    const room = roomData.find(
                        (room: any) => room.id === match.room_id
                    );
                    const movieDetails = await fetchMovieById(
                        match.liked_movie_id
                    );
                    return {
                        ...match,
                        movie_details: movieDetails,
                        room_name: room ? room.room_name : 'Unknown',
                    };
                })
            );

            setMovieMatches(mergedData);
        } catch (error) {
            console.error('Error fetching movie matches');
        }
    };

    const renderMatchItem = ({ item }: { item: MovieMatch }) => (
        <View style={styles.matchItem}>
            <Text style={styles.roomName}>Room Name: {item.room_name}</Text>
            {item.movie_details && (
                <View style={styles.movieDetailsContainer}>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500/${item.movie_details.poster_path}`,
                        }}
                        style={styles.poster}
                        resizeMode='cover'
                    />
                    <Text style={styles.movieTitle}>
                        {item.movie_details.title}
                    </Text>
                    <Text style={styles.movieOverview}>
                        {item.movie_details.overview}
                    </Text>
                    <Text style={styles.movieReleaseDate}>
                        Release Date: {item.movie_details.release_date}
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <LinearGradient
            colors={['#000428', '#004e92']}
            style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Matched Movies List</Text>
            </View>
            <FlatList
                data={movieMatches}
                renderItem={renderMatchItem}
                keyExtractor={(item) => item.match_id.toString()}
            />
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
    matchItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    matchId: {
        color: 'white',
        fontSize: 18,
    },
    roomName: {
        color: 'white',
        fontSize: 14,
        fontStyle: 'italic',
    },
    movieDetailsContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    poster: {
        width: 200,
        height: 300,
        marginBottom: 10,
    },
    movieTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    movieOverview: {
        color: 'white',
        fontSize: 14,
    },
    movieReleaseDate: {
        color: 'white',
        fontSize: 14,
    },
});
