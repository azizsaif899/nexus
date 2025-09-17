import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4200,
    host: true,
  },
  build: {
    outDir: '../../dist/apps/crm-system',
    emptyOutDir: true,
  },
});