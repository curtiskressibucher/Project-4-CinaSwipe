import React, { useState, useRef } from 'react';
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

// Default movie poster URL
export const defaultMoviePoster =
    'http://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png';

// Define props for MovieCardSwipe component
type MovieCardSwipeProps = {
    movies: Movie[];
    roomId: number;
};

// Dimensions of the window
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MovieCardSwipe = ({ movies, roomId }: MovieCardSwipeProps) => {
    // Authentication context
    const { session, profile } = useAuth();

    // States
    const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showTick, setShowTick] = useState(false);
    const [showCross, setShowCross] = useState(false);
    const [selectedGenreMovies, setSelectedGenreMovies] = useState<Movie[]>([]);
    const [reloadKey, setReloadKey] = useState(0);
    // First time using useRef for the overlay animation
    const overlayTranslateY = useRef(new Animated.Value(windowHeight)).current;

    // Function to check movie match
    const checkMovieMatch = async (movieId: number) => {
        const userId = session?.user?.id;
        const { data: likedMovies, error } = await supabase
            .from('movie_match')
            .select('liked_movie_id, user_id')
            .eq('room_id', roomId);

        if (error) {
            console.error('Error fetching liked movies');
            return;
        }

        const matchedUsers = likedMovies.filter(
            (match) =>
                match.liked_movie_id === movieId && match.user_id !== userId
        );
        return matchedUsers.length > 0;
    };

    // Function when swiped right
    const onSwipedRight = async (movieId: number, roomId: number) => {
        setShowTick(true);
        try {
            const userId = session?.user?.id;
            const isMatch = await checkMovieMatch(movieId);
            if (isMatch) {
                Alert.alert(
                    'Movie Matched!',
                    '',
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
                console.error('Error inserting data', error.message);
                return;
            }
        } catch (error) {
            console.error('Error inserting data', error);
        } finally {
            setTimeout(() => {
                setShowTick(false);
            }, 500);
        }
    };

    // Function when swiped left
    const onSwipedLeft = () => {
        setShowCross(true);
        setTimeout(() => {
            setShowCross(false);
        }, 500);
    };

    // Function to toggle modal visibility
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    // Function to handle genre selection
    const handleGenreSelect = (selectedMovies: Movie[]) => {
        setSelectedGenreMovies(selectedMovies);
        setReloadKey((prevKey) => prevKey + 1);
    };

    // Function to handle card press
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
            <Link href={'/(user)/rooms/room-page'} asChild>
                <TouchableOpacity style={styles.newButton}>
                    <Text style={styles.newButtonText}>Add Friends</Text>
                </TouchableOpacity>
            </Link>

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
                    movieId: movie.id,
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
                stackAnimationFriction={7}
                animateCardOpacity={true}
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    newButton: {
        position: 'absolute',
        top: 10,
        left: 10,
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
    newButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default MovieCardSwipe;
