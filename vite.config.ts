import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }: { mode: string }): UserConfig => ({
  server: {
    host: '::',
    port: 8080,
    strictPort: true,
    open: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'esbuild' : false,
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
}));
