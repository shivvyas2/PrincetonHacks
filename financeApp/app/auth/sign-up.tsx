import { View, StyleSheet, Alert } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Stack, useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
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

    try {
      // Remove lastName parameter which is causing issues
      await signUp.create({
        emailAddress,
        password,
        firstName: fullname,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error('Error:', err.message);
      Alert.alert("Signup Error", err.message);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      console.error('Error:', err.message);
      Alert.alert("Verification Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false,
      }} />
      
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Sign Up for free</ThemedText>
        <ThemedText style={styles.subtitle}>
          Let's get started! Create your Impact Invest account to begin your journey toward impactful investing.
        </ThemedText>
      </View>

      {!pendingVerification ? (
        <View style={styles.form}>
          <TextInput
            value={fullname}
            placeholder="Full name"
            onChangeText={setFullname}
            style={styles.input}
          />
          
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email address"
            onChangeText={setEmailAddress}
            style={styles.input}
          />
          
          <TextInput
            value={password}
            placeholder="Password (8+ chars, include A-Z, a-z, 0-9)"
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
          />

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
              <ThemedText style={styles.link}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.form}>
          <ThemedText style={styles.verificationText}>
            We've sent a verification code to your email address. Please enter it below.
          </ThemedText>
          
          <TextInput
            value={code}
            placeholder="Verification code"
            onChangeText={setCode}
            style={styles.input}
          />
          
          <TouchableOpacity 
            style={styles.button}
            onPress={onVerifyPress}
          >
            <ThemedText style={styles.buttonText}>Verify Email</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7C3AED',
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
    color: '#7C3AED',
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
  verificationText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#6B7280',
  },
});
