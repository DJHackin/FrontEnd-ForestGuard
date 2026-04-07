import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  root: 'client',              // dossier qui contient index.html
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
});