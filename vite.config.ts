import { defineConfig } from 'vite';

// Relative assets work both at /rosary/ on Pages and at a custom domain's root.
export default defineConfig({ base: './' });
