/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true,
      /**
       * After writing entry here, you will not need to add script tags in `index.html`, the original tags need to be deleted
       * @default src/main.ts
       */
      entry: "index.js",
      /**
       * If you want to store `index.html` in the specified folder, you can modify it, otherwise no configuration is required
       * @default index.html
       */
      template: "src/index.html",
    }),
    {
      // default settings on build (i.e. fail on error)
      ...eslintPlugin(),
      apply: "build",
    },
    {
      // do not fail on serve (i.e. local development)
      ...eslintPlugin({
        failOnWarning: false,
        failOnError: false,
      }),
      apply: "serve",
      enforce: "post",
    },
  ],
  build: {
    outDir: "dist",
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
  optimizeDeps: {
    include: ["@babel/runtime-corejs3"],
  },
});
