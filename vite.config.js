// vite.config.js
import { resolve } from "path"
import { defineConfig } from "vite"
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js"

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/main.ts"),
      name: "ActiveUsersWidget",
      // the proper extensions will be added
      fileName: "active-users-widget",
      formats: ["es"],
    },
    cssCodeSplit: true,
  },
  plugins: [cssInjectedByJsPlugin()],
})
