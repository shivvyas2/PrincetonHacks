import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color
const ACCENT_COLOR = '#3A6491'; // Medium blue as accent

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useUser();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          setFirstName(user.firstName || '');
          setLastName(user.lastName || '');
          setUsername(user.username || '');
          setEmail(user.primaryEmailAddress?.emailAddress || '');
          setPhone(user.primaryPhoneNumber?.phoneNumber || '');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Update user data in Clerk
      if (user) {
        await user.update({
          firstName,
          lastName,
          username
        });
        
        Alert.alert(
          "Success",
          "Your personal information has been updated.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert(
        "Error",
        "Failed to update your information. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* White background section with rounded corners */}
          <View style={styles.whiteSection}>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
              </View>
            ) : (
              <>
                <View style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Profile Information</ThemedText>
                  
                  <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>First Name</ThemedText>
                      <TextInput
                        style={styles.textInput}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="Enter your first name"
                        placeholderTextColor="#A4A4B8"
                      />
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Last Name</ThemedText>
                      <TextInput
                        style={styles.textInput}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Enter your last name"
                        placeholderTextColor="#A4A4B8"
                      />
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Username</ThemedText>
                      <TextInput
                        style={styles.textInput}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter your username"
                        placeholderTextColor="#A4A4B8"
                      />
                    </View>
                  </View>
                </View>
                
                <View style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Contact Information</ThemedText>
                  
                  <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
                      <TextInput
                        style={[styles.textInput, styles.disabledInput]}
                        value={email}
                        editable={false}
                      />
                      <ThemedText style={styles.helperText}>Email cannot be changed here</ThemedText>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.inputGroup}>
                      <ThemedText style={styles.inputLabel}>Phone Number</ThemedText>
                      <TextInput
                        style={[styles.textInput, styles.disabledInput]}
                        value={phone}
                        editable={false}
                      />
                      <ThemedText style={styles.helperText}>Phone cannot be changed here</ThemedText>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <ThemedText style={styles.saveButtonText}>Save Changes</ThemedText>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  whiteSection: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 16,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF',
  },
  disabledInput: {
    backgroundColor: '#F7FAFC',
    color: '#718096',
  },
  helperText: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  saveButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
