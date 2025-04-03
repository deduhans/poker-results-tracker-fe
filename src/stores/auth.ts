import { defineStore } from 'pinia';
import { useUserStore } from './user';
import AuthController from '@/network/lib/auth';

interface AuthState {
  isAuthenticated: boolean;
  sessionExpiry: number | null; // Timestamp when session expires
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const sessionData = sessionStorage.getItem('auth_session');
    const parsedData = sessionData ? JSON.parse(sessionData) : null;

    return {
      isAuthenticated: parsedData?.isAuthenticated || false,
      sessionExpiry: parsedData?.sessionExpiry || null,
    };
  },

  getters: {
    // Check if session is valid based on expiry time
    isSessionValid: (state): boolean => {
      if (!state.sessionExpiry) return false;
      return Date.now() < state.sessionExpiry;
    },
  },

  actions: {
    // Initialize auth state from backend session
    async initializeAuth() {
      const authController = new AuthController();
      try {
        const user = await authController.sessionStatus();
        if (user) {
          this.setAuthenticated(true);
          // Set user data in user store
          const userStore = useUserStore();
          userStore.setUser({
            userId: user.id,
            name: user.username
          });
          return true;
        } else {
          this.clearAuth();
          return false;
        }
      } catch (error) {
        this.clearAuth();
        return false;
      }
    },

    // Set authenticated state with session expiry
    setAuthenticated(isAuthenticated: boolean, expiryHours: number = 12) {
      this.isAuthenticated = isAuthenticated;

      if (isAuthenticated) {
        // Set session expiry (default: 12 hours from now)
        this.sessionExpiry = Date.now() + (expiryHours * 60 * 60 * 1000);
      } else {
        this.sessionExpiry = null;
      }

      // Save to sessionStorage
      this.persistAuthState();
    },

    // Clear auth state on logout
    clearAuth() {
      this.isAuthenticated = false;
      this.sessionExpiry = null;
      sessionStorage.removeItem('auth_session');

      // Clear user data
      const userStore = useUserStore();
      userStore.clearUser();
    },

    // Persist auth state to sessionStorage
    persistAuthState() {
      const authData = {
        isAuthenticated: this.isAuthenticated,
        sessionExpiry: this.sessionExpiry
      };

      sessionStorage.setItem('auth_session', JSON.stringify(authData));
    }
  }
});
