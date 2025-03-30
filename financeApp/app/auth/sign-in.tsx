import { View, StyleSheet, TouchableOpacity, ImageBackground, Alert, KeyboardAvoidingView, ScrollView, Platform, Image, Text } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Stack, useRouter } from 'expo-router';
import { TextInput } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color
const ACCENT_COLOR = '#3A6491'; // Medium blue as accent

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const onSignInPress = async () => {
    if (!isLoaded) return;
    try {
      // Use the correct parameters expected by Clerk
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      
      // Check if the sign-in was successful before setting the active session
      if (completeSignIn.status === 'complete') {
        await setActive({ session: completeSignIn.createdSessionId });
      } else {
        // If 2FA or another verification method is required
        // This handles any additional steps that might be required
        console.log("Additional verification needed:", completeSignIn.status);
      }
    } catch (err: any) {
      console.error('Error:', err.message);
      Alert.alert("Sign In Error", err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Background with waves */}
      <ImageBackground 
        source={require('../../assets/images/purple-waves.png')} 
        style={styles.backgroundImage}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
      
      {/* Form Container */}
      <ScrollView 
        style={styles.formContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Let's get started! Create your Impact Invest account to begin your journey toward impactful investing.
        </Text>
        
        {/* Email Input */}
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
        
        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={PRIMARY_COLOR} />
          </View>
          <TextInput
            value={password}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!passwordVisible}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons 
              name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color={PRIMARY_COLOR} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Remember Me and Forgot Password */}
        <View style={styles.rememberForgotContainer}>
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }]}>
              {rememberMe && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <ThemedText style={styles.rememberText}>Remember me</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        
        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={onSignInPress}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        {/* Terms of Service */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>By sign in, you agree to our </Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}> & </Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.termsText}>. We take your data security seriously.</Text>
        </View>
        
        {/* Terms Checkbox */}
        <View style={styles.termsCheckboxContainer}>
          <View style={[styles.checkbox, styles.checkboxChecked]}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <ThemedText style={styles.termsCheckboxText}>
            I agree to the Terms and Privacy Policy
          </ThemedText>
        </View>
        
        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/auth/sign-up')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Add bottom padding for better scrolling experience with keyboard */}
        <View style={{ paddingBottom: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: '100%',
    height: '35%',
    backgroundColor: PRIMARY_COLOR,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    height: 56,
  },
  iconContainer: {
    padding: 10,
    width: 40,
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  eyeIconImage: {
    width: 20,
    height: 20,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  checkmarkIcon: {
    width: 16,
    height: 16,
  },
  rememberText: {
    fontSize: 14,
    color: '#666',
  },
  forgotPassword: {
    color: PRIMARY_COLOR,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 30,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
  },
  linkText: {
    fontSize: 12,
    color: ACCENT_COLOR,
    fontWeight: '500',
  },
  termsCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  termsCheckboxText: {
    fontSize: 12,
    color: '#666',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#666',
  },
  signUpLink: {
    fontSize: 14,
    color: ACCENT_COLOR,
    fontWeight: 'bold',
  },
});

