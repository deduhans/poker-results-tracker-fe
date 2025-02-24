import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    viewportHeight: 760,
    viewportWidth: 360,
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:3001",
    chromeWebSecurity: false,
  },

  env: {
    apiUrl: "http://localhost:3000"
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
