import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  server: { https: true },
  plugins: [mkcert()],
});
