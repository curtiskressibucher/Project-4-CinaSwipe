import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Movie } from '@/src/types'; // Import the Movie interface
import movies from '../../../assets/data/moives';
import DeckSwiper from 'react-native-deck-swiper';

export default function MoviePage() {
    return (
        <View style={styles.pageContainer}>
            <DeckSwiper
                cards={movies}
                renderCard={(item: Movie) => (
                    <View style={styles.card}>
                        <Image
                            source={{ uri: item.Poster }}
                            style={styles.image}
                        />
                        <View style={styles.cardInner}>
                            <Text style={styles.title}>{item.Title}</Text>
                            <Text style={styles.plot}>{item.Plot}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '95%',
        height: '95%',
        borderRadius: 10,
        backgroundColor: '#fefefe',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    },
    image: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    cardInner: {
        padding: 10,
    },
    title: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold',
    },
    plot: {
        fontSize: 18,
        color: 'black',
        lineHeight: 25,
    },
});
