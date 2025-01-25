import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CartProvider } from '../Context/CartContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style = {{flex: 1, backgroundColor: '#ffffff'}}>
       <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#ff6f61",
          tabBarInactiveTintColor: "#000",
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
            default: {   borderTopColor: 'transparent', backgroundColor: '#fff',   borderTopLeftRadius: 50,
              borderTopRightRadius: 50, borderWidth: 0, borderColor: 'transparent', elevation: 20,},
          }),

          tabBarLabelStyle:{
            fontWeight: 'bold',
            color : 'black',
          },
          tabBarShowLabel: false,
          //tabBarLabelPosition: 'below-icon',
          // Static icons, color changes dynamically
      tabBarIcon: ({ focused, color }) => {
        let iconName: 'home' | 'account-circle' | 'cart-outline'| 'account-outline';

        if (route.name === 'index') {
          iconName = 'home';
          return <AntDesign name={iconName} size={28} color={color} />;
        } else if (route.name === 'profile') {
          iconName = 'account-outline';
          return <MaterialCommunityIcons name={iconName} size={28} color={color} />;
        } else if (route.name === 'Cart') {
          iconName = 'cart-outline';
          return <Ionicons name={iconName} size={28} color={color} />;
        }
      },
        })}
        >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home', 
            // tabBarIcon: ({ color }) => (
            //   <AntDesign name="home" size={28} color={'black'} />
            // ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            // tabBarIcon: ({ color }) => (
            //   <MaterialIcons name="account-circle" size={28} color={'black'} />
            // ),
          }}
        />
        <Tabs.Screen
          name="Cart"
          options={{
            title: 'My Cart',
            // tabBarIcon: ({ color }) => (
            //   <Entypo name="shopping-cart" size={28} color={'black'} />
            // ),
          }}
        />
      </Tabs>
</View>
  );
}