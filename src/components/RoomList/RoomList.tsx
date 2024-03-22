import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProviders';

type Room = {
    id: number;
    room_name: string;
};

type RoomListProps = {
    profile: any;
    selectedRoomId: number | null;
    onRoomSelect: (roomId: number) => void;
    setRoomCreated: React.Dispatch<React.SetStateAction<boolean>>;
};

const RoomList: React.FC<RoomListProps> = ({
    selectedRoomId,
    onRoomSelect,
    setRoomCreated,
}) => {
    const { session, profile } = useAuth();
    const [rooms, setRooms] = useState<any[]>([]);
    const [userRooms, setUserRooms] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [roomIdToUpdate, setRoomIdToUpdate] = useState<number | null>(null);
    const [newRoomName, setNewRoomName] = useState('');

    useEffect(() => {
        fetchRooms();
        fetchUserRooms();
        const interval = setInterval(() => {
            fetchRooms();
            fetchUserRooms();
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchUserRooms = async () => {
        try {
            const { data, error } = await supabase
                .from('user_room')
                .select('room_id')
                .eq('user_id', session?.user?.id);

            if (error) {
                throw error;
            }

            setUserRooms(data.map((entry: any) => entry.room_id));
        } catch (error) {
            console.error('Error fetching user rooms:');
        }
    };

    const fetchRooms = async () => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('id, room_name')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms');
        }
    };

    const isUserInRoom = (roomId: number): boolean => {
        return userRooms.includes(roomId);
    };

    const handleRoomSelect = (roomId: number) => {
        onRoomSelect(roomId);
        setRoomCreated(false);
    };

    const deleteRoom = async (roomId: number) => {
        try {
            await supabase.from('user_room').delete().eq('room_id', roomId);
            await supabase.from('rooms').delete().eq('id', roomId);
            fetchRooms();
        } catch (error) {
            console.error(`Error deleting room with ID ${roomId}`);
        }
    };

    const updateRoomName = async () => {
        try {
            if (!roomIdToUpdate || !newRoomName) return;

            await supabase
                .from('rooms')
                .update({ room_name: newRoomName })
                .eq('id', roomIdToUpdate);

            setShowModal(false);
            fetchRooms();
        } catch (error) {
            console.error(`Error updating room with ID ${roomIdToUpdate}`);
        }
    };
    const renderRoomItem = ({ item }: { item: Room }) => {
        if (isUserInRoom(item.id)) {
            return (
                <View style={styles.roomItemContainer}>
                    <TouchableOpacity onPress={() => handleRoomSelect(item.id)}>
                        <Text style={styles.roomName}>{item.room_name}</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                setShowModal(true);
                                setRoomIdToUpdate(item.id);
                            }}
                            style={[styles.button, styles.updateButton]}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => deleteRoom(item.id)}
                            style={[styles.button, styles.deleteButton]}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Room List:</Text>
            <FlatList
                data={rooms}
                renderItem={renderRoomItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Modal
                animationType='slide'
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalContainer}>
                    <TextInput
                        style={styles.input}
                        value={newRoomName}
                        onChangeText={setNewRoomName}
                        placeholder='Enter new room name'
                    />
                    <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={updateRoomName}>
                            <Text style={styles.modalButtonText}>
                                Update Room Name
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowModal(false)}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
    },
    header: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    roomItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    roomName: {
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    updateButton: {
        backgroundColor: '#0a93fc',
        padding: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    input: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 20,
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#33b249',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 10,
        marginLeft: 10,
    },
    modalButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
export default RoomList;
