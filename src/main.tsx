import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LanguageProvider } from './hooks/LanguageContext';
import { AuthProvider } from './hooks/AuthContext';

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </AuthProvider>
);
