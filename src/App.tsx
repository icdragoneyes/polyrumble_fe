import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { WalletConfig } from './lib/walletConfig';
import { WalletSync } from './components/wallet/WalletSync';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { queryClient } from './lib/queryClient';
import { router } from './lib/router';
import { validateEnv } from './config/env';

// Validate environment variables on app start
validateEnv();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <WalletConfig>
          <WalletSync />
          <RouterProvider router={router} />
        </WalletConfig>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
