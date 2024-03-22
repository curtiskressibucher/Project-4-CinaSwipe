import React, { useState } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { fetchMoviesByGenre } from '../../api/TmdbApi';

type Genre = {
    id: number;
    name: string;
};

type GenreModalProps = {
    visible: boolean;
    onClose: () => void;
    genres: Genre[];
    onSelectGenre: (movies: any[]) => void;
};

const GenreModal = ({
    visible,
    onClose,
    genres,
    onSelectGenre,
}: GenreModalProps) => {
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

    const handleGenreSelection = async (genre: Genre) => {
        setSelectedGenre(genre);
        onClose();

        try {
            const response = await fetchMoviesByGenre(genre.id);
            onSelectGenre(response);
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ScrollView>
                        {genres.map((genre) => (
                            <TouchableOpacity
                                key={genre.id}
                                style={styles.genreButton}
                                onPress={() => handleGenreSelection(genre)}>
                                <Text style={styles.genreButtonText}>
                                    {genre.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'rgb(0, 82, 145)',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '80%',
    },
    genreButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 10,
        backgroundColor: 'rgba(48, 210, 252, 0.569)',
        borderRadius: 20,
    },
    genreButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GenreModal;
