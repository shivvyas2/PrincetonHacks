import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import AsyncStorage from '@react-native-async-storage/async-storage';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color
const ACCENT_COLOR = '#3A6491'; // Medium blue as accent

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define types for our data
type Business = {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  latitude: number;
  longitude: number;
  fundingGoal: number;
  fundingRaised: number;
  impact: string;
};

type Investor = {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  latitude: number;
  longitude: number;
  investmentTotal: number;
  investmentCount: number;
  interests: string;
};

// Mock data for nearby businesses
const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Green Earth Cafe',
    description: 'Sustainable coffee shop using locally sourced ingredients',
    category: 'Food & Beverage',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    rating: 4.7,
    reviews: 128,
    latitude: 40.7128,
    longitude: -74.0060,
    fundingGoal: 50000,
    fundingRaised: 32500,
    impact: 'Reduces carbon footprint by 30% compared to traditional cafes'
  },
  {
    id: '2',
    name: 'Tech Innovators',
    description: 'Startup focused on affordable tech education for underserved communities',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHRlY2h8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    rating: 4.9,
    reviews: 85,
    latitude: 40.7138,
    longitude: -74.0070,
    fundingGoal: 75000,
    fundingRaised: 45000,
    impact: 'Provided tech education to over 500 students from low-income backgrounds'
  },
  {
    id: '3',
    name: 'Eco Threads',
    description: 'Sustainable clothing store using recycled materials and ethical manufacturing',
    category: 'Retail',
    imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhpbmclMjBzdG9yZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    reviews: 64,
    latitude: 40.7148,
    longitude: -74.0080,
    fundingGoal: 60000,
    fundingRaised: 42000,
    impact: 'Diverted 5 tons of textile waste from landfills in the past year'
  },
  {
    id: '4',
    name: 'Community Health Clinic',
    description: 'Affordable healthcare services for underserved populations',
    category: 'Healthcare',
    imageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xpbmljfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    rating: 4.8,
    reviews: 156,
    latitude: 40.7158,
    longitude: -74.0090,
    fundingGoal: 100000,
    fundingRaised: 78000,
    impact: 'Provided healthcare services to over 2,000 uninsured patients'
  },
  {
    id: '5',
    name: 'Urban Farms',
    description: 'Community-based agriculture in urban settings, providing fresh produce to food deserts',
    category: 'Agriculture',
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXJiYW4lMjBmYXJtfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    rating: 4.6,
    reviews: 92,
    latitude: 40.7168,
    longitude: -74.0100,
    fundingGoal: 45000,
    fundingRaised: 30000,
    impact: 'Produced 10,000 pounds of fresh produce for local food banks'
  }
];

// Mock data for nearby investors
const mockInvestors: Investor[] = [
  {
    id: '1',
    name: 'Impact Ventures',
    description: 'Angel investor focused on sustainable businesses',
    category: 'Angel Investor',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3NtYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    rating: 4.9,
    reviews: 42,
    latitude: 40.7128,
    longitude: -74.0060,
    investmentTotal: 750000,
    investmentCount: 15,
    interests: 'Sustainability, Clean Energy, Social Impact'
  },
  {
    id: '2',
    name: 'Green Future Fund',
    description: 'VC firm specializing in eco-friendly startups',
    category: 'Venture Capital',
    imageUrl: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3N3b21hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    rating: 4.8,
    reviews: 36,
    latitude: 40.7138,
    longitude: -74.0070,
    investmentTotal: 1200000,
    investmentCount: 8,
    interests: 'Renewable Energy, Sustainable Agriculture, Green Tech'
  },
  {
    id: '3',
    name: 'Community First Capital',
    description: 'Investment group focused on local community businesses',
    category: 'Community Investment',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YnVzaW5lc3NtYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    rating: 4.7,
    reviews: 29,
    latitude: 40.7148,
    longitude: -74.0080,
    investmentTotal: 500000,
    investmentCount: 12,
    interests: 'Local Businesses, Community Development, Small Business'
  },
  {
    id: '4',
    name: 'Ethical Growth Partners',
    description: 'Investment firm focusing on ethical and sustainable businesses',
    category: 'Ethical Investment',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YnVzaW5lc3N3b21hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    rating: 4.6,
    reviews: 31,
    latitude: 40.7158,
    longitude: -74.0090,
    investmentTotal: 900000,
    investmentCount: 10,
    interests: 'Ethical Business, Fair Trade, Social Enterprise'
  }
];

