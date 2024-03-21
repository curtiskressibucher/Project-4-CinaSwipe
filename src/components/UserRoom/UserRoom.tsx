import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProviders';
import { Link } from 'expo-router';

type UserRoomProps = {
    roomId: any;
    profile: any;
    onLeaveRoom: () => void;
};

const UserRoom: React.FC<UserRoomProps> = ({ roomId, onLeaveRoom }) => {
    const { session, loading, profile } = useAuth();
    const [userRoom, setUserRoom] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [fetchedUsers, setFetchedUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

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
                fetchUsersInRoom();
            } else {
                console.error('No room found with the provided ID');
            }
        } catch (error) {
            console.error('Error fetching user room:', error);
        }
    };

    const fetchUsersInRoom = async () => {
        try {
            const { data: roomUsers, error } = await supabase
                .from('user_room')
                .select('user_id')
                .eq('room_id', roomId);

            if (error) {
                throw error;
            }

            const userIds = roomUsers.map((user: any) => user.user_id);

            const { data: usersData, error: usersError } = await supabase
                .from('profiles')
                .select('id, full_name')
                .in('id', userIds);

            if (usersError) {
                throw usersError;
            }

            console.log('Active users in the room:', usersData || []);

            setUsers(usersData || []);
        } catch (error) {
            console.error('Error fetching users in room:', error);
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
            setFetchedUsers(data || []);
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
            fetchUsersInRoom();
        } catch (error) {
            console.error('Error inviting user:', error);
        }
    };

    const leaveRoom = async (userId: number) => {
        try {
            await supabase
                .from('user_room')
                // .update({ active: null })
                .delete()
                .eq('room_id', roomId)
                .eq('user_id', userId);

            fetchUsers();
            console.log('Left room successfully');
            onLeaveRoom();
        } catch (error) {
            console.error('Error leaving room:', error);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setSearchResults(
            fetchedUsers.filter((user) =>
                user.full_name.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    return (
        <View style={styles.container}>
            {userRoom ? (
                <>
                    <Text style={styles.roomName}>{userRoom.room_name}!</Text>
                    <View style={styles.goToRoomContainer}>
                        <Link href={`/rooms/${userRoom.id}`} asChild>
                            <Text style={styles.goToRoomButton}>
                                Movie Match!
                            </Text>
                        </Link>
                    </View>
                    <FlatList
                        data={users}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.userContainer}>
                                <Text style={styles.userName}>
                                    {item.full_name}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => leaveRoom(item.id)}
                                    style={styles.leaveButton}>
                                    <Text style={styles.buttonText}>Leave</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <View style={styles.bottomContainer}>
                        <TextInput
                            style={styles.searchBar}
                            placeholder='Search users...'
                            onChangeText={handleSearch}
                            value={searchQuery}
                        />
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.userContainer}>
                                    <Text style={styles.userName}>
                                        {item.full_name}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => inviteUser(item.id)}
                                        style={styles.inviteButton}>
                                        <Text style={styles.buttonText}>
                                            Invite
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
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
        backgroundColor: 'lightgray',
    },
    roomName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userName: {
        flex: 1,
        fontSize: 18,
        color: 'black',
    },
    leaveButton: {
        backgroundColor: 'red',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    inviteButton: {
        backgroundColor: 'green',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
    noRoomText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
    },
    goToRoomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    goToRoomButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        color: '#fff',
    },
    goToRoomButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: '#fff',
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});

export default UserRoom;
