import Constants from 'expo-constants';

const isDevelopment = process.env.NODE_ENV === 'development';

// Get the local IP address from Expo's manifest for development
const manifestProp = Constants.manifest2?.extra?.expoClient?.hostUri;
const localIp = manifestProp ? manifestProp.split(':')[0] : '10.29.251.136';

// Use local IP in development, production URL in production
const API_URL = 'https://finance-app-backend-d3ay.onrender.com/api';

console.log('Using API URL:', API_URL); // Debug log

// Helper function to add auth headers to requests
const addAuthHeaders = (userId: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (userId) {
    // Add the Clerk user ID as an auth header
    headers['X-User-ID'] = userId;
  }
  
  return headers;
};

// Fetch user-specific data from MongoDB
export const fetchUserData = async (userId: string) => {
  try {
    console.log('Fetching user data for:', userId);
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: addAuthHeaders(userId),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    console.log('Received user data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Create or update user data in MongoDB
export const updateUserData = async (userId: string, userData: any) => {
  try {
    console.log('Updating user data for:', userId);
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: addAuthHeaders(userId),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user data');
    }
    
    const data = await response.json();
    console.log('User data updated:', data);
    return data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

export const fetchBusinesses = async (userId?: string) => {
  try {
    console.log('Fetching from:', `${API_URL}/businesses`); // Debug log
    const response = await fetch(`${API_URL}/businesses`, {
      headers: addAuthHeaders(userId || null),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch businesses');
    }
    const data = await response.json();
    console.log('Received data:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
};

export const fetchBusinessesByCategory = async (category: string, userId?: string) => {
  try {
    const response = await fetch(`${API_URL}/businesses/category/${category}`, {
      headers: addAuthHeaders(userId || null),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch businesses by category');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching businesses by category:', error);
    throw error;
  }
};

export const toggleFavorite = async (id: string, userId: string) => {
  try {
    const response = await fetch(`${API_URL}/businesses/${id}/favorite`, {
      method: 'PATCH',
      headers: addAuthHeaders(userId),
    });
    if (!response.ok) {
      throw new Error('Failed to toggle favorite status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    throw error;
  }
};