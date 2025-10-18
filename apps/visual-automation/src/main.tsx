import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import '../styles/globals.css';
import '../styles/ios-fixes.css';
import { applyAllIOSFixes } from '../lib/ios-viewport-fix';

// Apply iOS fixes before rendering
applyAllIOSFixes();

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
