import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../../../lib/supabase';
import MovieCardSwipe from '@/src/components/MovieCardSwipe/MovieCardSwipe';
import { Stack, useLocalSearchParams } from 'expo-router';
import { fetchPopularMovies } from '@/src/api/TmdbApi';
import { Movie } from '@/src/types';
import { LinearGradient } from 'expo-linear-gradient';

interface Room {
    id: number;
    room_name: string;
}

type MovieCardSwipeProps = {
    movies: Movie[];
    roomId: Room;
};

export default function RoomDetail() {
    const { id } = useLocalSearchParams();
    const [room, setRoom] = useState<Room | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchRoomDetails(id.toString());
            fetchMovies();
        }
    }, [id]);

    const fetchRoomDetails = async (roomId: string) => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', parseInt(roomId))
                .single();

            if (error) {
                throw error;
            }

            if (data) {
                setRoom(data);
            } else {
                console.error('No room found with the provided ID');
            }
        } catch (error) {
            console.error('Error fetching room details');
        }
    };

    const fetchMovies = async () => {
        try {
            const movies = await fetchPopularMovies();
            setMovies(movies);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <LinearGradient
                colors={['#000428', '#004e92']}
                style={styles.container}>
                <ActivityIndicator size='large' color='white' />
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#000428', '#004e92']}
            style={styles.container}>
            <View style={styles.contentContainer}>
                <Stack.Screen options={{ title: room?.room_name }} />
                <MovieCardSwipe movies={movies} roomId={room?.id ?? -1} />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roomName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
});
