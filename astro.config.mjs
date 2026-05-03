// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://leo-mialaret.github.io',
  base: '/Portfolio_site',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [icon()]
});