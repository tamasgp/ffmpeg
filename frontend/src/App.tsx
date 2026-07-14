import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/common/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TranscodersPage } from './pages/TranscodersPage';
import { AbrTemplatesPage } from './pages/AbrTemplatesPage';
import { JobsPage } from './pages/JobsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transcoders" element={<TranscodersPage />} />
            <Route path="/abr-templates" element={<AbrTemplatesPage />} />
            <Route path="/jobs" element={<JobsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
