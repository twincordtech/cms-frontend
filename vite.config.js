// ===============================
// File: vite.config.js
// Description: Vite configuration for React CMS application, including server, proxy, and plugin settings.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite configuration for the CMS application.
 * Includes React plugin, server settings, CORS, and proxy for API requests.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
    host: true, // Allow external access
    allowedHosts: ['cms.fentro.net', 'localhost', '127.0.0.1']
  }
});
// ===============================
// End of File: vite.config.js
// Description: Vite configuration
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
