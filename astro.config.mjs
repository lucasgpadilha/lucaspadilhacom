import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // The portfolio imports all Tailwind layers in globals.css already. Avoid
  // injecting another global reset into it and the independent studio layout.
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  output: 'static',
});
