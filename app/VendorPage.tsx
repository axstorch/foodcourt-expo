import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VideoSplashScreen from '../components/Loading/Loading';
import supabase from '../supabase';
import BannerVendor from '../components/BannerVendor/BannerVendor';

interface Vendor {
  vendorid: number;
  name: string;
  location: string;
  image: string;
}

const FoodVendor = () => {
    const router = useRouter();    
    const handleMenuPress = (vendorid: number) => {
      router.push({
      pathname: '/Menu',
      params: { vendorid: vendorid.toString() }, // Ensure string format

    });
  };

  const [vendor, setVendor] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch items from Supabase
  const fetchVendor = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors') // Replace 'food_items' with your table name
        .select('vendorid, name, location, image'). eq('fcid', 1);// Select all columns or specify the columns you need

      if (error) {
        console.error('Error fetching items:', error);
        return;
      }

      setVendor(data); // Store retrieved items in state

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  
  // Fetch items on component mount
  useEffect(() => {
    fetchVendor();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        < VideoSplashScreen onFinish={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </View>
    );
  }

  return (
    <>
    <Stack.Screen 
    options={{
      headerShown: true,
      headerTitleAlign: 'center',
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{paddingLeft: 10, elevation: 3}}>
          <MaterialIcons name="arrow-back" size={24} color="#fff"  />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#ff6f61',  
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
      fontWeight: 'bold',
      },
      headerTransparent: false,
      headerShadowVisible: false,
    }}
    />
       <View style={styles.container}>
       <View style={styles.header}>
      </View>

     <View style = {styles.body}>   
     {/* <View style ={styles.Banner}>
      <View style = {styles.content}>
        <Text style={styles.BannerTitle}>DEmo</Text>
        <Text style={styles.headerSubtitle}>Select a vendor to view their menu</Text>
      </View>
      </View> */}
       <FlatList
       ListHeaderComponent={
        <View style={styles.Banner}>
       <BannerVendor />
        </View>
       }
       showsVerticalScrollIndicator = {false}
       contentContainerStyle={{ paddingBottom: 50 }} // Prevents last item from being cut off
       style={{marginTop: 10}}
        data={vendor}
        renderItem={({item})=> (
          <TouchableOpacity  onPress={() => handleMenuPress(item.vendorid)}
            >
            <ImageBackground
              style={styles.vendorCard}
              source={{ uri: item.image }} 
              imageStyle={{ borderRadius: 8 }}
          >
            <LinearGradient 
              colors={['rgba(255, 255, 255, 0)', "rgba(0, 0, 0, 0.7)"]}
              start={{x:0, y:0}}
              end={{x:0, y:1}}
              style={styles.vendorInfo}

            > 
            
              <Text style={styles.vendorName}>{item.name}</Text>
              <Text style={styles.vendorLocation}>{item.location}</Text>
            </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}
         keyExtractor={(item)=> item.vendorid.toString()}
         />
         
         </View>
         </View>
    
    
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
  },

  body: {
    //flex:1,
    alignItems: 'center',
  },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 10 : 5,
      paddingBottom: 1,
    },
    headerTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      color: '#ff6f61',
    },
    headerSubtitle: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },

    Banner: {
      flexDirection: 'row',
      margin: 16,
      padding: 16,
      marginBottom: 3,
      height: 250,
      backgroundColor: '#000',
      borderColor: '#ff6f61',
      borderRadius: 16,
      overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.6,
      shadowOffset: { width: 2, height: 2 },
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      elevation: 4,
    },

    BannerTitle:
    {
      flexDirection: 'row',
      fontSize: 28,
      marginBottom:10,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'right',
    },

  content:
  { flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
  },

  vendorCard: {
    width: Platform.OS === 'ios' ? 350 : 390,
    height: 150,
    marginBottom: 20,
    borderRadius: 15,
    paddingHorizontal: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
   
  },
  vendorImage: {
   borderRadius: 8,
  },

  vendorInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 10,
    height: 200,
    justifyContent: 'flex-end',
  },
    vendorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 1,
    textAlign: 'left',
  },

  vendorLocation: {
    fontSize: 16,
    color: '#fff',
  },
});

export default FoodVendor;