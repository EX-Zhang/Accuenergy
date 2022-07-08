import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },

    server: {

        proxy: {

            '/Gapi': {

                target: "https://maps.googleapis.com/maps/api",

                changeOrigin: true,

                rewrite: path => path.replace(/^\/Gapi/, ''),

                ws: false

            },

        },

    },

})
