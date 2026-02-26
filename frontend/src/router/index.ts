import { createRouter, createWebHistory } from 'vue-router'
import ResumeGeneratorView from '../views/resume/ResumeGeneratorView.vue'
import HomeView from '../views/HomeView.vue'
import FreelanceView from '../views/freelance/FreelanceView.vue'
import ResumeHistoryView from '../views/resume/ResumeHistoryView.vue'
import FreelanceHistoryView from '../views/freelance/FreelanceHistoryView.vue'
import { useAuth } from '../composables/useAuth'
import LoginView from '../views/auth/LoginView.vue'
import SignupView from '../views/auth/SignupView.vue'
import ProfileView from '../views/auth/ProfileView.vue'

const { checkAuth, user } = useAuth();

const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/auth/login', name: 'Login', component: LoginView },
    { path: '/auth/signup', name: 'Signup', component: SignupView },
    { path: '/auth/profile', name: 'Profile', component: ProfileView },

    { path: '/resume', name: 'ResumeGenerator', component: ResumeGeneratorView },
    { path: '/resume/history', name: 'ResumeHistory', component: ResumeHistoryView },

    { path: '/freelance', name: 'Freelance', component: FreelanceView },
    { path: '/freelance/history', name: 'FreelanceProposalHistory', component: FreelanceHistoryView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to) => {
    const HOME_ROUTE = 'Home' as const;
    const AUTH_ROUTES = ['Login', 'Signup'] as const;

    const PUBLIC_ROUTES = [
        HOME_ROUTE,
        ...AUTH_ROUTES,
    ] as const;

    if (!user.value) {
        await checkAuth();
    }

    if (user.value && AUTH_ROUTES.includes(to.name as any)) {
        return { name: HOME_ROUTE };
    }

    const authRequired = !PUBLIC_ROUTES.includes(to.name as any);

    if (authRequired && !user.value) {
        return { name: 'Login' };
    }

    return true;
});