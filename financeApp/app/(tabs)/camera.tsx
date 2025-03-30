import { View, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, SafeAreaView, Modal, Pressable, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

// App theme color
const PRIMARY_COLOR = '#479fd7';

// Business interface
interface Business {
  id: number;
  name: string;
  description: string;
  image: any;
  target: number;
  raised: number;
  daysLeft: number;
  progress: number;
  favorite: boolean;
}

// Mock business data
const businesses: Business[] = [
  {
    id: 1,
    name: "Eco-Friendly Packaging Solutions",
    description: "Help reduce plastic waste with biodegradable packaging alternatives.",
    image: require("@/assets/images/Center Content.png"),
    target: 15000,
    raised: 8800,
    daysLeft: 18,
    progress: 0.59,
    favorite: false
  },
  {
    id: 2,
    name: "Planting Trees for a Greener Tomorrow",
    description: "Help reforest areas devastated by deforestation, combat climate change.",
    image: require("@/assets/images/Center Content2.png"),
    target: 10000,
    raised: 7250,
    daysLeft: 15,
    progress: 0.73,
    favorite: true
  },
  {
    id: 3,
    name: "Sustainable Urban Farming",
    description: "Supporting local food production with innovative vertical farming.",
    image: require("@/assets/images/Center Content.png"),
    target: 25000,
    raised: 12000,
    daysLeft: 30,
    progress: 0.48,
    favorite: false
  }
];

export default function InvestScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  
  const navigateToBusinessDetails = (business: Business) => {
    // Route to the business details screen with the business ID
    console.log('Navigating to business details:', business.name);
    router.push(`/invest/business-details?id=${business.id}`);
  };

  const filteredBusinesses = businesses.filter(business => 
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
              source={business.image} 
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
                  <ThemedText style={styles.targetAmount}>Target: £{business.target.toLocaleString()}</ThemedText>
                  <ThemedText style={styles.raisedAmount}>Raised: £{business.raised.toLocaleString()} ({Math.round(business.progress * 100)}%)</ThemedText>
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
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.bottomSheetContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.bottomSheetHandle} />
            
            <View style={styles.headerContainer}>
              <ThemedText style={styles.modalTitle}>Invest Project</ThemedText>
              <ThemedText style={styles.modalSubtitle} numberOfLines={2}>
                We'll ask for a security code when we need to confirm that it's you logging in.
              </ThemedText>
            </View>
            
            <ThemedText style={styles.currencyLabel}>$ USD</ThemedText>
            
            <View style={styles.amountRow}>
              <TouchableOpacity 
                style={styles.circleButton} 
                onPress={() => setInvestmentAmount((prev) => String(Math.max(0, Number(prev) - 100)))}
              >
                <Ionicons name="remove" size={24} color="black" />
              </TouchableOpacity>
              
              <View style={styles.amountContainer}>
                <View style={styles.amountDisplay}>
                  <ThemedText style={styles.dollarSign}>$</ThemedText>
                  <ThemedText style={styles.amountValue}>{investmentAmount || '0'}</ThemedText>
                </View>
                
              </View>
              
              <TouchableOpacity 
                style={styles.circleButton} 
                onPress={() => setInvestmentAmount((prev) => String(Number(prev) + 100))}
              >
                <Ionicons name="add" size={24} color="black" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentMethodContainer}>
              <Ionicons name="logo-paypal" size={24} color="#0070BA" style={styles.paymentIcon} />
              <ThemedText style={styles.paymentText} numberOfLines={1}>**** **** **** 3747</ThemedText>
              <ThemedText style={styles.paymentAmount}>$7,124</ThemedText>
              <Ionicons name="chevron-down" size={16} color="#00C853" />
            </View>
            
            <TouchableOpacity style={styles.calculatorButton}>
              <ThemedText style={styles.calculatorButtonText}>Investment Calculator</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.bottomSheetInvestButton} 
              onPress={() => {
                setBottomSheetVisible(false);
                if (currentBusiness) {
                  // Log for debugging
                  console.log('Navigating to confirmation screen with:', {
                    amount: investmentAmount || '0',
                    businessName: currentBusiness.name,
                    businessId: currentBusiness.id.toString()
                  });
                  
                  // Use push instead of router.push to ensure proper navigation
                  router.push({
                    pathname: '/invest/confirmation',
                    params: {
                      amount: investmentAmount || '0',
                      businessName: currentBusiness.name,
                      businessId: currentBusiness.id.toString()
                    }
                  });
                }
              }}
            >
              <ThemedText style={styles.bottomSheetInvestButtonText}>Invest Now</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setBottomSheetVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    position: 'relative',
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  currencyLabel: {
    fontSize: 14,
    color: '#666',
    alignSelf: 'flex-start',
    marginBottom: 15,
    marginLeft: 15,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  amountContainer: {
    alignItems: 'center',

  },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  
  },
  dollarSign: {
    fontSize: 28,
    color: '#000',
    marginRight: 5,
  },
  amountValue: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#00C853',
  },
  blueLine: {
    width: 2,
    height: 20,
    backgroundColor: '#479fd7',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  paymentIcon: {
    marginRight: 10,
  },
  paymentText: {
    flex: 1,
    fontSize: 14,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00C853',
    marginRight: 5,
  },
  calculatorButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  calculatorButtonText: {
    fontSize: 16,
    color: '#6200EE',
  },
  bottomSheetInvestButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  bottomSheetInvestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
