import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        client: resolve(__dirname, 'src/client/index.ts'),
        server: resolve(__dirname, 'src/server/index.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    lib: {
      entry: {
        client: resolve(__dirname, 'src/client/index.ts'),
        server: resolve(__dirname, 'src/server/index.ts')
      },
      formats: ['es']
    },
    target: 'es2015',
    minify: 'terser'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});