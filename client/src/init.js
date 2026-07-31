// Intercepta fetch globalmente para redirigir /api/* a Render cuando estamos en Vercel
const RENDER_API = 'https://veterinariamariangel.onrender.com';
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

if (isVercel) {
  const origFetch = window.fetch;
  window.fetch = function (url, options) {
    const urlStr = typeof url === 'string' ? url : url.toString();
    if (urlStr.startsWith('/api/')) {
      url = RENDER_API + urlStr;
    }
    return origFetch.call(window, url, options);
  };
}