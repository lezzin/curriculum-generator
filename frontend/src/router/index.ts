import { createRouter, createWebHistory } from 'vue-router'
import ResumeGeneratorView from '../views/ResumeGeneratorView.vue'
import HomeView from '../views/HomeView.vue'
import FreelanceView from '../views/FreelanceView.vue'
import ResumeHistoryView from '../views/ResumeHistoryView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/resume', component: ResumeGeneratorView },
    { path: '/resume/history', component: ResumeHistoryView },
    { path: '/frelance', component: FreelanceView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})