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
// import { CartProvider } from '../Context/CartContext';

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
              borderTopColor: 'transparent', backgroundColor: '#fff',   borderTopLeftRadius: 50,
              borderTopRightRadius: 50, borderWidth: 0, borderColor: 'transparent',
            
            },
            default: {  tabBarBackground: '#ff6f61',
              borderTopColor: 'transparent', backgroundColor: '#fff',   borderTopLeftRadius: 50,
              borderTopRightRadius: 50, borderWidth: 0, borderColor: 'transparent'},
          }),


          tabBarShowLabel: false,
          //tabBarLabelPosition: 'below-icon',
          // Static icons, color changes dynamically
      tabBarIcon: ({ focused, color }) => {
        let iconName: 'home' | 'account-circle' | 'cart-outline'| 'account-outline';

        if (route.name === 'home') {
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
       <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="Cart" options={{ title: "My Cart" }} />
      </Tabs>

      <Tabs.Screen
          name="(stack)"
          options={{ headerShown: false }}/>

</View>
  );
}