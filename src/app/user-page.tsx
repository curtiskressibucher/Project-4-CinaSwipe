import { View, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const User = () => {
    return (
        <View>
            <Text>User</Text>
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
};

export default User;
