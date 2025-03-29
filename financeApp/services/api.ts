import Constants from 'expo-constants';

// Get the local IP address from Expo's manifest
const manifestProp = Constants.manifest2?.extra?.expoClient?.hostUri;
const localIp = manifestProp ? manifestProp.split(':')[0] : '10.29.251.136';

const API_URL = `http://${localIp}:5000/api`;

export const fetchBusinesses = async () => {
  try {
    console.log('Fetching from:', `${API_URL}/businesses`); // Debug log
    const response = await fetch(`${API_URL}/businesses`);
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

export const fetchBusinessesByCategory = async (category: string) => {
  try {
    const response = await fetch(`${API_URL}/businesses/category/${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch businesses by category');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching businesses by category:', error);
    throw error;
  }
};

export const toggleFavorite = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/businesses/${id}/favorite`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to toggle favorite status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}; 