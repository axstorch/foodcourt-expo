import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

type CourtDetailsParams = {
  id: string;
  name: string;
  vendors: string;
  isOpen: string;
  timing: string;
  distance: string;
  rating: string;
};

const CourtDetails = () => {
  const router = useRouter();
  const params = useLocalSearchParams<CourtDetailsParams>();
  const vendors = JSON.parse(params.vendors || '[]');
  const isOpen = params.isOpen === 'true';

  const handleVendorPress = (vendor: string) => {
    router.push(`/Menu`);
  };

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <MaterialIcons
            key={i}
            name={i < fullStars ? "star" : (i === fullStars && hasHalfStar ? "star-half" : "star-outline")}
            size={16}
            color="#FFD700"
          />
        ))}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: "Food Court Details",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
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
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Court Image */}
        <Image
          source={{uri: `https://source.unsplash.com/featured/?foodcourt&${params.id}`}}
          style={styles.courtImage}
          resizeMode="cover"
        />

        {/* Court Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.title}>{params.name}</Text>
          
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge, !isOpen && styles.closedBadge]}>
              <Text style={[styles.statusText, !isOpen && styles.closedText]}>
                {isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </View>
            <Text style={styles.timing}>
              <MaterialIcons name="access-time" size={16} color="#666" />
              {' '}{params.timing}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.infoText}>{params.distance}</Text>
          </View>

          <View style={styles.infoRow}>
            {renderRatingStars(parseFloat(params.rating || '0'))}
          </View>
        </View>

        {/* Vendors Section */}
        <View style={styles.vendorsSection}>
          <Text style={styles.sectionTitle}>Available Vendors</Text>
          <View style={styles.cardsContainer}>
            {vendors.map((vendor: string, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.vendorCard}
                onPress={() => handleVendorPress(vendor)}
                activeOpacity={0.7}
              >
                <Image
                  source={{uri: `https://source.unsplash.com/featured/?restaurant&${index}`}}
                  style={styles.vendorImage}
                  resizeMode="cover"
                />
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{vendor}</Text>
                  <MaterialIcons name="chevron-right" size={24} color="#666" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  courtImage: {
    width: '100%',
    height: 2,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closedBadge: {
    backgroundColor: '#ffebee',
  },
  closedText: {
    color: '#c62828',
  },
  timing: {
    color: '#666',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  vendorsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  cardsContainer: {
    gap: 15,
  },
  vendorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  vendorImage: {
    width: '100%',
    height: 120,
  },
  vendorInfo: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default CourtDetails;
