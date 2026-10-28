import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lucaspadilha.com',
  trailingSlash: 'always',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
});