export default function CommunityScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | Investor | null>(null);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const mapRef = useRef<MapView>(null);

  // Load business owner status
  useEffect(() => {
    const loadBusinessOwnerStatus = async () => {
      try {
        const storedIsBusinessOwner = await AsyncStorage.getItem('isBusinessOwner');
        if (storedIsBusinessOwner !== null) {
          setIsBusinessOwner(storedIsBusinessOwner === 'true');
        }
      } catch (error) {
        console.error('Error loading business owner status:', error);
      }
    };

    loadBusinessOwnerStatus();
  }, []);

  // Get current location
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
      } catch (error) {
        setErrorMsg('Could not get your location');
        // Use a default location (New York City)
        setLocation({
          coords: {
            latitude: 40.7128,
            longitude: -74.0060,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        });
      }
    })();
  }, []);

  // Get the data based on user role
  const getData = () => {
    return isBusinessOwner ? mockInvestors : mockBusinesses;
  };

  // Center map on selected item
  const centerMapOnItem = (item: Business | Investor) => {
    setSelectedBusiness(item);
    mapRef.current?.animateToRegion({
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }, 500);
  };

  // Render funding information based on item type
  const renderFundingInfo = (item: Business | Investor) => {
    if (isBusinessOwner) {
      // It's an investor
      const investor = item as Investor;
      return (
        <View style={styles.investorStats}>
          <View style={styles.statRow}>
            <Ionicons name="cash-outline" size={16} color={PRIMARY_COLOR} />
            <ThemedText style={styles.investorStatsText}>
              ${(investor.investmentTotal / 1000).toFixed(0)}K invested
            </ThemedText>
          </View>
          <View style={styles.statRow}>
            <Ionicons name="business-outline" size={16} color={PRIMARY_COLOR} />
            <ThemedText style={styles.investorStatsText}>
              {investor.investmentCount} businesses funded
            </ThemedText>
          </View>
          <View style={styles.statRow}>
            <Ionicons name="heart-outline" size={16} color={PRIMARY_COLOR} />
            <ThemedText style={styles.investorStatsText}>
              Interests: {investor.interests}
            </ThemedText>
          </View>
        </View>
      );
    } else {
      // It's a business
      const business = item as Business;
      return (
        <View style={styles.fundingProgress}>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${(business.fundingRaised / business.fundingGoal) * 100}%` }
              ]} 
            />
          </View>
          <View style={styles.fundingDetails}>
            <ThemedText style={styles.fundingText}>
              ${(business.fundingRaised / 1000).toFixed(0)}K raised
            </ThemedText>
            <ThemedText style={styles.fundingText}>
              ${(business.fundingGoal / 1000).toFixed(0)}K goal
            </ThemedText>
          </View>
          <ThemedText style={styles.impactText}>
            Impact: {business.impact}
          </ThemedText>
        </View>
      );
    }
  };

  // Render loading state
  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <ThemedText style={styles.loadingText}>
          {errorMsg || 'Loading map...'}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {/* User location marker */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            pinColor="#2196F3"
          />
          
          {/* Business/Investor markers */}
          {getData().map((item) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.name}
              description={item.description}
              pinColor={PRIMARY_COLOR}
              onPress={() => setSelectedBusiness(item)}
            />
          ))}
        </MapView>
      </View>
      
      {/* Business/Investor List */}
      <View style={styles.businessListContainer}>
        <View style={styles.businessListHeader}>
          <ThemedText style={styles.businessListTitle}>
            {isBusinessOwner ? "Nearby Investors" : "Nearby Small Businesses"}
          </ThemedText>
          <ThemedText style={styles.businessListSubtitle}>
            {isBusinessOwner 
              ? "Find potential investors in your area" 
              : "Discover and support local businesses"}
          </ThemedText>
        </View>
        
        {isBusinessOwner ? (
          // Business Owner View - Just show investors without search
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.businessCardsContainer}
          >
            {getData().map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.businessCard,
                  selectedBusiness?.id === item.id && styles.selectedBusinessCard
                ]}
                onPress={() => centerMapOnItem(item)}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.businessImage} />
                <View style={styles.businessCardContent}>
                  <ThemedText style={styles.businessName}>{item.name}</ThemedText>
                  <ThemedText style={styles.businessCategory}>{item.category}</ThemedText>
                  
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
                    <ThemedText style={styles.reviewCount}>({item.reviews} reviews)</ThemedText>
                  </View>
                  
                  {renderFundingInfo(item)}
                  
                  <TouchableOpacity style={styles.viewButton}>
                    <ThemedText style={styles.viewButtonText}>View Profile</ThemedText>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          // Investor View - Show businesses with search
          <>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search businesses..."
                placeholderTextColor="#999"
              />
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.businessCardsContainer}
            >
              {getData().map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.businessCard,
                    selectedBusiness?.id === item.id && styles.selectedBusinessCard
                  ]}
                  onPress={() => centerMapOnItem(item)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.businessImage} />
                  <View style={styles.businessCardContent}>
                    <ThemedText style={styles.businessName}>{item.name}</ThemedText>
                    <ThemedText style={styles.businessCategory}>{item.category}</ThemedText>
                    
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
                      <ThemedText style={styles.reviewCount}>({item.reviews} reviews)</ThemedText>
                    </View>
                    
                    {renderFundingInfo(item)}
                    
                    <TouchableOpacity style={styles.viewButton}>
                      <ThemedText style={styles.viewButtonText}>View Business</ThemedText>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: PRIMARY_COLOR,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  businessListHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  businessListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  businessListSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  businessCardsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  businessCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  selectedBusinessCard: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
  },
  businessImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  businessCardContent: {
    padding: 15,
  },
  businessName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  businessCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  investorStats: {
    marginTop: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  investorStatsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  fundingProgress: {
    marginTop: 12,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: PRIMARY_COLOR,
  },
  fundingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  fundingText: {
    fontSize: 12,
    color: '#666',
  },
  impactText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  viewButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
