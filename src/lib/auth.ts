import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api-client';
import { useState, useEffect } from 'react';
import type { User } from '@shared/types';
export function useAuth() {
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('sessionId'));
  const { data: user, isPending: isSessionLoading } = useQuery<User>({
    queryKey: ['session', sessionId],
    queryFn: () => api(`/api/auth/session`, { headers: { 'X-Session-Id': sessionId! } }),
    enabled: !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
  const loginMutation = useMutation<User, Error>({
    mutationFn: () => api<User>('/api/auth/session', { method: 'POST' }),
    onSuccess: (newUser) => {
      localStorage.setItem('sessionId', newUser.id);
      setSessionId(newUser.id);
      queryClient.setQueryData(['session', newUser.id], newUser);
    },
  });
  const logout = () => {
    if (sessionId) {
      queryClient.removeQueries({ queryKey: ['session', sessionId] });
    }
    localStorage.removeItem('sessionId');
    setSessionId(null);
  };
  useEffect(() => {
    if (!sessionId && !loginMutation.isPending) {
      loginMutation.mutate();
    }
  }, [sessionId, loginMutation]);
  return { 
    user, 
    sessionId,
    login: loginMutation.mutate, 
    logout, 
    isAuthenticated: !!user,
    isLoading: isSessionLoading || loginMutation.isPending,
  };
}