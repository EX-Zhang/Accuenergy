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

        proxy: { // Proxy for CORS Policy purpose

            '/GetIP': { // Web API to get the IP address of the user 

                target: "https://api.my-ip.io/ip",

                changeOrigin: true,

                rewrite: path => path.replace(/^\/GetIP/, ''), // All the path start with '/GetIP' will be replaced by the target url

                ws: false

            },

            '/GetLocation': { // Web API to get the coordinates by the IP address

                target: "http://ip-api.com/json",

                changeOrigin: true,

                rewrite: path => path.replace(/^\/GetLocation/, ''),

                ws: false

            },

            '/Gapi': { // Google map api

                target: "https://maps.googleapis.com/maps/api",

                changeOrigin: true,

                rewrite: path => path.replace(/^\/Gapi/, ''),

                ws: false

            },

        },

    },

})
