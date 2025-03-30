import Constants from 'expo-constants';

// Google Places API configuration
// The API key should be stored in .env file as EXPO_PUBLIC_GOOGLE_PLACES_API_KEY
const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';

// Base URLs for Google Places API
const PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';
const PLACES_PHOTO_BASE_URL = 'https://maps.googleapis.com/maps/api/place/photo';

/**
 * Search for a place using text query (business name and location)
 * @param query The search query (e.g., "Princeton Coffee House Princeton NJ")
 * @returns Promise with the search results
 */
export const searchPlace = async (query: string) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `${PLACES_API_BASE_URL}/findplacefromtext/json?input=${encodedQuery}&inputtype=textquery&fields=photos,place_id,name,formatted_address,geometry&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.candidates && data.candidates.length > 0) {
      return data.candidates[0];
    }
    
    console.warn('No places found for query:', query);
    return null;
  } catch (error) {
    console.error('Error searching for place:', error);
    return null;
  }
};

/**
 * Get place details including photos
 * @param placeId The Google Place ID
 * @returns Promise with the place details
 */
export const getPlaceDetails = async (placeId: string) => {
  try {
    const url = `${PLACES_API_BASE_URL}/details/json?place_id=${placeId}&fields=name,photos,formatted_address,geometry&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      return data.result;
    }
    
    console.warn('No place details found for place ID:', placeId);
    return null;
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
};

/**
 * Get photo URL for a place
 * @param photoReference The photo reference from Places API
 * @param maxWidth The maximum width of the photo
 * @returns The URL for the photo
 */
export const getPhotoUrl = (photoReference: string, maxWidth: number = 400) => {
  if (!photoReference) return null;
  return `${PLACES_PHOTO_BASE_URL}?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
};

/**
 * Search for a business and get its photo URL
 * @param businessName The name of the business
 * @param location The location (e.g., "Princeton, NJ")
 * @returns Promise with the photo URL or null if not found
 */
export const getBusinessPhotoUrl = async (businessName: string, location: string) => {
  try {
    const query = `${businessName} ${location}`;
    const place = await searchPlace(query);
    
    if (place && place.photos && place.photos.length > 0) {
      const photoReference = place.photos[0].photo_reference;
      return getPhotoUrl(photoReference);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting business photo:', error);
    return null;
  }
};

/**
 * Check if the Google Places API is properly configured
 * @returns boolean indicating if the API key is available
 */
export const isPlacesApiConfigured = () => {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('Google Places API key is not configured. Add EXPO_PUBLIC_GOOGLE_PLACES_API_KEY to your .env file.');
    return false;
  }
  return true;
};
