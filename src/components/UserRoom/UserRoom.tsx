import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProviders';

type UserRoomProps = {
    roomId: number | null;
    profile: any;
};

const UserRoom: React.FC<UserRoomProps> = ({ roomId }) => {
    const { session, loading } = useAuth();
    const [userRoom, setUserRoom] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetchUserRoom();
        fetchUsers();
    }, []);

    const fetchUserRoom = async () => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', roomId)
                .limit(1);

            if (error) {
                throw error;
            }

            if (data.length > 0) {
                setUserRoom(data[0]);
            } else {
                console.error('No room found with the provided ID');
            }
        } catch (error) {
            console.error('Error fetching user room:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name');

            if (error) {
                throw error;
            }

            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const inviteUser = async (userId: number) => {
        try {
            const { data: existingMembership, error: existingMembershipError } =
                await supabase
                    .from('user_room')
                    .select('*')
                    .eq('room_id', roomId)
                    .eq('user_id', userId)
                    .single();

            if (existingMembership) {
                console.log('User is already a member of the room');
                return;
            }

            const { data: newMembership, error: newMembershipError } =
                await supabase
                    .from('user_room')
                    .insert([
                        { room_id: roomId, user_id: userId, active: true },
                    ]);

            if (newMembershipError) {
                console.error(
                    'Error inviting user:',
                    newMembershipError.message
                );
                return;
            }

            console.log('User invited successfully');
        } catch (error) {
            console.error('Error inviting user:', error);
        }
    };

    return (
        <View style={styles.container}>
            {userRoom ? (
                <>
                    <Text style={styles.roomName}>
                        Room {userRoom.room_name}!
                    </Text>
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.userContainer}>
                                <Text style={styles.userName}>
                                    {item.full_name}
                                </Text>
                                <Button
                                    title='Invite'
                                    onPress={() => inviteUser(item.id)}
                                />
                            </View>
                        )}
                    />
                    {/* <MovieCardSwipe movies={movies} /> */}
                </>
            ) : (
                <Text style={styles.noRoomText}>
                    No room found with the provided ID
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    roomName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userName: {
        flex: 1,
        fontSize: 18,
    },
    noRoomText: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default UserRoom;
