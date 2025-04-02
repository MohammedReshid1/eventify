
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
    // Completely disable WebSocket compression to fix RSV1 error
    hmr: {
      protocol: 'ws',
      clientPort: 8080, // Force client to use the correct port
      host: 'localhost',
      timeout: 120000, // Increase timeout
    },
    headers: {
      // Disable compression on WebSocket headers
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
      'Sec-WebSocket-Extensions': ''
    },
    watch: {
      usePolling: true, // Polling is more reliable on some systems
      interval: 1000,    // Check every second
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
