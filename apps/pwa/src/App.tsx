import { AppRouter } from './app/routes';
import {
  ToastContainer,
  InstallPrompt,
  OfflineIndicator,
  UpdatePrompt,
  ErrorBoundary,
} from './ui/components';
import { useToast } from './hooks';

function App() {
  const { toasts, dismiss } = useToast();

  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <UpdatePrompt />
      <AppRouter />
      <InstallPrompt />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ErrorBoundary>
  );
}

export default App;
