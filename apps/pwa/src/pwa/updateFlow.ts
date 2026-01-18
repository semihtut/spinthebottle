import { registerSW } from 'virtual:pwa-register';

let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined;

export function initPWA(onUpdate: () => void) {
  updateSW = registerSW({
    onNeedRefresh() {
      onUpdate();
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
    onRegistered(registration) {
      if (registration) {
        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });
}

export function applyUpdate() {
  if (updateSW) {
    updateSW(true);
  }
}
