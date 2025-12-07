import { useContext } from 'react';
import { useAuth } from '@/lib/auth';
import { AuthProvider } from '@/components/AuthProvider'; // Need to import the component to get the context type
import React from 'react';
// This is a bit of a workaround to avoid circular dependencies while getting the context type.
// We define the context here, export it for the provider, and the provider uses it.
type AuthContextType = ReturnType<typeof useAuth>;
export const AuthContext = React.createContext<AuthContextType | null>(null);
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}