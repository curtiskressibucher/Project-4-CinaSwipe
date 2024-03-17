import React from 'react';
import {
    View,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

type Genre = {
    id: number;
    name: string;
};

type GenreModalProps = {
    visible: boolean;
    onClose: () => void;
    genres: Genre[];
};

const GenreModal = ({ visible, onClose, genres }: GenreModalProps) => {
    const handleGenreSelection = (genre: Genre) => {
        console.log('Selected genre:', genre);
        onClose();
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
        backgroundColor: 'white',
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
        backgroundColor: 'lightgrey',
        borderRadius: 20,
    },
    genreButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default GenreModal;
