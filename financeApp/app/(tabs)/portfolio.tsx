import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { getBusinessPhotoUrl, isUnsplashApiConfigured } from '@/services/unsplashApi';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color
const ACCENT_COLOR = '#3A6491'; // Medium blue as accent
const SECONDARY_COLOR = '#1E3A5F'; // Updated to match theme

// Profit sharing strategy
const PROFIT_SHARING_PERCENTAGE = 0.25; // 25% of profits go to investors
const PROFIT_DISTRIBUTION_THRESHOLD = 1000; // Minimum profit before distribution

// Define the type for business with photoUrl as string | null
interface Business {
  id: number;
  name: string;
  location: string;
  image: any;
  photoUrl: string | null;
  investedAmount: number;
  progress: number;
  returnAmount: number;
  returnPercentage: number;
  date: string;
  latitude: number;
  longitude: number;
}

// Mock data for local businesses
const localBusinesses: Business[] = [
  {
    id: 1,
    name: "Small World Coffee",
    location: "Princeton, NJ",
    image: require("@/assets/images/Center Content.png"),
    photoUrl: null,
    investedAmount: 5750,
    progress: 0.72,
    returnAmount: 632,
    returnPercentage: 11.0,
    date: "February 12, 2025",
    latitude: 40.3500,
    longitude: -74.6590
  },
  {
    id: 2,
    name: "Labyrinth Books",
    location: "Princeton, NJ",
    image: require("@/assets/images/Center Content2.png"),
    photoUrl: null,
    investedAmount: 7800,
    progress: 0.98,
    returnAmount: 975,
    returnPercentage: 12.5,
    date: "January 5, 2025",
    latitude: 40.3507,
    longitude: -74.6595
  },
  {
    id: 3,
    name: "Triumph Brewing Company",
    location: "Princeton, NJ",
    image: require("@/assets/images/Center Content.png"),
    photoUrl: null,
    investedAmount: 6500,
    progress: 0.81,
    returnAmount: 845,
    returnPercentage: 13.0,
    date: "March 1, 2025",
    latitude: 40.3505,
    longitude: -74.6600
  },
  {
    id: 4,
    name: "Jammin' Crepes",
    location: "Princeton, NJ",
    image: require("@/assets/images/Center Content2.png"),
    photoUrl: null,
    investedAmount: 4200,
    progress: 0.53,
    returnAmount: 378,
    returnPercentage: 9.0,
    date: "March 15, 2025",
    latitude: 40.3510,
    longitude: -74.6585
  },
  {
    id: 5,
    name: "Princeton Record Exchange",
    location: "Princeton, NJ",
    image: require("@/assets/images/Center Content.png"),
    photoUrl: null,
    investedAmount: 8000,
    progress: 1.0,
    returnAmount: 1200,
    returnPercentage: 15.0,
    date: "December 10, 2024",
    latitude: 40.3503,
    longitude: -74.6598
  },
  {
    id: 6,
    name: "Bent Spoon",
    location: "Princeton, NJ",
    image: require("@/assets/images/Center Content2.png"),
    photoUrl: null,
    investedAmount: 7250,
    progress: 0.91,
    returnAmount: 870,
    returnPercentage: 12.0,
    date: "January 20, 2025",
    latitude: 40.3508,
    longitude: -74.6592
  }
];

// Calculate portfolio totals
const calculatePortfolioTotals = () => {
  const totalInvestment = localBusinesses.reduce((sum, business) => sum + business.investedAmount, 0);
  const totalReturn = localBusinesses.reduce((sum, business) => sum + business.returnAmount, 0);
  const profitPercentage = (totalReturn / totalInvestment) * 100;
  
  return {
    totalInvestment,
    totalReturn,
    profitPercentage: parseFloat(profitPercentage.toFixed(2))
  };
};

