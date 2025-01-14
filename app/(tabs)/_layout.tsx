import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CartProvider } from '../Context/CartContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style = {{flex: 1, backgroundColor: '#ffffff'}}>
       <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
             // position: 'absolute',
             // borderTopColor: 'transparent',
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            },
            default: {  backgroundColor: '#ffffff',   borderTopLeftRadius: 25,
              borderTopRightRadius: 25, borderWidth: 0},
          }),

          tabBarLabelStyle:{
            fontWeight: 'bold',
            color : 'black'
          },
          tabBarLabelPosition: 'below-icon'
        }}
        >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home', 
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" size={28} color={'black'} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="account-circle" size={28} color={'black'} />
            ),
          }}
        />
        <Tabs.Screen
          name="Cart"
          options={{
            title: 'My Cart',
            tabBarIcon: ({ color }) => (
              <Entypo name="shopping-cart" size={28} color={'black'} />
            ),
          }}
        />
      </Tabs>
</View>
  );
}