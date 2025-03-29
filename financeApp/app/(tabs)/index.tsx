import { View, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';

// Category data
const categories = [
  { id: 'all', name: 'All', active: true },
  { id: 'cafe', name: 'Cafe', icon: 'leaf-outline' as const, active: false },
  { id: 'social', name: 'Social Welfare', icon: 'people-outline' as const, active: false },
];

// Business data
interface Business {
  id: number;
  name: string;
  description: string;
  image: any;
  amount: number;
  daysLeft: number;
  progress: number;
  favorite: boolean;
}

const businesses: Business[] = [
  {
    id: 1,
    name: 'Business 1',
    description: 'Most sleek and innovative electric cars in the world.',
    image: require('@/assets/images/Image.png'),
    amount: 7250,
    daysLeft: 15,
    progress: 0.7,
    favorite: false,
  },
  {
    id: 2,
    name: 'Business 2',
    description: 'Most sleek and innovative tech in the world.',
    image: require('@/assets/images/Center Content.png'),
    amount: 1330,
    daysLeft: 23,
    progress: 0.4,
    favorite: false,
  },
];

export default function HomeScreen() {
  const { isSignedIn, sessionId } = useAuth();
  const [investment, setInvestment] = useState('£12,565,058');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [businessList, setBusinessList] = useState(businesses);
  
  // Placeholder user data since useAuth doesn't directly expose user info
  const userName = "Natalie Workman";
  const userAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  const toggleFavorite = (id: number) => {
    setBusinessList(businessList.map(business => 
      business.id === id ? {...business, favorite: !business.favorite} : business
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: userAvatar }}
            style={styles.userAvatar} 
          />
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
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Top Up</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-down-circle-outline" size={24} color="#fff" />
              <ThemedText style={styles.actionButtonText}>Withdraw</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Discover Section */}
        <View style={styles.discoverSection}>
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
                    color={selectedCategory === category.id ? "#fff" : "#7C3AED"} 
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

          {/* Business Cards */}
          <View style={styles.businessCards}>
            {businessList.map((business) => (
              <View key={business.id} style={styles.businessCard}>
                <View style={styles.businessImageContainer}>
                  <Image 
                    source={business.image} 
                    style={styles.businessImage} 
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(business.id)}
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
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14142B',
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
    backgroundColor: '#22223A',
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
    backgroundColor: '#6C5DD3',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    minHeight: 220,
  },
  investmentLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 15,
  },
  investmentAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 10,
    lineHeight: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 25,
  },
  actionButton: {
    backgroundColor: '#322987',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    marginLeft: 5,
    fontWeight: '500',
  },
  discoverSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#aaa',
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
    borderColor: '#7C3AED',
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#7C3AED',
  },
  categoryText: {
    color: '#7C3AED',
    marginLeft: 5,
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  businessCards: {
    marginBottom: 20,
  },
  businessCard: {
    backgroundColor: '#22223A',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
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
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  businessDescription: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 10,
  },
  progressContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
  },
  businessFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  businessAmount: {
    color: '#7C3AED',
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysLeft: {
    color: '#aaa',
    fontSize: 14,
  },
});


