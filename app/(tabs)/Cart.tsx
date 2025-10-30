import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../Context/CartContext';
import { Stack, useFocusEffect } from 'expo-router';
import { router } from 'expo-router';

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

interface CartItem extends FoodItem {
  quantity: number;
}

const handlePaymentPage = () => {
  router.replace('../payment');
};

export default function MyCart() {
  const { items, updateQuantity, removeItem, getTotalPrice, isLoading, refreshCart } = useCart();

  // Reload cart when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshCart();
    }, [refreshCart])
  );

  const handleRemoveItem = (item_id: number): void => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          onPress: () => {
            removeItem(item_id);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleDecrement = (item: CartItem): void => {
    if (item.quantity === 1) {
      Alert.alert(
        'Remove Item',
        'This will remove the item from cart. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            onPress: () => {
              updateQuantity(item.item_id, -1);
            },
            style: 'destructive',
          },
        ]
      );
    } else {
      updateQuantity(item.item_id, -1);
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Image
        source={typeof item.image === 'string' ? { uri: item.image } : item.image}
        style={styles.itemImage}
      />
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveItem(item.item_id)}>
        <Ionicons name="close-circle" size={24} color="#ff6f61" />
      </TouchableOpacity>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={() => handleDecrement(item)}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.item_id, 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6f61" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'My Cart',
          headerStyle: { backgroundColor: '#ff6f61' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <View style={styles.container}>
        {items.length > 0 ? (
          <>
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.item_id.toString()}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
            <View style={styles.summaryContainer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total:</Text>
                <Text style={styles.totalAmount}>₹{getTotalPrice().toFixed(2)}</Text>
              </View>
              <TouchableOpacity onPress={handlePaymentPage} style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                <Ionicons name="arrow-forward" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyCartContainer}>
            <Ionicons name="cart-outline" size={80} color="#CCCCCC" />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
          </View>
        )}
      </View>
    </>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 10 },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  itemImage: { width: 60, height: 60, borderRadius: 8 },
  deleteButton: { position: 'absolute', right: 3, top: 1, color: '#f5f5f5' },
  itemDetails: { flex: 1, marginLeft: 10 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { fontSize: 14, color: '#888', marginTop: 5 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: {
    backgroundColor: '#ff6f61',
    padding: 5,
    borderRadius: 5,
    width: 25,
    height: 30,
    alignItems: 'center',
  },
  quantityButtonText: { color: '#fff', fontSize: 18, top: -2 },
  quantityText: { marginHorizontal: 10, fontSize: 16 },
  summaryContainer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#ff6f61' },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff6f61',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  emptyCartContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyCartText: { fontSize: 18, color: '#888', marginTop: 20 },
});