import { Stack } from 'expo-router';

export default function InvestLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="business-details" 
        options={{ 
          title: 'Business Details',
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen 
        name="payment" 
        options={{ 
          title: 'Payment',
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen 
        name="confirmation" 
        options={{ 
          title: 'Investment Confirmation',
          headerShown: false,
          gestureEnabled: false
        }} 
      />
    </Stack>
  );
}
