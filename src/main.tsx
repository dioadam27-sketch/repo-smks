import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SMKSProvider } from './context/SMKSContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SMKSProvider>
      <App />
    </SMKSProvider>
  </StrictMode>,
);

