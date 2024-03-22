import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Redirect, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { useClientOnlyValue } from '../../components/useClientOnlyValue';
import { useAuth } from '@/src/providers/AuthProviders';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { session } = useAuth();

    if (!session) {
        return <Redirect href={'/'} />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
            }}>
            <Tabs.Screen
                name='movies'
                options={{ href: null, headerShown: false }}
            />
            <Tabs.Screen
                name='rooms'
                options={{ href: null, headerShown: false }}
            />
            <Tabs.Screen
                name='rooms copy'
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
                name='lobby'
                options={{
                    title: 'Find A Room',
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name='television' color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
