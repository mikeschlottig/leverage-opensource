import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode, createContext, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  useLocation,
  Navigate,
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
import { useAuth } from './lib/auth';
import { GlobalLoader } from './components/GlobalLoader';
type AuthContextType = ReturnType<typeof useAuth>;
const AuthContext = createContext<AuthContextType | null>(null);
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();
  if (isLoading) {
    return <GlobalLoader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
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
  const auth = useAuth();
  return (
    <AuthContext.Provider value={auth}>
      <GlobalLoader />
      <RouterProvider router={router} />
    </AuthContext.Provider>
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