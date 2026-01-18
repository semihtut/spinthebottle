import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from './AppLayout';
import { LoadingScreen } from '@/ui/components/LoadingScreen';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@/features/home/HomePage'));
const SetupPage = lazy(() => import('@/features/setup/SetupPage'));
const GamePage = lazy(() => import('@/features/game/GamePage'));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'));
const PacksPage = lazy(() => import('@/features/packs/PacksPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'setup',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SetupPage />
          </Suspense>
        ),
      },
      {
        path: 'game',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <GamePage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: 'packs',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <PacksPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
