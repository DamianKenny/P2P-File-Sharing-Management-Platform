'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

//state and actions hook
export function useAuth() {
  const store = useAuthStore();

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    login: store.login,
    register: store.register,
    logout: store.logout,
    refreshProfile: store.refreshProfile,
    initialize: store.initialize,
  };
}

//authentication hook
export function useRequireAuth() {
  const { isAuthenticated, isInitialized, initialize } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  return { isAuthenticated, isInitialized };
}

//to redirect users
export function useRedirectAuthenticated(redirectTo = '/dashboard') {
  const { isAuthenticated, isInitialized, initialize } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isInitialized, router, redirectTo]);

  return { isAuthenticated, isInitialized };
}