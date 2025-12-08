import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
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
const queryClient = new QueryClient();
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
    element: <ComponentStudio />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/library",
    element: <PatternLibrary />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/integrations/:contextId?",
    element: <IntegrationsPane />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)