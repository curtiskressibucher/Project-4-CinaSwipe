import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
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

    const renderRoomItem = ({ item }: { item: Room }) => (
        <Link
            href={`/rooms/${item.id}`}
            onPress={() => handleRoomSelect(item.id)}>
            <View style={styles.roomItem}>
                <Text style={styles.roomName}>{item.room_name}</Text>
            </View>
        </Link>
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
    roomItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    roomName: {
        fontSize: 16,
    },
});

export default RoomList;
