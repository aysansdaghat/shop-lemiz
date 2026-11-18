import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base نسبی: خروجی build روی هر هاست استاتیک (مثلاً GitHub Pages) بدون تنظیم اضافه کار می‌کند.
export default defineConfig({
  plugins: [react()],
  base: './',
});
