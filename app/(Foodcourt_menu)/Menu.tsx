import React, { useState, useEffect } from 'react';
import { useCart } from '../Context/CartContext';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList, ActivityIndicator, Platform, ImageBackground } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import supabase from '../../supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as SplashScreen from 'expo-splash-screen';



interface FoodItem {
  itemid: number;
  vendorname: string;
  itemname: string;
  price: number; 
  category: string;
  veg: boolean;
  image: string;
  description: string;
}
interface CartItem extends FoodItem {
  quantity: number;
}



export default function Menu() {
  const { vendorid = null } = useLocalSearchParams(); // Get vendorId from params
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [foodItem, setFoodItem] = useState<FoodItem[]>([]);  
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const { items, addItem, updateQuantity } = useCart();

  useEffect(() => {
    let mounted = true;

    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        if (vendorid) {
          await fetchFood();
        } else {
          router.push("../+not-found");
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
  }, [vendorid]);
  
  // Function to fetch items from Supabase
  const fetchFood = async () => {
    //  setLoading(true); // Start the loading spinner

    try {
      const { data, error } = await supabase
        .from("menu") // Replace 'food_items' with your table name
        
        //vendors:vendors!menu_vendorid_fkey(vendorid, name), is used to specify the foreign key relationship that needs to be used 
        //cause menu and vendor has 2 foreign relationship. and they are cyclic. so we need to specify the foreign key relationship 
       
        .select(` 
          isavailable,
          vendors:vendors!menu_vendorid_fkey(vendorid,name),  
          items: items(itemid,
          itemname,
          description,
          price,
          image,
          veg)
        `)
        .eq('vendorid', vendorid);
  
      if (error) {
        console.error('Error fetching items:', error);
        return;
      }
      if(data.length === 0){
        //setLoading(false);
        router.replace('../+not-found');
        return;
      }
      const transformedItems: FoodItem[] = data.map((item: any) => ({
        itemid: item.items?.itemid,
        vendorname: item.vendors?.name || "Unknown Vendor :(",
        itemname: item.items?.itemname || "Unknown Item",
        price: item.items?.price || 0,
        category: item.categories?.categoryname || "Uncategorized",
        veg: item.items?.veg || false,
        image: item.items?.image || "",
        description: item.items?.description || "No description available"
      }));
  
      setFoodItem(transformedItems); // Store retrieved items in state
  
    } catch (err) {
      router.push("../+not-found");
    } finally {
      setLoading(false)
     // Stop the loading spinner
    }
  };
  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
    );
    
  }
  
  const filteredItems = selectedCuisine === 'All' 
    ? foodItem 
    : foodItem.filter(item => item.category === selectedCuisine);

  const getItemQuantity = (itemId: number) => {
    const item = items.find(item => item.itemid === itemId);
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
          headerShown: true,
          headerTitle: "Menu",
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style ={{ paddingLeft: 10, elevation: 3}}>
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
          <Text style={styles.promoSubtext}>Use code BRYAN | above 200</Text>
        </View>
        <View style={styles.cuisineFilterWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.cuisineFilter}
        >
          {/* {cuisines.map((cuisine) => (
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
          ))} */}
        </ScrollView>
        </View>

        <ScrollView style={styles.menuList}>
          {filteredItems.map((item: FoodItem) => (
            <View key={item.itemid} style={styles.menuItem}>
              <View style={styles.itemInfo}>
                     {item.veg && (
                      <MaterialCommunityIcons name="square-circle" size={16} color="green" />                   
                    )}

                    {!item.veg && (
                      <MaterialCommunityIcons name="square-circle" size={16} color="red" />                   
                    )}

                <Text style={styles.itemName}>{item.itemname}</Text>
                {/* {item.ratings && (
                  <View style={styles.ratingContainer}>
                    <MaterialIcons name="star" size={16} color="#ffd700" />
                    <Text style={styles.ratingText}>{item.ratings}</Text>
                    <Text style={styles.ratingCount}>({item.numRatings} ratings)</Text>
                  </View>
                )} */}
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
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
                  {getItemQuantity(item.itemid) > 0 && (
                    <>
                      <TouchableOpacity onPress={() => handleUpdateQuantity(item.itemid, -1)} style={styles.quantityButton}>
                        <MaterialIcons name="remove" size={20} color="#ff6f61" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{getItemQuantity(item.itemid)}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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

  //for cuisine filter, once implemented, update the height!
  cuisineFilterWrapper: {
  height: 0,
  backgroundColor: '#fff',
  borderBottomWidth: 0,
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
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
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