import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, Redirect } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { useAuth } from '@/src/providers/AuthProviders';
import { useClientOnlyValue } from '../../components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { isAdmin } = useAuth();

    if (!isAdmin) {
        return <Redirect href={'/'} />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.light.background,
                tabBarInactiveTintColor: 'gainsboro',
                tabBarStyle: {
                    backgroundColor: Colors.light.tint,
                },
            }}>
            <Tabs.Screen
                name='movies'
                options={{ href: null, headerShown: false }}
            />

            <Tabs.Screen
                name='index'
                options={{
                    title: 'CinaSwipe',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name='film' color={color} />
                    ),
                    headerRight: () => (
                        <Link href='/user-page' asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome
                                        name='user-circle'
                                        size={25}
                                        color={Colors.light.tint}
                                        style={{
                                            marginRight: 15,
                                            opacity: pressed ? 0.5 : 1,
                                        }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name='two'
                options={{
                    title: 'Lobby',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name='television' color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
