import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../Context/CartContext';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import supabase from '../../supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as SplashScreen from 'expo-splash-screen';

interface FoodItem {
  item_id: number;
  vendor_name: string;
  item_name: string;
  price: number;
  category: string;
  veg: boolean;
  image: string;
  description: string;
}

export default function Menu() {
  const params = useLocalSearchParams();
  const vendor_id = params.vendor_id || params.vendorId;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [foodItem, setFoodItem] = useState<FoodItem[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const { items, addItem, updateQuantity, isLoading: cartLoading, refreshCart } = useCart();

  useFocusEffect(
    useCallback(() => {
      refreshCart();
    }, [refreshCart])
  );

  useEffect(() => {
    let mounted = true;

    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        if (vendor_id) {
          await fetchFood();
        } else {
          router.push('../+not-found');
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) {
          await SplashScreen.hideAsync();
        }
      }
    };

    prepare();
    return () => {
      mounted = false;
    };
  }, [vendor_id]);

  const fetchFood = async () => {
    try {
      const { data, error } = await supabase
        .from('menu')
        .select(`
          is_available,
          vendors:vendors!menu_vendor_id_fkey(vendor_id,name),
          items:items(item_id,item_name,description,price,image,veg)
        `)
        .eq('vendor_id', vendor_id);

      if (error) {
        console.error('Error fetching items:', error);
        return;
      }
      if (data.length === 0) {
        router.replace('../+not-found');
        return;
      }
      const transformedItems: FoodItem[] = data.map((item: any) => ({
        item_id: item.items?.item_id,
        vendor_name: item.vendors?.name || 'Unknown Vendor :(',
        item_name: item.items?.item_name || 'Unknown Item',
        price: item.items?.price || 0,
        category: item.categories?.category || 'Uncategorized',
        veg: item.items?.veg || false,
        image: item.items?.image || 'Tasty food',
        description: item.items?.description || 'No description available',
      }));

      setFoodItem(transformedItems);
    } catch (err) {
      console.error('Error in fetchFood:', err);
      router.push('../+not-found');
    } finally {
      setLoading(false);
    }
  };

  if (loading || cartLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6f61" />
      </View>
    );
  }

  const filteredItems = selectedCuisine === 'All'
    ? foodItem
    : foodItem.filter((item) => item.category === selectedCuisine);

  const getItemQuantity = (item_Id: number) => {
    const item = items.find((item) => item.item_id === item_Id);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (item: FoodItem) => {
    addItem(item);
  };

  const handleUpdateQuantity = (itemId: number, increment: number) => {
    updateQuantity(itemId, increment);
  };

  const getTotalCartItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <>
      <Stack.Screen
        options={{
          animation: 'fade',
          headerShown: true,
          headerTitle: 'Menu',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingLeft: 10, elevation: 3 }}>
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.goToCartButton} onPress={() => router.push('../Cart')}>
              <MaterialIcons name="shopping-cart" size={28} color="#fff" />
              {getTotalCartItems() > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{getTotalCartItems()}</Text>
                </View>
              )}
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: '#ff6f61' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <View style={styles.container}>
        <View style={styles.cuisineFilterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cuisineFilter}
          >
            {/* Cuisine filters can be added here */}
          </ScrollView>
        </View>
        <ScrollView style={styles.menuList}>
          {filteredItems.map((item: FoodItem) => (
            <View key={item.item_id} style={styles.menuItem}>
              <View style={styles.itemInfo}>
                {item.veg ? (
                  <MaterialCommunityIcons name="square-circle" size={16} color="green" />
                ) : (
                  <MaterialCommunityIcons name="square-circle" size={16} color="red" />
                )}
                <Text style={styles.item_Name}>{item.item_name}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                  style={styles.itemImage}
                />
                <View style={styles.quantityContainer}>
                  {getItemQuantity(item.item_id) > 0 ? (
                    <>
                      <TouchableOpacity
                        onPress={() => handleUpdateQuantity(item.item_id, -1)}
                        style={styles.quantityButton}
                      >
                        <MaterialIcons name="remove" size={20} color="#ff6f61" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{getItemQuantity(item.item_id)}</Text>
                      <TouchableOpacity
                        onPress={() => handleUpdateQuantity(item.item_id, 1)}
                        style={styles.quantityButton}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleAddToCart(item)}
                      style={styles.addButton}
                    >
                      <Text style={styles.addButtonText}>ADD</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  cuisineFilterWrapper: { paddingHorizontal: 10 },
  cuisineFilter: { paddingVertical: 10 },
  menuList: { flex: 1 },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemInfo: { flex: 1 },
  item_Name: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  itemPrice: { fontSize: 14, color: '#888', marginTop: 5 },
  itemDescription: { fontSize: 12, color: '#888', marginTop: 5 },
  imageContainer: { alignItems: 'center' },
  itemImage: { width: 100, height: 100, borderRadius: 8 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  quantityButton: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ff6f61',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: { color: '#ff6f61', fontSize: 17, top: -3 },
  quantityText: { marginHorizontal: 10, fontSize: 16 },
  addButton: {
    backgroundColor: '#ff6f61',
    padding: 10,
    borderRadius: 5,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  goToCartButton: { paddingRight: 10, position: 'relative' },
  cartBadge: {
    position: 'absolute',
    top: 9,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 15,
    height: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { color: '#ff6f61', fontSize: 10, fontWeight: 'bold' },

});