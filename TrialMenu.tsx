import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { red } from 'react-native-reanimated/lib/typescript/Colors';
// Change this line in Menu.tsx
import { useCart } from '../../Context/CartContext';  // Use relative path


interface FoodItem {
  id: string;
  name: string;
  price: number;
  cuisine: string;
  image: string;
}
interface CartItem extends FoodItem {
  quantity: number;
}

// import ChowmeinImage from '../../assets/images/Chowmein.png';

// console.log(ChowmeinImage); // This should log the resolved image path

const foodItems: FoodItem[] = [
  { id: '1', name: 'Chow Mein', price: 8.99, cuisine: 'Chinese', image: require('../../assets/images/Chowmein.png') },
  { id: '2', name: 'MOMO', price: 12.99, cuisine: 'Chinese', image: require('../../assets/images/Momo.png') },
  { id: '3', name: 'Dairy Milk', price: 9.99, cuisine: 'Western', image: require('../../assets/images/Dairymilk.png') },
  { id: '4', name: 'Patties', price: 14.99, cuisine: 'Western', image: require('../../assets/images/Patties.png') },
  { id: '5', name: 'Tea', price: 10.99, cuisine: 'Indian', image: require('../../assets/images/Tea.png') },
  { id: '6', name: 'Pizza', price: 11.99, cuisine: 'Western', image: require('../../assets/images/Pizza.png') },
  { id: '7', name: 'Chhole Bhature', price: 13.99, cuisine: 'Indian', image: require('../../assets/images/ChholeBhature.png') },
  { id: '8', name: 'Chicken chowmein', price: 9.99, cuisine: 'Chinese', image: require('../../assets/images/ChickChowmein.png') },
];

const cuisines = ['All', 'Chinese', 'Indian', 'Western', 'Japanese', 'Thai'];
export default function Menu() {
  const router = useRouter();
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const { items, addItem, updateQuantity } = useCart();

  const filteredItems = selectedCuisine === 'All' 
    ? foodItems 
    : foodItems.filter(item => item.cuisine === selectedCuisine);

    const getItemQuantity = (itemId: string) => {
      const item = items.find((item: { id: string; }) => item.id === itemId);
      return item ? item.quantity : 0;
    };
  
  
    const handleAddToCart = (item: FoodItem) => {
      addItem(item);
    };

    const handleUpdateQuantity = (itemId: string, increment: number) => {
      updateQuantity(itemId, increment);
    };

    const getTotalCartItems = () => {
      return items.reduce((total, item) => total + item.quantity, 0);
    };


  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "Menu",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={styles.goToCartButton} 
              onPress={() => router.push('../Cart')}
            >
              <MaterialIcons name="shopping-cart" size={24} color="#fff" />
              {getTotalCartItems() > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{getTotalCartItems()}</Text>
                </View>
              )}
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: '#ff6f61',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
       <View style={styles.container}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.cuisineFilter}
        >
          {cuisines.map((cuisine) => (
            <TouchableOpacity
              key={cuisine}
              style={[
                styles.cuisineButton,
                selectedCuisine === cuisine && styles.selectedCuisine,
              ]}
              onPress={() => setSelectedCuisine(cuisine)}
            >
              <Text style={[
                styles.cuisineButtonText,
                selectedCuisine === cuisine && styles.selectedCuisineText,
              ]}>
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <ScrollView style={styles.menuList}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <Image             source={
              typeof item.image === 'string'
                ? { uri: item.image }
                : item.image
            }
            style={styles.foodImage}
          />
              {/* look into this for image  */}
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodCuisine}>{item.cuisine}</Text>
                <Text style={styles.foodPrice}>₹{item.price.toFixed(2)}</Text>
              </View>
              <View style={styles.quantityContainer}>
                {getItemQuantity(item.id) > 0 && (
                  <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, -1)} style={styles.quantityButton}>
                    <MaterialIcons name="remove" size={20} color="#ff6f61" />
                  </TouchableOpacity>
                )}
                {getItemQuantity(item.id) > 0 && (
                  <Text style={styles.quantityText}>{getItemQuantity(item.id)}</Text>
                )}
                <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.addButton}>
                  <MaterialIcons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      {/* {getTotalCartItems() > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItemCount}>{getTotalCartItems()} item(s)</Text>
            <Text style={styles.cartTotal}>₹{getTotalCartPrice()}</Text>
          </View>
          <TouchableOpacity style={styles.viewCartButton}>
            <Text style={styles.viewCartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )} */}
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cuisineFilterContainer: {
    backgroundColor: '#fff',
    // paddingVertical: 8,
    borderWidth: 1, // Add borders for debugging
    borderColor: 'red',
  },
  
  cuisineFilter: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cuisineButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 6,
  },
  selectedCuisine: {
    backgroundColor: '#ff6f61',
  },
  cuisineButtonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCuisineText: {
    color: '#fff',
    fontWeight: '500',
  },
  menuList: {
    flex: 1,
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  foodImage: {
    width: 100,
    height: 100,
  },
  foodInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  foodCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6f61',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff6f61',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cartInfo: {
    flexDirection: 'column',
  },
  cartItemCount: {
    fontSize: 14,
    color: '#666',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6f61',
  },
  viewCartButton: {
    backgroundColor: '#ff6f61',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goToCartButton: {
    marginRight: 15,
  },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

