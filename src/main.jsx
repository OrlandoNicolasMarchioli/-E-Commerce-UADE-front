import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import { CartProvider } from './context/CartContext';
import { store } from './store';
import './index.css';
import './theme/tokens.css';
import './components/ui.css';
import './app/layout.css';
import App from './App.jsx';

// Lee lo guardado en el navegador y lo vuelve a cargar en el store (rehidratación).
const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* Espera a recuperar la sesión antes de pintar: si no, una ruta protegida
          mandaría al login durante un instante después de cada F5. */}
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <CartProvider>
            <App />
          </CartProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
