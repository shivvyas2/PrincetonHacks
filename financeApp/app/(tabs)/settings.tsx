import { View, StyleSheet, SafeAreaView, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

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
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="person-outline" size={22} color="#7C3AED" />
              </View>
              <View style={styles.settingContent}>
                <ThemedText style={styles.settingTitle}>Personal Information</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A4A4B8" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="card-outline" size={22} color="#7C3AED" />
              </View>
              <View style={styles.settingContent}>
                <ThemedText style={styles.settingTitle}>Payment Methods</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A4A4B8" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#7C3AED" />
              </View>
              <View style={styles.settingContent}>
                <ThemedText style={styles.settingTitle}>Security</ThemedText>
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
                <Ionicons name="notifications-outline" size={22} color="#7C3AED" />
              </View>
              <View style={styles.settingContent}>
                <ThemedText style={styles.settingTitle}>Notifications</ThemedText>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#333', true: '#7C3AED' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingsItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="moon-outline" size={22} color="#7C3AED" />
              </View>
              <View style={styles.settingContent}>
                <ThemedText style={styles.settingTitle}>Dark Mode</ThemedText>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#333', true: '#7C3AED' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingsItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="finger-print-outline" size={22} color="#7C3AED" />
              </View>
              <View style={styles.settingContent}>
                <ThemedText style={styles.settingTitle}>Biometric Authentication</ThemedText>
              </View>
              <Switch
                value={biometricsEnabled}
                onValueChange={setBiometricsEnabled}
                trackColor={{ false: '#333', true: '#7C3AED' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="information-circle-outline" size={22} color="#7C3AED" />
              </View>
              <View style={styles.settingContent}>
                <ThemedText style={styles.settingTitle}>About Impact Invest</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A4A4B8" />
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name="help-circle-outline" size={22} color="#7C3AED" />
              </View>
              <View style={styles.settingContent}>
                <ThemedText style={styles.settingTitle}>Help & Support</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A4A4B8" />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" style={styles.signOutIcon} />
          <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
        </TouchableOpacity>
        
        {/* Add some bottom padding for better scrolling experience */}
        <View style={styles.bottomPadding} />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A4A4B8',
    marginBottom: 10,
    marginLeft: 5,
  },
  settingsCard: {
    backgroundColor: '#22223A',
    borderRadius: 15,
    overflow: 'hidden',
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
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
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
    padding: 15,
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
