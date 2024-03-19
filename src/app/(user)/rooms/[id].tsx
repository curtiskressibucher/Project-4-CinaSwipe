import UserRoom from '@/src/components/UserRoom/UserRoom';
import { useAuth } from '@/src/providers/AuthProviders';
import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '@/src/lib/supabase';

export default function RoomDetail() {
    return (
        <View>
            <Text>Room Detail</Text>
        </View>
    );
}
