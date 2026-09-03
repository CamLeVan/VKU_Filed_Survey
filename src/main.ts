import './style.css';
import { App } from './app';
import { registerServiceWorker } from './services/swRegister';

document.addEventListener('DOMContentLoaded', () => {
  console.log('[VKU Field Survey] Initializing application shell...');
  
  // Instantiate main application
  new App();

  // Register PWA Service Worker
  registerServiceWorker(() => {
    console.log('[VKU Field Survey] Update found, ready to refresh.');
  });
});
