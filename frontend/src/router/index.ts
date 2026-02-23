import { createRouter, createWebHistory } from 'vue-router'
import ResumeGeneratorView from '../views/ResumeGeneratorView.vue'
import HomeView from '../views/HomeView.vue'
import FreelanceView from '../views/FreelanceView.vue'
import ResumeHistoryView from '../views/ResumeHistoryView.vue'
import FreelanceHistoryView from '../views/FreelanceHistoryView.vue'

const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/resume', name: 'ResumeGenerator', component: ResumeGeneratorView },
    { path: '/resume/history', name: 'ResumeHistory', component: ResumeHistoryView },
    { path: '/freelance', name: 'Freelance', component: FreelanceView },
    { path: '/freelance/history', name: 'FreelanceProposalHistory', component: FreelanceHistoryView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})