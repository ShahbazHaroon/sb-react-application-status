import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Loads .env.<mode> (e.g. .env.localhost, .env.dev, .env.prod)
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: { port: Number(env.VITE_DEV_SERVER_PORT) },
  };
});
