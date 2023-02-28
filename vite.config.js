// vite.config.js
import { resolve } from "path"
import { defineConfig } from "vite"
import VitePluginLibInjectStyle from "vite-plugin-lib-inject-style"

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/main.ts"),
      name: "ActiveUsersWidget",
      // the proper extensions will be added
      fileName: "active-users-widget",
    },
    cssCodeSplit: true,
  },
  plugins: [
    VitePluginLibInjectStyle({
      // options ..
    }),
  ],
})
