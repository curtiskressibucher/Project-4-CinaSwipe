import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { useAuth } from '../../providers/AuthProviders';
import { supabase } from '../../lib/supabase';
import { Link, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
    const { session, profile } = useAuth();
    const [roomCreated, setRoomCreated] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (selectedRoomId !== null) {
            setRedirect(true);
        }
    }, [selectedRoomId]);

    const filmWords = [
        'GreenRoom',
        'Studio',
        'Backlot',
        'Soundstage',
        'FilmSet',
        'CastingRoom',
        'EditingBay',
        'ProjectionRoom',
        'MakeupRoom',
        'Wardrobe',
        'PropsRoom',
        'ScreeningRoom',
        'RehearsalRoom',
        'CameraRoom',
        'LightingRoom',
        'ArtDepartment',
        'DirectorSuite',
        'ProducerOffice',
        'ActorLounge',
        'SceneShop',
        'ScriptLibrary',
        'CinemaHall',
        'PremiereRoom',
        'VIPSection',
        'RedCarpet',
    ];

    const generateRandomFilmWord = () => {
        const randomIndex = Math.floor(Math.random() * filmWords.length);
        return filmWords[randomIndex];
    };

    const handleStartSwiping = async () => {
        try {
            if (!roomCreated || !selectedRoomId) {
                const roomName = generateRandomFilmWord();
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

                    const {
                        data: userRoomInsertData,
                        error: userRoomInsertError,
                    } = await supabase.from('user_room').insert([
                        {
                            user_id: profile.id,
                            room_id: newRoomId,
                        },
                    ]);

                    if (userRoomInsertError) {
                        return;
                    }

                    setRoomCreated(true);
                    setSelectedRoomId(newRoomId);
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create room. Please try again.');
        }
    };

    return !redirect && roomCreated ? (
        <Redirect href={`/rooms/${selectedRoomId}`} />
    ) : (
        <LinearGradient
            colors={['#000428', '#004e92']}
            style={styles.pageContainer}>
            <Text style={styles.title}>CinaSwipe</Text>
            <Pressable
                onPress={handleStartSwiping}
                style={({ pressed }) => [
                    styles.button,
                    styles.startSwipingButton,
                    pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.buttonText}>Start Swiping!</Text>
            </Pressable>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#fff',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 20,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007bff',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    startSwipingButton: {
        marginBottom: 20,
    },
    buttonPressed: {
        backgroundColor: '#0056b3', // darker shade when pressed
    },
});
