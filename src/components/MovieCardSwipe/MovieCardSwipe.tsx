import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    Pressable,
    Alert,
    Animated,
} from 'react-native';
import DeckSwiper from 'react-native-deck-swiper';
import { Movie } from '../../types';
import { Link } from 'expo-router';
import GenreModal from '../GenreModal/GenreModal';
import genres from '@/assets/data/genres';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProviders';

export const defaultMoviePoster =
    'http://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png';

type MovieCardSwipeProps = {
    movies: Movie[];
    roomId: number;
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MovieCardSwipe = ({ movies, roomId }: MovieCardSwipeProps) => {
    const { session, profile } = useAuth();
    const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [showTick, setShowTick] = useState(false);
    const [showCross, setShowCross] = useState(false);
    const [selectedGenreMovies, setSelectedGenreMovies] = useState<Movie[]>([]);
    const [reloadKey, setReloadKey] = useState(0);
    const [likedMovies, setLikedMovies] = useState<any[]>([]);
    const overlayTranslateY = useRef(new Animated.Value(windowHeight)).current;

    useEffect(() => {
        fetchLikedMovies();
    }, [roomId]);

    const fetchLikedMovies = async () => {
        const { data, error } = await supabase
            .from('movie_match')
            .select('liked_movie_id, user_id')
            .eq('room_id', roomId);

        if (error) {
            console.error('Error fetching liked movies:', error.message);
            return;
        }

        if (data) {
            setLikedMovies(data);
        }
    };

    const checkMovieMatch = async (movieId: number) => {
        const userId = session?.user?.id;
        const matchedUsers = likedMovies.filter(
            (match) =>
                match.liked_movie_id === movieId && match.user_id !== userId
        );

        if (matchedUsers.length > 0) {
            // Match found
            const matchedUsernames = matchedUsers
                .map((user) => user.username)
                .join(', ');
            Alert.alert(
                'Matched!',
                '',
                [
                    {
                        text: 'OK',
                    },
                ],
                { cancelable: false }
            );
        }
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const onSwipedRight = async (movieId: number, roomId: number) => {
        setShowTick(true);
        try {
            const userId = session?.user?.id;
            const isMatch = await checkMovieMatch(movieId);
            if (isMatch !== undefined) {
                Alert.alert(
                    'Matched!',
                    '   ',
                    [
                        {
                            text: 'OK',
                        },
                    ],
                    { cancelable: false }
                );
            }

            const { error } = await supabase.from('movie_match').insert([
                {
                    user_id: userId,
                    room_id: roomId,
                    liked_movie_id: movieId,
                    created_at: new Date(),
                },
            ]);
            if (error) {
                console.error('Error inserting data:', error.message);
                return;
            }
        } catch (error) {
            console.error('Error inserting data:');
        } finally {
            setTimeout(() => {
                setShowTick(false);
            }, 500);
        }
    };

    const onSwipedLeft = () => {
        setShowCross(true);
        setTimeout(() => {
            setShowCross(false);
        }, 500);
    };

    const handleGenreSelect = (selectedMovies: Movie[]) => {
        setSelectedGenreMovies(selectedMovies);
        // console.log('Selected genre movies:', selectedMovies);
        setReloadKey((prevKey) => prevKey + 1);
    };

    const handleCardPress = () => {
        if ((overlayTranslateY as any)._value === 0) {
            Animated.timing(overlayTranslateY, {
                toValue: windowHeight,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(overlayTranslateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <View key={reloadKey} style={styles.container}>
            <TouchableOpacity style={styles.genreButton} onPress={toggleModal}>
                <Text style={styles.genreButtonText}>Genres</Text>
            </TouchableOpacity>
            <GenreModal
                visible={isModalVisible}
                onClose={toggleModal}
                genres={genres}
                onSelectGenre={handleGenreSelect}
            />
            {showTick && (
                <View style={styles.iconContainer}>
                    <Text style={[styles.icon, styles.green]}>✓</Text>
                </View>
            )}
            {showCross && (
                <View style={styles.iconContainer}>
                    <Text style={[styles.icon, styles.red]}>✗</Text>
                </View>
            )}

            <DeckSwiper
                backgroundColor={'transparent'}
                cards={(selectedGenreMovies.length > 0
                    ? selectedGenreMovies
                    : movies
                ).map((movie, index) => ({
                    id: index.toString(),
                    poster: movie.poster_path
                        ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                        : defaultMoviePoster,
                    movieId: movie.id, // Use movie.id instead of index.toString()
                    name: movie.title,
                    year: movie.release_date,
                    plot: movie.overview,
                }))}
                renderCard={(item: any) => {
                    return (
                        <Pressable onPress={handleCardPress}>
                            <View style={styles.card}>
                                <Image
                                    source={{
                                        uri: item.poster,
                                    }}
                                    style={styles.image}
                                />
                                <Animated.View
                                    style={[
                                        styles.overlay,
                                        {
                                            transform: [
                                                {
                                                    translateY:
                                                        overlayTranslateY,
                                                },
                                            ],
                                        },
                                    ]}>
                                    <Text style={styles.movieName}>
                                        {item.name}
                                    </Text>
                                    <Text style={styles.movieYear}>
                                        {item.year}
                                    </Text>
                                    <Text style={styles.moviePlot}>
                                        {item.plot}
                                    </Text>
                                </Animated.View>
                            </View>
                        </Pressable>
                    );
                }}
                onSwipedRight={(index) => {
                    const movieId = (
                        selectedGenreMovies.length > 0
                            ? selectedGenreMovies[index]
                            : movies[index]
                    ).id;

                    onSwipedRight(movieId, roomId);
                }}
                onSwipedLeft={onSwipedLeft}
                onSwipedAll={() => setSwipeDirection(null)}
                verticalSwipe={false}
                stackSize={5}
                stackSeparation={20}
                stackScale={5}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        maxWidth: 400,
        maxHeight: 600,
        width: windowWidth * 0.9,
        height: windowHeight * 0.75,
        position: 'relative',
    },
    image: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
    },
    movieName: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
        color: 'black',
    },
    movieYear: {
        fontSize: 18,
        color: '#555',
    },
    moviePlot: {
        fontSize: 16,
        color: '#111',
    },
    iconContainer: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    icon: {
        fontSize: 50,
        marginHorizontal: 10,
    },
    green: {
        color: '#0FFF50',
        fontSize: 100,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    red: {
        color: 'red',
        fontSize: 100,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    genreButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
        backgroundColor: 'rgba(163, 163, 163, 0.5)',
        borderRadius: 20,
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    genreButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default MovieCardSwipe;
