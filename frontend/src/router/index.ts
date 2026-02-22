import { createRouter, createWebHistory } from 'vue-router'
import CurriculumGeneratorView from '../views/CurriculumGeneratorView.vue'
import HomeView from '../views/HomeView.vue'
import FreelanceView from '../views/FreelanceView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/curriculum', component: CurriculumGeneratorView },
    { path: '/frelance', component: FreelanceView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})