import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodePackageImporter } from 'sass';

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        importer: new NodePackageImporter(),
      },
    },
  },
});

