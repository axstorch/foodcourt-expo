import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../Context/CartContext';  // Use relative path
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';


interface Category {
  id: string;
  name: string;
  icon: string;
}

interface FoodCourt {
  id: string;
  name: string;
  vendors : string[]; 
  distance: string;
  rating: number;
  image: string;
}

interface FoodItem {
  id: string;
  name: string;
  price: number;
  cuisine: string;
  image: string;
}





const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
    // const { items, addItem, updateQuantity } = useCart();
    const router = useRouter();
    const handleMenuPress = () => {
      router.push(`/Foodcourt_menu/Menu`);
    };

    const handleVendorPress = (vendor: string) => {
      router.push(`/Foodcourt_menu/Menu`);
    };


  const foodItems: FoodItem[] = [
    { id: '1', name: 'Chow Mein', price: 8.99, cuisine: 'Chinese', image: require('../../assets/images/Chowmein.png') },
    // { id: '2', name: 'MOMO', price: 12.99, cuisine: 'Chinese', image: require('../../assets/images/Momo.png') },
    // { id: '3', name: 'Dairy Milk', price: 9.99, cuisine: 'Western', image: require('../../assets/images/Dairymilk.png') },
    { id: '4', name: 'Patties', price: 14.99, cuisine: 'Western', image: require('../../assets/images/Patties.png') },
    { id: '5', name: 'Tea', price: 10.99, cuisine: 'Beverages', image: require('../../assets/images/Tea.png') },
    // { id: '6', name: 'Pizza', price: 11.99, cuisine: 'Western', image: require('../../assets/images/Pizza.png') },
     { id: '7', name: 'Chhole Bhature', price: 13.99, cuisine: 'Indian', image: require('../../assets/images/ChholeBhature.png') },
    { id: '8', name: 'Chicken chowmein', price: 9.99, cuisine: 'Chinese', image: require('../../assets/images/ChickChowmein.png') },
    { id: '9', name: 'Pasta', price: 9.99, cuisine: 'Italian', image: require('../../assets/images/pasta.png') },

  ];
  

  const foodcourt: FoodCourt[] = [
    {
      id: '1',
      name: 'KIIT University Food Court',
      vendors: ['(Mech)FoodCourt-17', 'FoodCourt-21', 'FoodCourt-33,', 'FoodCourt-21', 'Foodcourt-66 '],
      distance: '0.2 km',
      rating: 4.5,
      image: require('../../assets/images/NewNoodlespng.png')
       
      },
      {
        id: '2',
        name: 'KIIT Road Food Court',
        vendors: ['Burnt', 'MahaMaya Faluda'],
        distance: '1.5 km',
        rating: 4.2,
        image: require('../../assets/images/panipuri.png')
      },
      {
        id: '3',
        name: 'Esplanade Mall Food Court',
        vendors: ['KFC', 'Pizza Hut'],
        distance: '3.2 km',
        rating: 3.8,
        image: require('../../assets/images/Burgerplatter.png')
      },
      {
        id: '4',
        name: 'Central Park Food Plaza',
        vendors: ['Burger King', 'Subway'],
        distance: '2.1 km',
        rating: 4.0,
        image: require('../../assets/images/Dosa.png')
      },
      {
        id: '5',
        name: 'Beachside Bites',
        vendors: ['Seafood Shack', 'Taco Stand'],
        distance: '5.7 km',
        rating: 4.7,
        image: require('../../assets/images/fish.png')
      },
      
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity> */}
        <View>
          <Text style={styles.headerTitle}>FoodCourt</Text>
          <Text style={styles.headerSubtitle}></Text>
        </View>
        
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu, restaurant or etc"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <MaterialIcons name="tune" size={20} color="#666" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Can't study?{'\n'}Growling Tummy?{'\n'}Why wait?</Text>
            <TouchableOpacity  onPress={() => handleMenuPress()}
            style={styles.orderButton}>

              <Text style={styles.orderButtonText}>Order now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../assets/images/ChickenBiryani.png') }
            style={styles.promoImage}
          />
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Categories</Text>
            {/* <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity> */}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {foodItems.map((FoodItem) => (
              <TouchableOpacity key={FoodItem.id} style={styles.FoodItem}
              >
                
                <Image             source={
                             typeof FoodItem.image === 'string'
                               ? { uri: FoodItem.image }
                               : FoodItem.image
                           }
                           style = {styles.FoodIcon}
                           
                           />
                <Text style={styles.FoodName}>{FoodItem.cuisine}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Discounts */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Discount</Text>
            {/* <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity> */}
          </View>
          <View style={styles.discountGrid}>
            {foodcourt.map((FoodCourt) => (
              <TouchableOpacity 
              onPress={() => handleMenuPress()}
              key={FoodCourt.id} style={styles.discountCard}>
        
                <Image source= {
                             typeof FoodCourt.image === 'string'
                               ? { uri: FoodCourt.image }
                               : FoodCourt.image
                           }
                           style = {styles.discountImage}

                           />
                <View style={styles.discountInfo}>
                  <Text style={styles.FoodCourtName}>{FoodCourt.name}</Text>
                  <View style={styles.FoodCourtDetails}>
                    <Text style={styles.FoodCourtDistance}>{FoodCourt.distance}</Text>
                    <View style={styles.ratingContainer}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{FoodCourt.rating} reviews</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ff6f61',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  promoBanner: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    backgroundColor: '#ff6f61',
    borderRadius: 16,
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 21,
  },
  orderButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  promoImage: {
    marginTop: 25,
    width: 150,
    height: 150,
    borderRadius: 75, // Keep this for rounded image
    borderWidth: 15, // Border thickness
    borderColor: 'white', // Border color
    overflow: 'hidden', // Ensures the border is applied within the rounded corners
    // padding: 0, // Padding between the image and border
    resizeMode:'contain'

  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#666',
  },
  categoriesScroll: {
    paddingLeft: 16,
  },
  FoodItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  FoodIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 25,
    marginBottom: 8,
  },
  FoodName: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  discountGrid: {
    paddingHorizontal: 16,
  },
  discountCard: {
    marginBottom: 16,
  },

  //this is for the menu images:
  discountImage: {
    width: '55%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
    marginLeft: 80,
    resizeMode: 'contain'

  },
  discountInfo: {
    paddingHorizontal: 4,
  },
  FoodCourtName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  FoodCourtDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  FoodCourtDistance: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#666',
  },
});

export default HomePage;