import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lucaspadilha.com',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
