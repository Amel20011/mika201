import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initViewportLock } from './utils/lockViewport';

// Kunci viewport: matikan auto-zoom & swipe elastis atas-bawah
initViewportLock();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

