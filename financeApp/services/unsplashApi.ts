// Unsplash API service for fetching high-quality business images
// This provides relevant images based on business type and name

// The API key should be stored in .env file as EXPO_PUBLIC_UNSPLASH_API_KEY
// If you don't have an Unsplash API key, you can get one at https://unsplash.com/developers
const UNSPLASH_API_KEY = process.env.EXPO_PUBLIC_UNSPLASH_API_KEY || '';

// Base URL for Unsplash API
const UNSPLASH_API_BASE_URL = 'https://api.unsplash.com';

/**
 * Search for photos based on a query
 * @param query The search query (e.g., "coffee shop")
 * @returns Promise with the photo URL or null if not found
 */
export const searchPhotos = async (query: string): Promise<string | null> => {
  try {
    // If no API key is provided, use a predefined set of image URLs
    if (!UNSPLASH_API_KEY) {
      return getDefaultImageForQuery(query);
    }

    const url = `${UNSPLASH_API_BASE_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${UNSPLASH_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    
    console.warn('No photos found for query:', query);
    return getDefaultImageForQuery(query);
  } catch (error) {
    console.error('Error searching for photos:', error);
    return getDefaultImageForQuery(query);
  }
};

/**
 * Get a business photo URL based on business type and name
 * @param businessName The name of the business
 * @returns Promise with the photo URL
 */
export const getBusinessPhotoUrl = async (businessName: string): Promise<string | null> => {
  try {
    // Extract business type from name for better search results
    const businessType = getBusinessTypeFromName(businessName);
    
    // Create a specific query for each business type
    let query = '';
    
    if (businessName.toLowerCase().includes('small world coffee')) {
      query = 'coffee shop interior princeton';
    } else if (businessName.toLowerCase().includes('labyrinth books')) {
      query = 'bookstore interior books shelves';
    } else if (businessName.toLowerCase().includes('triumph brewing')) {
      query = 'craft brewery beer restaurant';
    } else if (businessName.toLowerCase().includes('jammin') || businessName.toLowerCase().includes('crepes')) {
      query = 'crepe restaurant food';
    } else if (businessName.toLowerCase().includes('record exchange')) {
      query = 'record store vinyl music';
    } else if (businessName.toLowerCase().includes('bent spoon')) {
      query = 'ice cream shop gelato';
    } else {
      // Generic query based on business type
      query = `${businessType} business`;
    }
    
    return await searchPhotos(query);
  } catch (error) {
    console.error('Error getting business photo:', error);
    return null;
  }
};

/**
 * Extract business type from business name for better search results
 * @param businessName The name of the business
 * @returns The business type for searching
 */
const getBusinessTypeFromName = (businessName: string): string => {
  const businessNameLower = businessName.toLowerCase();
  
  if (businessNameLower.includes('coffee')) return 'coffee shop';
  if (businessNameLower.includes('book')) return 'bookstore';
  if (businessNameLower.includes('brewing') || businessNameLower.includes('brewery')) return 'brewery';
  if (businessNameLower.includes('crepe') || businessNameLower.includes('restaurant')) return 'restaurant';
  if (businessNameLower.includes('record') || businessNameLower.includes('music')) return 'record store';
  if (businessNameLower.includes('spoon') || businessNameLower.includes('ice cream')) return 'ice cream shop';
  
  // Default to generic business storefront
  return 'storefront';
};

/**
 * Get a default image URL for a business type when API key is not available
 * @param query The search query
 * @returns A default image URL
 */
const getDefaultImageForQuery = (query: string): string => {
  const queryLower = query.toLowerCase();
  
  // Predefined set of high-quality business images
  if (queryLower.includes('coffee')) {
    return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
  }
  if (queryLower.includes('bookstore')) {
    return 'https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
  }
  if (queryLower.includes('brewery')) {
    return 'https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
  }
  if (queryLower.includes('restaurant')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
  }
  if (queryLower.includes('record store')) {
    return 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
  }
  if (queryLower.includes('ice cream')) {
    return 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
  }
  
  // Default business storefront
  return 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
};

/**
 * Check if the Unsplash API is properly configured
 * @returns boolean indicating if the API key is available
 */
export const isUnsplashApiConfigured = (): boolean => {
  if (!UNSPLASH_API_KEY) {
    console.warn('Unsplash API key is not configured. Using default images.');
    return false;
  }
  return true;
};
