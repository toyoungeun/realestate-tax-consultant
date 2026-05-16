import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 호스팅 시 저장소 이름으로 base 경로를 바꿔주세요.
// 예: 저장소가 https://github.com/<user>/realestate-tax-consultant 이면
//     base: '/realestate-tax-consultant/'
// Vercel/Netlify에서는 '/'를 그대로 두면 됩니다.
const REPO_NAME = process.env.VITE_REPO_NAME || 'realestate-tax-consultant';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? `/${REPO_NAME}/` : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 라이브러리로도 쓸 수 있도록 manualChunks로 분리
    rollupOptions: {
      output: {
        manualChunks: {
          'tax-lib': ['./src/lib/taxCalculations.js', './src/data/taxRates2026.js'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@lib': '/src/lib',
      '@data': '/src/data',
      '@components': '/src/components',
    },
  },
}));
