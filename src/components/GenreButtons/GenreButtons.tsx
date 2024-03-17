import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
];

const GenreButtons = () => {
    const handleGenrePress = (genre: any) => {
        // Handle genre selection
        console.log('Selected genre:', genre);
    };

    return (
        <View style={styles.genreButtonsContainer}>
            {genres.map((genre) => (
                <TouchableOpacity
                    key={genre.id}
                    style={styles.genreButton}
                    onPress={() => handleGenrePress(genre)}>
                    <Text style={styles.genreButtonText}>{genre.name}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    genreButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    genreButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
    },
    genreButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GenreButtons;
