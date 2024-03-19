import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import DeckSwiper from 'react-native-deck-swiper';
import { Movie } from '../../types';
import { Link } from 'expo-router';
import GenreModal from '../GenreModal/GenreModal';
import genres from '@/assets/data/genres';

export const defaultMoviePoster =
    'http://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png';

type MovieCardSwipeProps = {
    movies: Movie[];
};

const windowWidth = Dimensions.get('window').width;

const MovieCardSwipe = ({ movies }: MovieCardSwipeProps) => {
    const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showTick, setShowTick] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const onSwipedRight = () => {
        console.log('Swiped right');
        setShowTick(true);
        setTimeout(() => {
            setShowTick(false);
        }, 1000);
    };

    const onSwipedLeft = () => {
        console.log('Swiped left');
    };

    useEffect(() => {
        if (showTick) {
            setTimeout(() => {
                setShowTick(false);
            }, 500);
        }
    }, [showTick]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.genreButton} onPress={toggleModal}>
                <Text style={styles.genreButtonText}>Genres</Text>
            </TouchableOpacity>
            {showTick && (
                <View style={styles.iconContainer}>
                    <Text style={[styles.icon, styles.green]}>✓</Text>
                </View>
            )}
            <GenreModal
                visible={isModalVisible}
                onClose={toggleModal}
                genres={genres}
            />

            <DeckSwiper
                backgroundColor={'lightblue'}
                cards={movies.map((movie) => ({
                    id: movie.id.toString(),
                    title: movie.title,
                    year: movie.release_date.substring(0, 4),
                    plot: movie.overview,
                    poster: movie.poster_path
                        ? `https://image.tmdb.org/t/p/original/${movie.poster_path}`
                        : defaultMoviePoster,
                }))}
                renderCard={(item: any) => {
                    return (
                        // Presable! use presable!
                        // <Link href={`/movies/${item.id}`} asChild>
                        <View style={styles.card}>
                            <Image
                                source={{ uri: item.poster }}
                                style={styles.image}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.year}>{item.year}</Text>
                                <Text style={styles.plot}>{item.plot}</Text>
                                {swipeDirection === 'right' && (
                                    <View style={styles.tickContainer}>
                                        <Text
                                            style={[styles.icon, styles.green]}>
                                            ✓
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        // </Link>
                    );
                }}
                onSwipedRight={onSwipedRight}
                onSwipedLeft={onSwipedLeft}
                onSwipedAll={() => setSwipeDirection(null)}
                verticalSwipe={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    tickContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    card: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: windowWidth * 0.9,
        height: 650,
        zIndex: -1,
    },
    textContainer: {
        padding: 10,
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    year: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    plot: {
        height: 120,
        fontSize: 14,
        lineHeight: 20,
    },
    image: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 450,
        resizeMode: 'cover',
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
        color: 'green',
        fontSize: 50,
    },
    red: {
        color: 'red',
    },
    genreButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
        backgroundColor: 'lightgrey',
        borderRadius: 5,
        zIndex: 1,
    },
    genreButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MovieCardSwipe;
