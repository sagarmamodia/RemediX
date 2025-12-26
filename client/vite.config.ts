import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@videosdk.live/rtc-js-prebuilt": path.resolve(
        __dirname,
        "./node_modules/@videosdk.live/rtc-js-prebuilt/dist/index.js"
      ),
    },
  },
})
