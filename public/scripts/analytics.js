
// analytics.js

// Función para detectar el tipo de dispositivo
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'Mobile';
  if (/tablet/i.test(ua) || /ipad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

// Función para detectar el navegador
function getBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Unknown';
}

// Función para detectar el sistema operativo
function getOS() {
  const ua = navigator.userAgent;
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Unknown';
}

// Función para obtener país/región usando una API gratuita (ipapi.co)
async function getIPAndCountry() {
  try {
    // Obtener IP pública
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const clientIP = ipData.ip;

    // Usar la IP para geolocalización (ej. con ipapi.co)
    const geoResponse = await fetch(`https://ipapi.co/${clientIP}/json/`);
    const geoData = await geoResponse.json();

    return {
      ip: clientIP,
      country: geoData.country_name || 'Unknown',
      region: geoData.region || 'Unknown'
    };
  } catch (error) {
    console.error('Error obteniendo IP o geo:', error);
    return { ip: 'Unknown', country: 'Unknown', region: 'Unknown' };
  }
}

// Función principal para recopilar y enviar datos


  
// analytics.js
(async function() {
  const PROJECT_URL = window.location.hostname;
  const URL_PATHNAME = window.location.pathname;
  const PROJECT_SECRET = '14dfd2bfbb91c941fca730d2a874e202b7a1ec9a14f10865c4fccb5304d0edcaecbf0c194444c02cbad254a3383b49416b3d3e6f42d33fd84acdbd507afec175839b02237e0fd344f9c0e8a14783093a3e774ab491ebc2edddd2f5821c5cae121f34f1e4';
  const API_URL = 'https://perealemany-dev.vercel.app/api/analytics/track';

  // Crear device_id si no existe
let device_id = localStorage.getItem('device_id');
  if (!device_id) {
    device_id = crypto.randomUUID();
    localStorage.setItem('device_id', device_id);
  }

const language = navigator.language || 'Unknown';
  const browser = getBrowser();
  const deviceType = getDeviceType();
  const os = getOS();
  const geo = await getIPAndCountry();

  // Preparar payload
const ua = navigator.userAgent;

  const payload = {
    device_id,
    url: PROJECT_URL,
    pathname: URL_PATHNAME,
    title: document.title,
    search: window.location.search,
    secret_key: PROJECT_SECRET,
    browser: browser,
    os: os,
    country: geo.country,
    region: geo.region,
    device_type: deviceType,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  console.log('Analytics payload:', payload);

  //Enviar datos al servidor
let sent = false;

function sendAnalytics() {
  if (sent) return;
  sent = true;

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

// 5 segundos
setTimeout(sendAnalytics, 5000);

// interacción
['click', 'scroll', 'keydown', 'touchstart'].forEach(e =>
  window.addEventListener(e, sendAnalytics, { once: true })
);
})();
