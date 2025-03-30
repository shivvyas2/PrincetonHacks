import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator,
  Animated,
  Platform,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { getBusinessPhotoUrl } from '@/services/unsplashApi';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color
const ACCENT_COLOR = '#3A6491'; // Medium blue as accent color
const { width } = Dimensions.get('window');

// Mock business story data
const businessStories = {
  "Small World Coffee": {
    videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    foundedYear: 1993,
    founder: "Jessica Durrie & Brant Cosaboom",
    story: "Small World Coffee was founded in 1993 by Jessica Durrie and Brant Cosaboom with a mission to create a community-centered coffee shop that serves exceptional coffee while supporting sustainable farming practices. Located in the heart of Princeton, Small World Coffee has become a beloved institution, known for its warm atmosphere, commitment to quality, and dedication to environmental responsibility.\n\nThe founders' passion for coffee began during their travels through coffee-growing regions, where they witnessed firsthand the impact of sustainable farming practices on both the quality of coffee and the livelihoods of farmers. This experience inspired them to create a business that would not only serve exceptional coffee but also support ethical and sustainable coffee production.",
    impact: [
      "Supports 15+ fair-trade coffee farms across South America and Africa",
      "Reduced carbon footprint by 25% through sustainable practices",
      "Diverts 95% of waste from landfills through composting and recycling",
      "Hosts community events that bring together diverse groups of people"
    ],
    milestones: [
      { year: 1993, event: "Opened first location on Nassau Street" },
      { year: 2000, event: "Began roasting their own coffee beans" },
      { year: 2006, event: "Opened second location on Witherspoon Street" },
      { year: 2012, event: "Launched sustainability initiative" },
      { year: 2018, event: "Celebrated 25th anniversary" },
      { year: 2023, event: "Joined community investment platform" }
    ]
  },
  "Labyrinth Books": {
    videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    foundedYear: 1997,
    founder: "Dorothea von Moltke & Cliff Simms",
    story: "Labyrinth Books was founded in 1997 by Dorothea von Moltke and Cliff Simms with a vision to create an independent bookstore that would serve as an intellectual hub for the Princeton community. What began as a small academic bookstore has grown into a vital cultural institution that hosts author events, supports local writers, and provides a carefully curated selection of books across all genres.\n\nThe founders believe in the power of books to transform lives and build community. Their commitment to intellectual diversity and accessibility has made Labyrinth Books a beloved destination for readers of all ages and backgrounds.",
    impact: [
      "Hosted 50+ community literacy events annually",
      "Partnered with 25 local schools for educational programs",
      "Supported over 100 local authors through book launches and events",
      "Created 15 jobs for Princeton residents"
    ],
    milestones: [
      { year: 1997, event: "Founded in New York City" },
      { year: 2005, event: "Opened Princeton location" },
      { year: 2009, event: "Expanded to current Nassau Street location" },
      { year: 2015, event: "Launched community reading program" },
      { year: 2020, event: "Developed online ordering system during pandemic" },
      { year: 2022, event: "Celebrated 25 years of independent bookselling" }
    ]
  },
  "Triumph Brewing Company": {
    videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    foundedYear: 1995,
    founder: "Adam Rechnitz",
    story: "Triumph Brewing Company was established in 1995 by Adam Rechnitz as Princeton's first and only brewpub. With a passion for craft beer and sustainable brewing practices, Triumph has become a cornerstone of Princeton's culinary scene, offering handcrafted beers paired with locally-sourced food in a historic building with industrial charm.\n\nThe founder's vision was to create not just a place to enjoy exceptional beer, but a community gathering space where people could connect over shared experiences. This philosophy has guided Triumph's growth and evolution over the years, as it continues to innovate while honoring traditional brewing methods.",
    impact: [
      "Sources 80% of ingredients from local farmers and producers",
      "Reduced water usage by 35% through innovative brewing techniques",
      "Donates spent grain to local farms for animal feed",
      "Hosts community fundraisers that have raised over $100,000 for local causes"
    ],
    milestones: [
      { year: 1995, event: "Founded in Princeton" },
      { year: 2003, event: "Expanded brewing capacity" },
      { year: 2007, event: "Opened New Hope, PA location" },
      { year: 2012, event: "Implemented sustainability initiatives" },
      { year: 2018, event: "Renovated Princeton location" },
      { year: 2023, event: "Celebrated brewing over 1,000 unique beer recipes" }
    ]
  },
  "Jammin' Crepes": {
    videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    foundedYear: 2011,
    founder: "Kathy Klockenbrink & Kim Rizk",
    story: "Jammin' Crepes began in 2011 as a farmers market stand founded by Kathy Klockenbrink and Kim Rizk, two food enthusiasts with a passion for local ingredients and zero-waste practices. What started as a weekend venture quickly grew into a beloved Princeton institution, known for its delicious crepes filled with locally-sourced, seasonal ingredients.\n\nThe founders' commitment to sustainability is evident in every aspect of the business, from the ingredients they source to their composting and recycling practices. Their mission is to create delicious food that connects people to local farms and reduces environmental impact.",
    impact: [
      "Diverted 95% of waste from landfills through composting and recycling",
      "Partners with 12 local farms for sustainable ingredients",
      "Reduced food miles by sourcing 90% of ingredients within 50 miles",
      "Created a closed-loop system with local farms for food waste"
    ],
    milestones: [
      { year: 2011, event: "Started as a farmers market stand" },
      { year: 2014, event: "Opened brick-and-mortar location on Nassau Street" },
      { year: 2016, event: "Implemented comprehensive zero-waste program" },
      { year: 2019, event: "Expanded menu to include more seasonal offerings" },
      { year: 2021, event: "Celebrated 10 years of operation" },
      { year: 2023, event: "Recognized with sustainable business award" }
    ]
  },
  "Princeton Record Exchange": {
    videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    foundedYear: 1980,
    founder: "Barry Weisfeld",
    story: "Princeton Record Exchange (PREX) was founded in 1980 by Barry Weisfeld, who started by selling records from his van before opening the iconic store that now houses over 140,000 titles. For over four decades, PREX has been a destination for music lovers from around the world, offering an expertly curated selection of new and used vinyl records, CDs, and DVDs.\n\nThe founder's passion for music and commitment to fair pricing has made PREX a beloved institution that has survived and thrived through dramatic changes in the music industry. The store's knowledgeable staff and community-oriented approach have created a space where music discovery and appreciation are celebrated.",
    impact: [
      "Reduced energy consumption by 40% through efficiency upgrades",
      "Supports 30+ local musicians through promotion and events",
      "Diverts thousands of used media items from landfills annually",
      "Created a cultural hub that attracts visitors to Princeton"
    ],
    milestones: [
      { year: 1980, event: "Founded by Barry Weisfeld" },
      { year: 1985, event: "Moved to current location on Tulane Street" },
      { year: 1998, event: "Expanded store to current size" },
      { year: 2010, event: "Celebrated 30th anniversary" },
      { year: 2020, event: "Survived pandemic through community support" },
      { year: 2023, event: "Expanded vinyl selection to meet growing demand" }
    ]
  },
  "Bent Spoon": {
    videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    foundedYear: 2004,
    founder: "Gabrielle Carbone & Matt Errico",
    story: "The Bent Spoon was founded in 2004 by Gabrielle Carbone and Matt Errico with a mission to create artisanal ice cream using organic, locally-sourced ingredients. Located in Palmer Square, this small-batch ice cream shop has gained national recognition for its innovative flavors and commitment to sustainability.\n\nThe founders' dedication to supporting local agriculture and reducing environmental impact has been central to their business model from day one. By sourcing ingredients from nearby farms and implementing eco-friendly practices, The Bent Spoon has become a model for sustainable food businesses.",
    impact: [
      "Eliminated single-use plastics from operations",
      "Sources 90% of ingredients from within 50 miles of Princeton",
      "Partners with 20+ local farms and producers",
      "Reduced water usage by 30% through efficiency measures"
    ],
    milestones: [
      { year: 2004, event: "Opened in Palmer Square" },
      { year: 2007, event: "Featured in Food & Wine magazine" },
      { year: 2012, event: "Implemented comprehensive sustainability program" },
      { year: 2015, event: "Expanded to include bakery items" },
      { year: 2019, event: "Celebrated 15th anniversary" },
      { year: 2023, event: "Recognized as one of America's best ice cream shops" }
    ]
  }
};

