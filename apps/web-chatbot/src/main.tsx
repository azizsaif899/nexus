import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

// Fix webpack favicon path issue
if (typeof document !== 'undefined') {
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon && favicon.href.includes('undefined')) {
    favicon.href = '/favicon.ico';
  }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
