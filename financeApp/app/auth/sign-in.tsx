import { View, StyleSheet } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPress = async () => {
    if (!isLoaded) return;
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      console.error('Error:', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign In' }} />
      
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          onChangeText={setEmailAddress}
          style={styles.input}
        />
        
        <TextInput
          value={password}
          placeholder="Password..."
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />

        <Button onPress={onSignInPress} title="Sign In" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    gap: 20,
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});
