import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Image, Text, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color
const ACCENT_COLOR = '#3A6491'; // Medium blue as accent

// Screen dimensions
const { width, height } = Dimensions.get('window');

// Mock data for nearby businesses
const nearbyBusinesses = [
  {
    id: '1',
    name: 'Green Leaf Cafe',
    description: 'A sustainable cafe serving organic coffee and locally sourced food.',
    category: 'Cafe',
    rating: 4.8,
    distance: '0.3 mi',
    latitude: 40.3573,
    longitude: -74.6672,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '2',
    name: 'Community Support Center',
    description: 'A non-profit organization providing resources and support for local communities.',
    category: 'Social Welfare',
    rating: 4.6,
    distance: '0.7 mi',
    latitude: 40.3593,
    longitude: -74.6652,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8Y29tbXVuaXR5JTIwY2VudGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '3',
    name: 'Tech Startup Hub',
    description: 'A collaborative workspace for tech entrepreneurs and startups.',
    category: 'Technology',
    rating: 4.9,
    distance: '1.2 mi',
    latitude: 40.3553,
    longitude: -74.6692,
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwc3BhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '4',
    name: 'Local Artisan Market',
    description: 'A marketplace featuring handcrafted goods from local artisans.',
    category: 'Retail',
    rating: 4.7,
    distance: '0.9 mi',
    latitude: 40.3613,
    longitude: -74.6662,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bWFya2V0fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
];

export default function CommunityScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.3573, // Princeton University coordinates as default
    longitude: -74.6672,
    latitudeDelta: 0.0222,
    longitudeDelta: 0.0121,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0121,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        setErrorMsg('Could not get your location. Using default location.');
      }
    })();
  }, []);

  const handleMarkerPress = (businessId: string) => {
    setSelectedBusiness(businessId);
  };

  const handleBusinessCardPress = (businessId: string) => {
    setSelectedBusiness(businessId);
    
    // Find the business and center the map on it
    const business = nearbyBusinesses.find(b => b.id === businessId);
    if (business) {
      setMapRegion({
        latitude: business.latitude,
        longitude: business.longitude,
        latitudeDelta: 0.0122,
        longitudeDelta: 0.0061,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Community</ThemedText>
        <ThemedText style={styles.subtitle}>Discover nearby small businesses</ThemedText>
      </View>
      
      {/* Map View - Takes top half of screen */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
        >
          {nearbyBusinesses.map((business) => (
            <Marker
              key={business.id}
              coordinate={{
                latitude: business.latitude,
                longitude: business.longitude,
              }}
              title={business.name}
              description={business.category}
              onPress={() => handleMarkerPress(business.id)}
              pinColor={selectedBusiness === business.id ? PRIMARY_COLOR : '#FF5A5F'}
            />
          ))}
        </MapView>
      </View>
      
      {/* Business Listings - Takes bottom half of screen */}
      <View style={styles.businessListContainer}>
        <View style={styles.businessListHeader}>
          <ThemedText style={styles.sectionTitle}>Nearby Small Businesses</ThemedText>
        </View>
        
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.businessCards}
        >
          {nearbyBusinesses.map((business) => (
            <TouchableOpacity
              key={business.id}
              style={[
                styles.businessCard,
                selectedBusiness === business.id && styles.selectedBusinessCard
              ]}
              onPress={() => handleBusinessCardPress(business.id)}
            >
              <Image source={{ uri: business.image }} style={styles.businessImage} />
              <View style={styles.businessInfo}>
                <ThemedText style={styles.businessName}>{business.name}</ThemedText>
                <View style={styles.businessMeta}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{business.category}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{business.rating}</Text>
                  </View>
                </View>
                <Text style={styles.distanceText}>{business.distance}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 5,
  },
  mapContainer: {
    height: height * 0.4, // 40% of screen height for map
    width: width,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  businessListContainer: {
    flex: 1, // Takes remaining space (approximately 50% with header)
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 15,
  },
  businessListHeader: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  businessCards: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  businessCard: {
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  selectedBusinessCard: {
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
  },
  businessImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  businessInfo: {
    padding: 10,
  },
  businessName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 4,
  },
  businessMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryBadge: {
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#333',
    fontSize: 10,
    marginLeft: 2,
  },
  distanceText: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
  },
});

