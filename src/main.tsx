import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Suppress benign ResizeObserver loop limit errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (
      e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
      e.message === 'ResizeObserver loop limit exceeded' ||
      e.message?.includes('ResizeObserver')
    ) {
      e.stopImmediatePropagation();
      e.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);


