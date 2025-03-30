import { View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, SafeAreaView, Modal, Pressable, Text, ActivityIndicator, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { NESSIE_API, validateApiConfig } from '@/services/api';
import { getBusinessPhotoUrl, isUnsplashApiConfigured } from '@/services/unsplashApi';
import BusinessStoryModal from '@/components/BusinessStoryModal';

// App theme color
const PRIMARY_COLOR = '#1E3A5F';
const ACCENT_COLOR = '#3A6491';

// Purchase interface
interface Purchase {
  merchant_id: string;
  medium: string;
  purchase_date: string;
  amount: number;
  status: string;
  description: string;
}

// Business interface
interface Business {
  id: number;
  name: string;
  description: string;
  image: any;
  photoUrl?: string;
  target: number;
  raised: number;
  daysLeft: number;
  progress: number;
  favorite: boolean;
  location?: string;
  latitude?: number;
  longitude?: number;
  impact?: string;
}

// Mock business data for Princeton area
const businesses: Business[] = [
  {
    id: 1,
    name: "Small World Coffee",
    description: "Popular local coffee shop supporting sustainable farming practices and offering organic, fair-trade coffee options.",
    image: require('@/assets/images/Center Content.png'),
    target: 8000,
    raised: 5750,
    daysLeft: 21,
    progress: 0.72,
    favorite: false,
    location: "Princeton, NJ",
    latitude: 40.3500,
    longitude: -74.6590,
    impact: "Supports 15 fair-trade coffee farms and reduced carbon footprint by 25% through sustainable practices."
  },
  {
    id: 2,
    name: "Labyrinth Books",
    description: "Independent bookstore focused on promoting literacy and supporting local authors through community events.",
    image: require('@/assets/images/Center Content2.png'),
    target: 8000,
    raised: 7800,
    daysLeft: 14,
    progress: 0.98,
    favorite: true,
    location: "Princeton, NJ",
    latitude: 40.3507,
    longitude: -74.6595,
    impact: "Hosted 50+ community literacy events and partnered with 25 local schools for educational programs."
  },
  {
    id: 3,
    name: "Triumph Brewing Company",
    description: "Local brewery implementing sustainable brewing practices and supporting regional farmers.",
    image: require('@/assets/images/Center Content.png'),
    target: 8000,
    raised: 6500,
    daysLeft: 30,
    progress: 0.81,
    favorite: false,
    location: "Princeton, NJ",
    latitude: 40.3505,
    longitude: -74.6600,
    impact: "Sources 80% of ingredients locally and reduced water usage by 35% through innovative brewing techniques."
  },
  {
    id: 4,
    name: "Jammin' Crepes",
    description: "Farm-to-table restaurant focusing on locally-sourced ingredients and zero-waste practices.",
    image: require('@/assets/images/Center Content2.png'),
    target: 8000,
    raised: 4200,
    daysLeft: 45,
    progress: 0.53,
    favorite: false,
    location: "Princeton, NJ",
    latitude: 40.3510,
    longitude: -74.6585,
    impact: "Diverted 95% of waste from landfills and partners with 12 local farms for sustainable ingredients."
  },
  {
    id: 5,
    name: "Princeton Record Exchange",
    description: "Iconic music store promoting local artists and implementing energy-efficient operations.",
    image: require('@/assets/images/Center Content.png'),
    target: 8000,
    raised: 8000,
    daysLeft: 0,
    progress: 1.0,
    favorite: true,
    location: "Princeton, NJ",
    latitude: 40.3503,
    longitude: -74.6598,
    impact: "Reduced energy consumption by 40% and supports 30+ local musicians through promotion and events."
  },
  {
    id: 6,
    name: "Bent Spoon",
    description: "Artisanal ice cream shop using organic, locally-sourced ingredients and eco-friendly packaging.",
    image: require('@/assets/images/Center Content2.png'),
    target: 8000,
    raised: 7250,
    daysLeft: 7,
    progress: 0.91,
    favorite: true,
    location: "Princeton, NJ",
    latitude: 40.3508,
    longitude: -74.6592,
    impact: "Eliminated single-use plastics and sources 90% of ingredients from within 50 miles of Princeton."
  }
];

export default function InvestScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(true);
  const [businessesWithPhotos, setBusinessesWithPhotos] = useState<Business[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBusinessForModal, setSelectedBusinessForModal] = useState<Business | null>(null);
  const { userId } = useAuth();
  
  // Check if API is properly configured
  useEffect(() => {
    const isConfigValid = validateApiConfig();
    setApiConfigured(isConfigValid);
    
    if (!isConfigValid) {
      console.warn('API configuration is incomplete. Some features may not work properly.');
    }
  }, []);
  
  // Load business photos from Unsplash API
  useEffect(() => {
    const loadBusinessPhotos = async () => {
      try {
        // Create a copy of businesses to update with photos
        const updatedBusinesses = [...businesses];
        
        // Fetch photos for each business
        for (let i = 0; i < updatedBusinesses.length; i++) {
          const business = updatedBusinesses[i];
          try {
            // Fetch photo URL from Unsplash API using business name
            const photoUrl = await getBusinessPhotoUrl(business.name);
            
            if (photoUrl) {
              updatedBusinesses[i] = {
                ...business,
                photoUrl
              };
            }
          } catch (error) {
            console.error(`Error fetching photo for ${business.name}:`, error);
          }
        }
        
        setBusinessesWithPhotos(updatedBusinesses);
      } catch (error) {
        console.error('Error loading business photos:', error);
        setBusinessesWithPhotos(businesses);
      }
    };
    
    loadBusinessPhotos();
  }, []);
  
  // Format number with commas for thousands
  const formatAmount = (amount: string) => {
    if (!amount) return '0';
    const num = parseFloat(amount);
    return num.toLocaleString('en-US');
  };
  
  // Make a purchase using Capital One Nessie API
  const makePurchase = async () => {
    if (!currentBusiness || !investmentAmount || parseFloat(investmentAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid investment amount.');
      return;
    }
    
    if (!userId) {
      Alert.alert('Authentication Required', 'Please sign in to make an investment.');
      return;
    }
    
    if (!apiConfigured && !NESSIE_API.USE_MOCK_API) {
      Alert.alert('Configuration Error', 'Payment system is not properly configured. Please try again later.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const amount = parseFloat(investmentAmount);
      const today = new Date();
      const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      const purchaseData: Purchase = {
        merchant_id: `${currentBusiness.id}`,
        medium: "balance",
        purchase_date: formattedDate,
        amount: amount,
        status: "pending",
        description: `Investment in ${currentBusiness.name}`
      };
      
      console.log('Making purchase with data:', JSON.stringify(purchaseData));
      
      let responseData;
      
      if (NESSIE_API.USE_MOCK_API) {
        // Mock successful API response for testing
        console.log('Using mock API response');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        responseData = {
          code: 201,
          message: "Created",
          objectCreated: {
            _id: "mock-purchase-" + Date.now(),
            ...purchaseData
          }
        };
      } else {
        // Use the Clerk userId as the account ID
        const response = await fetch(`${NESSIE_API.BASE_URL}/accounts/${userId}/purchases?key=${NESSIE_API.API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId,
          },
          body: JSON.stringify(purchaseData)
        });
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          // Handle non-JSON response
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Received non-JSON response from server');
        }
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${responseData?.message || 'Unknown error'}`);
        }
      }
      
      console.log('Purchase successful:', responseData);
      setPurchaseSuccess(true);
      
      // Navigate to confirmation screen after a short delay
      setTimeout(() => {
        setBottomSheetVisible(false);
        setIsProcessing(false);
        setPurchaseSuccess(false);
        
        router.push({
          pathname: '/invest/confirmation',
          params: {
            amount: formatAmount(investmentAmount || '0'),
            businessName: currentBusiness.name,
            businessId: currentBusiness.id.toString(),
            purchaseId: responseData.objectCreated?._id || 'unknown'
          }
        });
      }, 1500);
    } catch (error) {
      console.error('Error making purchase:', error);
      Alert.alert('Transaction Failed', 'Unable to process your investment. Please try again later.');
      setIsProcessing(false);
    }
  };
  
  const navigateToBusinessDetails = (business: Business) => {
    // Open the business story modal
    console.log('Opening business story modal for:', business.name);
    setSelectedBusinessForModal(business);
    setModalVisible(true);
  };

  const filteredBusinesses = (businessesWithPhotos.length > 0 ? businessesWithPhotos : businesses).filter(business => 
    business.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.screenTitle}>Invest</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#A4A4B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for businesses to invest in..."
            placeholderTextColor="#A4A4B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Featured Opportunities</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Discover high-impact businesses looking for investors like you
          </ThemedText>
        </View>
        
        {filteredBusinesses.map(business => (
          <TouchableOpacity
            key={business.id}
            style={styles.businessCard}
            onPress={() => navigateToBusinessDetails(business)}
          >
            <Image 
              source={business.photoUrl ? { uri: business.photoUrl } : business.image} 
              style={styles.businessImage}
              resizeMode="cover"
            />
            
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => {/* Toggle favorite */}}
            >
              <Ionicons 
                name={business.favorite ? "heart" : "heart-outline"} 
                size={20} 
                color={business.favorite ? "#FF4D4F" : "#fff"} 
              />
            </TouchableOpacity>
            
            <View style={styles.businessInfo}>
              <View style={styles.daysLeftContainer}>
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <ThemedText style={styles.daysLeft}>{business.daysLeft} days left</ThemedText>
              </View>
              
              <ThemedText style={styles.businessName}>{business.name}</ThemedText>
              <ThemedText style={styles.businessDescription}>{business.description}</ThemedText>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${business.progress * 100}%`, backgroundColor: PRIMARY_COLOR }
                    ]} 
                  />
                </View>
                <View style={styles.progressInfo}>
                  <ThemedText style={styles.targetAmount}>Target: ${business.target.toLocaleString()}</ThemedText>
                  <ThemedText style={styles.raisedAmount}>Raised: ${business.raised.toLocaleString()} ({Math.round(business.progress * 100)}%)</ThemedText>
                </View>
              </View>
              
              <Pressable 
                style={styles.investButton}
                onPress={(e) => { 
                  e.stopPropagation(); 
                  setCurrentBusiness(business);
                  setBottomSheetVisible(true); 
                }}
              >
                <ThemedText style={styles.investButtonText}>Invest Now</ThemedText>
              </Pressable>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Bottom Sheet for Investment */}
      <Modal
        visible={isBottomSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <TouchableOpacity 
          style={styles.bottomSheetOverlay} 
          activeOpacity={1} 
          onPress={() => setBottomSheetVisible(false)}
        >
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHandle} />
            
            <View style={styles.bottomSheetHeader}>
              <ThemedText style={styles.bottomSheetTitle}>Invest in {currentBusiness?.name || 'Project'}</ThemedText>
              <ThemedText style={styles.bottomSheetSubtitle}>
                Support local businesses and earn returns on your investment
              </ThemedText>
            </View>
            
            {/* Redesigned Investment Amount UI */}
            <View style={styles.investmentCard}>
              <View style={styles.investmentHeader}>
                <ThemedText style={styles.investmentLabel}>Investment Amount</ThemedText>
                <View style={styles.amountInputContainer}>
                  <ThemedText style={styles.currencySymbol}>$</ThemedText>
                  <TextInput
                    style={styles.amountInput}
                    value={investmentAmount}
                    onChangeText={setInvestmentAmount}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>
              </View>
              
              <View style={styles.sliderContainer}>
                <Pressable 
                  style={styles.sliderButton}
                  onPress={() => setInvestmentAmount((prev) => String(Math.max(0, Number(prev) - 100)))}
                >
                  <Ionicons name="remove" size={20} color="#FFF" />
                </Pressable>
                <View style={styles.slider}>
                  <View 
                    style={[
                      styles.sliderFill, 
                      { 
                        width: `${Math.min(100, (Number(investmentAmount) / (currentBusiness?.target || 8000)) * 100)}%` 
                      }
                    ]} 
                  />
                </View>
                <Pressable 
                  style={styles.sliderButton}
                  onPress={() => setInvestmentAmount((prev) => String(Number(prev) + 100))}
                >
                  <Ionicons name="add" size={20} color="#FFF" />
                </Pressable>
              </View>
              
              <View style={styles.quickAmountRow}>
                {[500, 1000, 2500, 5000].map((amount) => (
                  <TouchableOpacity 
                    key={amount} 
                    style={[
                      styles.quickAmountChip,
                      Number(investmentAmount) === amount && styles.quickAmountChipActive
                    ]}
                    onPress={() => setInvestmentAmount(String(amount))}
                  >
                    <ThemedText 
                      style={[
                        styles.quickAmountText,
                        Number(investmentAmount) === amount && styles.quickAmountTextActive
                      ]}
                    >
                      ${amount.toLocaleString()}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.businessSummary}>
              {currentBusiness && (
                <>
                  <View style={styles.summaryRow}>
                    <ThemedText style={styles.summaryLabel}>Business</ThemedText>
                    <ThemedText style={styles.summaryValue}>{currentBusiness.name}</ThemedText>
                  </View>
                  <View style={styles.summaryRow}>
                    <ThemedText style={styles.summaryLabel}>Target</ThemedText>
                    <ThemedText style={styles.summaryValue}>${currentBusiness.target.toLocaleString()}</ThemedText>
                  </View>
                  <View style={styles.summaryRow}>
                    <ThemedText style={styles.summaryLabel}>Progress</ThemedText>
                    <ThemedText style={styles.summaryValue}>{Math.round(currentBusiness.progress * 100)}%</ThemedText>
                  </View>
                </>
              )}
            </View>
            
            <TouchableOpacity 
              style={[
                styles.investNowButton,
                (!investmentAmount || Number(investmentAmount) <= 0) && styles.investNowButtonDisabled
              ]}
              onPress={makePurchase}
              disabled={!investmentAmount || Number(investmentAmount) <= 0 || isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <ThemedText style={styles.investNowButtonText}>
                  {purchaseSuccess ? 'Investment Successful!' : 'Confirm Investment'}
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* Business Story Modal */}
      {selectedBusinessForModal && (
        <BusinessStoryModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          businessId={selectedBusinessForModal.id}
          businessName={selectedBusinessForModal.name}
          onInvest={() => {
            setModalVisible(false);
            setCurrentBusiness(selectedBusinessForModal);
            setInvestmentAmount('');
            setBottomSheetVisible(true);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  businessCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  businessImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessInfo: {
    padding: 16,
  },
  daysLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  daysLeft: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  businessDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F5F5F7',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  targetAmount: {
    fontSize: 14,
    color: '#6B7280',
  },
  raisedAmount: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  investButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 12,
  },
  investButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  bottomSheetHeader: {
    marginBottom: 24,
  },
  bottomSheetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    textAlign: 'center',
    marginBottom: 8,
  },
  bottomSheetSubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  // Redesigned Investment Amount UI
  investmentCard: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  investmentHeader: {
    marginBottom: 16,
  },
  investmentLabel: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_COLOR,
    paddingBottom: 8,
  },
  currencySymbol: {
    fontSize: 25,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginRight: 4,
    marginTop: 5,
  },
  amountInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    flex: 1,
    padding: 0,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  sliderFill: {
    height: 8,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 4,
  },
  quickAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#EDF2F7',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickAmountChipActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  quickAmountText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '600',
  },
  quickAmountTextActive: {
    color: '#FFF',
  },
  
  // Business Summary
  businessSummary: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#718096',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  
  // Invest Now Button
  investNowButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  investNowButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  investNowButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
