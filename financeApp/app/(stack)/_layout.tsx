import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

// App theme colors
const PRIMARY_COLOR = '#1E3A5F'; // Dark blue as primary color

export default function StackLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: PRIMARY_COLOR,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="settings/personal-info" 
        options={{ 
          title: "Personal Information",
          headerBackTitle: "Settings"
        }} 
      />
      <Stack.Screen 
        name="business/story" 
        options={{ 
          title: "Business Story",
          headerBackTitle: "Back"
        }} 
      />
    </Stack>
  );
}
