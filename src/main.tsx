import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/CartContext';
import { ConfirmProvider } from '@/lib/ConfirmContext';
import { ToastProvider } from '@/lib/ToastContext';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ToastContainer } from '@/components/ToastContainer';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <ConfirmProvider>
              <App />
              <ConfirmModal />
              <ToastContainer />
            </ConfirmProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
