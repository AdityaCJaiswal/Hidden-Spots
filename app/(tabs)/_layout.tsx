import { Tabs } from 'expo-router';
import { Map, List, Plus, User } from 'lucide-react-native';
import { StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: styles.tabBarIOS,
          android: styles.tabBarAndroid,
          default: styles.tabBarWeb,
        }),
        tabBarBackground: () => Platform.OS === 'ios' ? (
          <BlurView intensity={95} style={StyleSheet.absoluteFill} />
        ) : undefined,
        tabBarActiveTintColor: '#EA580C',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ size, color, focused }) => (
            <Map 
              size={focused ? size + 2 : size} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="spots"
        options={{
          title: 'Spots',
          tabBarIcon: ({ size, color, focused }) => (
            <List 
              size={focused ? size + 2 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Spot',
          tabBarIcon: ({ size, color, focused }) => (
            <Plus 
              size={focused ? size + 2 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color, focused }) => (
            <User 
              size={focused ? size + 2 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarIOS: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingBottom: 8,
    paddingTop: 8,
    height: 88,
  },
  tabBarAndroid: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    paddingBottom: 8,
    paddingTop: 8,
    height: 70,
  },
  tabBarWeb: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 8,
    paddingTop: 8,
    height: 70,
  },
  tabBarLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    marginTop: 4,
  },
  tabBarItem: {
    paddingTop: 8,
  },
});