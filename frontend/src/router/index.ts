import { createRouter, createWebHistory } from 'vue-router';
import { publicRoutes } from './public.routes';
import { privateRoutes } from './private.routes';
import { useAuthStore } from '../stores/auth';

const routes = [...publicRoutes, ...privateRoutes];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

let authInitialized = false;

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();

  const isSameRoute = to.name === from.name;
  const isHashNavigation = !!to.hash && isSameRoute;
  if (isHashNavigation) return true;

  if (!authInitialized) {
    await authStore.checkAuth();
    authInitialized = true;
  }

  if (to.meta.requiresAuth && !authStore.user) {
    return {
      name: 'Login',
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.guestOnly && authStore.user) {
    return { name: 'Home' };
  }

  return true;
});
