import { createApp } from 'vue';
import './assets/style.css';
import App from './App.vue';
import { router } from './router';
import { api } from './services/api/api';
import { setupInterceptors } from './services/api/interceptors';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

setupInterceptors(api, () => {
  const authStore = useAuthStore();
  authStore.logout();
});

app.use(router).mount('#app');
