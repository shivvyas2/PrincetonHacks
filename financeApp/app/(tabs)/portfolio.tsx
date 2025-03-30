import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color
const ACCENT_COLOR = '#3A6491'; // Medium blue as accent
const SECONDARY_COLOR = '#1E3A5F'; // Updated to match theme

// Profit sharing strategy
const PROFIT_SHARING_PERCENTAGE = 0.25; // 25% of profits go to investors
const PROFIT_DISTRIBUTION_THRESHOLD = 1000; // Minimum profit before distribution

// Mock data
const portfolioData = {
  totalInvestment: 12565058,
  totalProfit: 1890142,
  profitPercentage: 15.04,
  projects: [
    {
      id: 1,
      name: "Eco-Friendly Packaging Solutions",
      image: require("@/assets/images/Center Content.png"),
      investedAmount: 7250,
      progress: 0.65,
      returnAmount: 22342,
      returnPercentage: 3.4,
      date: "July 19, 2023, 3:43:55 pm"
    },
    {
      id: 2,
      name: "Planting Trees for Greener Tomorrow",
      image: require("@/assets/images/Center Content2.png"),
      investedAmount: 7250,
      progress: 0.65,
      returnAmount: 22342,
      returnPercentage: 3.4,
      date: "July 19, 2023, 3:43:55 pm"
    },
    {
      id: 3,
      name: "Clean Water For All",
      image: require("@/assets/images/Center Content.png"),
      investedAmount: 7250,
      progress: 0.65,
      returnAmount: 22342,
      returnPercentage: 3.4,
      date: "July 19, 2023, 3:43:55 pm"
    }
  ],
  transactions: [
    { id: 1, projectId: 1, type: "investment", amount: 3021, date: "July 19, 2023" },
    { id: 2, projectId: 2, type: "withdrawal", amount: 3021, date: "July 19, 2023" },
    { id: 3, projectId: 3, type: "dividends", amount: 3021, date: "July 19, 2023" }
  ],
  chartData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [
          10000,
          25000,
          15000,
          30000,
          45000,
          60000
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
    
      {/* Portfolio Summary Card */}
      <View style={styles.summaryCard}>
        <TouchableOpacity style={styles.dividendsButton}>
          <ThemedText style={styles.dividendsText}>Dividends</ThemedText>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.totalInvestment}>
          <ThemedText style={styles.totalInvestmentLabel}>Total Investment (12 Projects)</ThemedText>
          <ThemedText style={styles.totalInvestmentValue}>{formatCurrency(portfolioData.totalInvestment)}</ThemedText>
          <ThemedText style={styles.profitText}>+{formatCurrency(portfolioData.totalProfit)} ({portfolioData.profitPercentage}%)</ThemedText>
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
            {portfolioData.projects.map(project => (
              <TouchableOpacity 
                key={project.id} 
                style={styles.projectItem}
              >
                <Image source={project.image} style={styles.projectImage} />
                <View style={styles.projectInfo}>
                  <View style={styles.projectNameContainer}>
                    <ThemedText style={styles.projectName} numberOfLines={1}>{project.name}</ThemedText>
                    <View style={styles.projectReturn}>
                      <Ionicons name="trending-up" size={16} color="#00C853" />
                      <ThemedText style={styles.projectReturnText}>${project.returnAmount.toLocaleString()} (+{project.returnPercentage}%)</ThemedText>
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
            ))}
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
              
              let transactionColor = '#00C853'; // Default green for investment
              
              if (transaction.type === 'withdrawal') {
                transactionColor = '#6200EE'; // Purple for withdrawal
              } else if (transaction.type === 'dividends') {
                transactionColor = '#FFA000'; // Amber for dividends
              }
              
              return (
                <View key={transaction.id} style={styles.transactionItem}>
                  <Image source={project.image} style={styles.transactionImage} />
                  <View style={styles.transactionInfo}>
                    <ThemedText style={styles.transactionProjectName} numberOfLines={1}>{project.name}</ThemedText>
                    <ThemedText style={styles.transactionDate}>{transaction.date}</ThemedText>
                  </View>
                  <View style={styles.transactionAmount}>
                    <ThemedText 
                      style={[
                        styles.transactionAmountText, 
                        { color: transactionColor }
                      ]}
                    >
                      {transaction.type === 'investment' ? '-' : '+'}${transaction.amount.toLocaleString()}
                    </ThemedText>
                    <View style={[styles.transactionTypeIndicator, { backgroundColor: transactionColor }]}>
                      <ThemedText style={styles.transactionTypeText}>{transaction.type}</ThemedText>
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
                <ThemedText style={styles.analyticsValue}>${(portfolioData.totalProfit * PROFIT_SHARING_PERCENTAGE).toLocaleString()}</ThemedText>
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
  profitText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 5,
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
    color: '#666',
  },
  activeTabText: {
    color: PRIMARY_COLOR,
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
  },
  sectionSubtitle: {
    color: '#666',
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
    color: '#666',
  },
  chartValue: {
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#666',
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
  },
  viewAllText: {
    color: SECONDARY_COLOR,
    fontSize: 14,
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
  },
  projectReturn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectReturnText: {
    fontSize: 12,
    color: '#00C853',
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
  },
  projectInvestedAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  projectProgressPercentage: {
    fontSize: 14,
    color: '#666',
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
    marginBottom: 5,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: SECONDARY_COLOR,
    marginBottom: 5,
  },
  analyticsSubtitle: {
    fontSize: 14,
    color: '#666',
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
  },
  profitThresholdText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
});
