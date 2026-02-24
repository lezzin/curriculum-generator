import { createRouter, createWebHistory } from 'vue-router'
import ResumeGeneratorView from '../views/ResumeGeneratorView.vue'
import HomeView from '../views/HomeView.vue'
import FreelanceView from '../views/FreelanceView.vue'
import ResumeHistoryView from '../views/ResumeHistoryView.vue'
import FreelanceHistoryView from '../views/FreelanceHistoryView.vue'
import { useAuth } from '../composables/useAuth'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'

const { authToken } = useAuth();

const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/auth/login', name: 'Login', component: LoginView },
    { path: '/auth/signup', name: 'Signup', component: SignupView },

    { path: '/resume', name: 'ResumeGenerator', component: ResumeGeneratorView },
    { path: '/resume/history', name: 'ResumeHistory', component: ResumeHistoryView },

    { path: '/freelance', name: 'Freelance', component: FreelanceView },
    { path: '/freelance/history', name: 'FreelanceProposalHistory', component: FreelanceHistoryView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, _, next) => {
    const publicPages = [
        '/auth/login',
        '/auth/signup',
        '/',
    ];

    const authRequired = !publicPages.includes(to.path);

    if (authRequired && !authToken.value) {
        next('/auth/login');
    } else {
        next();
    }
});