// Default story for businesses not in our database
const defaultStory = {
  videoUrl: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
  foundedYear: 2020,
  founder: "Local Entrepreneur",
  story: "This local business was founded with a commitment to sustainability and community impact. Through innovative practices and dedication to quality, they've grown to become an important part of Princeton's vibrant business ecosystem.",
  impact: [
    "Supporting local economy through job creation",
    "Implementing sustainable business practices",
    "Contributing to community initiatives",
    "Reducing environmental footprint"
  ],
  milestones: [
    { year: 2020, event: "Business founded" },
    { year: 2021, event: "Expanded operations" },
    { year: 2022, event: "Implemented sustainability initiatives" },
    { year: 2023, event: "Joined community investment platform" }
  ]
};

export default function BusinessStoryScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const [businessPhoto, setBusinessPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storyData, setStoryData] = useState<any>(defaultStory);
  const scrollY = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);
  
  // Load business photo
  useEffect(() => {
    const loadBusinessPhoto = async () => {
      try {
        if (name) {
          const photoUrl = await getBusinessPhotoUrl(name);
          setBusinessPhoto(photoUrl);
        }
      } catch (error) {
        console.error('Error loading business photo:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBusinessPhoto();
  }, [name]);
  
  // Load business story data
  useEffect(() => {
    if (name && businessStories[name as keyof typeof businessStories]) {
      setStoryData(businessStories[name as keyof typeof businessStories]);
    } else {
      setStoryData(defaultStory);
    }
  }, [name]);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Video Section */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: storyData.videoUrl }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={false}
          />
        </View>
        
        {/* Business Info */}
        <View style={styles.contentContainer}>
          <View style={styles.businessHeader}>
            <ThemedText style={styles.businessName}>{name}</ThemedText>
            <View style={styles.foundedInfo}>
              <ThemedText style={styles.foundedText}>Founded in {storyData.foundedYear} by {storyData.founder}</ThemedText>
            </View>
          </View>
          
          {/* Business Story */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Our Story</ThemedText>
            <ThemedText style={styles.storyText}>{storyData.story}</ThemedText>
          </View>
          
          {/* Impact Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Community Impact</ThemedText>
            <View style={styles.impactList}>
              {storyData.impact.map((impact: string, index: number) => (
                <View key={index} style={styles.impactItem}>
                  <Ionicons name="checkmark-circle" size={20} color={PRIMARY_COLOR} style={styles.impactIcon} />
                  <ThemedText style={styles.impactText}>{impact}</ThemedText>
                </View>
              ))}
            </View>
          </View>
          
          {/* Milestones */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Key Milestones</ThemedText>
            <View style={styles.timelineContainer}>
              {storyData.milestones.map((milestone: any, index: number) => (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineYearContainer}>
                    <ThemedText style={styles.timelineYear}>{milestone.year}</ThemedText>
                  </View>
                  <View style={styles.timelineConnector}>
                    <View style={styles.timelineDot} />
                    {index < storyData.milestones.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <ThemedText style={styles.timelineEvent}>{milestone.event}</ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>
          
          {/* Investment Section */}
          <View style={styles.investSection}>
            <ThemedText style={styles.investTitle}>Ready to support {name}?</ThemedText>
            <TouchableOpacity 
              style={styles.investButton}
              onPress={() => router.push(`/invest/business-details?id=${id}`)}
            >
              <ThemedText style={styles.investButtonText}>Invest Now</ThemedText>
            </TouchableOpacity>
          </View>
          
          {/* Spacer for bottom padding */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    height: 300,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  businessHeader: {
    marginBottom: 24,
  },
  businessName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  foundedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foundedText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 16,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  impactList: {
    marginTop: 8,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  impactIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  impactText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    flex: 1,
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineYearContainer: {
    width: 50,
    alignItems: 'flex-end',
    marginRight: 8,
  },
  timelineYear: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  timelineConnector: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PRIMARY_COLOR,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 8,
  },
  timelineEvent: {
    fontSize: 16,
    color: '#333',
  },
  investSection: {
    marginTop: 16,
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  investTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 16,
    textAlign: 'center',
  },
  investButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  investButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
