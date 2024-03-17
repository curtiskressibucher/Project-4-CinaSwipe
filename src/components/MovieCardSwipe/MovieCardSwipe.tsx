import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import DeckSwiper from 'react-native-deck-swiper';
import { Movie } from '../../types';
import { Link, useSegments } from 'expo-router';

const GreenTick = () => <Text style={[styles.icon, styles.green]}>✓</Text>;
const RedCross = () => <Text style={[styles.icon, styles.red]}>✕</Text>;

export const defaultMoviePoster =
    'http://www.staticwhich.co.uk/static/images/products/no-image/no-image-available.png';

type MovieCardSwipeProps = {
    movies: Movie[];
};

const windowWidth = Dimensions.get('window').width;

export default function MovieCardSwipe({ movies }: MovieCardSwipeProps) {
    const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
    const [showGreenTick, setShowGreenTick] = useState<boolean>(false);
    const [showRedCross, setShowRedCross] = useState<boolean>(false);

    const onSwiping = () => {
        setShowGreenTick(false);
    };

    const onSwiped = (index: number, direction: string) => {
        if (direction === 'right') {
            console.log('Swiped right');
            setShowGreenTick(true);
        } else if (direction === 'left') {
            console.log('Swiped left');
            setShowRedCross(true);
        }
    };

    return (
        <View style={styles.container}>
            <DeckSwiper
                cards={movies.map((movie) => ({
                    id: movie.imdbID,
                    title: movie.Title,
                    year: movie.Year,
                    plot: movie.Plot,
                    poster:
                        movie.Poster !== 'N/A'
                            ? movie.Poster
                            : defaultMoviePoster,
                }))}
                renderCard={(item: any) => (
                    <Link key={item.id} href={`/movies/${item.id}`}>
                        <View style={styles.card}>
                            <Image
                                source={{ uri: item.poster }}
                                style={styles.image}
                            />
                            <View>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.year}>{item.year}</Text>
                                <Text style={styles.plot}>{item.plot}</Text>
                            </View>
                        </View>
                    </Link>
                )}
                // onSwiping={() => onSwiping()}
                // onSwiped={(index: number, direction: string) =>
                //     onSwiped(index, direction)
                // }
                onSwipedRight={() => {
                    console.log('Swiped right');
                    setSwipeDirection('right');
                }}
                onSwipedLeft={() => {
                    console.log('Swiped left');
                    setSwipeDirection('left');
                }}
                onSwipedAll={() => setSwipeDirection(null)}
                verticalSwipe={false}
            />
            {showGreenTick && (
                <View style={styles.iconContainer}>
                    <GreenTick />
                </View>
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
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
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    year: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    plot: {
        fontSize: 16,
        lineHeight: 22,
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
        fontSize: 40,
        marginHorizontal: 10,
    },
    green: {
        color: 'green',
    },
    red: {
        color: 'red',
    },
});
