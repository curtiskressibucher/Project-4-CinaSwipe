import { Stack, Link } from 'expo-router';

export default function RoomStack() {
    return (
        <Stack>
            <Stack.Screen
                name='room-page'
                options={{
                    title: 'Lobby',
                }}
            />
        </Stack>
    );
}
