import { View, StyleSheet, Alert, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color
const ACCENT_COLOR = '#3A6491'; // Medium blue as accent

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  
  // Code verification state for 6 digits
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  const [code4, setCode4] = useState('');
  const [code5, setCode5] = useState('');
  const [code6, setCode6] = useState('');
  
  // References for text inputs to allow focus navigation - properly typed for TextInput
  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);
  const input4Ref = useRef<TextInput>(null);
  const input5Ref = useRef<TextInput>(null);
  const input6Ref = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);
  
  const router = useRouter();

  // Password validation
  const isValidPassword = (password: string) => {
    // At least 8 characters, including at least one uppercase, one lowercase, and one number
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!isValidPassword(password)) {
      Alert.alert(
        "Password Requirements", 
        "Password must be at least 8 characters and include uppercase, lowercase, and numbers."
      );
      return;
    }

    // Generate a username if not provided
    const generatedUsername = username || `user_${Math.random().toString(36).substring(2, 10)}`;

    try {
      // Create user with emailAddress, password, and username (required by Clerk)
      await signUp.create({
        emailAddress,
        password,
        username: generatedUsername,
      });

      // Prepare email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Error:', err.message);
      Alert.alert("Signup Error", err.message);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    
    // Combine the 6 code inputs
    const completeCode = `${code1}${code2}${code3}${code4}${code5}${code6}`;
    
    if (completeCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the complete 6-digit verification code.");
      return;
    }
    
    try {
      console.log("Attempting verification with code:", completeCode);
      
      // First, attempt the verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: completeCode,
      });
      
      console.log("Verification response:", completeSignUp);
      
      // Check if verification was successful
      if (completeSignUp.status === "complete") {
        // Set the active session
        console.log("Setting active session with ID:", completeSignUp.createdSessionId);
        await setActive({ session: completeSignUp.createdSessionId });
        
        // Navigate to the home screen
        router.replace("/(tabs)");
      } else if (completeSignUp.status === "missing_requirements") {
        // Handle missing requirements
        console.log("Missing requirements:", completeSignUp.missingFields);
        
        if (completeSignUp.missingFields.includes("username")) {
          // Generate a random username and update the user
          const randomUsername = `user_${Math.random().toString(36).substring(2, 10)}`;
          
          try {
            await signUp.update({
              username: randomUsername,
            });
            
            // Try verification again
            const updatedSignUp = await signUp.attemptEmailAddressVerification({
              code: completeCode,
            });
            
            if (updatedSignUp.status === "complete") {
              await setActive({ session: updatedSignUp.createdSessionId });
              router.replace("/(tabs)");
            } else {
              Alert.alert(
                "Verification Issue", 
                "Your email was verified, but there was an issue completing your profile. Please try signing in."
              );
              router.replace("/auth/sign-in");
            }
          } catch (updateErr: any) {
            console.error("Error updating username:", updateErr);
            Alert.alert("Update Error", updateErr.message);
          }
        } else {
          Alert.alert(
            "Additional Information Required", 
            `Please complete your profile: ${completeSignUp.missingFields.join(", ")}`
          );
        }
      } else {
        console.log("Verification not complete:", completeSignUp.status);
        Alert.alert("Verification Error", "Verification was not completed successfully. Please try again.");
      }
    } catch (err: any) {
      console.error('Error during verification:', err.message);
      
      // If the error is that verification has already been completed,
      // we can still proceed to the home screen
      if (err.message.includes("already been verified")) {
        console.log("Verification was already completed, proceeding to home screen");
        
        // Simply navigate to the home screen
        // The user is likely already verified and can sign in normally
        router.replace("/auth/sign-in");
        Alert.alert(
          "Account Already Verified", 
          "Your account has already been verified. Please sign in with your credentials.",
          [{ text: "OK" }]
        );
        return;
      }
      
      Alert.alert("Verification Error", err.message);
    }
  };

  const resendCode = async () => {
    if (!isLoaded) return;
    
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Code Sent", "A new verification code has been sent to your email.");
    } catch (error) {
      console.error("Error resending code:", error);
      Alert.alert("Error", "Failed to resend verification code. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen options={{ 
        headerShown: false,
      }} />
      
      {!pendingVerification ? (
        <ScrollView 
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>Sign Up for free</ThemedText>
            <ThemedText style={styles.subtitle}>
              Let's get started! Create your Impact Invest account to begin your journey toward impactful investing.
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={20} color={PRIMARY_COLOR} />
              </View>
              <TextInput
                value={firstName}
                placeholder="First Name"
                placeholderTextColor="#999"
                onChangeText={setFirstName}
                style={styles.input}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={20} color={PRIMARY_COLOR} />
              </View>
              <TextInput
                value={lastName}
                placeholder="Last Name"
                placeholderTextColor="#999"
                onChangeText={setLastName}
                style={styles.input}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail-outline" size={20} color={PRIMARY_COLOR} />
              </View>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email Address"
                placeholderTextColor="#999"
                onChangeText={setEmailAddress}
                style={styles.input}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={PRIMARY_COLOR} />
              </View>
              <TextInput
                value={password}
                placeholder="Password (8+ chars, include A-Z, a-z, 0-9)"
                secureTextEntry
                onChangeText={setPassword}
                style={styles.input}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <Ionicons name="person-outline" size={20} color={PRIMARY_COLOR} />
              </View>
              <TextInput
                ref={usernameRef}
                value={username}
                placeholder="Username"
                placeholderTextColor="#999"
                onChangeText={setUsername}
                style={styles.input}
              />
            </View>

            <TouchableOpacity 
              style={styles.button}
              onPress={onSignUpPress}
            >
              <ThemedText style={styles.buttonText}>Create Account</ThemedText>
            </TouchableOpacity>

            <View style={styles.termsContainer}>
              <ThemedText style={styles.termsText}>By signing up you agree to our </ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.link}>Terms of Service</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.termsText}> & </ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.link}>Privacy Policy</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.loginContainer}>
              <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
              <TouchableOpacity onPress={() => router.replace('/auth/sign-in')}>
                <ThemedText style={styles.signInLink}>Sign In</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Add bottom padding for better scrolling experience with keyboard */}
          <View style={{ paddingBottom: 40 }} />
        </ScrollView>
      ) : (
        <SafeAreaView style={styles.verificationContainer}>
          {/* Header with back button and step indicator */}
          <View style={styles.verificationHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setPendingVerification(false)}
            >
              <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Security Verification</ThemedText>
            <ThemedText style={styles.stepIndicator}>Step 2 / 5</ThemedText>
          </View>
          
          {/* Main content */}
          <ScrollView 
            style={styles.verificationContent}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.verificationCard}>
              <ThemedText style={styles.verificationTitle}>Email Verification</ThemedText>
              <ThemedText style={styles.verificationDescription}>
                We've sent a 6-digit verification code to your email address to confirm your account.
              </ThemedText>

              {/* Email display section */}
              <View style={styles.emailContainer}>
                <View style={styles.emailIconContainer}>
                  <Ionicons name="mail-outline" size={24} color={PRIMARY_COLOR} />
                </View>
                <ThemedText style={styles.emailText}>{emailAddress}</ThemedText>
              </View>
              
              {/* Code entry fields */}
              <View style={styles.codeInputContainer}>
                <TextInput
                  ref={input1Ref}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={code1}
                  onChangeText={(text) => {
                    setCode1(text);
                    if (text.length === 1) {
                      input2Ref.current?.focus();
                    }
                  }}
                />
                <TextInput
                  ref={input2Ref}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={code2}
                  onChangeText={(text) => {
                    setCode2(text);
                    if (text.length === 1) {
                      input3Ref.current?.focus();
                    } else if (text.length === 0) {
                      input1Ref.current?.focus();
                    }
                  }}
                />
                <TextInput
                  ref={input3Ref}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={code3}
                  onChangeText={(text) => {
                    setCode3(text);
                    if (text.length === 1) {
                      input4Ref.current?.focus();
                    } else if (text.length === 0) {
                      input2Ref.current?.focus();
                    }
                  }}
                />
                <TextInput
                  ref={input4Ref}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={code4}
                  onChangeText={(text) => {
                    setCode4(text);
                    if (text.length === 1) {
                      input5Ref.current?.focus();
                    } else if (text.length === 0) {
                      input3Ref.current?.focus();
                    }
                  }}
                />
                <TextInput
                  ref={input5Ref}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={code5}
                  onChangeText={(text) => {
                    setCode5(text);
                    if (text.length === 1) {
                      input6Ref.current?.focus();
                    } else if (text.length === 0) {
                      input4Ref.current?.focus();
                    }
                  }}
                />
                <TextInput
                  ref={input6Ref}
                  style={styles.codeInput}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={code6}
                  onChangeText={(text) => {
                    setCode6(text);
                    if (text.length === 0) {
                      input5Ref.current?.focus();
                    }
                  }}
                />
              </View>
              
              <View style={styles.resendContainer}>
                <ThemedText style={styles.resendText}>Don't get a code? </ThemedText>
                <TouchableOpacity onPress={resendCode}>
                  <ThemedText style={styles.resendLink}>Resend Code</ThemedText>
                </TouchableOpacity>
              </View>
              
              {/* Continue button */}
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={onVerifyPress}
              >
                <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
              </TouchableOpacity>
              
              {/* Add bottom padding for better scrolling experience with keyboard */}
              <View style={{ paddingBottom: 40 }} />
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#fff',
  },
  header: {
    marginVertical: 40,
    paddingHorizontal: 20,
    marginTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  form: {
    gap: 16,
    paddingHorizontal: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#4B5563',
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  termsText: {
    color: '#6B7280',
    fontSize: 14,
  },
  link: {
    color: ACCENT_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  signInLink: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Verification Screen Styles - Lighter theme
  verificationContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  verificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    width: '100%',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
  },
  stepIndicator: {
    color: '#6B7280',
    fontSize: 14,
  },
  verificationContent: {
    flex: 1,
    padding: 0,
    width: '100%',
  },
  verificationCard: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
    textAlign: 'center',
  },
  verificationDescription: {
    color: '#6B7280',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    marginHorizontal: 8,
  },
  emailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emailText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  codeInput: {
    width: '14%',
    height: 60,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    color: '#6B7280',
    fontSize: 14,
  },
  resendLink: {
    color: ACCENT_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
