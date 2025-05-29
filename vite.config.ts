import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defineConfig as vitestConfig } from "vitest/config";

const config = defineConfig({
  plugins: [react()],
});

const testConfig = vitestConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./vitest.setup.ts'],
    }
});

export default {
    ...config,
    ...testConfig,
};
