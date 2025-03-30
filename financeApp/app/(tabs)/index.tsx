import { View, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { fetchBusinesses, fetchBusinessesByCategory, toggleFavorite } from '@/services/api';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { knotService } from '@/services/knot';
import { mockTransactionData, Transaction, TransactionData } from '@/data/mockTransactions';
import { analyzeTransactions, generatePersonalizedReason } from '@/services/transactionAnalysis';
import { rankBusinesses } from '@/services/geminiService';
import * as WebBrowser from 'expo-web-browser';
import { Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';

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

// Business interfaces
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
  reason?: string;
  rank?: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

<<<<<<< Updated upstream
// Investment metrics interface
interface InvestmentMetrics {
  totalInvested: number;
  totalImpact: number;
  businessesSupported: number;
  monthlyGrowth: number;
}

=======
interface BusinessRecommendation {
  name: string;
  category: string;
  description: string;
  investmentAmount: number;
  potentialReturn: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  reason: string;
}

// Add merchant interface
interface KnotMerchant {
  id: number;
  name: string;
  logo: string;
  status?: string;
}

// Update Knot SDK configuration
const KNOT_CONFIG = {
  sessionId: 'test_session_123', // Test session ID
  clientId: 'a968a75c-a6e3-4128-8250-2d50eb7fe39b',  // Provided client ID
  environment: 'development',
  product: 'transaction_link',
  merchantIds: [19], // DoorDash merchant ID
  entryPoint: 'onboarding'
};

// Update API base URL to use local backend
const API_BASE_URL = 'http://10.29.251.136:3000';

>>>>>>> Stashed changes
export default function HomeScreen() {
  const { isSignedIn, sessionId } = useAuth();
  const { user } = useUser();
  const [investment, setInvestment] = useState('$2,400');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [businessList, setBusinessList] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
<<<<<<< Updated upstream
  const [investmentMetrics, setInvestmentMetrics] = useState<InvestmentMetrics>({
    totalInvested: 2400,
    totalImpact: 1200,
    businessesSupported: 6,
    monthlyGrowth: 8.5
  });
=======
  const [activeTab, setActiveTab] = useState<'knot' | 'businesses'>('businesses');
  const [isKnotAuthenticated, setIsKnotAuthenticated] = useState(false);
  const [showKnotUI, setShowKnotUI] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [knotError, setKnotError] = useState<string | null>(null);
>>>>>>> Stashed changes
  
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
      if (toIndex > 2) {
<<<<<<< Updated upstream
        // Force snap to the highest allowed point (80%)
        bottomSheetRef.current?.snapToIndex(1);
=======
        bottomSheetRef.current?.snapToIndex(2);
>>>>>>> Stashed changes
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
    try {
      setLoading(true);
      const businesses = await fetchBusinesses();
      
      // Get transaction insights
      const insights = analyzeTransactions(mockTransactionData);
      
      // Rank businesses based on user's transaction data
      const rankedBusinesses = await rankBusinesses(businesses, insights);
      
      setBusinessList(rankedBusinesses);
    } catch (err) {
      setError('Failed to load businesses');
      console.error(err);
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return '#4CAF50';
      case 'Medium': return '#FFC107';
      case 'High': return '#F44336';
      default: return '#666';
    }
  };

  // Update handleKnotLogin to handle errors better
  const handleKnotLogin = async () => {
    try {
      setKnotError(null);
      setIsSyncing(true);

      console.log('Starting Knot authentication...');
      
      // First, get the Knot SDK URL from our backend
      const response = await fetch(`${API_BASE_URL}/init-sdk`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Backend response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.details || 'Failed to initialize Knot SDK');
      }

      const data = await response.json();
      console.log('Received data from backend:', data);
      
      if (!data.url) {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response from server: missing URL');
      }

      // Log the URL before opening
      console.log('Opening Knot SDK URL:', data.url);

      // Open the Knot SDK URL in the browser
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        'financeapp://'
      );

      console.log('Auth session result:', result);

      if (result.type === 'success') {
        // Parse the URL to get the session ID and other parameters
        const urlParams = new URLSearchParams(result.url.split('?')[1]);
        const sessionId = urlParams.get('session_id');
        const status = urlParams.get('status');

        console.log('Auth URL params:', {
          sessionId,
          status,
          fullUrl: result.url
        });

        if (status === 'success' && sessionId) {
          setIsKnotAuthenticated(true);
          console.log('Authentication successful:', result.url);
          
          // Trigger initial sync
          await handleSyncTransactions();
        } else {
          console.error('Authentication failed or was cancelled:', {
            status,
            sessionId,
            url: result.url
          });
          throw new Error('Authentication failed or was cancelled');
        }
      } else {
        console.log('Authentication cancelled or failed:', result);
        setKnotError('Authentication was cancelled or failed. Please try again.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.message.includes('Network request failed')) {
        setKnotError('Cannot connect to server. Please check your internet connection and try again.');
      } else {
        setKnotError(error instanceof Error ? error.message : 'Failed to connect to DoorDash. Please try again later.');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Update handleSyncTransactions to use the deployed backend
  const handleSyncTransactions = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch(`${API_BASE_URL}/api/sync-transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantAccountId: '19', // DoorDash merchant ID
          cursor: null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to sync transactions');
      }

      const data = await response.json();
      console.log('Transactions synced:', data);
      
      // Update the UI to show the synced transactions
      if (data.transactions && data.transactions.length > 0) {
        setIsKnotAuthenticated(true);
      }
    } catch (error) {
      console.error('Error syncing transactions:', error);
      setKnotError(error instanceof Error ? error.message : 'Failed to sync transactions. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
<<<<<<< Updated upstream
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
=======
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaViewContext style={styles.container} edges={['top', 'left', 'right']}>
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
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>3</ThemedText>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#aaa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search small businesses to invest..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Investment Card */}
        <View style={styles.investmentCard}>
          <ThemedText style={styles.investmentLabel}>Your Investment</ThemedText>
          <ThemedText style={styles.investmentAmount}>{investment}</ThemedText>
>>>>>>> Stashed changes
            </View>
            
            {/* Knot Authentication Card */}
            {!isKnotAuthenticated ? (
              <View style={styles.knotAuthContainer}>
                <View style={styles.knotHeader}>
                  <Image 
                    source={{ uri: 'https://knotapi.com/favicon.ico' }} 
                    style={styles.knotIcon} 
                  />
                  <ThemedText style={styles.sectionTitle}>Connect DoorDash</ThemedText>
                </View>
                
                {knotError && (
                  <View style={styles.errorContainer}>
                    <ThemedText style={styles.errorText}>{knotError}</ThemedText>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.knotAuthButton}
                  onPress={handleKnotLogin}
                >
                  <View style={styles.knotAuthButtonContent}>
                    <Image 
                      source={{ uri: 'https://knotapi.com/favicon.ico' }} 
                      style={styles.knotAuthButtonIcon} 
                    />
                    <View style={styles.knotAuthButtonText}>
                      <ThemedText style={styles.knotAuthButtonTitle}>Connect DoorDash</ThemedText>
                      <ThemedText style={styles.knotAuthButtonSubtitle}>
                        Link your DoorDash account to view transaction insights
                      </ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={PRIMARY_COLOR} />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <ThemedText style={styles.transactionTitle}>Recent Transactions</ThemedText>
                  <TouchableOpacity 
                    style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
                    onPress={handleSyncTransactions}
                    disabled={isSyncing}
                  >
                    <Ionicons 
                      name={isSyncing ? "sync" : "sync-outline"} 
                      size={20} 
                      color={isSyncing ? "#666" : PRIMARY_COLOR} 
                    />
                    <ThemedText style={[styles.syncButtonText, isSyncing && styles.syncButtonTextDisabled]}>
                      {isSyncing ? 'Syncing...' : 'Sync'}
                </ThemedText>
              </TouchableOpacity>
                </View>

                <View style={styles.transactionList}>
                  {mockTransactionData.transactions.slice(0, 3).map((transaction: Transaction, index: number) => (
                    <View key={index} style={styles.transactionItem}>
                      <View style={styles.transactionInfo}>
                        <ThemedText style={styles.transactionName}>
                          {transaction.products[0].name}
                        </ThemedText>
                        <ThemedText style={styles.transactionDate}>
                          {new Date(transaction.datetime).toLocaleDateString()}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.transactionAmount}>
                        ${transaction.price.total.toFixed(2)}
                      </ThemedText>
                    </View>
                  ))}
                </View>

                <View style={styles.insightsContainer}>
                  <ThemedText style={styles.insightsTitle}>Spending Insights</ThemedText>
                  <View style={styles.insightsGrid}>
                    <View style={styles.insightItem}>
                      <ThemedText style={styles.insightValue}>
                        ${mockTransactionData.transactions.reduce((sum: number, t: Transaction) => sum + t.price.total, 0).toFixed(2)}
                      </ThemedText>
                      <ThemedText style={styles.insightLabel}>Total Spent</ThemedText>
                    </View>
                    <View style={styles.insightItem}>
                      <ThemedText style={styles.insightValue}>
                        {mockTransactionData.transactions.length}
                      </ThemedText>
                      <ThemedText style={styles.insightLabel}>Transactions</ThemedText>
                    </View>
                    <View style={styles.insightItem}>
                      <ThemedText style={styles.insightValue}>
                        ${(mockTransactionData.transactions.reduce((sum: number, t: Transaction) => sum + t.price.total, 0) / mockTransactionData.transactions.length).toFixed(2)}
                      </ThemedText>
                      <ThemedText style={styles.insightLabel}>Avg. Order</ThemedText>
                    </View>
                  </View>
                </View>

                <View style={styles.knotFooter}>
                  <ThemedText style={styles.knotFooterText}>
                    Powered by Knot API
                  </ThemedText>
                  <TouchableOpacity style={styles.knotSettingsButton}>
                    <ThemedText style={styles.knotSettingsText}>Settings</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
                <View style={styles.tabContainer}>
              <TouchableOpacity 
                    style={[styles.tab, activeTab === 'businesses' && styles.activeTab]}
                    onPress={() => setActiveTab('businesses')}
                  >
                    <Ionicons 
                      name="business-outline" 
                      size={20} 
                      color={activeTab === 'businesses' ? "#fff" : PRIMARY_COLOR} 
                    />
                    <ThemedText 
                style={[
                        styles.tabText,
                        activeTab === 'businesses' && styles.activeTabText
                      ]}
                    >
                      Businesses
                    </ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.tab, activeTab === 'knot' && styles.activeTab]}
                    onPress={() => setActiveTab('knot')}
                  >
                  <Ionicons 
                      name="card-outline" 
                      size={20} 
                      color={activeTab === 'knot' ? "#fff" : PRIMARY_COLOR} 
                    />
                <ThemedText 
                  style={[
                        styles.tabText,
                        activeTab === 'knot' && styles.activeTabText
                      ]}
                    >
                      Transactions
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {/* Scrollable content inside bottom sheet */}
            <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
              {activeTab === 'knot' ? (
                <View style={styles.knotSection}>
                  {!isKnotAuthenticated ? (
                    <View style={styles.knotAuthContainer}>
                      <View style={styles.knotHeader}>
                        <Image 
                          source={{ uri: 'https://knotapi.com/favicon.ico' }} 
                          style={styles.knotIcon} 
                        />
                        <ThemedText style={styles.sectionTitle}>Connect DoorDash</ThemedText>
                      </View>
                      
                      {knotError && (
                        <View style={styles.errorContainer}>
                          <ThemedText style={styles.errorText}>{knotError}</ThemedText>
                        </View>
                      )}
                      
                      <TouchableOpacity 
                        style={styles.knotAuthButton}
                        onPress={handleKnotLogin}
                      >
                        <View style={styles.knotAuthButtonContent}>
                          <Image 
                            source={{ uri: 'https://knotapi.com/favicon.ico' }} 
                            style={styles.knotAuthButtonIcon} 
                          />
                          <View style={styles.knotAuthButtonText}>
                            <ThemedText style={styles.knotAuthButtonTitle}>Connect DoorDash</ThemedText>
                            <ThemedText style={styles.knotAuthButtonSubtitle}>
                              Link your DoorDash account to view transaction insights
                            </ThemedText>
                          </View>
                          <Ionicons name="chevron-forward" size={24} color={PRIMARY_COLOR} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.transactionCard}>
                      <View style={styles.transactionHeader}>
                        <ThemedText style={styles.transactionTitle}>Recent Transactions</ThemedText>
                        <TouchableOpacity 
                          style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
                          onPress={handleSyncTransactions}
                          disabled={isSyncing}
                        >
                          <Ionicons 
                            name={isSyncing ? "sync" : "sync-outline"} 
                            size={20} 
                            color={isSyncing ? "#666" : PRIMARY_COLOR} 
                          />
                          <ThemedText style={[styles.syncButtonText, isSyncing && styles.syncButtonTextDisabled]}>
                            {isSyncing ? 'Syncing...' : 'Sync'}
                </ThemedText>
              </TouchableOpacity>
                      </View>

                      <View style={styles.transactionList}>
                        {mockTransactionData.transactions.slice(0, 3).map((transaction: Transaction, index: number) => (
                          <View key={index} style={styles.transactionItem}>
                            <View style={styles.transactionInfo}>
                              <ThemedText style={styles.transactionName}>
                                {transaction.products[0].name}
                              </ThemedText>
                              <ThemedText style={styles.transactionDate}>
                                {new Date(transaction.datetime).toLocaleDateString()}
                              </ThemedText>
                            </View>
                            <ThemedText style={styles.transactionAmount}>
                              ${transaction.price.total.toFixed(2)}
                            </ThemedText>
                          </View>
                        ))}
                      </View>

                      <View style={styles.insightsContainer}>
                        <ThemedText style={styles.insightsTitle}>Spending Insights</ThemedText>
                        <View style={styles.insightsGrid}>
                          <View style={styles.insightItem}>
                            <ThemedText style={styles.insightValue}>
                              ${mockTransactionData.transactions.reduce((sum: number, t: Transaction) => sum + t.price.total, 0).toFixed(2)}
                            </ThemedText>
                            <ThemedText style={styles.insightLabel}>Total Spent</ThemedText>
                          </View>
                          <View style={styles.insightItem}>
                            <ThemedText style={styles.insightValue}>
                              {mockTransactionData.transactions.length}
                            </ThemedText>
                            <ThemedText style={styles.insightLabel}>Transactions</ThemedText>
                          </View>
                          <View style={styles.insightItem}>
                            <ThemedText style={styles.insightValue}>
                              ${(mockTransactionData.transactions.reduce((sum: number, t: Transaction) => sum + t.price.total, 0) / mockTransactionData.transactions.length).toFixed(2)}
                            </ThemedText>
                            <ThemedText style={styles.insightLabel}>Avg. Order</ThemedText>
                          </View>
                        </View>
                      </View>

                      <View style={styles.knotFooter}>
                        <ThemedText style={styles.knotFooterText}>
                          Powered by Knot API
                        </ThemedText>
                        <TouchableOpacity style={styles.knotSettingsButton}>
                          <ThemedText style={styles.knotSettingsText}>Settings</ThemedText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
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
                          {business.reason && (
                            <ThemedText style={styles.businessReason}>{business.reason}</ThemedText>
                          )}
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
              )}
            </BottomSheetScrollView>
          </BottomSheet>
        </SafeAreaViewContext>
      </GestureHandlerRootView>
    </SafeAreaProvider>
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
<<<<<<< Updated upstream
    marginBottom: 2,
  },
  investmentLabel: {
    color: '#ffffff',
    fontSize: 14,
=======
    minHeight: 160,
    justifyContent: 'center',
  },
  investmentLabel: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 20,
>>>>>>> Stashed changes
  },
 
  investmentAmount: {
    color: '#ffffff',
<<<<<<< Updated upstream
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
=======
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 10,
    lineHeight: 45,
>>>>>>> Stashed changes
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
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  businessReason: {
    fontSize: 14,
    color: '#3A6491',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 10,
    lineHeight: 20,
  },
  knotSection: {
    padding: 20,
  },
  refreshButton: {
    backgroundColor: ACCENT_COLOR,
    padding: 8,
    borderRadius: 20,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  transactionCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  transactionCount: {
    fontSize: 12,
    color: '#666',
  },
  lastSync: {
    fontSize: 10,
    color: '#666',
    marginLeft: 8,
  },
  transactionList: {
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 10,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  insightsContainer: {
    marginTop: 15,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 2,
  },
  insightLabel: {
    fontSize: 10,
    color: '#666',
  },
  knotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  knotIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  knotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  knotFooterText: {
    fontSize: 10,
    color: '#666',
  },
  knotSettingsButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  knotSettingsText: {
    fontSize: 10,
    color: PRIMARY_COLOR,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: PRIMARY_COLOR,
  },
  tabText: {
    marginLeft: 8,
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  knotAuthContainer: {
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  knotAuthButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  knotAuthButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  knotAuthButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  knotAuthButtonText: {
    flex: 1,
  },
  knotAuthButtonTitle: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  knotAuthButtonSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  syncButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  syncButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: PRIMARY_COLOR,
  },
  syncButtonTextDisabled: {
    color: '#666',
  },
});

