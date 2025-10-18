// packages/integrations/october-implementation/src/frontend/vite.config.ts
import path from "node:path";
import { defineConfig } from "file:///C:/nexus/node_modules/vite/dist/node/index.js";
import react from "file:///C:/nexus/node_modules/@vitejs/plugin-react-swc/index.js";
import tailwindcss from "file:///C:/nexus/node_modules/@tailwindcss/vite/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\nexus\\packages\\integrations\\october-implementation\\src\\frontend";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvaW50ZWdyYXRpb25zL29jdG9iZXItaW1wbGVtZW50YXRpb24vc3JjL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcbmV4dXNcXFxccGFja2FnZXNcXFxcaW50ZWdyYXRpb25zXFxcXG9jdG9iZXItaW1wbGVtZW50YXRpb25cXFxcc3JjXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxuZXh1c1xcXFxwYWNrYWdlc1xcXFxpbnRlZ3JhdGlvbnNcXFxcb2N0b2Jlci1pbXBsZW1lbnRhdGlvblxcXFxzcmNcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L25leHVzL3BhY2thZ2VzL2ludGVncmF0aW9ucy9vY3RvYmVyLWltcGxlbWVudGF0aW9uL3NyYy9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgdGFpbHdpbmRjc3MoKV0sXHJcbiAgYmFzZTogXCIvYXBwL1wiLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcHJveHk6IHtcclxuICAgICAgLy8gUHJveHkgQVBJIHJlcXVlc3RzIHRvIHRoZSBiYWNrZW5kIHNlcnZlclxyXG4gICAgICBcIi9hcGlcIjoge1xyXG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vMTI3LjAuMC4xOjgwMDBcIiwgLy8gRGVmYXVsdCBiYWNrZW5kIGFkZHJlc3NcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgLy8gT3B0aW9uYWxseSByZXdyaXRlIHBhdGggaWYgbmVlZGVkIChlLmcuLCByZW1vdmUgL2FwaSBwcmVmaXggaWYgYmFja2VuZCBkb2Vzbid0IGV4cGVjdCBpdClcclxuICAgICAgICAvLyByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzWSxPQUFPLFVBQVU7QUFDdlosU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBSHhCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQUEsRUFDaEMsTUFBTTtBQUFBLEVBQ04sU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBO0FBQUEsTUFFTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUE7QUFBQSxRQUNSLGNBQWM7QUFBQTtBQUFBO0FBQUEsTUFHaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
