import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/fav-flicks/',
  plugins: [react(), tailwindcss()],
    // server: {
    //   proxy: {
    //       "api": {
    //           target: "https://tastedive.com",
    //           changeOrigin: true,
    //           rewrite: (path) => path.replace(/^\/api/, "")
    //       }
    //   }
    // }
})

