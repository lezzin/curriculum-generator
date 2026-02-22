import { createMemoryHistory, createRouter } from 'vue-router'
import CurriculumGeneratorView from '../views/CurriculumGeneratorView.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/curriculum', component: CurriculumGeneratorView },
]

export const router = createRouter({
    history: createMemoryHistory(),
    routes,
})