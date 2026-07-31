// Base URL for API calls — auto-detected for Vercel/Render/localhost
const API_URL = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
  ? 'https://veterinariamariangel.onrender.com'
  : '';

export function apiUrl(path) {
  return API_URL + path;
}