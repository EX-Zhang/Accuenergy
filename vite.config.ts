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

            '/GetIP': {

                target: "https://api.my-ip.io/ip",

                changeOrigin: true,

                rewrite: path => path.replace(/^\/GetIP/, ''),

                ws: false

            },

            '/GetLocation': {

                target: "http://ip-api.com/json",

                changeOrigin: true,

                rewrite: path => path.replace(/^\/GetLocation/, ''),

                ws: false

            },

            '/Gapi': {

                target: "https://maps.googleapis.com/maps/api",

                changeOrigin: true,

                rewrite: path => path.replace(/^\/Gapi/, ''),

                ws: false

            },

        },

    },

})
