import { View, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// App theme color
const PRIMARY_COLOR = '#479fd7';

// Business interface
interface TeamMember {
  name: string;
  role: string;
}

interface BusinessData {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  image: any;
  target: number;
  raised: number;
  daysLeft: number;
  progress: number;
  favorite: boolean;
  category: string;
  location: string;
  team: TeamMember[];
  impact: string;
  minimumInvestment: number;
}

// Mocked business data - in a real app this would be fetched from API
const businesses: Record<string, BusinessData> = {
  '1': {
    id: 1,
    name: "Eco-Friendly Packaging Solutions",
    description: "Help reduce plastic waste with biodegradable packaging alternatives. Our sustainable packaging is made from plant-based materials that decompose naturally without harming the environment.",
    longDescription: "Eco-Friendly Packaging Solutions is dedicated to creating innovative, sustainable packaging alternatives that reduce environmental impact while providing effective protection for products. Our materials are sourced from renewable resources and manufactured using processes that minimize carbon emissions.\n\nBy investing in our company, you're supporting the development of biodegradable packaging that helps reduce the 300 million tons of plastic waste generated globally each year. Our solutions have been proven to reduce packaging waste by up to 70% compared to traditional plastic packaging.",
    image: require("@/assets/images/Center Content.png"),
    target: 15000,
    raised: 8800,
    daysLeft: 18,
    progress: 0.72, // 72%
    favorite: false,
    category: "Environmental",
    location: "London, UK",
    team: [
      { name: "Sarah Johnson", role: "Founder & CEO" },
      { name: "David Chen", role: "Head of R&D" },
    ],
    impact: "Reduces plastic waste by 70%",
    minimumInvestment: 50
  },
  '2': {
    id: 2,
    name: "Planting Trees for a Greener Tomorrow",
    description: "Help reforest areas devastated by deforestation, combat climate change.",
    longDescription: "Our reforestation initiative focuses on planting native tree species in areas that have suffered from deforestation. We work with local communities to ensure sustainable forest management and create jobs while fighting climate change through carbon sequestration.",
    image: require("@/assets/images/Center Content2.png"),
    target: 10000,
    raised: 7250,
    daysLeft: 15,
    progress: 0.79, // 79%
    favorite: true,
    category: "Environmental",
    location: "Brazil",
    team: [
      { name: "Carlos Mendez", role: "Project Director" },
      { name: "Elena Silva", role: "Community Outreach" },
    ],
    impact: "Each £10 plants 5 trees",
    minimumInvestment: 10
  }
};

export default function BusinessDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [investmentAmount, setInvestmentAmount] = useState('100');
  
  // Convert id to string for lookup
  const businessId = typeof id === 'string' ? id : '1';
  
  // Get business data or use default
  const business = businesses[businessId] || businesses['1'];

  const handleInvest = () => {
    // Navigate to payment screen with investment amount
    router.push({
      pathname: '/invest/payment',
      params: { 
        businessId: business.id.toString(),
        amount: investmentAmount 
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Investment Details',
          headerShown: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image 
          source={business.image}
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
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
        
        <View style={styles.contentContainer}>
          <View style={styles.daysLeftContainer}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <ThemedText style={styles.daysLeft}>{business.daysLeft} days left</ThemedText>
          </View>
          
          <ThemedText style={styles.businessName}>{business.name}</ThemedText>
          
          <View style={styles.businessMetaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color={PRIMARY_COLOR} />
              <ThemedText style={styles.metaText}>{business.location}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={16} color={PRIMARY_COLOR} />
              <ThemedText style={styles.metaText}>{business.category}</ThemedText>
            </View>
          </View>
          
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
          
          <ThemedText style={styles.sectionTitle}>About the Project</ThemedText>
          <ThemedText style={styles.description}>{business.longDescription}</ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Impact</ThemedText>
          <View style={styles.impactContainer}>
            <Ionicons name="leaf-outline" size={24} color={PRIMARY_COLOR} />
            <ThemedText style={styles.impactText}>{business.impact}</ThemedText>
          </View>
          
          <ThemedText style={styles.sectionTitle}>Minimum Investment</ThemedText>
          <ThemedText style={styles.minimumText}>£{business.minimumInvestment}</ThemedText>
          
          <ThemedText style={styles.sectionTitle}>Team</ThemedText>
          {business.team.map((member: TeamMember, index: number) => (
            <View key={index} style={styles.teamMember}>
              <View style={styles.teamMemberIcon}>
                <Ionicons name="person-outline" size={18} color={PRIMARY_COLOR} />
              </View>
              <View>
                <ThemedText style={styles.teamMemberName}>{member.name}</ThemedText>
                <ThemedText style={styles.teamMemberRole}>{member.role}</ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <View style={styles.investmentInputContainer}>
          <ThemedText style={styles.investmentLabel}>Investment Amount</ThemedText>
          <View style={styles.inputWrapper}>
            <ThemedText style={styles.currencySymbol}>£</ThemedText>
            <TextInput
              style={styles.investmentInput}
              value={investmentAmount}
              onChangeText={setInvestmentAmount}
              keyboardType="numeric"
              placeholder="100"
            />
          </View>
        </View>
        <TouchableOpacity 
          style={styles.investButton}
          onPress={handleInvest}
        >
          <ThemedText style={styles.investButtonText}>Invest Now</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  businessMetaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  progressBarContainer: {
    marginBottom: 24,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 16,
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  impactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  minimumText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamMemberIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamMemberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  teamMemberRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  investmentInputContainer: {
    flex: 1,
    marginRight: 12,
  },
  investmentLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 4,
  },
  investmentInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  investButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  investButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
