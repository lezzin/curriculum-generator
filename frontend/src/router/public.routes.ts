import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/auth/LoginView.vue';
import SignupView from '../views/auth/SignupView.vue';

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/auth',
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
      },
      {
        path: 'signup',
        name: 'Signup',
        component: SignupView,
      },
    ],
  },
];
