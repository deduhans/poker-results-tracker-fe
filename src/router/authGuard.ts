import { useUserStore } from '@/stores/user';
import { type NavigationGuard } from 'vue-router';

const authGuard: NavigationGuard = (to, from, next) => {
    const isAuthenticated = !!useUserStore().userId;

    if (isAuthenticated) {
        next();
    } else {
        next({ name: 'welcome' });
    }
};

export default authGuard;