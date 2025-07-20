// API Configuration for Firebase IDX and local development
const getApiBaseUrl = () => {
  // Check if we're running in Firebase IDX/Studio
  const hostname = window.location.hostname;
  
  if (hostname.includes('googleusercontent.com') || 
      hostname.includes('cloudworkstations.dev') || 
      hostname.includes('studio.firebase.google.com')) {
    // Firebase IDX environment - use relative path to backend preview
    // The backend preview runs on port 8000 and should be accessible via the IDX proxy
    const baseUrl = window.location.origin.replace(/:\d+/, ':8000');
    return baseUrl;
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Local development environment
    return 'http://localhost:8000';
  } else {
    // Production or other environments
    return process.env.REACT_APP_API_URL || 'http://localhost:8000';
  }
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to make API requests with credentials
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include', // Important for Firebase IDX authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  apiRequest,
};