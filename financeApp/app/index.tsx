import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

// This is the root index file that will be shown first when app starts
// Always redirect to onboarding screens
export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Short timeout to ensure stable navigation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner briefly
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  // Always go to onboarding, regardless of whether user has seen it before
  return <Redirect href="/onboarding" />;
}
