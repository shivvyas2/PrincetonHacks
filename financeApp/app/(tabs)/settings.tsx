import { View, StyleSheet, SafeAreaView, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color
const ACCENT_COLOR = '#3A6491'; // Medium blue as accent

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);

  // Load user preferences when component mounts
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const storedIsBusinessOwner = await AsyncStorage.getItem('isBusinessOwner');
        if (storedIsBusinessOwner !== null) {
          setIsBusinessOwner(storedIsBusinessOwner === 'true');
        }
      } catch (error) {
        console.error('Error loading user preferences:', error);
      }
    };

    loadUserPreferences();
  }, []);

  // Save business owner status when it changes
  const handleBusinessOwnerToggle = async (value: boolean) => {
    setIsBusinessOwner(value);
    try {
      await AsyncStorage.setItem('isBusinessOwner', value.toString());
      
      // Show feedback to the user about the mode change
      Alert.alert(
        value ? "Business Owner Mode Activated" : "Investor Mode Activated",
        value 
          ? "You'll now see the app from a business owner's perspective." 
          : "You'll now see the app from an investor's perspective.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error('Error saving business owner status:', error);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear any session-related data from AsyncStorage
              await AsyncStorage.multiRemove([
                'hasSeenOnboarding',
                'hasSignedUpBefore'
              ]);
              
              // Sign out the user
              await signOut();
              
              // Explicitly redirect to sign-in page
              router.replace('/auth/sign-in');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with dark blue background */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* White background section with rounded corners */}
        <View style={styles.whiteSection}>
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>
            
            <View style={styles.settingsCard}>
              <TouchableOpacity 
                style={styles.settingsItem}
                onPress={() => router.push('/(stack)/settings/personal-info')}
              >
                <View style={styles.settingIconContainer}>
                  <Ionicons name="person-outline" size={22} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.settingContent}>
                  <ThemedText style={styles.settingTitle}>Personal Information</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#A4A4B8" />
              </TouchableOpacity>
              
              <View style={styles.divider} />
              
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="card-outline" size={22} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.settingContent}>
                  <ThemedText style={styles.settingTitle}>Payment Methods</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#A4A4B8" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
            
            <View style={styles.settingsCard}>
              <View style={styles.settingsItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="notifications-outline" size={22} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.settingContent}>
                  <ThemedText style={styles.settingTitle}>Notifications</ThemedText>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#E5E5E5', true: ACCENT_COLOR }}
                  thumbColor="#fff"
                />
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.settingsItem}>
                <View style={styles.settingIconContainer}>
                  <Ionicons name="business-outline" size={22} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.settingContent}>
                  <ThemedText style={styles.settingTitle}>Business Owner Mode</ThemedText>
                  <ThemedText style={styles.settingDescription}>
                    {isBusinessOwner 
                      ? "View the app as a business owner" 
                      : "View the app as an investor"}
                  </ThemedText>
                </View>
                <Switch
                  value={isBusinessOwner}
                  onValueChange={handleBusinessOwnerToggle}
                  trackColor={{ false: '#E5E5E5', true: ACCENT_COLOR }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" style={styles.signOutIcon} />
            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
          </TouchableOpacity>
          
          {/* Add some bottom padding for better scrolling experience */}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: PRIMARY_COLOR,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  whiteSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 25,
    flex: 1,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 10,
    marginLeft: 5,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 58, 95, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
  },
  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 30,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 10,
    padding: 25,
  },
  signOutIcon: {
    marginRight: 10,
  },
  signOutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 40,
  },
});

