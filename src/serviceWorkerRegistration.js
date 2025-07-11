// Enregistre le Service Worker pour l'application (PWA support, cache, etc.)
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker enregistré :', registration);
        })
        .catch((error) => {
          console.error('❌ Échec de l’enregistrement du Service Worker :', error);
        });
    });
  }
}
