import {defineConfig} from "@asenajs/asena-cli";

export default defineConfig({
  sourceFolder: 'src',
  rootFile: 'src/index.ts',
  buildOptions: {
    outdir: 'dist',
    minify: {
      whitespace: true,
      syntax: true,
      identifiers: false, //It's better for you to make this false for better debugging during the running phase of the application.
      keepNames: true
    },
  },
});
