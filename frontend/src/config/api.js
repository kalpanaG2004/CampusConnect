// Simple API configuration
const getBaseUrl = () => {
  // First, check for environment variable (for production/Render deployment)
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Then check hostname for development environments
  const hostname = window.location.hostname;
  
  if (hostname.includes('cloudworkstations.dev') || 
      hostname.includes('googleusercontent.com')) {
    return window.location.origin.replace(/:\d+/, ':8000');
  }
  
  if (hostname === 'localhost') {
    return 'http://localhost:8000';
  }
  
  // Fallback
  return 'http://localhost:8000';
};

const API_BASE_URL = getBaseUrl();

const apiRequest = async (endpoint, options = {}) => {
  const url = API_BASE_URL + endpoint;
  
  return fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
};

export { API_BASE_URL, apiRequest };