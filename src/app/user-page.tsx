import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    Platform,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Redirect } from 'expo-router';
import Button from '../components/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../providers/AuthProviders';
import { LinearGradient } from 'expo-linear-gradient';

const User = () => {
    const { session } = useAuth();
    const [userData, setUserData] = useState({ full_name: '' });
    const [newName, setNewName] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (session) {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    if (error) throw error;
                    setUserData(data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error as Error);
            }
        };

        fetchUserData();
    }, [session, refreshPage]); // Add refreshPage as a dependency

    const handleNameUpdate = async () => {
        try {
            if (!newName.trim()) {
                Alert.alert('Error', 'Name cannot be empty.');
                return;
            }

            await supabase
                .from('profiles')
                .update({ full_name: newName })
                .eq('id', session?.user?.id);

            setIsModalVisible(false);
            setRefreshPage((prev) => !prev); // Toggle refreshPage state
        } catch (error) {
            console.error('Error updating name:', (error as Error).message);
            Alert.alert(
                'Error',
                'Failed to update name. Please try again later.'
            );
        }
    };

    if (!session) {
        return <Redirect href={'/sign-in'} />;
    }

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Error signing out:', (error as Error).message);
            Alert.alert('Error', 'Failed to sign out. Please try again later.');
        }
    };

    return (
        <LinearGradient
            colors={['#000428', '#004e92']}
            style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {userData && userData.full_name}
                </Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                {userData && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Name: {userData.full_name}
                        </Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setIsModalVisible(true)}>
                            <Text style={styles.editButtonText}>Edit Name</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
            <Modal
                animationType='slide'
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Enter new name'
                            value={newName}
                            onChangeText={setNewName}
                        />
                        <Button
                            text='Update'
                            onPress={handleNameUpdate}
                            style={{ backgroundColor: 'green', marginTop: 10 }}
                        />
                        <Button
                            text='Cancel'
                            onPress={() => setIsModalVisible(false)}
                            style={{ backgroundColor: 'red', marginTop: 10 }}
                        />
                    </View>
                </View>
            </Modal>
            <Button
                text='Sign Out'
                onPress={handleSignOut}
                style={{ backgroundColor: 'red', marginBottom: 20 }}
            />
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    editButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    editButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default User;
