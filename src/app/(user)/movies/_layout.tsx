import { Stack } from 'expo-router';

export default function MovieStack() {
    return (
        <Stack>
            <Stack.Screen name='movie-page' options={{ title: 'Movie Page' }} />
        </Stack>
    );
}
