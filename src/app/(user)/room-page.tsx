import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import RoomList from '../../components/RoomList/RoomList';
import UserRoom from '../../components/UserRoom/UserRoom';
import { useAuth } from '../../providers/AuthProviders';

export default function RoomPage({}) {
    const { profile } = useAuth();
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [roomCreated, setRoomCreated] = useState(true);

    const handleRoomSelect = (roomId: number) => {
        setSelectedRoomId(roomId);
    };

    return (
        <View style={styles.container}>
            {!selectedRoomId && (
                <View style={styles.roomListContainer}>
                    <RoomList
                        profile={profile}
                        selectedRoomId={selectedRoomId}
                        onRoomSelect={handleRoomSelect}
                        setRoomCreated={setRoomCreated}
                    />
                </View>
            )}
            {selectedRoomId && (
                <View style={styles.userRoomContainer}>
                    <UserRoom profile={profile} roomId={selectedRoomId} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    roomListContainer: {
        flex: 1,
    },
    userRoomContainer: {
        flex: 1,
    },
});