// Portfolio data
const portfolioData = {
  ...calculatePortfolioTotals(),
  projects: localBusinesses,
  transactions: [
    { id: 1, projectId: 1, type: "investment", amount: 5750, date: "February 12, 2025" },
    { id: 2, projectId: 2, type: "investment", amount: 7800, date: "January 5, 2025" },
    { id: 3, projectId: 5, type: "investment", amount: 8000, date: "March 15, 2025" }
  ],
  chartData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [
          32000,
          34500,
          36000,
          38000,
          39500,
          41000
        ],
        color: (opacity = 1) => `rgba(71, 159, 215, ${opacity})`, // PRIMARY_COLOR with opacity
        strokeWidth: 2
      }
    ],
    legend: ["Portfolio Value"]
  }
};

export default function PortfolioScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('performance');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('1Y');
  const [businessesWithPhotos, setBusinessesWithPhotos] = useState<Business[]>([...localBusinesses]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [profit, setProfit] = useState(1200); // example profit
  const [investmentDate, setInvestmentDate] = useState(new Date('2025-01-01'));
  
  // Platform-specific adjustments
  const isAndroid = Platform.OS === 'android';
  const androidTopPadding = isAndroid ? 16 : 0;

  const handleWithdraw = () => {
    console.log('Withdrawal initiated');
    // Navigate to index tab instead of withdraw page
    router.push('/(tabs)');
  };

  // Load business photos from Unsplash API
  useEffect(() => {
    const loadBusinessPhotos = async () => {
      try {
        // Create a copy of businesses to update with photos
        const updatedBusinesses = [...localBusinesses];
        
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
        setIsLoadingPhotos(false);
      } catch (error) {
        console.error('Error loading business photos:', error);
        setIsLoadingPhotos(false);
      }
    };
    
    loadBusinessPhotos();
  }, []);
  
  // Format currency
  const formatCurrency = (amount: number): string => `$${amount.toLocaleString()}`;
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(71, 159, 215, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: PRIMARY_COLOR
    }
  };
  
  // Screen width for chart
  const screenWidth = Dimensions.get("window").width - 40; // -40 for padding
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: androidTopPadding }]}>
      {/* Header */}
    
      {/* Portfolio Summary Card */}
      <View style={styles.summaryCard}>
      
        <View style={styles.totalInvestment}>
          <ThemedText style={styles.totalInvestmentLabel}>Total Investment ({localBusinesses.length} Projects)</ThemedText>
          <ThemedText style={styles.totalInvestmentValue}>{formatCurrency(portfolioData.totalInvestment)}</ThemedText>
          <View style={styles.profitRow}>
            <Ionicons name="trending-up" size={20} color="#00C853" />
            <ThemedText style={styles.profitText}>+{portfolioData.profitPercentage}%</ThemedText>
          </View>
        </View>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'performance' && styles.activeTab]} 
          onPress={() => setActiveTab('performance')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'performance' && styles.activeTabText]}>Performance</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]} 
          onPress={() => setActiveTab('history')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]} 
          onPress={() => setActiveTab('analytics')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>Analytics</ThemedText>
        </TouchableOpacity>
      </View>
      
      {/* Content based on active tab */}
      <ScrollView style={styles.content}>
        {activeTab === 'performance' && (
          <>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Portfolio Insight</ThemedText>
              <ThemedText style={styles.sectionSubtitle}>Track your investments and their performance in one place.</ThemedText>
            </View>
            
            {/* Chart */}
            <View style={styles.chartContainer}>
              <LineChart
                data={portfolioData.chartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
              
              <View style={styles.chartValueContainer}>
                <ThemedText style={styles.chartDate}>29 July 00:00</ThemedText>
                <ThemedText style={styles.chartValue}>${(60000).toLocaleString()}</ThemedText>
                <ThemedText style={styles.chartPercentage}>+3.4%</ThemedText>
              </View>
            </View>
            
            {/* Time filters */}
            <View style={styles.timeFilters}>
              {['1M', '3M', '6M', '9M', '1Y', '3Y'].map((filter) => (
                <TouchableOpacity 
                  key={filter}
                  style={[styles.timeFilter, selectedTimeFilter === filter && styles.activeTimeFilter]}
                  onPress={() => setSelectedTimeFilter(filter)}
                >
                  <ThemedText 
                    style={[styles.timeFilterText, selectedTimeFilter === filter && styles.activeTimeFilterText]}
                  >
                    {filter}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* My Projects */}
            <View style={styles.myProjectsHeader}>
              <ThemedText style={styles.myProjectsTitle}>My Project</ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.viewAllText}>View All</ThemedText>
              </TouchableOpacity>
            </View>
            
            {/* Project List */}
            {isLoadingPhotos ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                <ThemedText style={styles.loadingText}>Loading business photos...</ThemedText>
              </View>
            ) : (
              businessesWithPhotos.map((project) => (
                <TouchableOpacity 
                  key={project.id} 
                  style={styles.projectItem}
                >
                  <Image 
                    source={project.photoUrl ? { uri: project.photoUrl } : project.image} 
                    style={styles.projectImage} 
                    resizeMode="cover"
                  />
                  <View style={styles.projectInfo}>
                    <View style={styles.projectNameContainer}>
                      <ThemedText style={styles.projectName} numberOfLines={1}>{project.name}</ThemedText>
                      <View style={styles.projectReturn}>
                        <Ionicons name="trending-up" size={16} color="#000" />
                        <ThemedText style={[styles.projectReturnText, {color: '#111'}]}>${project.returnAmount.toLocaleString()} (+{project.returnPercentage}%)</ThemedText>
                      </View>
                    </View>
                    <View style={styles.projectProgressContainer}>
                      <View style={styles.projectProgressBar}>
                        <View 
                          style={[
                            styles.projectProgressFill, 
                            { width: `${project.progress * 100}%` }
                          ]} 
                        />
                      </View>
                      <View style={styles.projectAmounts}>
                        <ThemedText style={styles.projectInvestedAmount}>${project.investedAmount.toLocaleString()}</ThemedText>
                        <ThemedText style={styles.projectProgressPercentage}>{project.progress * 100}%</ThemedText>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
            
            <View style={styles.withdrawSection}>
              <ThemedText style={styles.withdrawSectionTitle}>Performance</ThemedText>
              <ThemedText style={styles.withdrawProfitText}>Profit: ${profit}</ThemedText>
              {profit >= 1000 && (new Date().getTime() - investmentDate.getTime()) >= 7776000000 ? (
                <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                  <ThemedText style={styles.withdrawButtonText}>Withdraw</ThemedText>
                </TouchableOpacity>
              ) : (
                <ThemedText style={styles.withdrawInfo}>Withdraw available after 3 months lock-in and minimum profit of $1000</ThemedText>
              )}
            </View>
          </>
        )}
        
        {activeTab === 'history' && (
          <>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Transaction History</ThemedText>
              <ThemedText style={styles.sectionSubtitle}>Track your investment and their performance in one place.</ThemedText>
            </View>
            
            {/* Transaction List */}
            {portfolioData.transactions.map(transaction => {
              const project = portfolioData.projects.find(p => p.id === transaction.projectId);
              if (!project) return null;
              
              let transactionColor = '#4CAF50'; // Green for investment
              
              if (transaction.type === 'withdrawal') {
                transactionColor = '#6200EE'; // Purple for withdrawal
              }
              
              return (
                <View key={transaction.id} style={styles.transactionItem}>
                  <Image source={project.image} style={styles.transactionImage} />
                  <View style={styles.transactionInfo}>
                    <ThemedText style={styles.transactionProjectName} numberOfLines={1}>{project.name}</ThemedText>
                    <ThemedText style={styles.transactionDate}> {transaction.date}</ThemedText>
                  </View>
                  <View style={styles.transactionAmount}>
                    <ThemedText 
                      style={[
                        styles.transactionAmountText, 
                        { color: '#000' }
                      ]}
                    >
                      {transaction.type === 'investment' ? '-' : '+'}${transaction.amount.toLocaleString()}
                    </ThemedText>
                    <View style={[styles.transactionTypeIndicator, { backgroundColor: transactionColor }]}>
                      <ThemedText style={[styles.transactionTypeText, {color: '#fff'}]}>{transaction.type}</ThemedText>
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        )}
        
        {activeTab === 'analytics' && (
          <>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Project Performance</ThemedText>
              <ThemedText style={styles.sectionSubtitle}>Track your investment and their performance in one place.</ThemedText>
            </View>
            
            {/* Analytics content here */}
            <View style={styles.analyticsContainer}>
              <View style={styles.analyticsCard}>
                <ThemedText style={styles.analyticsTitle}>Profit Distribution</ThemedText>
                <ThemedText style={styles.analyticsSubtitle}>When businesses generate profit:</ThemedText>
                
                <View style={styles.profitSharingInfo}>
                  <View style={styles.profitSharingItem}>
                    <View style={[styles.profitSharingIndicator, { backgroundColor: '#00C853' }]} />
                    <ThemedText style={styles.profitSharingText}>{PROFIT_SHARING_PERCENTAGE * 100}% to Investors</ThemedText>
                  </View>
                  <View style={styles.profitSharingItem}>
                    <View style={[styles.profitSharingIndicator, { backgroundColor: '#FFA000' }]} />
                    <ThemedText style={styles.profitSharingText}>{(1 - PROFIT_SHARING_PERCENTAGE) * 100}% to Business</ThemedText>
                  </View>
                </View>
                
                <ThemedText style={styles.profitThresholdText}>
                  * Profits are distributed when they exceed ${PROFIT_DISTRIBUTION_THRESHOLD.toLocaleString()}
                </ThemedText>
              </View>
              
              <View style={styles.analyticsCard}>
                <ThemedText style={styles.analyticsTitle}>Your Profit Share</ThemedText>
                <ThemedText style={styles.analyticsValue}>${(portfolioData.totalReturn * PROFIT_SHARING_PERCENTAGE).toLocaleString()}</ThemedText>
                <ThemedText style={styles.analyticsSubtitle}>Total profit share received</ThemedText>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  summaryCard: {
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  dividendsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  dividendsText: {
    color: '#fff',
    fontWeight: '600',
  },
  totalInvestment: {
    marginTop: 5,
  },
  totalInvestmentLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  totalInvestmentValue: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,
  },
  profitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  profitText: {
    color: '#4CAF50',
    fontSize: 14,
    marginLeft: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginHorizontal: 20,
  },
  tab: {
    paddingVertical: 15,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_COLOR,
  },
  tabText: {
    color: '#000',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  sectionSubtitle: {
    color: '#000',
    fontSize: 14,
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartValueContainer: {
    position: 'absolute',
    top: 40,
    right: 40,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartDate: {
    fontSize: 12,
    color: '#000',
  },
  chartValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  chartPercentage: {
    fontSize: 12,
    color: '#00C853',
  },
  timeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeFilter: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTimeFilter: {
    backgroundColor: SECONDARY_COLOR,
  },
  timeFilterText: {
    fontSize: 12,
    color: '#000',
  },
  activeTimeFilterText: {
    color: '#fff',
  },
  myProjectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  myProjectsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  viewAllText: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
  projectItem: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  projectImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  projectInfo: {
    flex: 1,
  },
  projectNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    color: '#000',
  },
  projectReturn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectReturnText: {
    fontSize: 12,
    color: '#000',
    marginLeft: 5,
  },
  projectProgressContainer: {
    marginTop: 5,
  },
  projectProgressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 5,
  },
  projectProgressFill: {
    height: '100%',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 3,
  },
  projectAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#111',
  },
  projectInvestedAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  projectProgressPercentage: {
    fontSize: 14,
    color: '#000',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionProjectName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  transactionDate: {
    fontSize: 12,
    color: '#000',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#000',
  },
  transactionTypeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  transactionTypeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  analyticsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  analyticsCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SECONDARY_COLOR,
    marginBottom: 5,
  },
  analyticsSubtitle: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  },
  profitSharingInfo: {
    marginTop: 15,
    marginBottom: 10,
  },
  profitSharingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profitSharingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  profitSharingText: {
    fontSize: 14,
    color: '#000',
  },
  profitThresholdText: {
    fontSize: 12,
    color: '#000',
    fontStyle: 'italic',
    marginTop: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#000',
    fontSize: 14,
  },
  withdrawSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  withdrawSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  withdrawProfitText: {
    fontSize: 16,
    marginBottom: 10,
  },
  withdrawButton: {
    backgroundColor: '#3A6491',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  withdrawInfo: {
    color: '#A4A4B8',
    fontSize: 12,
    marginTop: 10,
  },
});

