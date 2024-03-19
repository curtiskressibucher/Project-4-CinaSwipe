import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../providers/AuthProviders';
import { supabase } from '../../lib/supabase';
import { Link, Redirect } from 'expo-router';

export default function CreateRoomForm() {
    const { profile } = useAuth();
    const [roomName, setRoomName] = useState('');
    const [roomCreated, setRoomCreated] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

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
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create room. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {!roomCreated ? (
                <>
                    <Text style={styles.label}>Room Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter Room Name'
                        value={roomName}
                        onChangeText={(text) => setRoomName(text)}
                    />
                    <Button title='Create Room' onPress={handleCreateRoom} />
                </>
            ) : (
                <Redirect href={'/rooms/room-page'} />
            )}

            <TouchableOpacity style={styles.searchButton}>
                <Link href={'/(user)/rooms/room-page'}>
                    <Text style={styles.buttonText}>Search Rooms</Text>
                </Link>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Link href={'/'}>
                    <Text style={styles.buttonText}>Back home</Text>
                </Link>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 60,
        paddingHorizontal: 20,
        backgroundColor: 'lightblue',
        position: 'relative',
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        marginTop: 20,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: '#00ff48',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
    },
});
