import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // TODO: تثبيت عند الحاجة

import App from "./app/app";

// إعداد React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // لا نعيد المحاولة لأخطاء المصادقة
        if (error?.message?.includes("auth") || error?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Fix webpack favicon path issue
if (typeof document !== "undefined") {
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon && favicon.href.includes("undefined")) {
    favicon.href = "/favicon.ico";
  }
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />} TODO: تفعيل عند تثبيت الحزمة */}
    </QueryClientProvider>
  </StrictMode>
);
