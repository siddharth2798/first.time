
/**
 * Application Configuration
 * Replace the values below with your actual credentials from:
 * - Cloudinary Dashboard: https://cloudinary.com/console/
 */
export const CONFIG = {
  // Cloudinary Settings
  // Go to Cloudinary Settings -> Enable Unsigned Uploading -> Create an Upload Preset
  CLOUDINARY_CLOUD_NAME: "dmljhznje",
  CLOUDINARY_UPLOAD_PRESET: "ml_default", // Change this to your actual unsigned preset name
  
  // Optional: Add other environment-specific variables here
  APP_URL: window.location.origin,
};
