// Google Places API service for fetching real business photos
// This uses the Places API to get actual photos of businesses

// The API key should be stored in .env file as EXPO_PUBLIC_GOOGLE_PLACES_API_KEY
const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';

// Base URLs for Google Places API
const PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Search for a place using text query with proper formatting
 * @param businessName The name of the business
 * @returns Promise with the place details including photos
 */
export const searchPlace = async (businessName: string): Promise<any> => {
  try {
    // Format the query to be more specific - this is key to getting results
    const formattedQuery = encodeURIComponent(`${businessName} in Princeton, NJ`);
    
    // Use the Places API Text Search endpoint which works better than Find Place
    const url = `${PLACES_API_BASE_URL}/textsearch/json?query=${formattedQuery}&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    console.warn(`No places found for: ${businessName} in Princeton, NJ`);
    return null;
  } catch (error) {
    console.error('Error searching for place:', error);
    return null;
  }
};

/**
 * Get photo URL for a place using photo reference
 * @param photoReference The photo reference from Places API
 * @param maxWidth The maximum width of the photo
 * @returns The URL for the photo
 */
export const getPhotoUrl = (photoReference: string, maxWidth: number = 400): string => {
  if (!photoReference) return getDefaultPhotoUrl();
  return `${PLACES_API_BASE_URL}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
};

/**
 * Get a default photo URL when no photo is available
 * @returns A default photo URL
 */
export const getDefaultPhotoUrl = (): string => {
  // Use a placeholder image from Picsum Photos
  return 'https://picsum.photos/400/300';
};

/**
 * Get a business photo URL
 * @param businessName The name of the business
 * @returns Promise with the photo URL
 */
export const getBusinessPhotoUrl = async (businessName: string): Promise<string> => {
  try {
    const place = await searchPlace(businessName);
    
    if (place && place.photos && place.photos.length > 0) {
      const photoReference = place.photos[0].photo_reference;
      return getPhotoUrl(photoReference);
    }
    
    return getDefaultPhotoUrl();
  } catch (error) {
    console.error('Error getting business photo:', error);
    return getDefaultPhotoUrl();
  }
};

/**
 * Check if the Google Places API is properly configured
 * @returns boolean indicating if the API key is available
 */
export const isPlacesApiConfigured = (): boolean => {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key is not configured. Add EXPO_PUBLIC_GOOGLE_PLACES_API_KEY to your .env file.');
    return false;
  }
  return true;
};
