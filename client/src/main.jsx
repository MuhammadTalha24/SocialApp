import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import store from './store/store.js';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    <ToastContainer />
  </StrictMode>
);
