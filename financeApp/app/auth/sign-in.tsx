import { View, StyleSheet, TouchableOpacity, ImageBackground, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { TextInput } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

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
          <Ionicons name="leaf" size={28} color="#fff" style={styles.logoIcon} />
          <ThemedText style={styles.logoText}>Auramax</ThemedText>
        </View>
      </ImageBackground>
      
      {/* Form Container */}
      <ScrollView 
        style={styles.formContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText style={styles.title}>Sign In</ThemedText>
        <ThemedText style={styles.subtitle}>
          Let's get started! Create your Impact Invest account to begin your journey toward impactful investing.
        </ThemedText>
        
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
            <ThemedText style={styles.forgotPassword}>Forgot Password?</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Login Button */}
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={onSignInPress}
        >
          <ThemedText style={styles.loginButtonText}>Login</ThemedText>
        </TouchableOpacity>
        
        {/* Terms of Service */}
        <View style={styles.termsContainer}>
          <ThemedText style={styles.termsText}>By sign in, you agree to our </ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.linkText}>Terms of Service</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.termsText}> & </ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.linkText}>Privacy Policy</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.termsText}>. We take your data security seriously.</ThemedText>
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
          <ThemedText style={styles.signUpText}>Don't have an account? </ThemedText>
          <TouchableOpacity onPress={() => router.replace('/auth/sign-up')}>
            <ThemedText style={styles.signUpLink}>Sign Up</ThemedText>
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
    height: 200,
    width: '100%',
    backgroundColor: PRIMARY_COLOR,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  logoIcon: {
    marginRight: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  subtitle: {
    color: '#666',
    marginBottom: 30,
    lineHeight: 22,
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
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
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
