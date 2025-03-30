import { View, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { fetchBusinesses, fetchBusinessesByCategory, toggleFavorite } from '@/services/api';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color
const ACCENT_COLOR = '#3A6491'; // Medium blue as accent

// Screen dimensions
const { height } = Dimensions.get('window');

// Category data
const categories = [
  { id: 'all', name: 'All', active: true },
  { id: 'cafe', name: 'Cafe', icon: 'leaf-outline' as const, active: false },
  { id: 'social', name: 'Social Welfare', icon: 'people-outline' as const, active: false },
];

// Business interface
interface Business {
  _id: string;
  id: string;
  name: string;
  description: string;
  image: string;
  amount: number;
  daysLeft: number;
  progress: number;
  favorite: boolean;
  category: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

// Investment metrics interface
interface InvestmentMetrics {
  totalInvested: number;
  totalImpact: number;
  businessesSupported: number;
  monthlyGrowth: number;
}

export default function HomeScreen() {
  const { isSignedIn, sessionId } = useAuth();
  const { user } = useUser();
  const [investment, setInvestment] = useState('$2,400');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [businessList, setBusinessList] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investmentMetrics, setInvestmentMetrics] = useState<InvestmentMetrics>({
    totalInvested: 2400,
    totalImpact: 1200,
    businessesSupported: 6,
    monthlyGrowth: 8.5
  });
  
  // Get user name from Clerk
  const userName = user ? 
    (user.firstName || user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0] || "Finance User") : 
    "Finance User";
  
  // Get user avatar from Clerk
  const userAvatar = user?.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  // Bottom sheet reference
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Bottom sheet snap points (50%, 70%, 80% of screen height)
  const snapPoints = useMemo(() => ['50%', '70%', '80%'], []);
  
  // Handle bottom sheet changes
  const handleSheetChanges = useCallback((index: number) => {
    console.log('Bottom sheet index changed:', index);
  }, []);
  
  // Handle sheet position exceeding max height
  const handleAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      // If trying to go beyond the highest snap point (index 2 which is 80%)
      if (toIndex > 2) {
        // Force snap to the highest allowed point (80%)
        bottomSheetRef.current?.snapToIndex(1);
        return false;
      }
      return true;
    },
    []
  );
  
  useEffect(() => {
    if (isSignedIn) {
      loadBusinesses();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      loadBusinessesByCategory(selectedCategory);
    }
  }, [selectedCategory, isSignedIn]);

  const loadBusinesses = async () => {
    if (!user?.id) {
      console.log('User not authenticated');
      return;
    }
    
    setLoading(true);
    try {
      const data = await fetchBusinesses(user?.id);
      setBusinessList(data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  const loadBusinessesByCategory = async (category: string) => {
    if (!user?.id) {
      console.log('User not authenticated');
      return;
    }
    
    if (category === 'all') {
      loadBusinesses();
      return;
    }
    
    setLoading(true);
    try {
      const data = await fetchBusinessesByCategory(category, user?.id);
      setBusinessList(data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(`Failed to load ${category} businesses`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    if (!user?.id) {
      console.log('User not authenticated');
      return;
    }
    
    try {
      await toggleFavorite(id, user.id);
      // Update the business list to reflect the change
      setBusinessList(prevList =>
        prevList.map(business =>
          business.id === id
            ? { ...business, favorite: !business.favorite }
            : business
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image source={{ uri: userAvatar }} style={styles.userAvatar} />
            <View>
              <ThemedText style={styles.greeting}>Good morning</ThemedText>
              <ThemedText style={styles.userName}>{userName}!</ThemedText>
            </View>
          </View>
          <View style={styles.notificationBadge}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
         
          {/* Investment Card */}
          <View style={styles.investmentCard}>
            <View style={styles.investmentCardHeader}>
              <ThemedText style={styles.investmentLabel}>Your Investment</ThemedText>
              
            </View>
            
            <ThemedText style={styles.investmentAmount}>{investment}</ThemedText>
            
            <View style={styles.investmentGrowthContainer}>
              <View style={styles.growthBadge}>
                <Ionicons name="trending-up" size={16} color="#fff" />
                <ThemedText style={styles.growthText}>+{investmentMetrics.monthlyGrowth}% this month</ThemedText>
              </View>
            </View>
            
            <View style={styles.metricsContainer}>
              <View style={styles.metricItem}>
                <ThemedText style={styles.metricValue}>{investmentMetrics.businessesSupported}</ThemedText>
                <ThemedText style={styles.metricLabel}>Businesses</ThemedText>
              </View>
              
              <View style={styles.metricDivider} />
              
              <View style={styles.metricItem}>
                <ThemedText style={styles.metricValue}>${investmentMetrics.totalImpact}</ThemedText>
                <ThemedText style={styles.metricLabel}>Impact</ThemedText>
              </View>
            </View>
          </View>
          
          {/* Empty space for bottom sheet */}
          <View style={styles.bottomSheetPlaceholder} />
        </ScrollView>
        
        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          handleIndicatorStyle={styles.bottomSheetIndicator}
          handleStyle={styles.bottomSheetHandle}
          backgroundStyle={styles.bottomSheetBackground}
          enableContentPanningGesture={true}
          enableHandlePanningGesture={true}
          keyboardBehavior="extend"
          android_keyboardInputMode="adjustResize"
          enableOverDrag={false}
          enablePanDownToClose={false}
          animateOnMount
          onAnimate={handleAnimate}
        >
          <View style={styles.bottomSheetHeader}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Discover Small Business</ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.viewAll}>View All</ThemedText>
              </TouchableOpacity>
            </View>
            
            {/* Categories */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {categories.map((category) => (
                <TouchableOpacity 
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.activeCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  {category.icon && (
                    <Ionicons 
                      name={category.icon} 
                      size={16} 
                      color={selectedCategory === category.id ? "#fff" : PRIMARY_COLOR} 
                    />
                  )}
                  <ThemedText 
                    style={[
                      styles.categoryText,
                      selectedCategory === category.id && styles.activeCategoryText
                    ]}
                  >
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Scrollable content inside bottom sheet */}
          <BottomSheetScrollView contentContainerStyle={styles.businessCardsContainer}>
            {/* Business Cards */}
            <View style={styles.businessCards}>
              {loading ? (
                <ThemedText style={styles.loadingText}>Loading...</ThemedText>
              ) : error ? (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              ) : (
                businessList.map((business) => (
                  <View key={business._id} style={styles.businessCard}>
                    <View style={styles.businessImageContainer}>
                      <Image 
                        source={{ uri: business.image }}
                        style={styles.businessImage} 
                        resizeMode="cover"
                      />
                      <TouchableOpacity 
                        style={styles.favoriteButton}
                        onPress={() => handleToggleFavorite(business._id)}
                      >
                        <Ionicons 
                          name={business.favorite ? "heart" : "heart-outline"} 
                          size={20} 
                          color={business.favorite ? "#f00" : "#fff"} 
                        />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.businessInfo}>
                      <ThemedText style={styles.businessName}>{business.name}</ThemedText>
                      <ThemedText style={styles.businessDescription}>{business.description}</ThemedText>
                    </View>
                    
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[styles.progressFill, { width: `${business.progress * 100}%` }]} 
                        />
                      </View>
                    </View>
                    
                    <View style={styles.businessFooter}>
                      <ThemedText style={styles.businessAmount}>
                        ${business.amount.toLocaleString()}
                      </ThemedText>
                      <ThemedText style={styles.daysLeft}>
                        {business.daysLeft} days left
                      </ThemedText>
                    </View>
                  </View>
                ))
              )}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 14,
  },
  userName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#f00',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A4A70',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
  },
  investmentCard: {
    
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  investmentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  investmentLabel: {
    color: '#ffffff',
    fontSize: 14,
  },
 
  investmentAmount: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 2,
    marginBottom: 10,
  },
  investmentGrowthContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  growthText: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  bottomSheetPlaceholder: {
    height: height * 0.4, // 40% of screen height for placeholder
  },
  bottomSheetBackground: {
    backgroundColor: '#fff',
  },
  bottomSheetHandle: {
    paddingVertical: 10,
  },
  bottomSheetIndicator: {
    backgroundColor: '#ddd',
    width: 40,
    height: 5,
  },
  bottomSheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#666',
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  categoryText: {
    color: PRIMARY_COLOR,
    marginLeft: 5,
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  businessCardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  businessCards: {
    marginBottom: 20,
  },
  businessCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  businessImageContainer: {
    position: 'relative',
    height: 180,
  },
  businessImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessInfo: {
    padding: 15,
  },
  businessName: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  businessDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  progressContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: PRIMARY_COLOR,
  },
  businessFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  businessAmount: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysLeft: {
    color: '#666',
    fontSize: 14,
  },
  loadingText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    color: '#f00',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

