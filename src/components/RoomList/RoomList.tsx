import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import UserRoom from '../UserRoom/UserRoom';

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

    const renderRoomItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => handleRoomSelect(item.id)}>
            <View>
                <Text>{item.room_name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <Text style={{ fontWeight: 'bold' }}>Room List:</Text>
            {selectedRoomId === null && (
                <FlatList
                    data={rooms}
                    renderItem={renderRoomItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
            {selectedRoomId !== null && (
                <UserRoom profile={profile} roomId={selectedRoomId} />
            )}
        </View>
    );
};

export default RoomList;
