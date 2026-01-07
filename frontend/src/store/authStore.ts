import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api, {apiHelpers } from '@/lib/api';
import { STORAGE_KEYS } from '@/lib/constants';
import type { User, AuthTokens, LoginCredentials, RegisterCredentials } from '@/types';

interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;

    //Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
    initialize: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,

            initialize: () => {
                //check if theres tokens in the local storage
                const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                const userStr = localStorage.getItem(STORAGE_KEYS.USER);

                if (accessToken && refreshToken && userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        set({
                            user,
                            tokens: { accessToken, refreshToken, expiresIn: '7d'},
                            isAuthenticated: true,
                            isInitialized: true,
                        });
                    } catch {
                        set({ isInitialized: true});
                    }
                } else {
                    set({ isInitialized: true});
                }
            },

            login: async (credentials) => {
                set ({ isLoading: true});

                try{
                    const response = await api.post('/auth/login', credentials);
                    const { user, tokens } = response.data.data;

                    //save to local storage
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
                    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))

                    set({
                        user,
                        tokens,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error){
                    set({ isLoading: false});
                    throw new Error(apiHelpers.getErrorMessage(error));
                }
            },

            register:async (credentials) => {
                set({ isLoading: true});
                try{
                    const response = await api.post('/auth.register', credentials);
                    const {user, tokens} = response.data.data;

                    //save to local storage
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresToken);
                    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

                    set({
                        user,
                        tokens,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error){
                    set ({ isLoading: false });
                    throw new Error(apiHelpers.getErrorMessage(error));
                }
            },

            logout: () => {
                //clear local storage
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);

                set({
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                });
            },

            refreshProfile: async() => {
                try{
                    const response = await api.get('/auth/profile');
                    const user = response.data.data;

                    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
                    set({ user });
                } catch (error) {
                    console.error('Failed to refresh profile', error);
                }
            },

            setLoading: (loading) => set({ isLoading: loading }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);