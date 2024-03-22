import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    Button,
    Alert,
} from 'react-native';
import { useAuth } from '../../providers/AuthProviders';
import { supabase } from '../../lib/supabase';
import { Link, Redirect } from 'expo-router';

export default function CreateRoomForm() {
    const { session, profile } = useAuth();
    const [roomName, setRoomName] = useState('');
    const [roomCreated, setRoomCreated] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleCreateRoom = async () => {
        try {
            const { data: roomInsertData, error: roomInsertError } =
                await supabase.from('rooms').insert([
                    {
                        room_name: roomName,
                        creator_id: session?.user.id,
                        created_at: new Date(),
                    },
                ]);
            if (roomInsertError) {
                return null;
            }

            const roomData = await fetchUserRoom();
            async function fetchUserRoom() {
                const { data } = await supabase
                    .from('rooms')
                    .select('*')
                    .eq('creator_id', session?.user.id)
                    .order('created_at', { ascending: false })
                    .limit(1);
                return data;
            }

            if (roomData && roomData.length > 0) {
                const newRoomId = roomData[0].id;

                const { data: userRoomInsertData, error: userRoomInsertError } =
                    await supabase.from('user_room').insert([
                        {
                            user_id: session?.user.id,
                            room_id: newRoomId,
                            active: true,
                        },
                    ]);

                if (userRoomInsertError) {
                    return null;
                }

                setRoomCreated(true);
                setRoomName('');
                setSelectedRoomId(newRoomId);
                setIsModalVisible(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create room. Please try again.');
            return null;
        }
    };

    if (roomCreated && selectedRoomId) {
        return <Redirect href={`/(user)/rooms/${selectedRoomId}`} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                    style={[styles.searchButton, styles.buttonBorder]}>
                    <Link href={'/(user)/rooms/room-page'} asChild>
                        <Text style={styles.buttonText}>Search Rooms</Text>
                    </Link>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.buttonBorder]}
                    onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.buttonText}>Make a Room</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={isModalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalLabel}>Room Name:</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder='Enter Room Name'
                            value={roomName}
                            onChangeText={(text) => setRoomName(text)}
                        />

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleCreateRoom}>
                                <Text style={styles.modalButtonText}>
                                    Create Room
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setIsModalVisible(false)}>
                                <Text style={styles.modalButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        padding: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalLabel: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333333',
    },
    modalInput: {
        height: 40,
        width: '100%',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#0a93fc',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 20,
    },
    buttonBorder: {
        borderColor: 'black',
        borderWidth: 1,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    searchButton: {
        backgroundColor: '#33b249',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 20,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalButton: {
        backgroundColor: '#33b249',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 10,
    },
    modalButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
