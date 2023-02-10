import { defineConfig } from 'vite';
import { dedup, draco, prune } from "@gltf-transform/functions";
import gltf from 'vite-plugin-gltf';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  server: { https: true },
  plugins: [
    mkcert(),
    gltf({
      transforms: [
        // remove unused resources
        prune(),
        // combine duplicated resources
        dedup(),
        // compress mesh geometry
        draco({}),
      ]
    })
  ],
});
