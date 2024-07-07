import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_URL,
        changeOrigin: true
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Optional: Set up aliases for convenience
    },
  },
});