import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './theme/tokens.css';
import './components/ui.css';
import ComponentLibraryPage from './pages/ComponentLibraryPage/ComponentLibraryPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ComponentLibraryPage />
  </StrictMode>,
);
