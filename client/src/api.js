// Helper para llamadas API: en producción (Vercel) usa URL absoluta de Render
const API_URL = import.meta.env.PROD ? 'https://veterinariamariangel.onrender.com' : '';

export function apiUrl(path) {
  return API_URL + path;
}