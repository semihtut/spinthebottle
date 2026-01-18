import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useSettingsStore } from './providers';

export function AppLayout() {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);

  // Sync reduced motion preference to document
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  return (
    <div className="flex flex-col min-h-dvh safe-top safe-bottom">
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
