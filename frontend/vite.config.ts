import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      clientPort: Number(process.env.VITE_HMR_CLIENT_PORT) || 5173,
    },
  },
});
