// ===============================
// File: main.jsx
// Description: Main entry point for the React application. Sets up providers and renders the root component.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';

/**
 * Main entry point for the CMS application.
 * Sets up React, routing, authentication provider, and global toasts.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        {/* Global toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
// ===============================
// End of File: main.jsx
// Description: Main entry point for the React application
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 