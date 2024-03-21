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
    const { profile } = useAuth();
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
                        creator_id: profile.id,
                        created_at: new Date(),
                    },
                ]);
            if (roomInsertError) {
                return;
            }

            const roomData = await fetchUserRoom();
            async function fetchUserRoom() {
                const { data } = await supabase
                    .from('rooms')
                    .select('*')
                    .eq('creator_id', profile.id)
                    .order('created_at', { ascending: false })
                    .limit(1);
                return data;
            }

            if (roomData && roomData.length > 0) {
                const newRoomId = roomData[0].id;

                const { data: userRoomInsertData, error: userRoomInsertError } =
                    await supabase.from('user_room').insert([
                        {
                            user_id: profile.id,
                            room_id: newRoomId,
                        },
                    ]);

                if (userRoomInsertError) {
                    return;
                }

                setRoomCreated(true);
                setRoomName('');
                setSelectedRoomId(newRoomId);
                setIsModalVisible(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create room. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={[styles.button, styles.buttonBorder]}>
                    <Link href={'/(user)/rooms/room-page'}>
                        <Text style={styles.buttonText}>Search Rooms</Text>
                    </Link>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.buttonBorder]}
                    onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.buttonText}>Make a Room</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.backHomeContainer}>
                <TouchableOpacity
                    style={[styles.backHomeButton, styles.buttonBorder]}>
                    <Link href={'/'}>
                        <Text style={styles.buttonText}>Back Home</Text>
                    </Link>
                </TouchableOpacity>
            </View>

            <Modal visible={isModalVisible} animationType='slide'>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalLabel}>Room Name:</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder='Enter Room Name'
                        value={roomName}
                        onChangeText={(text) => setRoomName(text)}
                    />
                    <Button title='Create Room' onPress={handleCreateRoom} />
                    <Button
                        title='Cancel'
                        onPress={() => setIsModalVisible(false)}
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        padding: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
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
        backgroundColor: '#33b249',
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
        color: '#333333',
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
    backHomeContainer: {
        width: '100%',
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backHomeButton: {
        backgroundColor: '#D3D3D3',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
});
