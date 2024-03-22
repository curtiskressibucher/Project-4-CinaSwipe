import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import RoomList from '../../../components/RoomList/RoomList';
import UserRoom from '../../../components/UserRoom/UserRoom';
import { useAuth } from '../../../providers/AuthProviders';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoomPage() {
    const { profile } = useAuth();
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [roomCreated, setRoomCreated] = useState(true);

    const handleRoomSelect = (roomId: number) => {
        setSelectedRoomId(roomId);
    };
    const handleLeaveRoom = () => {
        setSelectedRoomId(null);
    };

    return (
        <LinearGradient
            colors={['#000428', '#004e92']}
            style={styles.container}>
            {!selectedRoomId ? (
                <RoomList
                    profile={profile}
                    selectedRoomId={selectedRoomId}
                    onRoomSelect={handleRoomSelect}
                    setRoomCreated={setRoomCreated}
                />
            ) : (
                <UserRoom
                    profile={profile}
                    roomId={selectedRoomId}
                    onLeaveRoom={handleLeaveRoom}
                />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
        padding: 20,
        justifyContent: 'center',
    },
});
