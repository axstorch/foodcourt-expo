import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../Context/CartContext';

interface FoodItem {
  id: string;
  name: string;
  price: number;
  cuisine: string;
  image: string;
  ratings?: number;
  numRatings?: number;
}
interface CartItem extends FoodItem {
  quantity: number;
}

const foodItems = [
  { id: '1', name: 'Java Chip Frappuccino', price: 305, cuisine: 'Beverages', image: require('../../assets/images/Coffee.png'), ratings: 4.5, numRatings: 110 },
  { id: '2', name: 'New York Cheesecake', price: 395, cuisine: 'Desserts', image: require('../../assets/images/Cheesecake.png'), ratings: 4.5, numRatings: 35 },
  { id: '3', name: 'Dairy Milk', price: 9.99, cuisine: 'Snacks', image: require('../../assets/images/Dairymilk.png') },
  { id: '4', name: 'Patties', price: 14.99, cuisine: 'Western', image: require('../../assets/images/Patties.png') },
  { id: '5', name: 'Tea', price: 10.99, cuisine: 'Beverages', image: require('../../assets/images/Tea.png') },
  { id: '6', name: 'Pizza', price: 11.99, cuisine: 'Western', image: require('../../assets/images/Pizza.png') },
  { id: '7', name: 'Chhole Bhature', price: 13.99, cuisine: 'Indian', image: require('../../assets/images/ChholeBhature.png') },
  { id: '8', name: 'Chicken chowmein', price: 9.99, cuisine: 'Chinese', image: require('../../assets/images/ChickChowmein.png') },
];

const cuisines = ['All', 'Western', 'Indian', 'Chinese', 'Beverages', 'Desserts', 'Snacks' ];

export default function Menu() {
  const router = useRouter();
  
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const { items, addItem, updateQuantity } = useCart();

  const filteredItems = selectedCuisine === 'All' 
    ? foodItems 
    : foodItems.filter(item => item.cuisine === selectedCuisine);

  const getItemQuantity = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
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
        <View style={styles.promoContainer}>
          <Text style={styles.promoText}>20% OFF upto ₹50</Text>
          <Text style={styles.promoSubtext}>Use code LOMDA | above 200</Text>
        </View>
        <View style={styles.cuisineFilterWrapper}>
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
        </View>

        <ScrollView style={styles.menuList}>
          {filteredItems.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <View style={styles.itemInfo}>
                <MaterialIcons name="verified" size={16} color="#388e3c" style={styles.verifiedIcon} />
                <Text style={styles.itemName}>{item.name}</Text>
                {item.ratings && (
                  <View style={styles.ratingContainer}>
                    <MaterialIcons name="star" size={16} color="#ffd700" />
                    <Text style={styles.ratingText}>{item.ratings}</Text>
                    <Text style={styles.ratingCount}>({item.numRatings} ratings)</Text>
                  </View>
                )}
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  We blend mocha sauce and Frappuccino chips with roast coffee and milk and ice, then top...
                </Text>
              </View>
              <View style={styles.imageContainer}>
                <Image 
                  source={
                    typeof item.image === 'string'
                      ? { uri: item.image }
                      : item.image
                  }
                  style={styles.itemImage}
                />
                <View style={styles.quantityContainer}>
                  {getItemQuantity(item.id) > 0 && (
                    <>
                      <TouchableOpacity onPress={() => handleUpdateQuantity(item.id, -1)} style={styles.quantityButton}>
                        <MaterialIcons name="remove" size={20} color="#ff6f61" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{getItemQuantity(item.id)}</Text>
                    </>
                  )}
                  <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.addButton}>
                    <Text style={styles.addButtonText}>ADD</Text>
                  </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  promoContainer: {
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  promoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  promoSubtext: {
    fontSize: 14,
    color: '#666',
  },
  cuisineFilterWrapper: {
  height: 60,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
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
    fontWeight: 'bold',
    color: '#333',
  },
  selectedCuisineText: {
    color: '#fff',
    fontWeight: '500',
  },
  menuList: {
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  verifiedIcon: {
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  ratingCount: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  imageContainer: {
    width: 120,
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ff6f61',
  },
  addButtonText: {
    color: '#ff6f61',
    fontSize: 14,
    fontWeight: '600',
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