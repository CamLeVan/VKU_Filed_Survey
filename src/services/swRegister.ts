export function registerServiceWorker(onUpdateFound?: () => void): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        console.log('[PWA] Service Worker registered with scope:', registration.scope);

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New content available; please refresh.');
                if (onUpdateFound) onUpdateFound();
              }
            };
          }
        };
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    });
  } else {
    console.warn('[PWA] Service Workers are not supported in this browser.');
  }
}

export async function requestBackgroundSync(): Promise<boolean> {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const reg = await navigator.serviceWorker.ready;
      // TS type assertion for SyncManager API
      await (reg as unknown as { sync: { register: (tag: string) => Promise<void> } }).sync.register('vku-survey-sync');
      console.log('[PWA] Registered background sync tag: vku-survey-sync');
      return true;
    } catch (err) {
      console.warn('[PWA] Background sync registration failed or rejected:', err);
      return false;
    }
  }
  return false;
}
