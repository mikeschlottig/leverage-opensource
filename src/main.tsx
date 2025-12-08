import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import CatalogPage from '@/pages/CatalogPage';
import ProjectExplorer from '@/pages/ProjectExplorer';
import ComponentStudio from '@/pages/ComponentStudio';
import PatternLibrary from '@/pages/PatternLibrary';
import IntegrationsPane from '@/pages/IntegrationsPane';
import { GlobalLoader } from './components/GlobalLoader';
import { AuthProvider, ProtectedRoute } from './components/AuthProvider';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/catalog",
    element: <CatalogPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/projects/:projectId",
    element: <ProjectExplorer />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/studio/:patternId",
    element: <ProtectedRoute><ComponentStudio /></ProtectedRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/library",
    element: <ProtectedRoute><PatternLibrary /></ProtectedRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/integrations/:contextId?",
    element: <IntegrationsPane />,
    errorElement: <RouteErrorBoundary />,
  },
]);
const queryClient = new QueryClient();
function App() {
  return (
    <AuthProvider>
      <GlobalLoader />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
export {};