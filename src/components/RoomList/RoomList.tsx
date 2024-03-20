import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { Link } from 'expo-router';

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
    profile,
    selectedRoomId,
    onRoomSelect,
    setRoomCreated,
}) => {
    const [rooms, setRooms] = useState<any[]>([]);

    useEffect(() => {
        fetchRooms();
    }, []);

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

    const handleRoomSelect = (roomId: number) => {
        onRoomSelect(roomId);
        setRoomCreated(false);
    };

    const deleteRoom = async (roomId: number) => {
        await supabase.from('rooms').delete().eq('id', roomId);
        fetchRooms();
    };

    const renderRoomItem = ({ item }: { item: Room }) => (
        <View style={styles.roomItemContainer}>
            <TouchableOpacity onPress={() => handleRoomSelect(item.id)}>
                <Text style={styles.roomName}>{item.room_name}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => deleteRoom(item.id)}
                style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Room List:</Text>
            {selectedRoomId === null && (
                <FlatList
                    data={rooms}
                    renderItem={renderRoomItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
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
});

export default RoomList;
