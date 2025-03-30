// Business images service using Picsum Photos
// This provides high-quality, consistent images for businesses without API key requirements

// The API key is still kept for potential future use
const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';

/**
 * Get a street view image URL for a location (kept for reference)
 * @param latitude The latitude of the business
 * @param longitude The longitude of the business
 * @param size The size of the image (width x height)
 * @returns The URL for the street view image
 */
export const getStreetViewImageUrl = (
  latitude: number, 
  longitude: number, 
  size: string = '400x400'
): string => {
  return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
};

/**
 * Get a static map image URL for a location (kept for reference)
 * @param latitude The latitude of the business
 * @param longitude The longitude of the business
 * @param zoom The zoom level (1-20)
 * @param size The size of the image (width x height)
 * @returns The URL for the static map image
 */
export const getStaticMapImageUrl = (
  latitude: number, 
  longitude: number, 
  zoom: number = 18,
  size: string = '400x400'
): string => {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${size}&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
};

/**
 * Get a business photo URL based on its coordinates using Picsum Photos
 * @param latitude The latitude of the business
 * @param longitude The longitude of the business
 * @returns The URL for the business photo
 */
export const getBusinessPhotoUrl = (latitude: number, longitude: number): string => {
  // Use the business coordinates to get a consistent image for each business
  const businessId = Math.floor((latitude + longitude) * 100);
  return `https://picsum.photos/seed/${businessId}/400/300`;
};

/**
 * Check if the Google Maps API is properly configured (kept for reference)
 * @returns boolean indicating if the API key is available
 */
export const isMapsApiConfigured = (): boolean => {
  // Always return true since we're now using Picsum Photos
  return true;
};
