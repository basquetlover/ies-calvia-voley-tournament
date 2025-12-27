
// analytics.js
(function() {
  const PROJECT_URL = window.location.hostname;
  const PROJECT_SECRET = '14dfd2bfbb91c941fca730d2a874e202b7a1ec9a14f10865c4fccb5304d0edcaecbf0c194444c02cbad254a3383b49416b3d3e6f42d33fd84acdbd507afec175839b02237e0fd344f9c0e8a14783093a3e774ab491ebc2edddd2f5821c5cae121f34f1e4';
  const API_URL = 'https://perealemany-dev.vercel.app/api/analytics/track';

  // Crear device_id si no existe
let device_id = localStorage.getItem('device_id');
  if (!device_id) {
    device_id = crypto.randomUUID();
    localStorage.setItem('device_id', device_id);
  }

  // Preparar payload
const ua = navigator.userAgent;
  let device_type = 'desktop';
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) device_type = 'mobile';

  const payload = {
    device_id,
    url: PROJECT_URL,
    title: document.title,
    search: window.location.search,
    secret_key: PROJECT_SECRET,
    user_agent: ua,
    device_type,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  // Enviar datos al servidor
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch((err) => {
    console.error('Analytics error:', err);
  });
})();
