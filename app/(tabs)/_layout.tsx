// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { colors } from '../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Consultations',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon({ name, color }: { name: string; color: string }) {
  const iconNames: any = {
    home: 'medical',
    person: 'person',
  };
  
  return <Ionicons name={iconNames[name]} size={24} color={color} />;
}