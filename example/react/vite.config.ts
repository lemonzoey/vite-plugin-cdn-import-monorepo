import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import importToCDN, { autoComplete } from 'vite-plugin-cdn-import-monorepo'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        importToCDN({
            modules: [
              {
                name: 'vue',
                var: 'Vue',
                mode: 'async', // 'async' atrribute will be added to its <script> tag.
                path: `https://unpkg.com/vue@next`,
            },
            {
                name: 'axios',  // Module without 'mode' param will be loaded synchronously.
                var: 'axios',
                path: 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js',
            }
                // autoComplete('react-dom'),
                // autoComplete('moment'),
                // autoComplete('antd'),
                // {
                //     name: 'react',
                //     var: 'React',
                //     mode: 'DOMContentLoaded',
                //     path: `https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js`,
                // },
                // {
                //     name: 'lottie-web',
                //     var: 'lottie',
                //     mode: '300',
                //     path: `https://cdn.jsdelivr.net/npm/lottie-web@5.10.0/build/player/lottie.min.js`,
                // },
                // {
                //     name: 'axios',  // Module without 'mode' param will be loaded synchronously.
                //     var: 'axios',
                //     path: 'https://cdn.jsdelivr.net/npm/axios@1.2.1/dist/axios.min.js',
                // }
            ],
        }),
        reactRefresh(),
    ],
})
