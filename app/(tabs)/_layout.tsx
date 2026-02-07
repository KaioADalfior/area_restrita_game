import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4a5568',
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Bate-papo', tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="cloud" options={{ title: 'Nuvem', tabBarIcon: ({ color }) => <Ionicons name="cloud-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="apps" options={{ title: 'Apps', tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="shop" options={{ title: 'Loja', tabBarIcon: ({ color }) => <Ionicons name="bag-handle-outline" size={24} color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { height: 70, paddingBottom: 10, backgroundColor: '#fff' },
  tabBarLabel: { fontFamily: 'Poppins', fontSize: 10 },
});