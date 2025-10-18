// packages/integrations/gemini-research-agent/src/frontend/vite.config.ts
import path from "node:path";
import { defineConfig } from "file:///C:/nexus/node_modules/vite/dist/node/index.js";
import react from "file:///C:/nexus/node_modules/@vitejs/plugin-react-swc/index.js";
import tailwindcss from "file:///C:/nexus/node_modules/@tailwindcss/vite/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\nexus\\packages\\integrations\\gemini-research-agent\\src\\frontend";
var vite_config_default = defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/app/",
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    proxy: {
      // Proxy API requests to the backend server
      "/api": {
        target: "http://127.0.0.1:8000",
        // Default backend address
        changeOrigin: true
        // Optionally rewrite path if needed (e.g., remove /api prefix if backend doesn't expect it)
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvaW50ZWdyYXRpb25zL2dlbWluaS1yZXNlYXJjaC1hZ2VudC9zcmMvZnJvbnRlbmQvdml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxuZXh1c1xcXFxwYWNrYWdlc1xcXFxpbnRlZ3JhdGlvbnNcXFxcZ2VtaW5pLXJlc2VhcmNoLWFnZW50XFxcXHNyY1xcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcbmV4dXNcXFxccGFja2FnZXNcXFxcaW50ZWdyYXRpb25zXFxcXGdlbWluaS1yZXNlYXJjaC1hZ2VudFxcXFxzcmNcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L25leHVzL3BhY2thZ2VzL2ludGVncmF0aW9ucy9nZW1pbmktcmVzZWFyY2gtYWdlbnQvc3JjL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy92aXRlXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCB0YWlsd2luZGNzcygpXSxcclxuICBiYXNlOiBcIi9hcHAvXCIsXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwcm94eToge1xyXG4gICAgICAvLyBQcm94eSBBUEkgcmVxdWVzdHMgdG8gdGhlIGJhY2tlbmQgc2VydmVyXHJcbiAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xMjcuMC4wLjE6ODAwMFwiLCAvLyBEZWZhdWx0IGJhY2tlbmQgYWRkcmVzc1xyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAvLyBPcHRpb25hbGx5IHJld3JpdGUgcGF0aCBpZiBuZWVkZWQgKGUuZy4sIHJlbW92ZSAvYXBpIHByZWZpeCBpZiBiYWNrZW5kIGRvZXNuJ3QgZXhwZWN0IGl0KVxyXG4gICAgICAgIC8vIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1ZLE9BQU8sVUFBVTtBQUNwWixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxpQkFBaUI7QUFIeEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7QUFBQSxFQUNoQyxNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxNQUVMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQTtBQUFBLFFBQ1IsY0FBYztBQUFBO0FBQUE7QUFBQSxNQUdoQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
