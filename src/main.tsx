import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Toaster } from 'react-hot-toast';
import './index.css';
import './styles/forms.css';
import 'animate.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        className: 'toast-container',
      }}
    />
  </StrictMode>,
);
