import AuthController from '@/network/lib/auth';
import { useUserStore } from '@/stores/user';
import { type NavigationGuard } from 'vue-router';

const authGuard: NavigationGuard = (to, from, next) => {
  const isAuthenticated = !!useUserStore().userId;

  if (isAuthenticated) {
    next();
  } else {
    new Promise(async (res, rej) => {
      const user: any = await new AuthController().sessionStatus();

      if (user) {
        useUserStore().setUser({ userId: user.userId, name: user.username });
        next();
      } else {
        next({ name: 'login' });
      }
    });
  }
};

export default authGuard;